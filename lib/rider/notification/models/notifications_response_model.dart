import 'notification_model.dart';
import 'pagination_model.dart';

class NotificationsResponseModel {
  final List<NotificationModel> items;
  final PaginationModel pagination;

  NotificationsResponseModel({
    required this.items,
    required this.pagination,
  });

  factory NotificationsResponseModel.fromJson(Map<String, dynamic> json) {
    final data = json['data'] as Map<String, dynamic>? ?? {};
    final itemsList = data['items'] as List? ?? [];
    List<NotificationModel> notifications = itemsList
        .map((i) => NotificationModel.fromJson(i as Map<String, dynamic>))
        .toList();
    final paginationData = data['pagination'] as Map<String, dynamic>? ?? {};

    return NotificationsResponseModel(
      items: notifications,
      pagination: PaginationModel.fromJson(paginationData),
    );
  }
}