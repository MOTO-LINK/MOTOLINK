import 'dart:convert';

import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;

Future<void> sendLocationToBackend({
  required LatLng latLng,
  required String autoAddress,
  required String label,
  required String token,
}) async {
  final url = Uri.parse('https://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api'); // عدل اللينك
  final response = await http.post(
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({
      'latitude': latLng.latitude,
      'longitude': latLng.longitude,
      'address': autoAddress,
      'label': label,
    }),
  );

  if (response.statusCode == 200 || response.statusCode == 201) {
    print('✅ Location saved to backend!');
  } else {
    print('❌ Failed to save location. Status: ${response.statusCode}');
    throw Exception('فشل في الحفظ');
  }
}
