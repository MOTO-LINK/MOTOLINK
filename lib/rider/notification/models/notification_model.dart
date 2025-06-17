class NotificationModel {
  final String notificationId;
  final String userId;
  final String notificationType;
  final String messageContent;
  final bool viewed;
  final bool sent;
  final DateTime createdAt;

  NotificationModel({
    required this.notificationId,
    required this.userId,
    required this.notificationType,
    required this.messageContent,
    required this.viewed,
    required this.sent,
    required this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      notificationId: json['notification_id'] ?? '',
      userId: json['user_id'] ?? '',
      notificationType: json['notification_type'] ?? 'general',
      messageContent: json['message_content'] ?? 'No content available',
      viewed: json['viewed'] ?? false,
      sent: json['sent'] ?? false,
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
    );
  }
}