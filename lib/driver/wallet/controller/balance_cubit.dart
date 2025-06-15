import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../rider/auth/core/services/storage_service.dart';
import 'balance_model.dart';
import 'constant_api.dart';
import 'dio_helper.dart';

part 'balance_state.dart';

class BalanceCubit extends Cubit<BalanceState> {
  BalanceCubit() : super(BalanceInitial());
  double _totalOrdersAmount = 0;

  double get totalOrdersAmount => _totalOrdersAmount;

  Future<void> fetchBalance() async {
    emit(BalanceLoading());
    final token = await StorageService().getToken();
    if (token == null) {
      emit(BalanceFailure("Token not found"));
      return;
    }

    try {
      final response = await DioHelper.getData(
        baseUrl: ConstantApi.baseUrl,
        endpoint: ConstantApi.walletBalance,
        token: token,
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final data = response.data['data'];
        emit(BalanceSuccess(BalanceModel.fromJson(data)));
      } else {
        emit(BalanceFailure("Balance fetch failed: \${response.statusCode}"));
      }
    } catch (e) {
      emit(BalanceFailure("Error: \${e.toString()}"));
    }
  }
}
