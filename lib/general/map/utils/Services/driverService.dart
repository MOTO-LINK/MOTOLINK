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

    if (!await _isDriver()) return;

    final isOnline = await storageService.getDriverOnlineStatus();
    final isAvailable = await storageService.getDriverAvailability();

    if (!isOnline || !isAvailable) {
      print("❌ Driver is not online or available.");
      return;
    }

    final url = Uri.parse('$baseUrl/driver/location');
    String? token = await storageService.getToken();
    if (token == null) return;

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

    if (!await _isDriver()) return;

    final url = Uri.parse('$baseUrl/driver/availability');
    String? token = await storageService.getToken();
    if (token == null) return;

    final body = jsonEncode({'is_available': isAvailable});
    final response = await http.patch(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );

    print("📬 Availability response: ${response.statusCode}");
    print("📬 Availability body: ${response.body}");

    await storageService.saveDriverAvailability(isAvailable);
  }

  Future<bool> setOnlineStatus(bool online) async {
    print("🟦 Setting online status to: $online");

    if (!await _isDriver()) return false;

    final url = Uri.parse('$baseUrl/driver/status');
    String? token = await storageService.getToken();
    if (token == null) return false;

    final body = jsonEncode({
      'isOnline': online,
    });

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

    if (response.statusCode == 200) {
      try {
        final data = jsonDecode(response.body);
        bool isOnline = data['data']['isOnline'] ?? false;
        bool isAvailable = data['data']['isAvailable'] ?? false;

        await storageService.saveDriverOnlineStatus(isOnline);
        await storageService.saveDriverAvailability(isAvailable);

        print("📦 Stored online: ${await storageService.getDriverOnlineStatus()}");
        print("📦 Stored available: ${await storageService.getDriverAvailability()}");

        return true;
      } catch (e) {
        print("⚠️ Error parsing success response.");
        return false;
      }
    } else if (response.statusCode == 403) {
      try {
        final error = jsonDecode(response.body);
        print("🚫 Forbidden: ${error['error']['message']}");
      } catch (e) {
        print("⚠️ Error parsing error response.");
      }
      return false;
    } else {
      print("❌ Unexpected status: ${response.statusCode}");
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> fetchAvailableRides() async {
    print("🚕 Fetching available rides...");

    if (!await _isDriver()) return [];

    final isOnline = await storageService.getDriverOnlineStatus();
    final isAvailable = await storageService.getDriverAvailability();

    if (!isOnline || !isAvailable) {
      print("❌ Driver is offline or not available, skipping fetch rides.");
      return [];
    }

    final url = Uri.parse('$baseUrl/rides/available');
    String? token = await storageService.getToken();
    if (token == null) return [];

    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    print("📬 Rides response: ${response.statusCode}");
    print("📬 Rides body: ${response.body}");

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['data']);
    } else {
      return [];
    }
  }

  Future<bool> acceptOrder(String requestId) async {
    print("📦 Accepting order: $requestId");

    if (!await _isDriver()) return false;

    final isOnline = await storageService.getDriverOnlineStatus();
    final isAvailable = await storageService.getDriverAvailability();

    if (!isOnline || !isAvailable) {
      print("❌ Driver is offline or not available, can't accept order.");
      return false;
    }

    final url = Uri.parse('$baseUrl/rides/$requestId/accept');
    String? token = await storageService.getToken();
    if (token == null) return false;

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    print("📬 Accept order response: ${response.statusCode}");
    print("📬 Accept order body: ${response.body}");

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true;
    } else {
      try {
        final data = jsonDecode(response.body);
        print("❌ Error message: ${data['message']}");
      } catch (_) {}
      return false;
    }
  }

  Future<bool> cancelOrder(String requestId, {String reason = "Cancelled by driver"}) async {
    print("🚫 Cancelling order: $requestId");

    if (!await _isDriver()) return false;

    final isOnline = await storageService.getDriverOnlineStatus();
    final isAvailable = await storageService.getDriverAvailability();

    if (!isOnline || !isAvailable) {
      print("❌ Driver is offline or not available, can't cancel order.");
      return false;
    }

    final url = Uri.parse('$baseUrl/rides/$requestId/cancel');
    String? token = await storageService.getToken();
    if (token == null) return false;

    final body = jsonEncode({
      "reason": reason,
    });

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );

    print("📬 Cancel order response: ${response.statusCode}");
    print("📬 Cancel order body: ${response.body}");

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true;
    } else {
      try {
        final data = jsonDecode(response.body);
        print("❌ Error message: ${data['message']}");
      } catch (_) {}
      return false;
    }
  }

  Future<bool> declineOrder(String requestId) async {
    print("🚫 Declining order: $requestId");

    if (!await _isDriver()) return false;

    final isOnline = await storageService.getDriverOnlineStatus();
    final isAvailable = await storageService.getDriverAvailability();

    if (!isOnline || !isAvailable) {
      print("❌ Driver is offline or not available, can't decline order.");
      return false;
    }

    final url = Uri.parse('$baseUrl/rides/$requestId/decline');
    String? token = await storageService.getToken();
    if (token == null) return false;

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    print("📬 Decline order response: ${response.statusCode}");
    print("📬 Decline order body: ${response.body}");

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true;
    } else {
      try {
        final data = jsonDecode(response.body);
        print("❌ Error message: ${data['message']}");
      } catch (_) {}
      return false;
    }
  }

  Future<bool> updateRideStatus(String requestId, String status) async {
    print("🚦 Updating ride status for $requestId to: $status");

    if (!await _isDriver()) return false;

    final isOnline = await storageService.getDriverOnlineStatus();
    final isAvailable = await storageService.getDriverAvailability();

    if (!isOnline || !isAvailable) {
      print("❌ Driver is offline or not available, can't update ride status.");
      return false;
    }

    final url = Uri.parse('$baseUrl/rides/$requestId/status');
    String? token = await storageService.getToken();
    if (token == null) return false;

    final body = jsonEncode({
      "status": status,
    });

    final response = await http.patch(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );

    print("📬 Update ride status response: ${response.statusCode}");
    print("📬 Update ride status body: ${response.body}");

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true;
    } else {
      try {
        final data = jsonDecode(response.body);
        print("❌ Error message: ${data['message']}");
      } catch (_) {}
      return false;
    }
  }

  Future<Map<String, dynamic>?> getDriverProfile() async {
    print("👤 Fetching driver profile...");

    if (!await _isDriver()) return null;

    final url = Uri.parse('$baseUrl/driver/profile');
    String? token = await storageService.getToken();
    if (token == null) return null;

    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    print("📬 Profile response: ${response.statusCode}");
    print("📬 Profile body: ${response.body}");

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return json['data'];
    } else {
      return null;
    }
  }
}