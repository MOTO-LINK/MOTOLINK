import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/notifications_response_model.dart';

class NotificationService {
  final String _baseUrl =
      "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api";

  Future<NotificationsResponseModel> getNotifications({
    required String token,
    int page = 1,
    int limit = 20,
    bool unreadOnly = false,
  }) async {
    final queryParams = {
      'page': '$page',
      'limit': '$limit',
      'unreadOnly': '$unreadOnly',
    };
    final uri = Uri.parse(
      '$_baseUrl/notifications',
    ).replace(queryParameters: queryParams);

    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    };

    print('GET $uri');
    print('Headers: $headers');

    final response = await http.get(uri, headers: headers);

    if (response.statusCode == 200) {
      return NotificationsResponseModel.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load notifications: ${response.body}');
    }
  }

  Future<bool> markNotificationAsRead(
    String notificationId,
    String token,
  ) async {
    final uri = Uri.parse('$_baseUrl/notifications/read/$notificationId');
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    };
    print('PUT $uri');
    print('Headers: $headers');
    final response = await http.put(uri, headers: headers);
    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] ?? false;
    } else {
      throw Exception('Failed to mark notification as read');
    }
  }

  Future<bool> markAllNotificationsAsRead(String token) async {
    final uri = Uri.parse('$_baseUrl/notifications/read/all');
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    };
    final response = await http.put(uri, headers: headers);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] ?? false;
    } else {
      throw Exception('Failed to mark all notifications as read');
    }
  }
}
