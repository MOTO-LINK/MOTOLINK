import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:moto/rider/requests/models/submit_rating_request_model.dart';
import 'package:moto/rider/requests/models/submit_rating_response_model.dart';

class RatingsServiceRequests {
  final String baseUrl =
      "https://virtserver.swaggerhub.com/motolink-505/MotolinkAPI/1.0";

  Future<SubmitRatingResponseModel?> submitRating(
    SubmitRatingRequestModel body,
  ) async {
    final url = Uri.parse('$baseUrl/ratings/submit');
    final headers = {'Content-Type': 'application/json'};

    try {
      final response = await http.post(
        url,
        headers: headers,
        body: jsonEncode(body.toJson()),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = jsonDecode(response.body);

        if (body['success'] == true) {
          final data = body['data'];
          final rating = SubmitRatingResponseModel.fromJson(data);
          log('Rating submitted successfully.');
          return rating;
        } else {
          log(
            'Rating submission failed with success: false. Message: ${body['message']}',
          );
        }
      } else {
        log(
          'Failed to submit rating. Status: ${response.statusCode}, Body: ${response.body}',
        );
      }
    } catch (e) {
      log('Exception while submitting rating: $e');
    }
    return null;
  }
}
