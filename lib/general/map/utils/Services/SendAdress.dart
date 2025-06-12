import 'dart:convert';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;

// إرسال عنوان جديد
Future<String?> sendLocationToBackend({
  required LatLng latLng,
  required String autoAddress,
  required String label,
  required String token,
}) async {
  final url = Uri.parse("http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api/rider/locations");

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
