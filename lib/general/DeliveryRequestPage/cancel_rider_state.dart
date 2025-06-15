

abstract class CancelRideState {}

class CancelRideInitial extends CancelRideState {}

class CancelRideLoading extends CancelRideState {}

class CancelRideSuccess extends CancelRideState {
  final String message;

  CancelRideSuccess(this.message);
}

class CancelRideError extends CancelRideState {
  final String error;

  CancelRideError(this.error);
}
