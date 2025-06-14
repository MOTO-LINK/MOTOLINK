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
      balance: double.tryParse(json['balance'].toString()) ?? 0.0,
      amountOwed: double.tryParse(json['amountOwed'].toString()) ?? 0.0,
      currency: json['currency'] ?? '',
      status: json['status'] ?? '',
    );
  }

}
