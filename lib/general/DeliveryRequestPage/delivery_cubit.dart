import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dio/dio.dart';
import '../../rider/auth/core/services/storage_service.dart';

part 'delivery_state.dart';

class DeliveryCubit extends Cubit<DeliveryState> {
  DeliveryCubit() : super(DeliveryInitial());

  final String baseUrl = "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api";

  Map<String, dynamic>? _currentFirstOffer;

  Future<void> fetchOffers() async {
    emit(DeliveryLoading());
    try {
      final token = await StorageService().getToken();
      print("tokeen+++++$token");
      if (token == null) {
        emit(DeliveryError("Token not found."));
        return;
      }

      final dio = Dio(BaseOptions(
        baseUrl: baseUrl,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ));

      final offersResponse = await dio.get("/rides/available");
      final ratingsResponse = await dio.get("/ratings/my-ratings");

      if (offersResponse.statusCode == 200 &&
          offersResponse.data['success'] == true &&
          ratingsResponse.statusCode == 200 &&
          ratingsResponse.data['success'] == true) {

        final offersData = offersResponse.data['data'] as List;
        final averageRating = ratingsResponse.data['data']['average'] ?? 4;

        final offers = offersData.map<Map<String, dynamic>>((item) {
          return {
            'name': item['ride_type'] ?? 'Unknown Ride',
            'price': item['estimated_fee'] ?? 0,
            'rating': averageRating,
            'request_id': item['request_id'], // نحتفظ بالـ id
          };
        }).toList();

        _currentFirstOffer = offersData.isNotEmpty ? offersData.first : null;

        emit(DeliveryLoaded(
          offers,
          orderDetails: {
            'service_type': _currentFirstOffer?['service_type'] ?? 'Unknown',
            'estimated_fee': _currentFirstOffer?['estimated_fee'] ?? 0,
          },
        ));
      } else {
        emit(DeliveryError("Data upload failed"));
      }
    } catch (e) {
      emit(DeliveryError("An error occurred while loading data."));
    }
  }

  String? get requestId => _currentFirstOffer?['request_id'];

  Future<void> cancelRide({String? reason}) async {
    emit(CancelRideLoading());

    try {
      final token = await StorageService().getToken();
      if (token == null) {
        emit(CancelRideError("Token not found."));
        return;
      }

      final requestIdValue = requestId;
      if (requestIdValue == null) {
        emit(CancelRideError("Request ID not available."));
        return;
      }

      final dio = Dio(BaseOptions(
        baseUrl: baseUrl,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ));

      final response = await dio.post(
        "/rides/$requestIdValue/cancel",
        data: {
          if (reason != null) 'cancel_reason': reason,
        },
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        emit(CancelRideSuccess(response.data['message'] ?? "Ride cancelled successfully."));
      } else {
        emit(CancelRideError("Failed to cancel the ride."));
      }
    } catch (e) {
      emit(CancelRideError("An error occurred: ${e.toString()}"));
    }
  }
}
