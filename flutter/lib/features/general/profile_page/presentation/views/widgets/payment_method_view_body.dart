import 'package:flutter/material.dart';
import 'package:motolink/features/general/profile_page/presentation/views/widgets/payment_card.dart';
class PaymentMethodViewBody extends StatelessWidget {
  const PaymentMethodViewBody({super.key});
  @override
  Widget build(BuildContext context) {
    List<Map<String, String>> paymentMethods = [
      {"card": "****9010", "expiry": "12/28", "type": "Primary"},
      {"card": "****5484", "expiry": "11/25", "type": ""},
      {"card": "****2314", "expiry": "17/30", "type": ""},
      {"card": "****4578", "expiry": "15/27", "type": ""},
    ];

    return   Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            SizedBox(height: 30,),
            Expanded(
              child: ListView.builder(
                itemCount: paymentMethods.length,
                itemBuilder: (context, index) {
                  final card = paymentMethods[index];
                  return PaymentCard(
                    cardNumber: card["card"]!,
                    expiryDate: card["expiry"]!,
                    isPrimary: card["type"] == "Primary",
                  );
                },
              ),
            ),
          ],
        ),
    );
  }
}
