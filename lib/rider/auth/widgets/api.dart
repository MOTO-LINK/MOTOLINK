import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

class Api {
  String ip = "";

  TextEditingController nameRider = TextEditingController();
  TextEditingController emailRider = TextEditingController();
  TextEditingController passwordRider = TextEditingController();
  TextEditingController phoneNumberRider = TextEditingController();
  TextEditingController confirmPasswordRider = TextEditingController();

  Future<void> signUpRider() async {
    final url = Uri.parse('$ip/api/auth/signup');
    final headers = {'Content-Type': 'application/json'};
    final body = jsonEncode({
      'name': nameRider.text,
      'email': emailRider.text,
      'password': passwordRider.text,
      'userType': 'rider',
      'phoneNumber': phoneNumberRider.text,
      //'confirmPassword': confirmPasswordRider.text,
    });

    try {
      final response = await http.post(url, headers: headers, body: body);
      final resData = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('Sign up successful!');
        //print(response.body);
      } else {
        print('Sign up failed. Status: ${response.statusCode}');
        //print('Body: ${response.body}');
        return resData['message'] ?? 'error from backend';
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  TextEditingController passwordLoginRider = TextEditingController();
  TextEditingController emailLoginRider = TextEditingController();
  TextEditingController phoneNumberLoginRider = TextEditingController();
  
  Future<void> loginRider() async {
    final url = Uri.parse('$ip/api/auth/login');
    final headers = {'Content-Type': 'application/json'};
    final body = jsonEncode({
      //'phoneNumber': phoneNumberLoginRider.text,
      'email': emailLoginRider.text,
      'password': passwordRider.text,
    });

    try {
      final response = await http.post(url, headers: headers, body: body);
      final resData = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('Sign up successful!');
        //print(response.body);
        //print(resData);
      } else {
        print('Sign up failed. Status: ${response.statusCode}');
        // print('Body: ${response.body}');
        return resData['message'] ?? 'error from backend';
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  TextEditingController code1Rider = TextEditingController();
  TextEditingController code2Rider = TextEditingController();
  TextEditingController code3Rider = TextEditingController();
  TextEditingController code4Rider = TextEditingController();

  Future<bool> sendVerificationSMS(String phoneNumber) async {
    final url = Uri.parse("");

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phone': phoneNumber,
          "otp": "${code1Rider.text}${code2Rider.text}${code3Rider.text}${code4Rider.text}",
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print("Response: $data");
        return data['status'] == 'success';
      } else {
        print("Error: ${response.body}");
        return false;
      }
    } catch (e) {
      print('Error: $e');
      return false;
    }
  }
}
