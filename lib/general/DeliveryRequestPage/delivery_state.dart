part of 'delivery_cubit.dart';

abstract class DeliveryState {}

class DeliveryInitial extends DeliveryState {}

class DeliveryLoading extends DeliveryState {}

class DeliveryLoaded extends DeliveryState {
  final List<Map<String, dynamic>> offers;
  final Map<String, dynamic> orderDetails;

  DeliveryLoaded(this.offers, {required this.orderDetails});
}

class DeliveryError extends DeliveryState {
  final String message;
  DeliveryError(this.message);
}
