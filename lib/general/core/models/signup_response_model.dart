import 'package:flutter/foundation.dart';

@immutable
class SignUpSuccessResponse {
  final bool success;
  final UserData data;
  final String message;
  const SignUpSuccessResponse({
    required this.success,
    required this.data,
    required this.message,
  });
  factory SignUpSuccessResponse.fromJson(Map<String, dynamic> json) =>
      SignUpSuccessResponse(
        success: json['success'],
        data: UserData.fromJson(json['data']),
        message: json['message'],
      );
}

@immutable
class UserData {
  final User user;
  final String token;
  final String refreshToken;
  const UserData({
    required this.user,
    required this.token,
    required this.refreshToken,
  });
  factory UserData.fromJson(Map<String, dynamic> json) => UserData(
    user: User.fromJson(json['user']),
    token: json['token'],
    refreshToken: json['refreshToken'],
  );
}

@immutable
class User {
  final String userId;
  final String name;
  final String email;
  final String phone;
  final String userType;
  final String? profilePicture;
  final bool? phoneVerified;
  final bool? accountLocked;

    const User({
    required this.userId,
    required this.name,
    required this.email,
    required this.phone,
    required this.userType,
    this.profilePicture,
    this.phoneVerified,
    this.accountLocked,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['user_id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      userType: json['user_type'],
      profilePicture: json['profile_picture'],
      phoneVerified: json['phone_verified'],
      accountLocked: json['account_locked'],
    );
  }
}

@immutable
class SignUpErrorResponse {
  final bool success;
  final ErrorData error;
  const SignUpErrorResponse({required this.success, required this.error});
  factory SignUpErrorResponse.fromJson(Map<String, dynamic> json) =>
      SignUpErrorResponse(
        success: json['success'],
        error: ErrorData.fromJson(json['error']),
      );
}

@immutable
class ErrorData {
  final String code;
  final String message;
  const ErrorData({required this.code, required this.message});
  factory ErrorData.fromJson(Map<String, dynamic> json) =>
      ErrorData(code: json['code'], message: json['message']);
}
