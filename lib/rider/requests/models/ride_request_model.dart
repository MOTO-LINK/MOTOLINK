
import 'package:moto/rider/requests/models/ride_location_model.dart';

class RideRequestModel {
  final String requestId;
  final String riderId;
  final String driverId;
  final String startLocationId;
  final String endLocationId;
  final String rideType;
  final String serviceType;
  final double distance;
  final double estimatedFee;
  final String paymentType;
  final String status;
  final String? cancelReason;
  final String? notes;
  final DateTime requestTime;
  final DateTime createdAt;
  final RideLocationModel startLocation;
  final RideLocationModel endLocation;

  const RideRequestModel({
    required this.requestId,
    required this.riderId,
    required this.driverId,
    required this.startLocationId,
    required this.endLocationId,
    required this.rideType,
    required this.serviceType,
    required this.distance,
    required this.estimatedFee,
    required this.paymentType,
    required this.status,
    this.cancelReason,
    this.notes,
    required this.requestTime,
    required this.createdAt,
    required this.startLocation,
    required this.endLocation,
  });

  factory RideRequestModel.fromJson(Map<String, dynamic> json) {
    return RideRequestModel(
      requestId: json['request_id'],
      riderId: json['rider_id'],
      driverId: json['driver_id'],
      startLocationId: json['start_location_id'],
      endLocationId: json['end_location_id'],
      rideType: json['ride_type'],
      serviceType: json['service_type'],
      distance: (json['distance'] as num).toDouble(),
      estimatedFee: (json['estimated_fee'] as num).toDouble(),
      paymentType: json['payment_type'],
      status: json['status'],
      cancelReason: json['cancel_reason'],
      notes: json['notes'],
      requestTime: DateTime.parse(json['request_time']),
      createdAt: DateTime.parse(json['created_at']),
      startLocation: RideLocationModel.fromJson(json['startLocation']),
      endLocation: RideLocationModel.fromJson(json['endLocation']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'request_id': requestId,
      'rider_id': riderId,
      'driver_id': driverId,
      'start_location_id': startLocationId,
      'end_location_id': endLocationId,
      'ride_type': rideType,
      'service_type': serviceType,
      'distance': distance,
      'estimated_fee': estimatedFee,
      'payment_type': paymentType,
      'status': status,
      'cancel_reason': cancelReason,
      'notes': notes,
      'request_time': requestTime.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'startLocation': startLocation.toJson(),
      'endLocation': endLocation.toJson(),
    };
  }
}
