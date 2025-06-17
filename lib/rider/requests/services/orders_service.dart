import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:moto/rider/requests/models/driver_profile_model.dart';
import 'package:moto/rider/requests/models/ride_history_response_model.dart';
import 'package:moto/rider/requests/models/ride_request_model.dart';

class OrdersServiceRequests {
  final String baseUrl =
      "https://virtserver.swaggerhub.com/motolink-505/MotolinkAPI/1.0";

  Future<RideRequestModel?> fetchActiveRide() async {
    final url = Uri.parse('$baseUrl/rides/active');
    final headers = {'Content-Type': 'application/json'};
    try {
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200 || response.statusCode == 201) {
        final jsonBody = jsonDecode(response.body);
        if (jsonBody['success'] == true) {
          final rideData = jsonBody['data'];
          final rideRequest = RideRequestModel.fromJson(rideData);
          log('Ride request fetched successfully. ${rideData}');
          return rideRequest;
        } else {
          log(
            'API responded with success: false. Message: ${jsonBody['message']}',
          );
        }
      } else {
        log(
          'Failed to fetch active ride. Status: ${response.statusCode}, Body: ${response.body}',
        );
      }
    } catch (e) {
      log('Error fetching active ride: $e');
    }
    return null;
  }

  Future<RideHistoryResponseModel?> fetchRideHistory({int page = 1}) async {
    final url = Uri.parse('$baseUrl/rides/history?page=$page');
    final headers = {'Content-Type': 'application/json'};

    try {
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200 || response.statusCode == 201) {
        final jsonBody = jsonDecode(response.body);
        if (jsonBody['success'] == true) {
          final historyData = jsonBody['data'];
          final history = RideHistoryResponseModel.fromJson(historyData);

          log(
            'Ride history fetched successfully for page $page body: ${historyData}',
          );
          return history;
        } else {
          log(
            'API responded with success: false. Message: ${jsonBody['message']}',
          );
        }
      } else {
        log(
          'Failed to fetch ride history. Status: ${response.statusCode}, Body: ${response.body}',
        );
      }
    } catch (e) {
      log('Exception fetching ride history: $e');
    }
    return null;
  }

  Future<DriverProfileModel?> fetchDriverProfile(String userId) async {
    final url = Uri.parse('$baseUrl/driver/profile/$userId');
    final headers = {'Content-Type': 'application/json'};
    
    try {
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) {
        final jsonBody = jsonDecode(response.body);
        if (jsonBody['success'] == true) {
          log('Driver profile fetched successfully for userId: $userId');
          return DriverProfileModel.fromJson(jsonBody['data']);
        } else {
          log('API call for driver profile was not successful: ${jsonBody['message']}');
        }
      } else {
        log('Failed to fetch driver profile. Status: ${response.statusCode}');
      }
    } catch (e) {
      log('Error fetching driver profile: $e');
    }
    return null;
  }
}
