class SubmitRatingResponseModel {
  final String ratingId;
  final String rideTransactionId;
  final String ratingUserId;
  final String ratedUserId;
  final int ratingValue;
  final String feedback;
  final DateTime createdAt;
  final String raterName;

  const SubmitRatingResponseModel({
    required this.ratingId,
    required this.rideTransactionId,
    required this.ratingUserId,
    required this.ratedUserId,
    required this.ratingValue,
    required this.feedback,
    required this.createdAt,
    required this.raterName,
  });

  factory SubmitRatingResponseModel.fromJson(Map<String, dynamic> json) {
    return SubmitRatingResponseModel(
      ratingId: json['rating_id'],
      rideTransactionId: json['ride_transaction_id'],
      ratingUserId: json['rating_user_id'],
      ratedUserId: json['rated_user_id'],
      ratingValue: json['rating_value'],
      feedback: json['feedback'],
      createdAt: DateTime.parse(json['created_at']),
      raterName: json['rater_name'],
    );
  }
}
