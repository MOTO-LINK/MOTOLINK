import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;

// إرسال عنوان جديد
Future<String?> sendLocationToBackend({
  required LatLng latLng,
  required String autoAddress,
  required String label,
  required String token,
}) async {
  final url = Uri.parse("http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api/rides/request");

  print('🚀 Sending location to backend...');
  print('📍 Coordinates: ${latLng.latitude}, ${latLng.longitude}');
  print('🏷️ Label: $label');
  print('📫 Address: $autoAddress');
  print('🔐 Token: $token');

  final body = jsonEncode({
    'name': label,
    'address': autoAddress,
    'latitude': latLng.latitude,
    'longitude': latLng.longitude,
    'type': 'other',
    'isDefault': false,
  });

  print('📦 Request Body: $body');

  final response = await http.post(
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: body,
  );

  print('📬 Response Status Code: ${response.statusCode}');
  print('📨 Response Body: ${response.body}');

  if (response.statusCode == 200 || response.statusCode == 201) {
    final data = jsonDecode(response.body);
    final locationId = data['data']?['location_id'];
    print('✅ Location successfully sent! 🆔 ID: $locationId');
    return locationId?.toString();
  } else {
    print('❌ Error sending address: ${response.statusCode}');
    print('💥 Body: ${response.body}');
    throw Exception('Failed to send address');
  }
}

// تحديث عنوان موجود
Future<void> updateLocationToBackend({
  required String locationId,
  required LatLng latLng,
  required String autoAddress,
  required String label,
  required String token,
}) async {
  final url = Uri.parse(
      "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api/rider/locations/$locationId");

  final data = {
    'name': label,
    'address': autoAddress,
    'latitude': latLng.latitude,
    'longitude': latLng.longitude,
    'isDefault': false,
  };

  print("🔧 PATCH URL: $url");
  print("🪪 Bearer Token: $token");
  print("📝 Headers: {Content-Type: application/json, Authorization: Bearer $token}");
  print("📦 Data: $data");

  final response = await http.patch(
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode(data),
  );

  print("📥 Patch response status: ${response.statusCode}");
  print("📥 Patch response body: ${response.body}");

  if (response.statusCode == 200 || response.statusCode == 204) {
    print("✅ Address updated successfully!");
  } else {
    print("🚨 Failed to update address: ${response.body}");
    throw Exception('❌ Failed to update address | Status: ${response.statusCode}, Body: ${response.body}');
  }
}

// حذف عنوان
Future<void> deleteLocationFromBackend({
  required String locationId,
  required String token,
}) async {
  final url = Uri.parse(
    "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api/rider/locations/$locationId",
  );

  final response = await http.delete(
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
  );

  print("🗑️ Delete response status: ${response.statusCode}");
  print("🗑️ Delete response body: ${response.body}");

  if (response.statusCode != 200) {
    throw Exception('Failed to delete address | Status: ${response.statusCode}, Body: ${response.body}');
  }
}




class DriverLocationService {
  final String baseUrl =
      'http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api';

  Future<void> updateDriverLocation(double lat, double lng) async {
    final url = Uri.parse('$baseUrl/driver/location');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'latitude': lat,
          'longitude': lng,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          print('✅ Location updated');
        } else {
          print('❌ Failed: ${data['message']}');
        }
      } else {
        print('❌ Server error: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error: $e');
    }
  }
}


const String googleApiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q';

class RouteService {
  static Future<void> drawRouteFromBackend({
    required LatLng start,
    required LatLng end,
    required Function(Set<Polyline>) onPolylinesReady,
  }) async {
    final url = Uri.parse(
      'https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=$googleApiKey',
    );

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final points = data['routes'][0]['overview_polyline']['points'];

      final decodedPoints = _decodePoly(points);

      onPolylinesReady({
        Polyline(
          polylineId: PolylineId('backend_route'),
          color: Colors.blue,
          width: 5,
          points: decodedPoints,
        )
      });
    } else {
      print('فشل في جلب المسار من Google Directions API');
    }
  }

  static List<LatLng> _decodePoly(String poly) {
    List<LatLng> points = [];
    int index = 0, len = poly.length;
    int lat = 0, lng = 0;

    while (index < len) {
      int b, shift = 0, result = 0;

      do {
        b = poly.codeUnitAt(index++) - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);

      int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = poly.codeUnitAt(index++) - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);

      int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.add(LatLng(lat / 1E5, lng / 1E5));
    }

    return points;
  }
}
