import 'package:moto/general/core/models/login_request_model.dart';
class LoginResponseModel {
  final bool success;
  final LoginData data;
  final String message;

  LoginResponseModel({
    required this.success,
    required this.data,
    required this.message,
  });

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) {
    return LoginResponseModel(
      success: json['success'] ?? false,
      data: LoginData.fromJson(json['data']),
      message: json['message'] ?? '',
    );
  }
}

class LoginData {
  final UserModel user;
  final String token;
  final String refreshToken;

  LoginData({
    required this.user,
    required this.token,
    required this.refreshToken,
  });

  factory LoginData.fromJson(Map<String, dynamic> json) {
    return LoginData(
      user: UserModel.fromJson(json['user']),
      token: json['token'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
    );
  }
}

class LoginErrorResponse {
  final bool success;
  final ErrorDataLogin error;

  LoginErrorResponse({
    required this.success,
    required this.error,
  });

  factory LoginErrorResponse.fromJson(Map<String, dynamic> json) {
    return LoginErrorResponse(
      success: json['success'] ?? false,
      error: ErrorDataLogin.fromJson(json['error']),
    );
  }
}

class ErrorDataLogin {
  final String code;
  final String message;

  ErrorDataLogin({
    required this.code,
    required this.message,
  });

  factory ErrorDataLogin.fromJson(Map<String, dynamic> json) {
    return ErrorDataLogin(
      code: json['code'] ?? '',
      message: json['message'] ?? '',
    );
  }
}
