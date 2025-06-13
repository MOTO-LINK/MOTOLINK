
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../../core/utils/showSnackBar.dart';
import '../controller/wallet_cubit.dart';
import 'custom_wallet_button.dart';


class ContentModelSheet extends StatefulWidget {
  const ContentModelSheet({
    super.key,
    required this.label,
    required this.amount,
    required this.hint,
    required this.txtButton,
    required this.onTransactionComplete,
    required this.availableBalance,
  });

  final String label;
  final String amount;
  final String hint;
  final String txtButton;
  final Function(int amount) onTransactionComplete;
  final int availableBalance;

  @override
  State<ContentModelSheet> createState() => _ContentModelSheetState();
}

class _ContentModelSheetState extends State<ContentModelSheet> {
  final TextEditingController _amountController = TextEditingController();
  String _selectedMethod = "vodafone_cash";

  @override
  Widget build(BuildContext context) {
    return BlocListener<WalletCubit, WalletState>(
      listener: (context, state) {
        if (state is WithdrawLoading) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (_) => Center(
              child: LoadingAnimationWidget.fourRotatingDots(
                color: const Color(0xFFB5022F),
                size: 80,
              ),
            ),
          );
        } else {
          Navigator.of(context, rootNavigator: true).pop();
          if (state is WithdrawSuccess) {
            final int amount = int.tryParse(_amountController.text) ?? 0;
            widget.onTransactionComplete(amount);
            Navigator.pop(context);
            showSnackBar(context, "Withdraw request sent successfully");
          } else if (state is WithdrawFailure) {
            Navigator.pop(context);
            showSnackBar(context, "Sorry, there was an error. Please try again later.");
            debugPrint(state.error);
          }
        }
      },
      child: Padding(
        padding: MediaQuery.of(context).viewInsets,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    height: 5,
                    width: 50,
                    decoration: BoxDecoration(
                      color: Colors.grey,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Divider(thickness: 2),
                  const SizedBox(height: 16),
                  Text(widget.label, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  Text("Available:   ${widget.amount}"),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _amountController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      hintText: widget.hint,
                      border: const OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(10.0)),
                      ),
                      focusedBorder: const OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(10.0)),
                        borderSide: BorderSide(color: Color(0xFFB5022F)),
                      ),
                      enabledBorder: const OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(10.0)),
                        borderSide: BorderSide(color: Colors.grey),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  DropdownButton<String>(
                    value: _selectedMethod,
                    items: const [
                      DropdownMenuItem(value: "vodafone_cash", child: Text("Vodafone Cash")),
                      DropdownMenuItem(value: "Visa", child: Text("Visa")),
                    ],
                    onChanged: (value) => setState(() => _selectedMethod = value!),
                  ),
                  const SizedBox(height: 16),
                  CustomButton(
                    txt: widget.txtButton,
                    amountController: _amountController,
                    isWithdraw: widget.label == "Withdraw Request",
                    method: _selectedMethod,
                    accountDetails: "01012345678",
                    availableBalance: widget.availableBalance,
                    onSuccess: (amount) {
                      widget.onTransactionComplete(amount);
                    },
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}