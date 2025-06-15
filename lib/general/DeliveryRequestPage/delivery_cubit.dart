import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;
import 'package:moto/general/DeliveryRequestPage/ride_model.dart';
import '../../rider/auth/core/services/storage_service.dart';
import 'delivery_state.dart';

class DeliveryCubit extends Cubit<DeliveryState> {
  DeliveryCubit() : super(DeliveryInitial());

  Future<void> fetchOffers() async {
    emit(DeliveryLoading());
    try {
      final token = await StorageService().getToken();
      print("Token $token");

      final url = Uri.parse(
        'http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api/rides/active',
      );

      final response = await http.get(
        url,
        headers: {
          'Authorization': "Bearer $token",
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      print("🧾 API Response: ${response.body}");

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);

        if (data['success'] == true && data['data'] != null) {
          final List rides = data['data']['activeRides'];
          if (rides.isNotEmpty) {
            final DeliveryModel ride = DeliveryModel.fromJson(rides.first);
            emit(DeliveryLoaded(ride));
          } else {
            emit(DeliveryError("No active rides found"));
          }
        } else {
          emit(DeliveryError("Failed to fetch active rides"));
        }
      } else {
        emit(DeliveryError("Failed with status: ${response.statusCode}"));
      }
    } catch (e) {
      emit(DeliveryError("Error: $e"));
      print("🧾 Error: $e");
    }
  }
}
