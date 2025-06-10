import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/general/map/utils/google_maps_places_services.dart';
import 'package:moto/general/map/utils/location_service.dart';
import 'package:moto/models/textfieldmodel.dart';
import 'package:moto/core/widgets/CustomTextField.dart';
import 'place_BotoomSheet.dart';

class GoogleMapView extends StatefulWidget {
  const GoogleMapView({super.key});

  @override
  State<GoogleMapView> createState() => _GoogleMapViewState();
}

class _GoogleMapViewState extends State<GoogleMapView> {
  late LocationService locationService;
  late GoogleMapController googleMapController;
  late CameraPosition initialCameraPosition;
  late GoogleMapsPlacesServices googleMapsPlacesServices;
  Set<Marker> markers = {};

  @override
  void initState() {
    googleMapsPlacesServices = GoogleMapsPlacesServices();
    locationService = LocationService();
    initialCameraPosition = const CameraPosition(
      target: LatLng(26.559028636955873, 31.6956708805559),
      zoom: 9,
    );
    super.initState();

    // Show bottom sheet automatically after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        builder: (BuildContext context) {
          return PlacesBottomSheet(
            googleMapsPlacesServices: googleMapsPlacesServices,
            colorsApp: ColorsApp(),
          );
        },
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(appBar: CustomAppBar(
           title: "Find Your Location",
        imagePath: "assets/images/DELIVERY.png",
        


        ),body: GoogleMap(
          markers: markers,
          onMapCreated: (controller) {
            googleMapController = controller;
            updateCurrentLocation();
          },
          zoomControlsEnabled: false,
          initialCameraPosition: initialCameraPosition,
        ),),
        
      ],
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
      updateCurrentLocation();
    } on Exception catch (e) {
      print("Error: $e");
    }
  }
}