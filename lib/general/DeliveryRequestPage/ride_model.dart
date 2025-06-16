import 'dart:convert';

class DeliveryModel {
  final String requestId;
  final String? riderId;
  final String? driverId;
  final String? startLocationId;
  final String? endLocationId;
  final String? rideType;
  final String? serviceType;
  final double? distance;
  final double? estimatedFee;
  final String? paymentType;
  final String? status;
  final String? cancelReason;
  final String? notes;
  final DateTime requestTime;
  final DateTime createdAt;
  final Map<String, dynamic>? startLocation;
  final Map<String, dynamic>? endLocation;

  DeliveryModel({
    required this.requestId,
    this.riderId,
    this.driverId,
    this.startLocationId,
    this.endLocationId,
    this.rideType,
    this.serviceType,
    this.distance,
    this.estimatedFee,
    this.paymentType,
    this.status,
    this.cancelReason,
    this.notes,
    required this.requestTime,
    required this.createdAt,
    this.startLocation,
    this.endLocation,
  });

  factory DeliveryModel.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic>? parseLocation(dynamic loc) {
      if (loc == null) return null;
      if (loc is Map<String, dynamic>) return loc;
      if (loc is String) {
        try {
          return loc.isNotEmpty ? Map<String, dynamic>.from(jsonDecode(loc)) : null;
        } catch (_) {
          return null;
        }
      }
      return null;
    }

    return DeliveryModel(
      requestId: json['request_id']?.toString() ?? '',
      riderId: json['rider_id']?.toString(),
      driverId: json['driver_id']?.toString(),
      startLocationId: json['start_location_id']?.toString(),
      endLocationId: json['end_location_id']?.toString(),
      rideType: json['ride_type']?.toString(),
      serviceType: json['service_type']?.toString(),
      distance: (json['distance'] is String)
          ? double.tryParse(json['distance'])
          : (json['distance'] as num?)?.toDouble(),
      estimatedFee: (json['estimated_fee'] is String)
          ? double.tryParse(json['estimated_fee'])
          : (json['estimated_fee'] as num?)?.toDouble(),
      paymentType: json['payment_type']?.toString(),
      status: json['status']?.toString(),
      cancelReason: json['cancel_reason']?.toString(),
      notes: json['notes']?.toString(),
      requestTime: DateTime.tryParse(json['request_time']?.toString() ?? '') ?? DateTime.now(),
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
      startLocation: parseLocation(json['startLocation']),
      endLocation: parseLocation(json['endLocation']),
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
      'startLocation': startLocation,
      'endLocation': endLocation,
    };
  }

   String get startAddress => startLocation?['address']?.toString() ?? '';
  String get endAddress => endLocation?['address']?.toString() ?? '';
}