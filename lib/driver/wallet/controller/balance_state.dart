part of 'balance_cubit.dart';

abstract class BalanceState {}

class BalanceInitial extends BalanceState {}

class BalanceLoading extends BalanceState {}

class BalanceSuccess extends BalanceState {
  final BalanceModel balance;
  BalanceSuccess(this.balance);
}

class BalanceFailure extends BalanceState {
  final String error;
  BalanceFailure(this.error);
}