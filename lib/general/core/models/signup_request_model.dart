import 'package:flutter/foundation.dart';

@immutable
class SignUpRequest {
  final String name;
  final String email;
  final String password;
  final String phone;
  final String dob;
  final String userType;
  final String? vehicleType;
  final List<String>? orderTypes;

  const SignUpRequest({
    required this.name,
    required this.email,
    required this.password,
    required this.phone,
    required this.dob,
    required this.userType,
    this.vehicleType,
    this.orderTypes,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {
      'name': name,
      'email': email,
      'password': password,
      'phone': phone,
      'dob': dob,
      'userType': userType,
    };

    if (vehicleType != null) {
      data['vehicleType'] = vehicleType;
    }
    if (orderTypes != null) {
      data['orderTypes'] = orderTypes;
    }
    return data;
  }
}