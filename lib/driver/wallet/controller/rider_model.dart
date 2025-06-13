class RideModel {
  final String requestId;
  final String rideType;
  final String serviceType;
  final int estimatedFee;
  final DateTime requestTime;

  RideModel({
    required this.requestId,
    required this.rideType,
    required this.serviceType,
    required this.estimatedFee,
    required this.requestTime,
  });

  factory RideModel.fromJson(Map<String, dynamic> json) {
    return RideModel(
      requestId: json['request_id'],
      rideType: json['ride_type'],
      serviceType: json['service_type'],
      estimatedFee: json['estimated_fee'],
      requestTime: DateTime.parse(json['request_time']),
    );
  }
}
