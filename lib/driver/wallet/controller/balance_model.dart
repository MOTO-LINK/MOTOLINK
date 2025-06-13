class BalanceModel {
  final double balance;
  final double amountOwed;
  final String currency;
  final String status;

  BalanceModel({
    required this.balance,
    required this.amountOwed,
    required this.currency,
    required this.status,
  });

  factory BalanceModel.fromJson(Map<String, dynamic> json) {
    return BalanceModel(
      balance: (json['balance'] ?? 0).toDouble(),
      amountOwed: (json['amountOwed'] ?? 0).toDouble(),
      currency: json['currency'] ?? '',
      status: json['status'] ?? '',
    );
  }
}
