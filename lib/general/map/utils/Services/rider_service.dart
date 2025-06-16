import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:moto/general/core/service/storage_service.dart';

class RiderService {
  final String baseUrl = 'https://api.motolink.com/api'; // TODO: استبدل بعنوان API الفعلي
  final StorageService storageService = StorageService();

  // طلب رحلة جديدة
  Future<Map<String, dynamic>?> requestRide({
    required double pickupLat,
    required double pickupLng,
    required double dropoffLat,
    required double dropoffLng,
    required String paymentMethod,
  }) async {
    try {
      final token = await storageService.getToken();
      if (token == null || token.isEmpty) {
        print('خطأ: التوكن غير موجود أو فارغ');
        return null;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/rides/request'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'pickup': {'latitude': pickupLat, 'longitude': pickupLng},
          'dropoff': {'latitude': dropoffLat, 'longitude': dropoffLng},
          'paymentMethod': paymentMethod,
        }),
      );

      print('طلب رحلة: ${response.statusCode} - ${response.body}');

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return data is Map<String, dynamic> ? data : null;
      } else {
        print('خطأ طلب الرحلة: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('استثناء طلب الرحلة: $e');
      return null;
    }
  }

  // جلب الرحلة النشطة
  Future<Map<String, dynamic>?> getActiveRide() async {
    try {
      final token = await storageService.getToken();
      if (token == null || token.isEmpty) {
        print('خطأ: التوكن غير موجود أو فارغ');
        return null;
      }

      final response = await http.get(
        Uri.parse('$baseUrl/rides/active'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('جلب الرحلة النشطة: ${response.statusCode} - ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data is Map<String, dynamic> ? data : null;
      } else {
        print('خطأ جلب الرحلة النشطة: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('استثناء جلب الرحلة النشطة: $e');
      return null;
    }
  }

  // تقدير تكلفة الرحلة
  Future<Map<String, dynamic>?> estimateRide({
    required double pickupLat,
    required double pickupLng,
    required double dropoffLat,
    required double dropoffLng,
  }) async {
    try {
      final token = await storageService.getToken();
      if (token == null || token.isEmpty) {
        print('خطأ: التوكن غير موجود أو فارغ');
        return null;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/rides/estimate'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'pickup': {'latitude': pickupLat, 'longitude': pickupLng},
          'dropoff': {'latitude': dropoffLat, 'longitude': dropoffLng},
        }),
      );

      print('تقدير الرحلة: ${response.statusCode} - ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data is Map<String, dynamic> ? data : null;
      } else {
        print('خطأ تقدير الرحلة: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('استثناء تقدير الرحلة: $e');
      return null;
    }
  }

  // تتبع موقع السائق
  Future<Map<String, dynamic>?> trackRide(String requestId) async {
    try {
      final token = await storageService.getToken();
      if (token == null || token.isEmpty) {
        print('خطأ: التوكن غير موجود أو فارغ');
        return null;
      }

      final response = await http.get(
        Uri.parse('$baseUrl/rides/$requestId/track'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('تتبع الرحلة $requestId: ${response.statusCode} - ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data is Map<String, dynamic> ? data : null;
      } else {
        print('خطأ تتبع الرحلة: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('استثناء تتبع الرحلة: $e');
      return null;
    }
  }

  // جلب حالة الرحلة
  Future<String?> getRideStatus(String requestId) async {
    try {
      final token = await storageService.getToken();
      if (token == null || token.isEmpty) {
        print('خطأ: التوكن غير موجود أو فارغ');
        return null;
      }

      final response = await http.get(
        Uri.parse('$baseUrl/rides/$requestId/status'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('جلب حالة الرحلة $requestId: ${response.statusCode} - ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is Map<String, dynamic> && data['status'] != null) {
          return data['status'].toString();
        } else {
          print('خطأ: استجابة غير متوقعة: ${response.body}');
          return null;
        }
      } else {
        print('خطأ HTTP: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('استثناء جلب حالة الرحلة: $e');
      return null;
    }
  }
}