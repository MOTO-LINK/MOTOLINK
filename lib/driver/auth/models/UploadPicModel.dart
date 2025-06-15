class UploadPictureResponse {
  final bool success;
  final String profilePicture;
  final String message;

  UploadPictureResponse({
    required this.success,
    required this.profilePicture,
    required this.message,
  });

  factory UploadPictureResponse.fromJson(Map<String, dynamic> json) {
    return UploadPictureResponse(
      success: json['success'] ?? false,
      profilePicture:
          json['data'] != null ? json['data']['profile_picture'] ?? '' : '',
      message: json['message'] ?? '',
    );
  }
}
