import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:dio/dio.dart';
import 'package:location/location.dart' hide LocationAccuracy;
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/general/core/service/storage_service.dart';

class UserMapPage extends StatefulWidget {
  const UserMapPage({super.key});

  @override
  State<UserMapPage> createState() => _UserMapPageState();
}

class _UserMapPageState extends State<UserMapPage> {
  final Completer<GoogleMapController> _controller = Completer();
  Position? _currentPosition;
  LatLng? _pickupLocation;
  LatLng? _dropoffLocation;
  bool isPickupSelected = true;
  bool isLoading = false;

  final String baseUrl = "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api";

  @override
  void initState() {
    super.initState();
    _checkLocationPermission();
  }

  Future<void> _checkLocationPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('يرجى تفعيل خدمات الموقع')),
      );
      return;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('يرجى السماح بالوصول إلى الموقع')),
        );
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('تم رفض إذن الموقع بشكل دائم، يرجى تفعيله من الإعدادات')),
      );
      return;
    }

    await _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      setState(() {
        _currentPosition = position;
      });

      final GoogleMapController controller = await _controller.future;
      controller.animateCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(
            target: LatLng(position.latitude, position.longitude),
            zoom: 14.0,
          ),
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('خطأ في جلب الموقع: $e')),
      );
    }
  }

  void _onMapTapped(LatLng position) {
    setState(() {
      if (isPickupSelected) {
        _pickupLocation = position;
      } else {
        _dropoffLocation = position;
      }
    });
  }

  Future<void> _sendRideRequest() async {
    if (_pickupLocation == null || _dropoffLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("يجب تحديد نقطة الانطلاق والوصول")),
      );
      return;
    }

    try {
      setState(() {
        isLoading = true;
      });

      final token = await StorageService().getToken();
      if (token == null) throw Exception("Token not found.");

      final dio = Dio(BaseOptions(
        baseUrl: baseUrl,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ));

      final requestBody = {
        "pickup_latitude": _pickupLocation!.latitude,
        "pickup_longitude": _pickupLocation!.longitude,
        "dropoff_latitude": _dropoffLocation!.latitude,
        "dropoff_longitude": _dropoffLocation!.longitude,
        "service_type": "delivery" // لو نوع الخدمة متغير حط اللي انت عاوزه
      };

      final response = await dio.post("/rides/request", data: requestBody);

      if (response.statusCode == 200 && response.data['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("تم إرسال الطلب بنجاح")),
        );
        Navigator.pop(context); // ارجعه للشاشة السابقة بعد النجاح
      } else {
        throw Exception("فشل إرسال الطلب");
      }
    } catch (e) {
      print(e);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('خطأ: $e')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Set<Marker> _buildMarkers() {
    Set<Marker> markers = {};

    if (_pickupLocation != null) {
      markers.add(Marker(
        markerId: const MarkerId("pickup"),
        position: _pickupLocation!,
        infoWindow: const InfoWindow(title: "مكان الانطلاق"),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
      ));
    }

    if (_dropoffLocation != null) {
      markers.add(Marker(
        markerId: const MarkerId("dropoff"),
        position: _dropoffLocation!,
        infoWindow: const InfoWindow(title: "مكان الوصول"),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
      ));
    }

    return markers;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "حدد موقعك",
        centerTitle: true, onBackPressed: () {  },
        
      ),
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: CameraPosition(
              target: _currentPosition != null
                  ? LatLng(_currentPosition!.latitude, _currentPosition!.longitude)
                  : const LatLng(24.7136, 46.6753),
              zoom: 14.0,
            ),
            onMapCreated: (GoogleMapController controller) {
              _controller.complete(controller);
            },
            onTap: _onMapTapped,
            markers: _buildMarkers(),
            myLocationEnabled: true,
            myLocationButtonEnabled: false,
          ),
          Positioned(
            bottom: 20,
            left: 20,
            right: 20,
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          isPickupSelected = true;
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isPickupSelected ? ColorsApp().secondaryColor : Colors.grey,
                      ),
                      child: const Text("تحديد نقطة الانطلاق"),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          isPickupSelected = false;
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: !isPickupSelected ? ColorsApp().secondaryColor : Colors.grey,
                      ),
                      child: const Text("تحديد نقطة الوصول"),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: isLoading ? null : _sendRideRequest,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: ColorsApp().secondaryColor,
                  ),
                  child: isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text("إرسال الطلب"),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
