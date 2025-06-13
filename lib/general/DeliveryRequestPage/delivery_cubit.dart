import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dio/dio.dart';

import '../../rider/auth/core/services/storage_service.dart';

part 'delivery_state.dart';

class DeliveryCubit extends Cubit<DeliveryState> {
  DeliveryCubit() : super(DeliveryInitial());

  final String baseUrl = "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api";

  Future<void> fetchOffers() async {
    emit(DeliveryLoading());

    try {

      final token = await StorageService().getToken();
      print("token+++++$token");

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
          };
        }).toList();

        final firstOffer = offersData.isNotEmpty ? offersData.first : null;

        emit(DeliveryLoaded(
          offers,
          orderDetails: {
            'service_type': firstOffer?['service_type'] ?? 'Unknown',
            'estimated_fee': firstOffer?['estimated_fee'] ?? 0,
          },
        ));
      } else {
        emit(DeliveryError("Data upload failed"));
      }
    } catch (e) {
      emit(DeliveryError("An error occurred while loading data."));
      print("error++++++++${e.toString()}");
    }
  }
}
