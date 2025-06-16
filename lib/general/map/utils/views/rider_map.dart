import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:moto/general/DeliveryRequestPage/ride_model.dart';
import 'package:moto/general/map/utils/Services/rider_service.dart';
import 'package:geolocator/geolocator.dart';
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

double parseDouble(dynamic value) {
  if (value == null) return 0.0;
  if (value is num) return value.toDouble();
  if (value is String) return double.tryParse(value) ?? 0.0;
  return 0.0;
}

class MapScreen extends StatefulWidget {
  final Map<String, dynamic>? pickupLocation;
  final Map<String, dynamic>? dropoffLocation;

  const MapScreen({super.key, this.pickupLocation, this.dropoffLocation});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final ApiService _apiService = ApiService();
  List<DeliveryModel> _activeRides = [];
  bool _isLoading = true;
  final Set<Marker> _markers = {};
  final Set<Polyline> _polylines = {};
  GoogleMapController? _mapController;
  DeliveryModel? _currentRide;
  LatLng _initialPosition = const LatLng(30.0444, 31.2357);

  bool _isDisposed = false;
  bool _isScreenClosed = false;
  Timer? _statusPollingTimer;
  Timer? _driverLocationTimer;
  String? _lastStatus;

  BitmapDescriptor? _driverIconAccepted;
  BitmapDescriptor? _driverIconInProgress;
  BitmapDescriptor? _driverIconArrived;

  bool _userMovedMap = false;
  bool _movedToUserLocation = false;

  static const Color primaryColor = Color(0xFFB5022F);
  static const Color secondaryColor = Colors.black;
  static const Color accentColor = Colors.white;

  String? _driverPhone;

  @override
  void initState() {
    super.initState();
    _loadDriverIcons();
    _fetchActiveRides();
    _setUserLocation();
    _startStatusPolling();
  }

  Future<void> _loadDriverIcons() async {
    try {
      _driverIconAccepted = await BitmapDescriptor.fromAssetImage(
        const ImageConfiguration(size: Size(48, 48)),
        'assets/images/Delivery_Courier.png',
      );
    } catch (e) {
      _driverIconAccepted = BitmapDescriptor.defaultMarker;
    }
    try {
      _driverIconInProgress = await BitmapDescriptor.fromAssetImage(
        const ImageConfiguration(size: Size(48, 48)),
        'assets/images/Delivery_man.png',
      );
    } catch (e) {
      _driverIconInProgress = BitmapDescriptor.defaultMarker;
    }
    try {
      _driverIconArrived = await BitmapDescriptor.fromAssetImage(
        const ImageConfiguration(size: Size(48, 48)),
        'assets/images/delivery2.png',
      );
    } catch (e) {
      _driverIconArrived = BitmapDescriptor.defaultMarker;
    }
    if (mounted) setState(() {});
  }

  void _startStatusPolling() {
    _statusPollingTimer = Timer.periodic(const Duration(seconds: 2), (timer) async {
      if (mounted && !_isDisposed && !_isScreenClosed) {
        final rides = await _fetchActiveRidesWithRetry();
        if (!mounted || _isDisposed || _isScreenClosed) return;
        if (rides.isNotEmpty) {
          final newStatus = rides.first.status;
          if (_lastStatus != newStatus) {
            _lastStatus = newStatus;
            setState(() {
              _activeRides = rides;
              _currentRide = rides.first;
              _addInitialMarkers();
              _isLoading = false;
            });
            if (newStatus == "accepted" ||
                newStatus == "in_progress" ||
                newStatus == "arrived") {
              _startDriverLocationPolling();
              _showDriverRouteOnMap();
            } else {
              _driverLocationTimer?.cancel();
              _polylines.clear();
              setState(() {});
            }
          }
        }
      }
    });
  }

  void _startDriverLocationPolling() {
    _driverLocationTimer?.cancel();
    _driverLocationTimer = Timer.periodic(const Duration(seconds: 1), (timer) async {
      if (!mounted || _isDisposed || _isScreenClosed) return;
      final rides = await _fetchActiveRidesWithRetry();
      if (!mounted || _isDisposed || _isScreenClosed) return;
      if (rides.isNotEmpty) {
        setState(() {
          _activeRides = rides;
          _currentRide = rides.first;
          _addInitialMarkers();
        });
        final driverLoc = _currentRide?.endLocation;
        if (driverLoc != null &&
            _mapController != null &&
            mounted &&
            !_isDisposed &&
            !_isScreenClosed &&
            !_userMovedMap) {
          try {
            await _mapController!.animateCamera(
              CameraUpdate.newLatLng(
                LatLng(
                  parseDouble(driverLoc['latitude']),
                  parseDouble(driverLoc['longitude']),
                ),
              ),
            );
          } catch (e) {
            print('Error moving camera to driver: $e');
          }
        }
        await _showDriverRouteOnMap();
      }
    });
  }

  Future<void> _showDriverRouteOnMap() async {
    final driverLoc = _currentRide?.endLocation;
    LatLng? destLatLng;
    if (_currentRide?.status == "in_progress" || _currentRide?.status == "arrived") {
      final dropoffLoc = widget.dropoffLocation;
      if (driverLoc == null || dropoffLoc == null) return;
      destLatLng = LatLng(
        parseDouble(dropoffLoc['latitude']),
        parseDouble(dropoffLoc['longitude']),
      );
    } else {
      final pickupLoc = widget.pickupLocation;
      if (driverLoc == null || pickupLoc == null) return;
      destLatLng = LatLng(
        parseDouble(pickupLoc['latitude']),
        parseDouble(pickupLoc['longitude']),
      );
    }

    final LatLng driverLatLng = LatLng(
      parseDouble(driverLoc!['latitude']),
      parseDouble(driverLoc['longitude']),
    );

    final polylinePoints = await _getRoutePolyline(driverLatLng, destLatLng);
    if (polylinePoints.isNotEmpty) {
      _polylines.clear();
      _polylines.add(Polyline(
        polylineId: const PolylineId('driver_route'),
        color: primaryColor,
        width: 5,
        points: polylinePoints,
      ));
      setState(() {});
    }
  }

  Future<List<LatLng>> _getRoutePolyline(LatLng start, LatLng end) async {
    const String apiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q';
    final url =
        'https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=$apiKey&mode=driving';

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['routes'] != null && data['routes'].isNotEmpty) {
          final points = data['routes'][0]['overview_polyline']['points'];
          return _decodePolyline(points);
        }
      }
    } catch (e) {
      print('Error fetching route polyline: $e');
    }
    return [];
  }

  List<LatLng> _decodePolyline(String encoded) {
    List<LatLng> polyline = [];
    int index = 0, len = encoded.length;
    int lat = 0, lng = 0;

    while (index < len) {
      int b, shift = 0, result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      polyline.add(LatLng(lat / 1E5, lng / 1E5));
    }
    return polyline;
  }

  @override
  void dispose() {
    _statusPollingTimer?.cancel();
    _driverLocationTimer?.cancel();
    _isDisposed = true;
    _isScreenClosed = true;
    _mapController?.dispose();
    _mapController = null;
    super.dispose();
  }

  Future<void> _setUserLocation() async {
    final pos = await _getCurrentLocation();
    if (!mounted || _isDisposed || _isScreenClosed) return;
    if (pos != null) {
      setState(() {
        _initialPosition = LatLng(pos.latitude, pos.longitude);
      });
    }
  }

  Future<Position?> _getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      print('Location service is disabled');
      return null;
    }
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        print('Location permission denied');
        return null;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      print('Location permission permanently denied');
      return null;
    }
    return await Geolocator.getCurrentPosition();
  }

  void _addInitialMarkers() async {
    _markers.clear();

    // Pickup marker
    if (widget.pickupLocation != null) {
      _markers.add(Marker(
        markerId: const MarkerId('pickup'),
        position: LatLng(
          parseDouble(widget.pickupLocation!['latitude']),
          parseDouble(widget.pickupLocation!['longitude']),
        ),
        infoWindow: InfoWindow(
          title: 'Pickup Location',
          snippet: widget.pickupLocation!['label'] ?? '',
        ),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
      ));
    }

    // Dropoff marker
    if (widget.dropoffLocation != null) {
      _markers.add(Marker(
        markerId: const MarkerId('dropoff'),
        position: LatLng(
          parseDouble(widget.dropoffLocation!['latitude']),
          parseDouble(widget.dropoffLocation!['longitude']),
        ),
        infoWindow: InfoWindow(
          title: 'Drop-off Location',
          snippet: widget.dropoffLocation!['label'] ?? '',
        ),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
      ));
    }

    // Driver marker
    final driverLoc = _currentRide?.endLocation;
    print('Driver Marker: $driverLoc');
    if (driverLoc != null &&
        driverLoc['latitude'] != null &&
        driverLoc['longitude'] != null &&
        driverLoc['latitude'].toString().isNotEmpty &&
        driverLoc['longitude'].toString().isNotEmpty) {
      BitmapDescriptor driverIcon = BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange);
      if (_currentRide!.status == "accepted" && _driverIconAccepted != null) {
        driverIcon = _driverIconAccepted!;
      } else if (_currentRide!.status == "in_progress" && _driverIconInProgress != null) {
        driverIcon = _driverIconInProgress!;
      } else if (_currentRide!.status == "arrived" && _driverIconArrived != null) {
        driverIcon = _driverIconArrived!;
      }
      _markers.add(Marker(
        markerId: const MarkerId('driver'),
        position: LatLng(
          parseDouble(driverLoc['latitude']),
          parseDouble(driverLoc['longitude']),
        ),
        infoWindow: const InfoWindow(
          title: 'Driver',
        ),
        icon: driverIcon,
      ));
      await _showDriverRouteOnMap();
    }

    if (mounted && !_isDisposed && !_isScreenClosed) setState(() {});
  }

  Future<List<DeliveryModel>> _fetchActiveRidesWithRetry() async {
    const maxRetries = 3;
    for (int i = 0; i < maxRetries; i++) {
      try {
        return await _apiService.fetchActiveRides();
      } catch (e) {
        if (i == maxRetries - 1) {
          print('Error fetching rides after $maxRetries attempts: $e');
          return [];
        }
        await Future.delayed(const Duration(seconds: 2));
      }
    }
    return [];
  }

  Future<void> _fetchActiveRides() async {
    setState(() => _isLoading = true);
    try {
      final rides = await _fetchActiveRidesWithRetry();
      if (!mounted || _isDisposed || _isScreenClosed) return;
      setState(() {
        _activeRides = rides;
        _currentRide = rides.isNotEmpty ? rides.first : null;
        _addInitialMarkers();
        _isLoading = false;
      });
      await _fetchDriverPhone();
    } catch (e) {
      if (!mounted || _isDisposed || _isScreenClosed) return;
      setState(() {
        _isLoading = false;
        _activeRides = [];
        _currentRide = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to load rides: $e'),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );
      print('Error fetching rides: $e');
    }
  }

  Future<void> _fetchDriverPhone() async {
    final driverId = _currentRide?.driverId;
    if (driverId != null) {
      final phone = await _apiService.fetchDriverPhone(driverId);
      setState(() {
        _driverPhone = phone;
      });
    }
  }

  Future<void> _callDriver() async {
    if (_driverPhone == null || _driverPhone!.isEmpty) return;
    final String url = 'tel:$_driverPhone';
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('لا يمكن فتح تطبيق الاتصال')),
      );
    }
  }

  Widget _buildStatusBar(String? status) {
    final steps = [
      {'status': 'pending', 'label': 'Waiting', 'icon': Icons.hourglass_empty},
      {'status': 'accepted', 'label': 'Accepted', 'icon': Icons.check_circle},
      {'status': 'in_progress', 'label': 'En Route', 'icon': Icons.directions_bike},
      {'status': 'arrived', 'label': 'Arrived', 'icon': Icons.location_on},
      {'status': 'completed', 'label': 'Completed', 'icon': Icons.flag},
      {'status': 'cancelled', 'label': 'Cancelled', 'icon': Icons.cancel},
    ];

    int currentStep = steps.indexWhere((step) => step['status'] == status);
    if (currentStep == -1) currentStep = 0;

    return Column(
      children: [
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: List.generate(steps.length, (index) {
              bool isActive = index <= currentStep;
              bool isCancelled = status == 'cancelled' && index == steps.length - 1;
              Color color = isCancelled
                  ? Colors.red
                  : isActive
                      ? primaryColor
                      : Colors.grey[300]!;
              return Row(
                children: [
                  Column(
                    children: [
                      CircleAvatar(
                        radius: 14,
                        backgroundColor: color,
                        child: Icon(
                          steps[index]['icon'] as IconData,
                          color: accentColor,
                          size: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        steps[index]['label'] as String,
                        style: TextStyle(
                          fontSize: 10,
                          color: isActive ? secondaryColor : Colors.grey,
                          fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                  if (index < steps.length - 1)
                    Container(
                      width: 20,
                      height: 2,
                      color: index < currentStep ? primaryColor : Colors.grey[300],
                    ),
                ],
              );
            }),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          steps[currentStep]['label'] as String,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: status == 'cancelled' ? Colors.red : primaryColor,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(IconData icon, String text, Color iconColor) {
    return Row(
      children: [
        Icon(icon, color: iconColor, size: 20),
        const SizedBox(width: 8),
        Text(
          text,
          style: const TextStyle(fontSize: 14, color: secondaryColor),
        ),
      ],
    );
  }

  Widget _buildRideInfoCard() {
    if (_currentRide == null) {
      return Container(
        padding: const EdgeInsets.all(16),
        color: accentColor,
        child: const Text(
          'No active rides at the moment',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 16, color: Colors.grey),
        ),
      );
    }

    return Card(
      elevation: 8,
      margin: const EdgeInsets.all(16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStatusBar(_currentRide!.status),
            const Divider(height: 24),
            _buildInfoRow(Icons.info, 'Status: ${_currentRide!.status?.toUpperCase() ?? 'N/A'}', primaryColor),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.attach_money, 'Cost: ${_currentRide!.estimatedFee ?? 'N/A'} EGP', Colors.green),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.route, 'Distance: ${_currentRide!.distance ?? 'N/A'} km', Colors.orange),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                if (_driverPhone != null && _driverPhone!.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.phone, color: Colors.green, size: 28),
                    tooltip: 'اتصل بالسائق',
                    onPressed: _callDriver,
                  ),
                if (_currentRide!.status != "completed" && _currentRide!.status != "cancelled")
                  ElevatedButton.icon(
                    onPressed: () => _showCancelDialog(_currentRide!.requestId),
                    icon: const Icon(Icons.cancel, color: accentColor),
                    label: const Text('Cancel Ride', style: TextStyle(color: accentColor)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                if (_currentRide!.status == "arrived")
                  ElevatedButton.icon(
                    onPressed: () {
                      print(_currentRide);
                      _completeRide(_currentRide!.requestId);
                    },
                    icon: const Icon(Icons.check_circle, color: accentColor),
                    label: const Text('Complete Ride', style: TextStyle(color: accentColor)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _cancelRide(String requestId) async {
    try {
      await _apiService.cancelRide(requestId, 'User cancelled');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Ride cancelled successfully'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 3),
        ),
      );
      await _fetchActiveRides();
      setState(() {});
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error cancelling ride: $e'),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );
      print('Error cancelling ride: $e');
    }
  }

  Future<void> _completeRide(String requestId) async {
    try {
      print('Trying to complete ride:');
      print(_currentRide);
      await _apiService.completeRide(requestId);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Ride completed successfully'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 3),
        ),
      );
      await _fetchActiveRides();
      setState(() {});
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error completing ride: $e'),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );
      print('Error completing ride: $e');
    }
  }

  Future<void> _showCancelDialog(String requestId) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Confirm Cancellation', style: TextStyle(color: secondaryColor)),
        content: const Text('Are you sure you want to cancel the ride?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('No', style: TextStyle(color: primaryColor)),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Confirm', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (result == true) {
      _isScreenClosed = true;
      await _cancelRide(requestId);
      if (mounted && !_isDisposed) {
        Navigator.of(context).pop();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryColor,
        title: const Text(
          'Ride Map',
          style: TextStyle(color: accentColor, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: accentColor),
            onPressed: _fetchActiveRides,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: CameraPosition(
              target: _initialPosition,
              zoom: 17,
            ),
            markers: _markers,
            polylines: _polylines,
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
            onMapCreated: (GoogleMapController controller) async {
              _mapController = controller;
              _addInitialMarkers();
              if (!_movedToUserLocation) {
                final pos = await _getCurrentLocation();
                if (pos != null && mounted && !_isDisposed && !_isScreenClosed) {
                  await _mapController!.animateCamera(
                    CameraUpdate.newLatLngZoom(
                      LatLng(pos.latitude, pos.longitude),
                      17,
                    ),
                  );
                  setState(() {
                    _movedToUserLocation = true;
                  });
                }
              }
            },
            onCameraMove: (CameraPosition position) {
              _userMovedMap = true;
            },
          ),
          if (_isLoading)
            const Center(child: CircularProgressIndicator(color: primaryColor)),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _buildRideInfoCard(),
          ),
        ],
      ),
    );
  }
}