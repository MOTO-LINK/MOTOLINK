import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/login_response_model.dart';
import '../models/signup_request_model.dart';
import '../models/signup_response_model.dart';

class AuthService {
  final String _baseUrl = "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api";

  // ---------- Register ----------
  Future<dynamic> signUp(SignUpRequest request) async {
    try {
      final response = await http.post(
        Uri.parse("$_baseUrl/auth/register"),
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: jsonEncode(request.toJson()),
      );
      final responseBody = jsonDecode(response.body);

      if (response.statusCode == 201 && responseBody['success'] == true) {
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

  // ---------- Login ----------
  Future<dynamic> login({
    required String phone,
    required String password,
  }) async {
    final Uri url = Uri.parse("$_baseUrl/auth/login");
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: jsonEncode({'phone': phone, 'password': password}),
      );

      final responseBody = jsonDecode(response.body);

      if (response.statusCode == 200 && responseBody['success'] == true) {
        return LoginResponseModel.fromJson(responseBody);
      } else {
        return LoginErrorResponse.fromJson(responseBody);
      }
    } catch (e) {
      return LoginErrorResponse(
        success: false,
        error: ErrorDataLogin(
          code: 'CONNECTION_ERROR',
          message: 'Failed to connect. Please check your internet connection.',
        ),
      );
    }
  }

  // ---------- Forgot Password ----------
  Future<Map<String, dynamic>> forgotPassword(String phone) async {
    try {
      final response = await http.post(
        Uri.parse("$_baseUrl/auth/forgot-password"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"phone": phone}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return {"success": false, "message": "Phone number not found"};
      }
    } catch (e) {
      return {"success": false, "message": "An error occurred: $e"};
    }
  }

  // ---------- Reset Password ----------
  Future<bool> resetPassword({
    required String phone,
    required String code,
    required String newPassword,
  }) async {
    final Uri url = Uri.parse("$_baseUrl/auth/reset-password");
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "phone": phone,
          "code": code,
          "newPassword": newPassword,
        }),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print("Reset password failed: ${response.body}");
        return false;
      }
    } catch (e) {
      print("Error in resetPassword: $e");
      return false;
    }
  }

  // ---------- Verify Phone ----------
  Future<dynamic> verify({required String phone, required String code}) async {
    final Uri url = Uri.parse("$_baseUrl/phone/verify");

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: jsonEncode({'phone': phone, 'code': code}),
      );

      final responseBody = jsonDecode(response.body);
      print("Verify Response Body: $responseBody");

      // لاحظ ان هنا بنشيك على status مش success
      if (response.statusCode == 200 && responseBody['status'] == "success") {
        return responseBody['message']; // هرجع الرسالة مباشرة
      } else {
        return 'Verification failed: ${responseBody['message']}';
      }
    } catch (e) {
      print("Error in verifyPhone: $e");
      return 'تعذر الاتصال بالسيرفر. تأكد من الاتصال بالإنترنت أو حاول لاحقًا.';
    }
  }

  // ---------- Resend Code ----------
  Future<Map<String, dynamic>> resendCode(String phone) async {
    try {
      final response = await http.post(
        Uri.parse("$_baseUrl/phone/resend-code"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"phone": phone}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return {"success": false, "message": "Phone number not found"};
      }
    } catch (e) {
      return {"success": false, "message": "An error occurred: $e"};
    }
  }
}
