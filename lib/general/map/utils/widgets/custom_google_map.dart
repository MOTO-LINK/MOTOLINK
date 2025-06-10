import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:moto/general/map/utils/location_service.dart';

class CustomGoogleMap extends StatefulWidget {
  const CustomGoogleMap({super.key});

  @override
  State<CustomGoogleMap> createState() => _CustomGoogleMapState();
}

class _CustomGoogleMapState extends State<CustomGoogleMap> {
  late CameraPosition initialCameraPosition;
  GoogleMapController? googleMapController;
  late LocationService locationService;
  bool isFirstCall = true;

  String? appMapStyle;
  Set<Marker> markers = {};

  @override
  void initState() {
    super.initState();
    initialCameraPosition = const CameraPosition(
      zoom: 1,
      target: LatLng(26.55926462535152, 31.695673232389016),
    );
    locationService = LocationService();
    loadMapStyle();
    updateMyLocation();
  }

  Future<void> loadMapStyle() async {
    appMapStyle = await DefaultAssetBundle.of(
      context,
    ).loadString('assets/map_styles/app_style.json');
    setState(() {});
  }

  @override
  void dispose() {
    googleMapController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (appMapStyle == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return Stack(
      children: [
        GoogleMap(
          markers: markers,
          zoomControlsEnabled: false,
          style: appMapStyle,
          onMapCreated: (controller) {
            googleMapController = controller;
          },
          cameraTargetBounds: CameraTargetBounds(
            LatLngBounds(
              southwest: const LatLng(26.5400, 31.6500),
              northeast: const LatLng(26.5900, 31.7400),
            ),
          ),
          initialCameraPosition: initialCameraPosition,
        ),
      ],
    );
  }

  void updateMyLocation() async {
    await locationService.checkAndRequestLocationService();
    await locationService.checkAndRequestPermission();
    locationService.getRealTimeLocation((locationData) {
      SetMyLocationMarker(locationData);
      UpdateMyCamera(locationData);
    });
  }

  void UpdateMyCamera(LocationData locationData) {
    if (isFirstCall) {
      var cameraPosition = CameraPosition(
        target: LatLng(locationData.latitude!, locationData.longitude!),
        zoom: 16,
      );
      googleMapController?.animateCamera(
        CameraUpdate.newCameraPosition(cameraPosition),
      );
      isFirstCall = false;
    } else {
      googleMapController?.animateCamera(
        CameraUpdate.newLatLng(
          LatLng(locationData.latitude!, locationData.longitude!),
        ),
      );
    }
  }

  void SetMyLocationMarker(LocationData locationData) {
    var myLocationmarker = Marker(
      markerId: const MarkerId('my_location'),
      position: LatLng(locationData.latitude!, locationData.longitude!),
      infoWindow: const InfoWindow(title: 'My Location'),
    );
    markers.add(myLocationmarker);
    setState(() {});
  }
}