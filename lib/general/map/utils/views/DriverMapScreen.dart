import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:moto/general/map/utils/Services/driverService.dart';

class DriverMapFullScreen extends StatefulWidget {
  const DriverMapFullScreen({super.key});

  @override
  State<DriverMapFullScreen> createState() => _DriverMapFullScreenState();
}

class _DriverMapFullScreenState extends State<DriverMapFullScreen> {
  final Location location = Location();
  final DriverService driverService = DriverService();

  GoogleMapController? _mapController;
  LatLng _currentLatLng = const LatLng(30.0444, 31.2357);
  StreamSubscription<LocationData>? _locationSubscription;
  Marker? _driverMarker;

  @override
  void initState() {
    super.initState();
    _startLocationUpdates();
  }

  void _startLocationUpdates() async {
    bool permission = await location.requestPermission() == PermissionStatus.granted;

    if (!permission) return;

    _locationSubscription = location.onLocationChanged.listen((LocationData data) async {
      if (data.latitude == null || data.longitude == null) return;

      final newLatLng = LatLng(data.latitude!, data.longitude!);

      setState(() {
        _currentLatLng = newLatLng;
        _driverMarker = Marker(
          markerId: const MarkerId('driver'),
          position: newLatLng,
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        );
      });

      // Move camera
      _mapController?.animateCamera(CameraUpdate.newLatLng(newLatLng));

      // Send to server
      await driverService.updateDriverLocation(data.latitude!, data.longitude!);
    });
  }

  @override
  void dispose() {
    _locationSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("موقعك الحالي")),
      body: GoogleMap(
        initialCameraPosition: CameraPosition(target: _currentLatLng, zoom: 15),
        onMapCreated: (controller) => _mapController = controller,
        markers: _driverMarker != null ? {_driverMarker!} : {},
        myLocationEnabled: true,
        myLocationButtonEnabled: true,
      ),
    );
  }
}
