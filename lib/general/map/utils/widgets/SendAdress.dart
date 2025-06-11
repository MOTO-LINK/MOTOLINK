import 'dart:convert';

import 'package:http/http.dart' as http;

Future<void> sendAddressToBackend(Map selectedLocation) async {
  final url = Uri.parse('https://your-api.com/api/addresses'); // غيّر الرابط دا

  final body = {
    "name": selectedLocation['label'] ?? 'No Label',
    "address": selectedLocation['autoAddress'] ?? '',
    "latitude": selectedLocation['latLng']?.latitude ?? 0,
    "longitude": selectedLocation['latLng']?.longitude ?? 0,
    "type": "other",
    "isDefault": false,
  };

  final response = await http.post(
    url,
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer TOKEN', لو فيه
    },
    body: jsonEncode(body),
  );

  if (response.statusCode == 200 || response.statusCode == 201) {
    print('📍 العنوان اتبعت تمام ✅');
  } else {
    print('❌ حصلت مشكلة: ${response.body}');
  }
}
