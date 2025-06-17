import 'package:moto/rider/requests/models/pagination_model.dart';
import 'package:moto/rider/requests/models/ride_request_model.dart';

class RideHistoryResponseModel {
  final List<RideRequestModel> items;
  final PaginationModel pagination;

  const RideHistoryResponseModel({
    required this.items,
    required this.pagination,
  });

  factory RideHistoryResponseModel.fromJson(Map<String, dynamic> json) {
    final itemsJson = json['items'] as List<dynamic>;
    final paginationJson = json['pagination'] as Map<String, dynamic>;

    return RideHistoryResponseModel(
      items: itemsJson.map((item) => RideRequestModel.fromJson(item)).toList(),
      pagination: PaginationModel.fromJson(paginationJson),
    );
  }

  Map<String, dynamic> toJson() => {
    'items': items.map((e) => e.toJson()).toList(),
    'pagination': pagination.toJson(),
  };
}
