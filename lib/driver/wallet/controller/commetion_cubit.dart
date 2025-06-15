import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:moto/driver/wallet/controller/rider_model.dart';
import '../../../general/core/service/storage_service.dart';
import 'commetion_state.dart';
import 'constant_api.dart';
import 'dio_helper.dart';

class RidesCubit extends Cubit<RidesState> {
  RidesCubit() : super(RidesInitial());

  double _totalOrdersAmount = 0;
  double get totalOrdersAmount => _totalOrdersAmount;

  Future<void> fetchRides() async {
    emit(RidesLoading());
    final token = await StorageService().getToken();
    if (token == null) {
      emit(RidesError("Token not found"));
      return;
    }

    try {
      final dio = DioHelper.createDio(ConstantApi.baseUrl);
      final res = await dio.get(
        ConstantApi.rideHistory,
        options: Options(headers: {"Authorization": "Bearer $token"}), // ✅ بدون \ قبل $
      );

      final items = res.data['data']['items'] as List;
      final rides = items.map((e) => RideModel.fromJson(e)).toList();

      _totalOrdersAmount = rides.fold(
        0.0,
            (sum, ride) => sum + ride.estimatedFee,
      );

      emit(RidesLoaded(rides));
    } catch (e) {
      emit(RidesError("Failed to load orders"));
    }
  }
}
