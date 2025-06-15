part of 'wallet_cubit.dart';

abstract class WalletState {}

class WithdrawInitial extends WalletState {}

class WithdrawLoading extends WalletState {}

class WithdrawSuccess extends WalletState {}

class WithdrawFailure extends WalletState {
  final String error;

  WithdrawFailure(this.error);
}
/*

class BalanceInitial extends WalletState {}

class BalanceLoading extends WalletState {}

class BalanceSuccess extends WalletState {
  final BalanceModel balance;

  BalanceSuccess(this.balance);
}

class BalanceFailure extends WalletState {
  final String error;

  BalanceFailure(this.error);
}
*/

class TransactionsInitial extends WalletState {}

class TransactionsLoading extends WalletState {}

class TransactionsLoaded extends WalletState {
  final List<TransactionModel> transactions;
  TransactionsLoaded(this.transactions);
}

class TransactionsError extends WalletState {
  final String message;
  TransactionsError(this.message);
}

/*

class RidesInitial extends WalletState {}

class RidesLoading extends WalletState {}

class RidesLoaded extends WalletState {
  final List<RideModel> rides;
  RidesLoaded(this.rides);
}

class RidesError extends WalletState {
  final String message;
  RidesError(this.message);
}
*/
