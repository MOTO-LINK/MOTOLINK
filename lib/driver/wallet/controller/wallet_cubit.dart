import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:moto/driver/wallet/controller/rider_model.dart';
import 'package:moto/driver/wallet/controller/transaction_model.dart';
import '../../../rider/auth/core/services/storage_service.dart';
import 'balance_model.dart';
import 'constant_api.dart';
import 'dio_helper.dart';

part 'wallet_state.dart';

class WalletCubit extends Cubit<WalletState> {
  WalletCubit() : super(WithdrawInitial());

 // final StorageService _storageService = StorageService();

  double _totalOrdersAmount = 0;
  double get totalOrdersAmount => _totalOrdersAmount;

  Future<void> sendWithdrawRequest({
    required int amount,
    required String method,
    required String accountDetails,
  }) async {
    emit(WithdrawLoading());
    final token = await StorageService().getToken();
    print("++++++++++++$token");
    if (token == null) {
      emit(WithdrawFailure("Token not found"));
      return;
    }

    try {
      final response = await DioHelper.postData(
        baseUrl: ConstantApi.baseUrl,
        endpoint: ConstantApi.walletWithdraw,
        data: {
          "amount": amount,
          "method": method,
          "account_details": accountDetails,
        },
        token: token,
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        emit(WithdrawSuccess());
      } else {
        emit(WithdrawFailure("Something went wrong: ${response.statusCode}"));
      }
    } catch (e) {
      emit(WithdrawFailure("Error: ${e.toString()}"));
    }
  }

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

      if (response.statusCode == 200 && response.data['data'] != null) {
        final data = response.data['data'];
        emit(BalanceSuccess(BalanceModel.fromJson(data)));
      } else {
        emit(BalanceFailure("Balance fetch failed: ${response.statusCode}"));
      }
    } catch (e) {
      emit(BalanceFailure("Error: ${e.toString()}"));
    }
  }

  Future<void> fetchTransactions({int page = 1, String? type}) async {
    emit(TransactionsLoading());

    final token = await StorageService().getToken();
    if (token == null) {
      emit(TransactionsError("Token not found"));
      return;
    }

    try {
      final dio = DioHelper.createDio(ConstantApi.baseUrl);
      final response = await dio.get(
        ConstantApi.walletTransaction,
        queryParameters: {
          'page': page,
          if (type != null) 'type': type,
        },
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      final items = response.data['data']['items'] as List;
      final transactions = items
          .map((json) => TransactionModel.fromJson(json as Map<String, dynamic>))
          .toList();

      emit(TransactionsLoaded(transactions));
    } catch (e) {
      emit(TransactionsError(e.toString()));
    }
  }

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
        options: Options(headers: {"Authorization": "Bearer $token"}),
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
