import 'dart:convert';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

const String baseUrl = 'http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api';

// إرسال عنوان جديد
Future<String?> sendLocationToBackend({
  required LatLng latLng,
  required String autoAddress,
  required String label,
  required String token,
}) async {
  final url = Uri.parse("$baseUrl/rider/locations");

  final body = jsonEncode({
    'name': label,
    'address': autoAddress,
    'latitude': latLng.latitude,
    'longitude': latLng.longitude,
    'type': 'other',
    'isDefault': false,
  });

  print('🚀 [Send Location] Sending data to: $url');
  print('📦 Request Body: $body');

  try {
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );

    print('📬 Response Status: ${response.statusCode}');
    print('📨 Response Body: ${response.body}');

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      final locationId = data['data']?['location_id'];
      print('✅ Location added with ID: $locationId');
      return locationId?.toString();
    } else {
      throw Exception('❌ Failed to send location | Status: ${response.statusCode}');
    }
  } catch (e) {
    print('💥 Exception while sending location: $e');
    rethrow;
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
  final url = Uri.parse("$baseUrl/rider/locations/$locationId");

  final data = {
    'name': label,
    'address': autoAddress,
    'latitude': latLng.latitude,
    'longitude': latLng.longitude,
    'isDefault': false,
  };

  print("🔧 [Update Location] URL: $url");
  print("📦 Data: $data");

  try {
    final response = await http.patch(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );

    print("📬 Response Status: ${response.statusCode}");
    print("📨 Response Body: ${response.body}");

    if (response.statusCode == 200 || response.statusCode == 204) {
      print("✅ Location updated successfully");
    } else {
      throw Exception('❌ Failed to update location | Status: ${response.statusCode}');
    }
  } catch (e) {
    print("💥 Exception while updating location: $e");
    rethrow;
  }
}

// حذف عنوان
Future<void> deleteLocationFromBackend({
  required String locationId,
  required String token,
}) async {
  final url = Uri.parse("$baseUrl/rider/locations/$locationId");

  print("🗑️ [Delete Location] URL: $url");

  try {
    final response = await http.delete(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    print("📬 Response Status: ${response.statusCode}");
    print("📨 Response Body: ${response.body}");

    if (response.statusCode != 200) {
      throw Exception('❌ Failed to delete location | Status: ${response.statusCode}');
    } else {
      print("✅ Location deleted successfully");
    }
  } catch (e) {
    print("💥 Exception while deleting location: $e");
    rethrow;
  }
}

// خدمة تحديث مكان السواق
class DriverLocationService {
  Future<void> updateDriverLocation(double lat, double lng) async {
    final url = Uri.parse('$baseUrl/driver/location');

    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');

      if (token == null) {
        print('❌ No token found');
        return;
      }

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'latitude': lat, 'longitude': lng}),
      );

      print('📬 Response Status: ${response.statusCode}');
      print('📨 Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          print('✅ Driver location updated successfully');
        } else {
          print('❌ Failed: ${data['message']}');
        }
      } else {
        throw Exception('❌ Server error: ${response.statusCode}');
      }
    } catch (e) {
      print('💥 Exception while updating driver location: $e');
    }
  }
}

// خدمة قبول الطلب
class AcceptOrderService {
  Future<bool> acceptOrder(String requestId) async {
    final url = Uri.parse('$baseUrl/driver/request/$requestId/accept');

    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');

      if (token == null) {
        print('❌ No token found');
        return false;
      }

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print('📬 Response Status: ${response.statusCode}');
      print('📨 Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          print('✅ Order accepted successfully');
          return true;
        } else {
          print('❌ API Error: ${data['message']}');
          return false;
        }
      } else {
        throw Exception('❌ Server error: ${response.statusCode}');
      }
    } catch (e) {
      print('💥 Exception while accepting order: $e');
      return false;
    }
  }
}
