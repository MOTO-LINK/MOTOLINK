class TransactionModel {
  final String transactionId;
  final double amount;
  final String type;
  final String purpose;
  final String status;
  final String? referenceId;
  final String? description;
  final DateTime createdAt;

  TransactionModel({
    required this.transactionId,
    required this.amount,
    required this.type,
    required this.purpose,
    required this.status,
    this.referenceId,
    this.description,
    required this.createdAt,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      transactionId: json['transaction_id'],
      amount: json['amount']?.toDouble() ?? 0.0,
      type: json['type'],
      purpose: json['purpose'],
      status: json['status'],
      referenceId: json['reference_id'],
      description: json['description'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
