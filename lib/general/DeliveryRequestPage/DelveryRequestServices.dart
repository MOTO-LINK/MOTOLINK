import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:moto/rider/auth/core/services/storage_service.dart';

class DeliveryService {
  final String baseUrl = "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api";

  Future<bool> createDeliveryRequest({
    required Map<String, dynamic> pickupLocation,
    required Map<String, dynamic> dropoffLocation,
    required String description,
    required int quantity,
    required double weight,
    required String paymentMethod,  
  }) async {
    final url = Uri.parse('$baseUrl/rides/request');

    final token = await StorageService().getToken();

    if (token == null) {
      print("❌ No token found. User might be logged out.");
      return false;
    }

    final pickupLatitude = pickupLocation['latitude'] ?? 0.0;
    final pickupLongitude = pickupLocation['longitude'] ?? 0.0;
    final dropoffLatitude = dropoffLocation['latitude'] ?? 0.0;
    final dropoffLongitude = dropoffLocation['longitude'] ?? 0.0;

    final body = {
      "pickupLocation": {
        "locationId": pickupLocation['id'] ?? "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": pickupLocation['label'] ?? "",
        "latitude": pickupLatitude,
        "longitude": pickupLongitude,
      },
      "dropoffLocation": {
        "locationId": dropoffLocation['id'] ?? "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": dropoffLocation['label'] ?? "",
        "latitude": dropoffLatitude,
        "longitude": dropoffLongitude,
      },
      "vehicleType": "motorcycle",
      "serviceType": "delivery",
      "paymentMethod": paymentMethod,
      "packageDetails": {
        "items": [
          {
            "description": description,
            "quantity": quantity,
            "weight": weight
          }
        ]
      }
    };

    try {
      print("🔐 Token used: $token");
      print("📦 Request Body: ${jsonEncode(body)}");

      final response = await http.post(
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode(body),
      );

      print("📡 Response: ${response.statusCode} => ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        print("✅ Delivery request submitted successfully.");
        return true;
      } else {
        print("❌ Failed with status code ${response.statusCode}");
        return false;
      }
    } catch (e) {
      print("❌ Exception occurred: $e");
      return false;
    }
  }
}
