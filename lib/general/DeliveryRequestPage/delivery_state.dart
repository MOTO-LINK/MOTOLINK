import 'package:moto/general/DeliveryRequestPage/ride_model.dart';



abstract class DeliveryState {}

class DeliveryInitial extends DeliveryState {}

class DeliveryLoading extends DeliveryState {}

class DeliveryLoaded extends DeliveryState {
  final DeliveryModel ride;

  DeliveryLoaded(this.ride);
}

class DeliveryError extends DeliveryState {
  final String message;

  DeliveryError(this.message);
}
