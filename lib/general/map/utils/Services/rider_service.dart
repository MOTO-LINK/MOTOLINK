import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:moto/general/DeliveryRequestPage/ride_model.dart';
import 'package:moto/general/core/service/storage_service.dart';

class ApiService {
  final String baseUrl = 'http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api';
  final StorageService _storageService = StorageService();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _storageService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<List<DeliveryModel>> fetchActiveRides() async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$baseUrl/rides/active'), headers: headers);
    print('Active rides response: ${response.statusCode} - ${response.body}');
    if (response.statusCode == 200) {
      final decoded = json.decode(response.body);
      final List rides = decoded['data']?['activeRides'] ?? [];
      return rides.map((e) => DeliveryModel.fromJson(e)).toList();
    } else {
      print('Failed to load active rides: ${response.body}');
      throw Exception('Failed to load active rides');
    }
  }

  Future<Map<String, dynamic>> estimateRide({
    required double pickupLat,
    required double pickupLng,
    required double dropoffLat,
    required double dropoffLng,
  }) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/rides/estimate'),
      headers: headers,
      body: json.encode({
        'pickup_lat': pickupLat,
        'pickup_lng': pickupLng,
        'dropoff_lat': dropoffLat,
        'dropoff_lng': dropoffLng,
      }),
    );
    print('Estimate response: ${response.statusCode} - ${response.body}');
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      print('Failed to estimate ride: ${response.body}');
      throw Exception('Failed to estimate ride');
    }
  }

  Future<DeliveryModel> requestRide({
    required double pickupLat,
    required double pickupLng,
    required double dropoffLat,
    required double dropoffLng,
    required String paymentType,
  }) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/rides/request'),
      headers: headers,
      body: json.encode({
        'pickup_lat': pickupLat,
        'pickup_lng': pickupLng,
        'dropoff_lat': dropoffLat,
        'dropoff_lng': dropoffLng,
        'payment_type': paymentType,
      }),
    );
    print('Request ride response: ${response.statusCode} - ${response.body}');
    if (response.statusCode == 200 || response.statusCode == 201) {
      final decoded = json.decode(response.body);
      final rideJson = decoded['data']?['request'] ?? decoded;
      return DeliveryModel.fromJson(rideJson);
    } else {
      print('Failed to request ride: ${response.body}');
      throw Exception('Failed to request ride');
    }
  }

  Future<void> cancelRide(String requestId, String reason) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/rides/$requestId/cancel'),
      headers: headers,
      body: json.encode({'reason': reason}),
    );
    print('Cancel ride response: ${response.statusCode} - ${response.body}');
    if (response.statusCode != 200) {
      print('Failed to cancel ride: ${response.body}');
      throw Exception('Failed to cancel ride');
    }
  }

  Future<DeliveryModel> trackRide(String requestId) async {
    final headers = await _getHeaders();
    print('Tracking ride with requestId: $requestId');
    final response = await http.get(Uri.parse('$baseUrl/rides/$requestId/track'), headers: headers);
    print('Track response: ${response.statusCode} - ${response.body}');
    if (response.statusCode == 200) {
      final decoded = json.decode(response.body);
      final rideJson = decoded['data']?['request'] ?? decoded;
      return DeliveryModel.fromJson(rideJson);
    } else {
      print('Failed to track ride: ${response.body}');
      throw Exception('Failed to track ride');
    }
  }

  Future<void> completeRide(String requestId) async {
    final headers = await _getHeaders();
    final response = await http.patch(
      Uri.parse('$baseUrl/rides/$requestId/status'),
      headers: headers,
      body: json.encode({"status": "completed"}),
    );
    print('Complete ride PATCH response: ${response.statusCode} - ${response.body}');
    if (response.statusCode != 200) {
      print('Failed to complete ride: ${response.body}');
      throw Exception('Failed to complete ride');
    }
  }

  Future<Map<String, dynamic>> rideStatus(String requestId) async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$baseUrl/rides/$requestId/status'), headers: headers);
    print('Ride status response: ${response.statusCode} - ${response.body}');
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      print('Failed to get ride status: ${response.body}');
      throw Exception('Failed to get ride status');
    }
  }

  // دالة لجلب رقم هاتف السائق باستخدام driverId
  Future<String?> fetchDriverPhone(String driverId) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/driver/profile/$driverId'),
      headers: headers,
    );
    print('Driver profile response: ${response.statusCode} - ${response.body}');
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      // عدل حسب شكل الـ response لو مختلف
      return data['data']?['phone'] ?? data['phone'];
    } else {
      print('Failed to fetch driver profile: ${response.body}');
      return null;
    }
  }}