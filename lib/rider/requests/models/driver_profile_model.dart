// lib/models/driver_profile_model.dart

class DriverProfileModel {
  final String driverId;
  final String? name; // ملاحظة: هذا الحقل غير موجود في الـ API حالياً
  final String? photoUrl; // ملاحظة: هذا الحقل غير موجود في الـ API حالياً
  final double rating;
  final int totalRides;
  final bool isVerified;

  const DriverProfileModel({
    required this.driverId,
    this.name,
    this.photoUrl,
    required this.rating,
    required this.totalRides,
    required this.isVerified,
  });

  factory DriverProfileModel.fromJson(Map<String, dynamic> json) {
    return DriverProfileModel(
      driverId: json['driver_id'],
      // TODO: اطلب من مطور الباك اند إضافة اسم السائق وصورته في هذا الـ Response
      name: json['name'] ?? 'Driver Name', // قيمة افتراضية مؤقتة
      photoUrl: json['photo_url'], // قيمة افتراضية مؤقتة
      rating: (json['rating'] as num).toDouble(),
      totalRides: json['total_rides'],
      isVerified: json['verified'],
    );
  }
}