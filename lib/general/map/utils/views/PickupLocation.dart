import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/general/map/utils/location_service.dart';

class PickupLocation extends StatefulWidget {
  const PickupLocation({super.key});

  @override
  State<PickupLocation> createState() => _PickupLocationState();
}

class _PickupLocationState extends State<PickupLocation> {
  final LocationService locationService = LocationService();
  GoogleMapController? _controller;
  Marker? _myMarker;

  @override
  void initState() {
    super.initState();
    updateMyLocation(); // 👈 أول ما الصفحة تفتح
  }

  void updateMyLocation() async {
    await locationService.checkAndRequestLocationService();
    await locationService.checkAndRequestPermission();
    locationService.getRealTimeLocation((locationData) {
      SetMyLocationMarker(locationData);
      UpdateMyCamera(locationData);
    });
  }

  void SetMyLocationMarker(LocationData data) {
    final marker = Marker(
      markerId: MarkerId('me'),
      position: LatLng(data.latitude!, data.longitude!),
      infoWindow: InfoWindow(title: 'أنا هنا!'),
    );
    setState(() {
      _myMarker = marker;
    });
  }

  void UpdateMyCamera(LocationData data) {
    _controller?.animateCamera(
      CameraUpdate.newLatLng(
        LatLng(data.latitude!, data.longitude!),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:CustomAppBar(onBackPressed: (){},
        
      ),
      body: GoogleMap(
        initialCameraPosition: CameraPosition(
          target: LatLng(0, 0),
          zoom: 15,
        ),
        markers: _myMarker != null ? {_myMarker!} : {},
        onMapCreated: (controller) => _controller = controller,
        myLocationEnabled: true,
        myLocationButtonEnabled: false,
      ),
    );
  }
}
