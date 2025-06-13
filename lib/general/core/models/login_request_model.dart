class UserModel {
  final String userId;
  final String name;
  final String email;
  final String phone;
  final bool phoneVerified;
  final String profilePicture;
  final String userType;
  final bool accountLocked;
  final DateTime createdAt;
  final DateTime lastLogin;

  UserModel({
    required this.userId,
    required this.name,
    required this.email,
    required this.phone,
    required this.phoneVerified,
    required this.profilePicture,
    required this.userType,
    required this.accountLocked,
    required this.createdAt,
    required this.lastLogin,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['user_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      phoneVerified: json['phone_verified'] ?? false,
      profilePicture: json['profile_picture'] ?? '',
      userType: json['user_type'] ?? '',
      accountLocked: json['account_locked'] ?? false,
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
      lastLogin: DateTime.tryParse(json['last_login'] ?? '') ?? DateTime.now(),
    );
  }
}
