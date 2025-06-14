import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:moto/general/core/service/storage_service.dart';

class DriverService {
  final String baseUrl =
      'http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api';
  final StorageService storageService = StorageService();

  Future<bool> _isDriver() async {
    String? userType = await storageService.getUserType();
    print("🧾 User Type from storage: $userType");
    return userType?.toLowerCase() == "driver";
  }

  Future<void> updateDriverLocation(double lat, double lng) async {
    print("📍 Trying to update driver location...");

    if (!await _isDriver()) {
      print("⚠️ Not a driver. Skipping.");
      return;
    }

    final isOnline = await storageService.getDriverOnlineStatus();
    final isAvailable = await storageService.getDriverAvailability();

    if (!isOnline || !isAvailable) {
      print("❌ Driver is not online or not available. Skipping location update.");
      return;
    }

    final url = Uri.parse('$baseUrl/driver/location');
    String? token = await storageService.getToken();

    if (token == null) {
      print("❌ No token found.");
      return;
    }

    final body = jsonEncode({'latitude': lat, 'longitude': lng});
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );

    print("📬 Location update response: ${response.statusCode}");
    print("📬 Location update body: ${response.body}");
  }

  Future<void> updateAvailability(bool isAvailable) async {
    print("🟢 Updating availability...");

    if (!await _isDriver()) {
      print("⚠️ Not a driver. Skipping.");
      return;
    }

    final url = Uri.parse('$baseUrl/driver/availability');
    String? token = await storageService.getToken();

    if (token == null) {
      print("❌ No token found.");
      return;
    }

    final body = jsonEncode({'isAvailable': isAvailable});
    print("📬 Availability request body: $body");

    final response = await http.patch(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );

    print("📬 Availability response status: ${response.statusCode}");
    print("📬 Availability response body: ${response.body}");

    // 🆕 حفظ الحالة في التخزين
    await storageService.saveDriverAvailability(isAvailable);
  }

  Future<bool> setOnlineStatus(bool online) async {
    print("🟦 Setting online status to: $online");

    if (!await _isDriver()) {
      print("⚠️ Not a driver. Skipping.");
      return false;
    }

    final url = Uri.parse('$baseUrl/driver/online');
    String? token = await storageService.getToken();

    if (token == null) {
      print("❌ No token found.");
      return false;
    }

    final body = jsonEncode({'online': online});
    print("📤 Online status body: $body");

    final response = await http.patch(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );

    print("📬 Online status response: ${response.statusCode}");
    print("📬 Online status body: ${response.body}");

    // 🆕 حفظ الحالة في التخزين
    await storageService.saveDriverOnlineStatus(online);

    return response.statusCode == 200;
  }

  Future<List<Map<String, dynamic>>> fetchAvailableRides() async {
    print("🚕 Fetching available rides...");

    if (!await _isDriver()) {
      print("⚠️ Not a driver. Skipping.");
      return [];
    }

    final url = Uri.parse('$baseUrl/rides/available');
    String? token = await storageService.getToken();

    if (token == null) {
      print("❌ No token found.");
      return [];
    }

    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    print("📬 Response: ${response.statusCode}");
    print("📬 Body: ${response.body}");

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(json['data']);
    } else {
      return [];
    }
  }

  Future<bool> acceptOrder(String requestId) async {
    print("📦 Accepting order: $requestId");

    if (!await _isDriver()) {
      print("⚠️ Not a driver.");
      return false;
    }

    final url = Uri.parse('$baseUrl/driver/request/$requestId/accept');
    String? token = await storageService.getToken();

    if (token == null) {
      print("❌ No token.");
      return false;
    }

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    print("📬 Accept response: ${response.statusCode}");
    print("📬 Accept response body: ${response.body}");

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true;
    } else {
      return false;
    }
  }
}
