class DeliveryModel {
  final String requestId;
  final String riderId;
  final String? driverId;
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

  final Map<String, dynamic>? startLocation;
  final Map<String, dynamic>? endLocation;

  DeliveryModel({
    required this.requestId,
    required this.riderId,
    this.driverId,
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
    this.startLocation,
    this.endLocation,
  });

  factory DeliveryModel.fromJson(Map<String, dynamic> json) {
    return DeliveryModel(
      requestId: json['request_id'],
      riderId: json['rider_id'],
      driverId: json['driver_id'], // هنا بقت nullable
      startLocationId: json['start_location_id'],
      endLocationId: json['end_location_id'],
      rideType: json['ride_type'],
      serviceType: json['service_type'],
      distance: double.tryParse(json['distance'].toString()) ?? 0.0,
      estimatedFee: double.tryParse(json['estimated_fee'].toString()) ?? 0.0,
      paymentType: json['payment_type'],
      status: json['status'],
      cancelReason: json['cancel_reason'],
      notes: json['notes'],
      requestTime: DateTime.parse(json['request_time']),
      createdAt: DateTime.parse(json['created_at']),
      startLocation: json['startLocation'],
      endLocation: json['endLocation'],
    );
  }
}
