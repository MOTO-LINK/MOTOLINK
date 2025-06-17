class RideLocationModel {
  final String locationId;
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final String type; 
  final bool isDefault;
  final DateTime createdAt;

  const RideLocationModel({
    required this.locationId,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.type,
    required this.isDefault,
    required this.createdAt,
  });

  factory RideLocationModel.fromJson(Map<String, dynamic> json) {
    return RideLocationModel(
      locationId: json['location_id'],
      name: json['name'],
      address: json['address'],
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      type: json['type'],
      isDefault: json['is_default'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'location_id': locationId,
      'name': name,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'type': type,
      'is_default': isDefault,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
