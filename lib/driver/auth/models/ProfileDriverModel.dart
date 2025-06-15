// فيه كل معلومات الـ Driver

class DriverProfileModel {
  final String driverId;
  final String vehicleType;
  final List<String> orderTypes;
  final bool isOnline;
  final bool isAvailable;
  final bool verified;
  final String verificationStatus;
  final int rating;
  final int totalRides;
  final bool accountLocked;
  final DateTime createdAt;

  DriverProfileModel({
    required this.driverId,
    required this.vehicleType,
    required this.orderTypes,
    required this.isOnline,
    required this.isAvailable,
    required this.verified,
    required this.verificationStatus,
    required this.rating,
    required this.totalRides,
    required this.accountLocked,
    required this.createdAt,
  });

  factory DriverProfileModel.fromJson(Map<String, dynamic> json) {
    return DriverProfileModel(
      driverId: json['driver_id'],
      vehicleType: json['vehicle_type'],
      orderTypes: List<String>.from(json['order_types']),
      isOnline: json['is_online'],
      isAvailable: json['is_available'],
      verified: json['verified'],
      verificationStatus: json['verification_status'],
      rating: json['rating'],
      totalRides: json['total_rides'],
      accountLocked: json['account_locked'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
