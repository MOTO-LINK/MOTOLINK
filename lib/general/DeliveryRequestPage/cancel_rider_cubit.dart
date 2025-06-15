import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;
import '../../rider/auth/core/services/storage_service.dart';
import 'cancel_rider_state.dart';
import '../../general/DeliveryRequestPage/ride_model.dart'; // تأكد من المسار الصحيح

class CancelRideCubit extends Cubit<CancelRideState> {
  CancelRideCubit() : super(CancelRideInitial());

  Future<void> cancelRide(DeliveryModel ride, {String reason = "Cancelled by user"}) async {
    emit(CancelRideLoading());

    try {
      final token = await StorageService().getToken();

      final url = Uri.parse(
        "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api/rides/${ride.requestId}/cancel",
      );

      final response = await http.post(
        url,
        headers: {
          "Authorization": "Bearer $token",
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "cancel_reason": reason,
        }),
      );

      print("🚫 Cancel Response: ${response.body}");

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        if (data["success"] == true) {
          emit(CancelRideSuccess("Ride cancelled successfully"));
        } else {
          emit(CancelRideError("Failed to cancel ride"));
        }
      } else {
        emit(CancelRideError("Failed with status: ${response.statusCode}"));
      }
    } catch (e) {
      emit(CancelRideError("Cancel error: $e"));
      print("🚫 Cancel error: $e");
    }
  }
}
