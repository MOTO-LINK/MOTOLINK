import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:http/http.dart' as http;
import 'package:moto/general/core/service/storage_service.dart';
import 'package:moto/general/map/utils/Services/driverService.dart';

class DriverHomePage extends StatefulWidget {
  const DriverHomePage({super.key});

  @override
  State<DriverHomePage> createState() => _DriverHomePageState();
}

class _DriverHomePageState extends State<DriverHomePage> {
  final DriverService driverService = DriverService();
  final StorageService storageService = StorageService();
  final Location location = Location();

  bool _isOnline = false;
  bool _isDriverOnline = false;
  bool _isLoading = false;
  bool _showBigMap = false;
  bool _hasAcceptedOrder = false;
  bool _hasPickedUp = false;
  bool _isMapInitialized = false;
  Map<String, dynamic>? _pendingOrder;
  String _userName = '';
  String? _pickupAddress;
  String? _dropoffAddress;

  GoogleMapController? _mapController;
  LatLng? _currentLatLng;
  Timer? _locationTimer;
  Timer? _ridesTimer;

  Set<Polyline> _polylines = {};

  @override
  void initState() {
    super.initState();
    _initialize();
    _startFetchingRides();
  }

  void _startFetchingRides() {
    _ridesTimer?.cancel();
    _ridesTimer = Timer.periodic(const Duration(seconds: 5), (_) async {
      if (_hasAcceptedOrder) {
        print('تخطي جلب الطلبات: الطلب مقبول بالفعل');
        return;
      }

      bool online = await storageService.getDriverOnlineStatus();
      bool available = await storageService.getDriverAvailability();
      print('حالة السائق: أونلاين=$online, متاح=$available');

      if (online && available) {
        try {
          final availableRides = await driverService.fetchAvailableRides();
          print('الطلبات المتاحة: ${jsonEncode(availableRides)}');
          setState(() {
            _pendingOrder = availableRides.isNotEmpty ? availableRides.first : null;
            _pickupAddress = null;
            _dropoffAddress = null;
          });
          if (_pendingOrder != null) {
            print('طلب جديد: ${jsonEncode(_pendingOrder)}');
            await _fetchAddresses();
            await _drawRouteToPickup();
          }
        } catch (e) {
          print('خطأ في جلب الطلبات: $e');
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('❌ خطأ في جلب الطلبات: $e')),
          );
        }
      } else {
        setState(() {
          _pendingOrder = null;
          _pickupAddress = null;
          _dropoffAddress = null;
          _polylines = {};
        });
      }
    });
  }

  @override
  void dispose() {
    _locationTimer?.cancel();
    _ridesTimer?.cancel();
    _mapController?.dispose();
    super.dispose();
  }

  Future<void> _initialize() async {
    setState(() => _isLoading = true);

    try {
      final name = await storageService.getUserName();
      final availableRides = await driverService.fetchAvailableRides();
      print('الطلبات المتاحة الأولية: ${jsonEncode(availableRides)}');

      _isOnline = await storageService.getDriverAvailability();
      _isDriverOnline = await storageService.getDriverOnlineStatus();

      LocationData locationData = await location.getLocation();
      if (locationData.latitude != null && locationData.longitude != null) {
        _currentLatLng = LatLng(locationData.latitude!, locationData.longitude!);
        print('موقع السائق الأولي: $_currentLatLng');
      } else {
        throw Exception('فشل في جلب موقع السائق');
      }

      setState(() {
        _userName = name ?? 'سائق';
        _pendingOrder = availableRides.isNotEmpty ? availableRides.first : null;
        _isLoading = false;
      });

      if (_pendingOrder != null) {
        await _fetchAddresses();
      }
      await _drawRouteToPickup();

      _locationTimer = Timer.periodic(const Duration(seconds: 10), (_) async {
        try {
          LocationData locationData = await location.getLocation();
          if (locationData.latitude != null && locationData.longitude != null) {
            _currentLatLng = LatLng(locationData.latitude!, locationData.longitude!);
            print('تحديث موقع السائق: $_currentLatLng');
            await driverService.updateDriverLocation(locationData.latitude!, locationData.longitude!);
            if (_mapController != null && _isMapInitialized) {
              await _updateCameraPosition();
            }
            if (!_hasPickedUp) {
              await _drawRouteToPickup();
            } else {
              await _drawRouteToDropoff();
            }
            setState(() {});
          }
        } catch (e) {
          print('خطأ تحديث الموقع: $e');
        }
      });
    } catch (e) {
      print('خطأ التهيئة: $e');
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء التهيئة')),
      );
    }
  }

  Future<void> _fetchAddresses() async {
    if (_pendingOrder == null) return;

    String pickupAddress = 'غير متوفر';
    String dropoffAddress = 'غير متوفر';

    if (_pendingOrder!['start_location'] != null &&
        _pendingOrder!['start_location'] is Map &&
        _pendingOrder!['start_location']['address'] != null) {
      pickupAddress = _pendingOrder!['start_location']['address'].toString();
    } else if (_pendingOrder!['start_address'] != null) {
      pickupAddress = _pendingOrder!['start_address'].toString();
    } else if (_pendingOrder!['pickup_address'] != null) {
      pickupAddress = _pendingOrder!['pickup_address'].toString();
    } else if (_pendingOrder!['pickup_location'] != null) {
      pickupAddress = _pendingOrder!['pickup_location'].toString();
    } else if (_pendingOrder!['start_lat'] != null && _pendingOrder!['start_lng'] != null) {
      final lat = double.tryParse(_pendingOrder!['start_lat'].toString().trim());
      final lng = double.tryParse(_pendingOrder!['start_lng'].toString().trim());
      if (lat != null && lng != null) {
        pickupAddress = await _getAddressFromCoordinates(lat, lng);
        if (pickupAddress.startsWith('خطأ') || pickupAddress.startsWith('فشل')) {
          pickupAddress = 'إحداثيات: ($lat, $lng)';
        }
      }
    }

    if (_pendingOrder!['end_location'] != null &&
        _pendingOrder!['end_location'] is Map &&
        _pendingOrder!['end_location']['address'] != null) {
      dropoffAddress = _pendingOrder!['end_location']['address'].toString();
    } else if (_pendingOrder!['end_address'] != null) {
      dropoffAddress = _pendingOrder!['end_address'].toString();
    } else if (_pendingOrder!['dropoff_address'] != null) {
      dropoffAddress = _pendingOrder!['dropoff_address'].toString();
    } else if (_pendingOrder!['dropoff_location'] != null) {
      dropoffAddress = _pendingOrder!['dropoff_location'].toString();
    } else if (_pendingOrder!['end_lat'] != null && _pendingOrder!['end_lng'] != null) {
      final lat = double.tryParse(_pendingOrder!['end_lat'].toString().trim());
      final lng = double.tryParse(_pendingOrder!['end_lng'].toString().trim());
      if (lat != null && lng != null) {
        dropoffAddress = await _getAddressFromCoordinates(lat, lng);
        if (dropoffAddress.startsWith('خطأ') || dropoffAddress.startsWith('فشل')) {
          dropoffAddress = 'إحداثيات: ($lat, $lng)';
        }
      }
    }

    setState(() {
      _pickupAddress = pickupAddress;
      _dropoffAddress = dropoffAddress;
    });
    print('عنوان الاستلام: $pickupAddress');
    print('عنوان التوصيل: $dropoffAddress');
  }

  Future<void> _updateCameraPosition() async {
    if (_mapController != null && _currentLatLng != null && _isMapInitialized) {
      try {
        await _mapController!.animateCamera(CameraUpdate.newLatLng(_currentLatLng!));
      } catch (e) {
        print('خطأ تحريك الكاميرا: $e');
      }
    }
  }

  Future<void> _toggleOnlineStatus() async {
    try {
      setState(() => _isOnline = !_isOnline);
      await driverService.updateAvailability(_isOnline);
      await storageService.saveDriverAvailability(_isOnline);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_isOnline ? "✅ أنت الآن متاح للطلبات" : "⛔ تم إيقاف التوفر")),
      );
    } catch (e) {
      print('خطأ تبديل التوفر: $e');
      setState(() => _isOnline = !_isOnline);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء تحديث التوفر')),
      );
    }
  }

  Future<void> _toggleDriverOnlineSwitch() async {
    try {
      setState(() => _isDriverOnline = !_isDriverOnline);
      bool success = await driverService.setOnlineStatus(_isDriverOnline);
      if (success) {
        await storageService.saveDriverOnlineStatus(_isDriverOnline);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_isDriverOnline ? "✅ تم تفعيل وضع الأونلاين" : "⛔ تم إيقاف وضع الأونلاين"),
          ),
        );
      } else {
        setState(() => _isDriverOnline = !_isDriverOnline);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ حصلت مشكلة أثناء التحديث")),
        );
      }
    } catch (e) {
      print('خطأ تبديل الأونلاين: $e');
      setState(() => _isDriverOnline = !_isDriverOnline);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء تحديث الحالة')),
      );
    }
  }

  Future<void> _handleAcceptOrder() async {
    try {
      bool online = await storageService.getDriverOnlineStatus();
      bool available = await storageService.getDriverAvailability();

      if (!online || !available) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ لازم تكون أونلاين ومتاح عشان تستلم طلب")),
        );
        return;
      }

      if (_pendingOrder == null) {
        print('خطأ: _pendingOrder فارغ في _handleAcceptOrder');
        return;
      }

      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.acceptOrder(requestId);

      if (success) {
        setState(() {
          _hasAcceptedOrder = true;
          print('قبول الطلب: _hasAcceptedOrder=$_hasAcceptedOrder, _pendingOrder=${jsonEncode(_pendingOrder)}');
        });
        await _drawRouteToPickup();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم قبول الطلب")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في قبول الطلب")),
        );
      }
    } catch (e) {
      print('خطأ قبول الطلب: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء قبول الطلب')),
      );
    }
  }

  Future<void> _handleDeclineOrder() async {
    try {
      bool online = await storageService.getDriverOnlineStatus();
      bool available = await storageService.getDriverAvailability();

      if (!online || !available) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ لازم تكون أونلاين ومتاح عشان ترفض طلب")),
        );
        return;
      }

      if (_pendingOrder == null) return;

      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.declineOrder(requestId);

      if (success) {
        setState(() {
          _pendingOrder = null;
          _pickupAddress = null;
          _dropoffAddress = null;
          _polylines = {};
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم رفض الطلب")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في رفض الطلب")),
        );
      }
    } catch (e) {
      print('خطأ رفض الطلب: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء رفض الطلب')),
      );
    }
  }

  Future<void> _handleCancelOrder() async {
    try {
      if (_pendingOrder == null) return;

      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.cancelOrder(requestId);

      if (success) {
        setState(() {
          _hasAcceptedOrder = false;
          _hasPickedUp = false;
          _pendingOrder = null;
          _pickupAddress = null;
          _dropoffAddress = null;
          _polylines = {};
        });
        _startFetchingRides();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم إلغاء الطلب")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في إلغاء الطلب")),
        );
      }
    } catch (e) {
      print('خطأ إلغاء الطلب: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء إلغاء الطلب')),
      );
    }
  }

  Future<void> _handlePickupConfirmation() async {
    try {
      if (_pendingOrder == null) return;

      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.updateRideStatus(requestId, "in_progress");
      print('تأكيد الاستلام لـ requestId: $requestId، الحالة: in_progress');

      if (success) {
        setState(() {
          _hasPickedUp = true;
          _polylines = {};
        });
        await _drawRouteToDropoff();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم تأكيد الاستلام")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في تأكيد الاستلام")),
        );
      }
    } catch (e) {
      print('خطأ تأكيد الاستلام: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء تأكيد الاستلام')),
      );
    }
  }

  Future<void> _handleDeliveryConfirmation() async {
    try {
      if (_pendingOrder == null) return;

      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.updateRideStatus(requestId, "arrived");
      print('تأكيد التوصيل لـ requestId: $requestId، الحالة: arrived');

      if (success) {
        setState(() {
          _hasAcceptedOrder = false;
          _hasPickedUp = false;
          _pendingOrder = null;
          _pickupAddress = null;
          _dropoffAddress = null;
          _polylines = {};
        });
        _startFetchingRides();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم تأكيد التوصيل")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في تأكيد التوصيل")),
        );
      }
    } catch (e) {
      print('خطأ تأكيد التوصيل: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء تأكيد التوصيل')),
      );
    }
  }

  Set<Marker> _getMapMarkers() {
    LatLng? targetLatLng;
    String markerId = 'pickup';
    String markerTitle = 'موقع العميل';
    double markerHue = BitmapDescriptor.hueRed;

    if (_pendingOrder != null) {
      if (!_hasPickedUp) {
        if (_pendingOrder?['start_lat'] != null && _pendingOrder?['start_lng'] != null) {
          final startLat = double.tryParse(_pendingOrder!['start_lat'].toString().trim());
          final startLng = double.tryParse(_pendingOrder!['start_lng'].toString().trim());
          if (startLat != null &&
              startLng != null &&
              startLat >= -90 &&
              startLat <= 90 &&
              startLng >= -180 &&
              startLng <= 180) {
            targetLatLng = LatLng(startLat, startLng);
          }
        }
      } else {
        if (_pendingOrder?['end_lat'] != null && _pendingOrder?['end_lng'] != null) {
          final endLat = double.tryParse(_pendingOrder!['end_lat'].toString().trim());
          final endLng = double.tryParse(_pendingOrder!['end_lng'].toString().trim());
          if (endLat != null &&
              endLng != null &&
              endLat >= -90 &&
              endLat <= 90 &&
              endLng >= -180 &&
              endLng <= 180) {
            targetLatLng = LatLng(endLat, endLng);
            markerId = 'dropoff';
            markerTitle = 'موقع التسليم';
            markerHue = BitmapDescriptor.hueBlue;
          }
        }
      }
    }

    Set<Marker> markers = {};
    if (_currentLatLng != null) {
      markers.add(Marker(
        markerId: const MarkerId('driver'),
        position: _currentLatLng!,
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        infoWindow: const InfoWindow(title: "موقعك"),
      ));
    }
    if (targetLatLng != null) {
      markers.add(Marker(
        markerId: MarkerId(markerId),
        position: targetLatLng,
        icon: BitmapDescriptor.defaultMarkerWithHue(markerHue),
        infoWindow: InfoWindow(title: markerTitle),
      ));
    }
    return markers;
  }

  Future<void> _drawRouteToPickup() async {
    if (_hasPickedUp || _pendingOrder == null || _currentLatLng == null) {
      print('تخطي مسار الاستلام: hasPickedUp=$_hasPickedUp, pendingOrder=$_pendingOrder, currentLatLng=$_currentLatLng');
      setState(() => _polylines = {});
      return;
    }

    final pickupLat = double.tryParse(_pendingOrder!['start_lat'].toString().trim() ?? '');
    final pickupLng = double.tryParse(_pendingOrder!['start_lng'].toString().trim() ?? '');
    if (pickupLat == null ||
        pickupLng == null ||
        pickupLat < -90 ||
        pickupLat > 90 ||
        pickupLng < -180 ||
        pickupLng > 180) {
      print('إحداثيات الاستلام غير صالحة: ${_pendingOrder!['start_lat']}, ${_pendingOrder!['start_lng']}');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ إحداثيات العميل غير صالحة، حاول تحديث الطلب')),
      );
      setState(() => _polylines = {});
      return;
    }

    final pickupLatLng = LatLng(pickupLat, pickupLng);

    final distance = _calculateDistance(_currentLatLng!, pickupLatLng);
    if (distance > 100) {
      print('المسافة كبيرة: $distance كم');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ المسافة كبيرة جدًا، تحقق من إحداثيات العميل')),
      );
      setState(() => _polylines = {});
      return;
    }

    const apiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q'; // TODO: انقل لـ .env
    final url =
        'https://maps.googleapis.com/maps/api/directions/json?origin=${_currentLatLng!.latitude},${_currentLatLng!.longitude}&destination=$pickupLat,$pickupLng&mode=driving&region=eg&language=ar&key=$apiKey';

    try {
      final response = await http.get(Uri.parse(url));
      print('استجابة API المسارات (الاستلام): ${response.statusCode} - ${response.body}');
      if (response.statusCode != 200) {
        print('خطأ API المسارات: ${response.statusCode} - ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ فشل في جلب المسار، تحقق من الاتصال بالإنترنت')),
        );
        if (distance < 1) {
          setState(() {
            _polylines = {
              Polyline(
                polylineId: const PolylineId('manual_route'),
                color: Colors.red,
                width: 5,
                points: [_currentLatLng!, pickupLatLng],
              ),
            };
          });
        } else {
          setState(() => _polylines = {});
        }
        return;
      }

      final data = jsonDecode(response.body);
      if (data['status'] != 'OK') {
        print('حالة API المسارات: ${data['status']} - ${data['error_message']}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ خطأ في جلب المسار: ${data['error_message'] ?? 'غير معروف'}')),
        );
        if (distance < 1) {
          setState(() {
            _polylines = {
              Polyline(
                polylineId: const PolylineId('manual_route'),
                color: Colors.red,
                width: 5,
                points: [_currentLatLng!, pickupLatLng],
              ),
            };
          });
        } else {
          setState(() => _polylines = {});
        }
        return;
      }

      if (data['routes'] != null && data['routes'].isNotEmpty) {
        final route = data['routes'][0];
        final legs = route['legs'];
        if (legs != null && legs.isNotEmpty) {
          final distanceText = legs[0]['distance']['text'] ?? 'غير معروف';
          final durationText = legs[0]['duration']['text'] ?? 'غير معروف';
          print('مسافة مسار الاستلام: $distanceText, المدة: $durationText');

          final points = route['overview_polyline']['points'];
          final List<LatLng> polylinePoints = _decodePolyline(points);
          if (polylinePoints.isNotEmpty) {
            setState(() {
              _polylines = {
                Polyline(
                  polylineId: const PolylineId('route'),
                  color: Colors.blue,
                  width: 5,
                  points: polylinePoints,
                ),
              };
            });
            if (_isMapInitialized) {
              await _updateCameraToFitRoute(_currentLatLng!, pickupLatLng);
            }
          } else {
            print('لا توجد نقاط مسار للاستلام');
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('❌ فشل في رسم المسار، حاول مرة أخرى')),
            );
            setState(() => _polylines = {});
          }
        } else {
          print('لا توجد legs في مسار الاستلام');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('❌ لا يوجد مسار متاح، تحقق من إحداثيات العميل')),
          );
          setState(() => _polylines = {});
        }
      } else {
        print('لا توجد مسارات للاستلام');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ لا يوجد مسار متاح، تحقق من إحداثيات العميل')),
        );
        if (distance < 1) {
          setState(() {
            _polylines = {
              Polyline(
                polylineId: const PolylineId('manual_route'),
                color: Colors.red,
                width: 5,
                points: [_currentLatLng!, pickupLatLng],
              ),
            };
          });
        } else {
          setState(() => _polylines = {});
        }
      }
    } catch (e) {
      print('استثناء API المسارات (الاستلام): $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء جلب المسار، حاول مرة أخرى')),
      );
      if (distance < 1) {
        setState(() {
          _polylines = {
            Polyline(
              polylineId: const PolylineId('manual_route'),
              color: Colors.red,
              width: 5,
              points: [_currentLatLng!, pickupLatLng],
            ),
          };
        });
      } else {
        setState(() => _polylines = {});
      }
    }
  }

  Future<void> _drawRouteToDropoff() async {
    if (!_hasPickedUp || _pendingOrder == null || _currentLatLng == null) {
      print('تخطي مسار التوصيل: hasPickedUp=$_hasPickedUp, pendingOrder=$_pendingOrder, currentLatLng=$_currentLatLng');
      setState(() => _polylines = {});
      return;
    }

    final dropoffLat = double.tryParse(_pendingOrder!['end_lat'].toString().trim() ?? '');
    final dropoffLng = double.tryParse(_pendingOrder!['end_lng'].toString().trim() ?? '');
    if (dropoffLat == null ||
        dropoffLng == null ||
        dropoffLat < -90 ||
        dropoffLat > 90 ||
        dropoffLng < -180 ||
        dropoffLng > 180) {
      print('إحداثيات التوصيل غير صالحة: ${_pendingOrder!['end_lat']}, ${_pendingOrder!['end_lng']}');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ إحداثيات التسليم غير صالحة، حاول تحديث الطلب')),
      );
      setState(() => _polylines = {});
      return;
    }

    final dropoffLatLng = LatLng(dropoffLat, dropoffLng);

    final distance = _calculateDistance(_currentLatLng!, dropoffLatLng);
    if (distance > 100) {
      print('مسافة التوصيل كبيرة: $distance كم');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ المسافة كبيرة جدًا، تحقق من إحداثيات التسليم')),
      );
      setState(() => _polylines = {});
      return;
    }

    const apiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q'; // TODO: انقل لـ .env
    final url =
        'https://maps.googleapis.com/maps/api/directions/json?origin=${_currentLatLng!.latitude},${_currentLatLng!.longitude}&destination=$dropoffLat,$dropoffLng&mode=driving&region=eg&language=ar&key=$apiKey';

    try {
      final response = await http.get(Uri.parse(url));
      print('استجابة API المسارات (التوصيل): ${response.statusCode} - ${response.body}');
      if (response.statusCode != 200) {
        print('خطأ API المسارات (التوصيل): ${response.statusCode} - ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ فشل في جلب المسار، تحقق من الاتصال بالإنترنت')),
        );
        if (distance < 1) {
          setState(() {
            _polylines = {
              Polyline(
                polylineId: const PolylineId('manual_route'),
                color: Colors.red,
                width: 5,
                points: [_currentLatLng!, dropoffLatLng],
              ),
            };
          });
        } else {
          setState(() => _polylines = {});
        }
        return;
      }

      final data = jsonDecode(response.body);
      if (data['status'] != 'OK') {
        print('حالة API المسارات (التوصيل): ${data['status']} - ${data['error_message']}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ خطأ في جلب المسار: ${data['error_message'] ?? 'غير معروف'}')),
        );
        if (distance < 1) {
          setState(() {
            _polylines = {
              Polyline(
                polylineId: const PolylineId('manual_route'),
                color: Colors.red,
                width: 5,
                points: [_currentLatLng!, dropoffLatLng],
              ),
            };
          });
        } else {
          setState(() => _polylines = {});
        }
        return;
      }

      if (data['routes'] != null && data['routes'].isNotEmpty) {
        final route = data['routes'][0];
        final legs = route['legs'];
        if (legs != null && legs.isNotEmpty) {
          final distanceText = legs[0]['distance']['text'] ?? 'غير معروف';
          final durationText = legs[0]['duration']['text'] ?? 'غير معروف';
          print('مسافة مسار التوصيل: $distanceText, المدة: $durationText');

          final points = route['overview_polyline']['points'];
          final List<LatLng> polylinePoints = _decodePolyline(points);
          if (polylinePoints.isNotEmpty) {
            setState(() {
              _polylines = {
                Polyline(
                  polylineId: const PolylineId('route'),
                  color: Colors.blue,
                  width: 5,
                  points: polylinePoints,
                ),
              };
            });
            if (_isMapInitialized) {
              await _updateCameraToFitRoute(_currentLatLng!, dropoffLatLng);
            }
          } else {
            print('لا توجد نقاط مسار للتوصيل');
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('❌ فشل في رسم المسار، حاول مرة أخرى')),
            );
            setState(() => _polylines = {});
          }
        } else {
          print('لا توجد legs في مسار التوصيل');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('❌ لا يوجد مسار متاح، تحقق من إحداثيات التسليم')),
          );
          setState(() => _polylines = {});
        }
      } else {
        print('لا توجد مسارات للتوصيل');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ لا يوجد مسار متاح، تحقق من إحداثيات التسليم')),
        );
        if (distance < 1) {
          setState(() {
            _polylines = {
              Polyline(
                polylineId: const PolylineId('manual_route'),
                color: Colors.red,
                width: 5,
                points: [_currentLatLng!, dropoffLatLng],
              ),
            };
          });
        } else {
          setState(() => _polylines = {});
        }
      }
    } catch (e) {
      print('استثناء API المسارات (التوصيل): $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء جلب المسار، حاول مرة أخرى')),
      );
      if (distance < 1) {
        setState(() {
          _polylines = {
            Polyline(
              polylineId: const PolylineId('manual_route'),
              color: Colors.red,
              width: 5,
              points: [_currentLatLng!, dropoffLatLng],
            ),
          };
        });
      } else {
        setState(() => _polylines = {});
      }
    }
  }

  Future<String> _getAddressFromCoordinates(double lat, double lng) async {
    const apiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q'; // TODO: انقل لـ .env
    final url =
        'https://maps.googleapis.com/maps/api/geocode/json?latlng=$lat,$lng&language=ar&region=eg&key=$apiKey';

    try {
      final response = await http.get(Uri.parse(url));
      print('استجابة API الجيوكودينج لـ ($lat, $lng): ${response.statusCode} - ${response.body}');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'OK' && data['results'] != null && data['results'].isNotEmpty) {
          final address = data['results'][0]['formatted_address'] ?? 'عنوان غير معروف';
          print('العنوان المجيوكود: $address');
          return address;
        } else {
          print('فشل الجيوكودينج: الحالة=${data['status']}, الخطأ=${data['error_message']}');
          return 'فشل في جلب العنوان: ${data['error_message'] ?? 'غير معروف'}';
        }
      } else {
        print('خطأ HTTP جيوكودينج: ${response.statusCode} - ${response.body}');
        return 'خطأ في جلب العنوان: HTTP ${response.statusCode}';
      }
    } catch (e) {
      print('استثناء الجيوكودينج: $e');
      return 'خطأ في جلب العنوان: $e';
    }
  }

  double _calculateDistance(LatLng start, LatLng end) {
    const double R = 6371; // نصف قطر الأرض بالكيلومتر
    final lat1 = start.latitude * pi / 180;
    final lat2 = end.latitude * pi / 180;
    final deltaLat = (end.latitude - start.latitude) * pi / 180;
    final deltaLng = (end.longitude - start.longitude) * pi / 180;

    final a = sin(deltaLat / 2) * sin(deltaLat / 2) +
        cos(lat1) * cos(lat2) * sin(deltaLng / 2) * sin(deltaLng / 2);
    final c = 2 * atan2(sqrt(a), sqrt(1 - a));

    return R * c; // المسافة بالكيلومتر
  }

  Future<void> _updateCameraToFitRoute(LatLng driver, LatLng target) async {
    if (_mapController != null && _isMapInitialized) {
      try {
        final bounds = LatLngBounds(
          southwest: LatLng(
            min(driver.latitude, target.latitude),
            min(driver.longitude, target.longitude),
          ),
          northeast: LatLng(
            max(driver.latitude, target.latitude),
            max(driver.longitude, target.longitude),
          ),
        );
        await _mapController!.animateCamera(
          CameraUpdate.newLatLngBounds(bounds, 50),
        );
      } catch (e) {
        print('خطأ تهيئة الكاميرا للمسار: $e');
      }
    }
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
  Widget build(BuildContext context) {
    if (_showBigMap) {
      return Scaffold(
        body: Stack(
          children: [
            GoogleMap(
              initialCameraPosition: CameraPosition(
                target: _currentLatLng ?? const LatLng(26.5570241, 31.6953085),
                zoom: 16,
              ),
              myLocationEnabled: true,
              myLocationButtonEnabled: true,
              zoomControlsEnabled: false,
              markers: _getMapMarkers(),
              polylines: _polylines,
              onMapCreated: (controller) {
                _mapController = controller;
                setState(() {
                  _isMapInitialized = true;
                });
                _updateCameraPosition();
              },
            ),
            Positioned(
              top: 40,
              right: 20,
              child: FloatingActionButton(
                backgroundColor: Colors.white,
                onPressed: () {
                  setState(() {
                    _showBigMap = false;
                  });
                },
                child: const Icon(Icons.close, color: Colors.black),
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: _isLoading
            ? const Center(
                child: CircularProgressIndicator(
                  color: Colors.blueAccent,
                  strokeWidth: 6,
                ),
              )
            : Column(
                children: [
                  _buildHeader(),
                  const SizedBox(height: 16),
                  _buildAvailabilityCard(),
                  const SizedBox(height: 16),
                  _buildOnlineModeCard(),
                  const SizedBox(height: 16),
                  _buildMiniMap(),
                  const SizedBox(height: 16),
                  Expanded(child: _buildPendingOrderCard()),
                ],
              ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blueAccent, Colors.blue.shade700],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(20)),
        boxShadow: const [
          BoxShadow(color: Colors.black26, blurRadius: 8, offset: Offset(0, 4)),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          GestureDetector(
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("📸 سيتم فتح صفحة الملف الشخصي")),
              );
            },
            child: const CircleAvatar(
              radius: 32,
              backgroundImage: AssetImage('assets/images/driver_avatar.png'),
              backgroundColor: Colors.white,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "مرحبا 👋",
                  style: TextStyle(fontSize: 16, color: Colors.white70),
                ),
                Text(
                  _userName,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("🔔 سيتم فتح الإشعارات")),
              );
            },
            icon: const Icon(Icons.notifications_none, size: 28, color: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildAvailabilityCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.directions_bike, size: 36, color: Colors.green),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _isOnline ? "أنت متاح الآن" : "أنت غير متاح",
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const Text(
                  "تفعيل التوفر لاستقبال الطلبات",
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
              ],
            ),
          ),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: Switch(
              key: ValueKey<bool>(_isOnline),
              value: _isOnline,
              onChanged: (_) => _toggleOnlineStatus(),
              activeColor: Colors.green,
              inactiveThumbColor: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOnlineModeCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.wifi, size: 36, color: Colors.blue),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _isDriverOnline ? "أنت أونلاين الآن" : "أنت أوفلاين",
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const Text(
                  "تفعيل الأونلاين للاتصال بالنظام",
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
              ],
            ),
          ),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: Switch(
              key: ValueKey<bool>(_isDriverOnline),
              value: _isDriverOnline,
              onChanged: (_) => _toggleDriverOnlineSwitch(),
              activeColor: Colors.blue,
              inactiveThumbColor: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniMap() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      height: 220,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4)),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            GoogleMap(
              initialCameraPosition: CameraPosition(
                target: _currentLatLng ?? const LatLng(26.5570241, 31.6953085),
                zoom: 16,
              ),
              myLocationEnabled: true,
              myLocationButtonEnabled: false,
              zoomControlsEnabled: false,
              markers: _getMapMarkers(),
              polylines: _polylines,
              onMapCreated: (controller) {
                _mapController = controller;
                setState(() {
                  _isMapInitialized = true;
                });
                _updateCameraPosition();
              },
            ),
            Positioned(
              bottom: 12,
              right: 12,
              child: FloatingActionButton(
                mini: true,
                backgroundColor: Colors.white,
                onPressed: () {
                  if (_currentLatLng != null && _isMapInitialized) {
                    _updateCameraPosition();
                  }
                },
                child: const Icon(Icons.my_location, color: Colors.blueAccent),
              ),
            ),
            Positioned.fill(
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(20),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("🗺️ تم الضغط على الخريطة")),
                    );
                    setState(() {
                      _showBigMap = true;
                    });
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPendingOrderCard() {
    if (!_isOnline || !_isDriverOnline) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.lock, color: Colors.red, size: 80),
            const SizedBox(height: 16),
            const Text(
              "أنت غير متاح الآن",
              style: TextStyle(
                fontSize: 24,
                color: Colors.red,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "قم بتفعيل التوفر لاستقبال الطلبات",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    if (_pendingOrder == null && !_hasAcceptedOrder) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 100,
              height: 100,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  SizedBox(
                    width: 80,
                    height: 80,
                    child: CircularProgressIndicator(
                      strokeWidth: 8,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.blueAccent),
                    ),
                  ),
                  const Icon(Icons.hourglass_empty, size: 40, color: Colors.blueAccent),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "بانتظار الطلبات...",
              style: TextStyle(
                fontSize: 22,
                color: Colors.blueGrey,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "جاري البحث عن طلبات جديدة",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    print('الطلب المنتظر: ${jsonEncode(_pendingOrder)}, _hasAcceptedOrder: $_hasAcceptedOrder, _hasPickedUp: $_hasPickedUp, نوع_الرحلة: ${_pendingOrder?['ride_type']}');

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.grey.shade50],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4)),
        ],
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_hasAcceptedOrder)
              Center(
                child: Column(
                  children: [
                    SizedBox(
                      width: 100,
                      height: 100,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            width: 80,
                            height: 80,
                            child: CircularProgressIndicator(
                              strokeWidth: 8,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                            ),
                          ),
                          const Icon(Icons.check_circle, size: 40, color: Colors.green),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _hasPickedUp ? "تم الاستلام" : "تم قبول الطلب",
                      style: const TextStyle(
                        fontSize: 22,
                        color: Colors.green,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            if (_hasAcceptedOrder) const SizedBox(height: 16),
            const Text(
              "طلب جديد",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blueAccent),
            ),
            const Divider(color: Colors.grey, thickness: 0.5),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.directions_car, size: 24, color: Colors.blueGrey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "نوع الرحلة: ${_pendingOrder!['ride_type'] ?? 'غير محدد'}",
                    style: const TextStyle(fontSize: 16),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.room_service, size: 24, color: Colors.blueGrey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "نوع الخدمة: ${_pendingOrder!['service_type'] ?? 'غير محددة'}",
                    style: const TextStyle(fontSize: 16),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.payment, size: 24, color: Colors.blueGrey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "الدفع: ${_pendingOrder!['payment_type'] ?? 'غير معروف'}",
                    style: const TextStyle(fontSize: 16),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.location_on, size: 24, color: Colors.blueGrey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "عنوان الاستلام: ${_pickupAddress ?? 'جاري التحميل...'}",
                    style: const TextStyle(fontSize: 16),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 2,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.flag, size: 24, color: Colors.blueGrey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "عنوان التوصيل: ${_dropoffAddress ?? 'جاري التحميل...'}",
                    style: const TextStyle(fontSize: 16),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 2,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                if (!_hasAcceptedOrder) ...[
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        minimumSize: const Size(0, 50),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        shadowColor: Colors.green.withOpacity(0.5),
                        elevation: 4,
                      ),
                      onPressed: _handleAcceptOrder,
                      child: const Text(
                        "قبول الطلب",
                        style: TextStyle(fontSize: 18, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        minimumSize: const Size(0, 50),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        shadowColor: Colors.red.withOpacity(0.5),
                        elevation: 4,
                      ),
                      onPressed: _handleDeclineOrder,
                      child: const Text(
                        "رفض الطلب",
                        style: TextStyle(fontSize: 18, color: Colors.white),
                      ),
                    ),
                  ),
                ] else ...[
                  if (!_hasPickedUp) ...[
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          minimumSize: const Size(0, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          shadowColor: Colors.blue.withOpacity(0.5),
                          elevation: 4,
                        ),
                        onPressed: _handlePickupConfirmation,
                        child: const Text(
                          "تم الاستلام",
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          minimumSize: const Size(0, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          shadowColor: Colors.red.withOpacity(0.5),
                          elevation: 4,
                        ),
                        onPressed: _handleCancelOrder,
                        child: const Text(
                          "إلغاء الطلب",
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                      ),
                    ),
                  ] else ...[
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          minimumSize: const Size(0, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          shadowColor: Colors.green.withOpacity(0.5),
                          elevation: 4,
                        ),
                        onPressed: _handleDeliveryConfirmation,
                        child: const Text(
                          "تم التوصيل",
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}