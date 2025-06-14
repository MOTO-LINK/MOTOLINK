import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:moto/driver/wallet/controller/wallet_cubit.dart';
import '../../../core/utils/showSnackBar.dart';
import '../../../rider/auth/core/services/storage_service.dart';
import '../pages/payment_page.dart';

class CustomButton extends StatelessWidget {
  const CustomButton({
    super.key,
    required this.txt,
    required this.amountController,
    required this.isWithdraw,
    required this.method,
    required this.accountDetails,
    required this.availableBalance,
    required this.onSuccess,
  });

  final String txt;
  final TextEditingController amountController;
  final bool isWithdraw;
  final String method;
  final String accountDetails;
  final int availableBalance;
  final Function(int amount) onSuccess;

  Future<void> _handleTap(BuildContext context) async {
    final amountText = amountController.text.trim();
    final int? amount = int.tryParse(amountText);

    if (amount == null || amount <= 0) {
      Navigator.pop(context);
      showSnackBar(context, "Enter a valid amount");
      return;
    }

    if (isWithdraw && amount  > availableBalance) {
      Navigator.pop(context);
      showSnackBar(context, "Insufficient balance");
      return;
    }

    // جلب التوكن من التخزين
    final token = await StorageService().getToken();

    if (token == null || token.isEmpty) {
      Navigator.pop(context);
      showSnackBar(context, "Session expired. Please login again.");
      return;
    }

    if (isWithdraw) {
      context.read<WalletCubit>().sendWithdrawRequest(
        amount: amount,
        method: method,
        accountDetails: accountDetails,

      );
      onSuccess(amount);
    } else {
      Navigator.pop(context);
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => PaymentPage(
            paymentMethod: method,
            amount: amount.toDouble(),
            token: token,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _handleTap(context),
      child: Container(
        width: double.infinity,
        height: 55,
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFFB5022F), Colors.black]),
          borderRadius: BorderRadius.circular(15),
        ),
        child: Center(
          child: Text(
            txt,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
