import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geocoding/geocoding.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/general/map/utils/location_service.dart';
import 'package:moto/general/map/utils/widgets/searchlocation.dart';
import 'package:moto/general/map/utils/Services/google_maps_places_services.dart';

final colors = ColorsApp();

class SelectLocationScreen extends StatefulWidget {
  final String? initialLabel;
  final String? initialAutoAddress;
  final LatLng? initialLatLng;
  final String? initialLocationId;

  const SelectLocationScreen({
    this.initialLabel,
    this.initialAutoAddress,
    this.initialLatLng,
    this.initialLocationId,
    super.key,
  });

  @override
  _SelectLocationScreenState createState() => _SelectLocationScreenState();
}

class _SelectLocationScreenState extends State<SelectLocationScreen> with WidgetsBindingObserver {
  GoogleMapController? _mapController;
  LatLng? _currentLatLng;
  String _placeNameFromMap = 'جاري تحديد العنوان...';
  final TextEditingController _customLabelController = TextEditingController();
  LocationService locationService = LocationService();
  final GoogleMapsPlacesServices _placesServices = GoogleMapsPlacesServices();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);

    if (widget.initialLatLng != null) {
      _currentLatLng = widget.initialLatLng;
    }
    if (widget.initialLabel != null) {
      _customLabelController.text = widget.initialLabel!;
    }
    if (widget.initialAutoAddress != null) {
      _placeNameFromMap = widget.initialAutoAddress!;
    }

    if (_currentLatLng == null) {
      _getUserCurrentLocation();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _mapController?.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _getUserCurrentLocation();
    }
  }

  void _getUserCurrentLocation() async {
    try {
      final locationData = await locationService.getLocation();
      final latLng = LatLng(locationData.latitude!, locationData.longitude!);

      if (!mounted) return;
      setState(() {
        _currentLatLng = latLng;
      });

      if (_mapController != null) {
        _mapController!.animateCamera(CameraUpdate.newLatLng(latLng));
      }
    } catch (e) {
      print("❌ Error getting location: $e");
    }
  }

  void _onCameraMove(CameraPosition position) {
    _currentLatLng = position.target;
  }

  void _onCameraIdle() async {
    if (_currentLatLng == null) return;

    try {
      List<Placemark> placemarks = await placemarkFromCoordinates(
        _currentLatLng!.latitude,
        _currentLatLng!.longitude,
      );
      if (placemarks.isNotEmpty) {
        final place = placemarks.first;
        final fullName =
            '${place.street}, ${place.locality}, ${place.administrativeArea}';
        if (!mounted) return;
        setState(() {
          _placeNameFromMap = fullName;
        });
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _placeNameFromMap = 'مش قادر أحدد العنوان';
      });
    }
  }

  void _saveLocation() {
    String label = _customLabelController.text.trim();

    if (label.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('من فضلك اكتب اسم للمكان')),
      );
      return;
    }

    Navigator.pop(context, {
      'latLng': _currentLatLng,
      'autoAddress': _placeNameFromMap,
      'label': label,
      'locationId': widget.initialLocationId, // مهم جداً
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: colors.backgroundColor,
      resizeToAvoidBottomInset: true,
      body: _currentLatLng == null
          ? Center(child: CircularProgressIndicator())
          : Stack(
              children: [
                GoogleMap(
                  onMapCreated: (controller) {
                    _mapController = controller;
                    if (_currentLatLng != null) {
                      _mapController!.animateCamera(
                        CameraUpdate.newLatLng(_currentLatLng!),
                      );
                    }
                  },
                  initialCameraPosition: CameraPosition(
                    target: _currentLatLng!,
                    zoom: 16.0,
                  ),
                  onCameraMove: _onCameraMove,
                  onCameraIdle: _onCameraIdle,
                  myLocationEnabled: true,
                  myLocationButtonEnabled: false,
                ),
                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          margin: EdgeInsets.only(top: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.9),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 4,
                              ),
                            ],
                          ),
                          child: IconButton(
                            icon: Icon(Icons.arrow_back, color: ColorsApp().secondaryColor, size: 28),
                            onPressed: () => Navigator.of(context).pop(),
                            tooltip: 'back',
                          ),
                        ),
                        SizedBox(width: 8),
                        Expanded(
                          child: PlacesSearchBar(
                            googleMapsPlacesServices: _placesServices,
                            colorsApp: ColorsApp(),
                            onPlaceSelected: (placeDetails) {
                              final lat = placeDetails.geometry?.location?.lat;
                              final lng = placeDetails.geometry?.location?.lng;
                              if (lat != null && lng != null) {
                                final newLatLng = LatLng(lat, lng);
                                _mapController?.animateCamera(
                                  CameraUpdate.newLatLng(newLatLng),
                                );
                                setState(() => _currentLatLng = newLatLng);
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        margin: EdgeInsets.only(bottom: 8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(6),
                          boxShadow: [
                            BoxShadow(
                              color: colors.shadowColor,
                              blurRadius: 4,
                            )
                          ],
                        ),
                        child: Text(
                          _placeNameFromMap,
                          style: TextStyle(
                            fontSize: 11,
                            color: colors.textColor,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Icon(
                        FontAwesomeIcons.mapMarkerAlt,
                        size: 42,
                        color: colors.secondaryColor,
                      ),
                    ],
                  ),
                ),
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Material(
                    color: Colors.transparent,
                    child: Container(
                      padding: EdgeInsets.all(16),
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
                        boxShadow: [
                          BoxShadow(
                            color: colors.shadowColor,
                            blurRadius: 10,
                          )
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          TextField(
                            controller: _customLabelController,
                            textDirection: TextDirection.rtl,
                            decoration: InputDecoration(
                              hintText: 'مثال: البيت، الشغل...',
                              hintStyle: TextStyle(color: colors.TextField),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: colors.primaryColor),
                              ),
                            ),
                          ),
                          SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _saveLocation,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: colors.secondaryColor,
                                padding: EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              child: Text(
                                'save location',
                                textDirection: TextDirection.rtl,
                                style: TextStyle(
                                  color: ColorsApp().textColor,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}