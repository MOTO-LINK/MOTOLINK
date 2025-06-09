import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:moto/general/map/utils/location_service.dart';

class GoogleMapView extends StatefulWidget {
  const GoogleMapView({super.key});

  @override
  State<GoogleMapView> createState() => _GoogleMapViewState();
}

class _GoogleMapViewState extends State<GoogleMapView> {
  late LocationService locationService;
  late GoogleMapController googleMapController;
  late CameraPosition initialCameraPosition;
  Set<Marker> markers = {};
  @override
  void initState() {
    locationService = LocationService();

    initialCameraPosition = const CameraPosition(
      target: LatLng(26.559028636955873, 31.6956708805559),
      zoom: 9,
    );
    super.initState();
    // Initialize any necessary services or variables here
  }

  @override
  Widget build(BuildContext context) {
    return GoogleMap(
      markers: markers,
      onMapCreated: (controller) {
        googleMapController = controller;
        updateCurrentLocation();
      },
      zoomControlsEnabled: false,
      initialCameraPosition: initialCameraPosition,
    );
  }

  void updateCurrentLocation() async {
    try {
      await locationService.checkAndRequestLocationService();
      await locationService.checkAndRequestPermission();

      var locationData = await locationService.getLocation();
      Marker currentLocationMarker = Marker(
        markerId: MarkerId('current_location'),
        position: LatLng(locationData.latitude!, locationData.longitude!),
        infoWindow: InfoWindow(title: 'Current Location'),
      );
      LatLng currentPositon = LatLng(
        locationData.latitude!,
        locationData.longitude!,
      );
      CameraPosition cameraPosition = CameraPosition(
        target: currentPositon,
        zoom: 17,
      );
      googleMapController.animateCamera(
        CameraUpdate.newCameraPosition(cameraPosition),
      );
      markers.add(currentLocationMarker);
      setState(() {});
    } on LocationServicePermissionException catch (_) {
      await Future.delayed(Duration(seconds: 1));
      updateCurrentLocation(); // 👈 هنا بنعيد المحاولة
    } on Exception catch (e) {
      print("Error: $e");
    }
  }
}
