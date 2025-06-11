import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/signup_request_model.dart';
import '../models/signup_response_model.dart';

class AuthService {
  final String _baseUrl = "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api";

  Future<dynamic> signUp(SignUpRequest request) async {
    try {
      final response = await http.post(
        Uri.parse("$_baseUrl/auth/register"),
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: jsonEncode(request.toJson()),
      );
      final responseBody = jsonDecode(response.body);
      if (response.statusCode == 201) {
        return SignUpSuccessResponse.fromJson(responseBody);
  
      } else {
        return SignUpErrorResponse.fromJson(responseBody);
      }
    } catch (e) {
      return SignUpErrorResponse(
        success: false,
        error: ErrorData(
          code: 'CONNECTION_ERROR',
          message: 'Failed to connect. Check your internet connection.',
        ),
      );
    }
  }

}