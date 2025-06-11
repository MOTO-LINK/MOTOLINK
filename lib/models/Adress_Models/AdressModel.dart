class AddressModel {
  final String title;
  final String autoAddress;
  final double latitude;
  final double longitude;

  AddressModel({
    required this.title,
    required this.autoAddress,
    required this.latitude,
    required this.longitude,
  });

  Map<String, dynamic> toJson() => {
        'title': title,
        'address': autoAddress,
        'latitude': latitude,
        'longitude': longitude,
      };
}
