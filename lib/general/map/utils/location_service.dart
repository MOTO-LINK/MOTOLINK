import 'package:location/location.dart';

class LocationService {
Location location = Location();
Future<void> checkAndRequestLocationService() async {
    var isServiceEnabled = await location.serviceEnabled();
    if (!isServiceEnabled) {
      isServiceEnabled = await location.requestService();
    }
    if (!isServiceEnabled) {
     throw LocationServiceException();  }
    }
    
  





  Future<void> checkAndRequestPermission() async {
    var permissionStatus = await location.hasPermission();
    if (permissionStatus == PermissionStatus.deniedForever) {
      throw LocationServicePermissionException();
    }
    if (permissionStatus == PermissionStatus.denied) {
      permissionStatus = await location.requestPermission();
     if (permissionStatus != PermissionStatus.granted) {
        throw LocationServicePermissionException();
      }
    }
   
  }


  void getRealTimeLocation(void Function(LocationData)? onData) async{
    await checkAndRequestLocationService();
    await checkAndRequestPermission();

  location.onLocationChanged.listen((locationData) {
    if (onData != null) {
      onData(locationData);
    }
  });

  
}
Future<LocationData> getLocation() async {
     await checkAndRequestLocationService();
    await checkAndRequestPermission();

    return await location.getLocation();
  }
}


class LocationServiceException implements Exception {
  @override
  String toString() {
    return 'Location service is not enabled.';
  }
  
}
class LocationServicePermissionException implements Exception {
  @override
  String toString() {
    return 'Location permission is denied.';
  }
  
}