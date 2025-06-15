
class UpdateProfileResponse {
  final bool success;
  final UserData data;
  final String message;

  UpdateProfileResponse({
    required this.success,
    required this.data,
    required this.message,
  });

  factory UpdateProfileResponse.fromJson(Map<String, dynamic> json) {
    return UpdateProfileResponse(
      success: json['success'],
      data: UserData.fromJson(json['data']),
      message: json['message'] ?? '',
    );
  }
}

class UserData {
  final String userId;
  final String name;
  final String email;
  final String phone;
  final bool phoneVerified;
  final String profilePicture;
  final String userType;
  final bool accountLocked;
  final String createdAt;
  final String lastLogin;

  UserData({
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

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      userId: json['user_id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      phoneVerified: json['phone_verified'],
      profilePicture: json['profile_picture'],
      userType: json['user_type'],
      accountLocked: json['account_locked'],
      createdAt: json['created_at'],
      lastLogin: json['last_login'],
    );
  }
}
