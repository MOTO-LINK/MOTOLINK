import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:http/http.dart' as http;
import 'package:moto/general/map/utils/Services/SendAdress.dart';
import 'package:moto/general/map/utils/Services/google_maps_places_services.dart';
import 'package:moto/general/map/utils/location_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

const String googleApiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q';

class DriverHomeScreen extends StatefulWidget {
  @override
  _DriverHomeScreenState createState() => _DriverHomeScreenState();
}

class _DriverHomeScreenState extends State<DriverHomeScreen> {
  bool isAvailable = true;
  bool _isBottomSheetShown = false;
  LocationData? currentLocation;
  LatLng? customerLocation;
  GoogleMapController? mapController;
  Set<Polyline> polylines = {};

  @override
  void initState() {
    super.initState();
    LocationService().getRealTimeLocation((locationData) {
      if (locationData.latitude != null && locationData.longitude != null) {
        setState(() {
          currentLocation = locationData;
        });
        DriverLocationService().updateDriverLocation(
          locationData.latitude!,
          locationData.longitude!,
        );
        _moveCameraToDriver();
      }
    });
  }

  void _moveCameraToDriver() {
    if (mapController != null && currentLocation?.latitude != null && currentLocation?.longitude != null) {
      mapController!.animateCamera(
        CameraUpdate.newLatLngZoom(
          LatLng(currentLocation!.latitude!, currentLocation!.longitude!),
          16,
        ),
      );
    }
  }

  void _toggleAvailability(bool value) {
    setState(() {
      isAvailable = value;
    });
  }

  void _simulateIncomingOrder() {
    if (currentLocation?.latitude == null || currentLocation?.longitude == null) return;
    setState(() {
      customerLocation = LatLng(
        currentLocation!.latitude! + 0.01,
        currentLocation!.longitude! + 0.01,
      );
    });
    _getRoute();
    Navigator.of(context).pop();
  }

  Future<void> _getRoute() async {
    if (currentLocation?.latitude == null || currentLocation?.longitude == null || customerLocation == null) return;

    final origin = LatLng(currentLocation!.latitude!, currentLocation!.longitude!);
    final destination = customerLocation!;

    final routePoints = await GoogleDirectionsService().getRoute(origin, destination);

    setState(() {
      polylines = {
        Polyline(
          polylineId: PolylineId('route'),
          points: routePoints,
          color: Colors.blue,
          width: 5,
        )
      };
    });
  }

  Future<void> drawRouteFromBackend(double startLat, double startLng, double endLat, double endLng) async {
    final origin = LatLng(startLat, startLng);
    final destination = LatLng(endLat, endLng);

    final routePoints = await GoogleDirectionsService().getRoute(origin, destination);

    setState(() {
      polylines = {
        Polyline(
          polylineId: PolylineId('backend_route'),
          points: routePoints,
          color: Colors.blue,
          width: 5,
        ),
      };
    });
  }

  void _showWaitingSheet() {
    if (_isBottomSheetShown) return;
    _isBottomSheetShown = true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.25,
          width: double.infinity,
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 10),
              Text('بانتظار الطلبات', style: TextStyle(fontSize: 16)),
              ElevatedButton(
                onPressed: _simulateIncomingOrder,
                child: Text('محاكاة طلب جديد'),
              )
            ],
          ),
        );
      },
    ).whenComplete(() {
      _isBottomSheetShown = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isAvailable && customerLocation == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _showWaitingSheet());
    }

    return Scaffold(
      body: Stack(
        children: [
          currentLocation == null
              ? Center(child: CircularProgressIndicator())
              : GoogleMap(
                  onMapCreated: (controller) {
                    mapController = controller;
                    _moveCameraToDriver();
                  },
                  initialCameraPosition: CameraPosition(
                    target: LatLng(
                      currentLocation!.latitude!,
                      currentLocation!.longitude!,
                    ),
                    zoom: 16,
                  ),
                  myLocationEnabled: true,
                  myLocationButtonEnabled: false,
                  markers: {
                    if (customerLocation != null)
                      Marker(
                        markerId: MarkerId('customer'),
                        position: customerLocation!,
                        infoWindow: InfoWindow(title: 'العميل'),
                      ),
                  },
                  polylines: polylines,
                ),
          Positioned(
            top: 50,
            left: 0,
            right: 0,
            child: Container(
              color: Colors.blue,
              padding: EdgeInsets.symmetric(vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Switch(
                    value: isAvailable,
                    onChanged: _toggleAvailability,
                    activeColor: Colors.white,
                  ),
                  Text(
                    isAvailable ? 'متاح الآن' : 'غير متاح الآن',
                    style: TextStyle(color: Colors.white, fontSize: 18),
                  ),
                  Icon(Icons.notifications_none, color: Colors.white),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'الرئيسية'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: 'محفظتي'),
          BottomNavigationBarItem(icon: Icon(Icons.list), label: 'طلباتي'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'الإعدادات'),
        ],
      ),
    );
  }
}
