import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> sendLocationToBackend({
  required LatLng latLng,
  required String autoAddress,
  required String label,
  required String token,
}) async {
  final url = Uri.parse('motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api/rider/locations');

  final response = await http.post(
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({
      'name': label,
      'address': autoAddress,
      'latitude': latLng.latitude,
      'longitude': latLng.longitude,
      'type': 'other',
      'isDefault': false,
    }),
  );

  if (response.statusCode == 200 || response.statusCode == 201) {
    print('📡 Address successfully sent to backend');
  } else {
    print('❌ Error sending address: ${response.statusCode} => ${response.body}');
    throw Exception('Failed to send address');
  }
}
