class SubmitRatingRequestModel {
  final String rideTransactionId;
  final int rating;
  final String feedback;

  const SubmitRatingRequestModel({
    required this.rideTransactionId,
    required this.rating,
    required this.feedback,
  });

  Map<String, dynamic> toJson() => {
    'rideTransactionId': rideTransactionId,
    'rating': rating,
    'feedback': feedback,
  };
}
