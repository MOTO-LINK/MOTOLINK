import 'package:flutter/material.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import '../../../../../core/utils/colors_palette.dart';

class PaymentMethodView extends StatelessWidget {
  const PaymentMethodView({super.key});

  @override
  Widget build(BuildContext context) {
    List<Map<String, String>> paymentMethods = [
      {"card": "****9010", "expiry": "12/28", "type": "Primary"},
      {"card": "****5484", "expiry": "11/25", "type": ""},
      {"card": "****2314", "expiry": "17/30", "type": ""},
      {"card": "****4578", "expiry": "15/27", "type": ""},
    ];
    return Scaffold(
      appBar: CustomAppBar(txt: "Payment Method"),
      body:   Padding(
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
      )
    );
  }
}

class PaymentCard extends StatelessWidget {
  final String cardNumber;
  final String expiryDate;
  final bool isPrimary;

  const PaymentCard({
    super.key,
    required this.cardNumber,
    required this.expiryDate,
    this.isPrimary = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color:ColorsPalette.baseColor, width: 1),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Image.asset("assets/images/VISA-Logo.png", width: 40),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    cardNumber,
                    style: const TextStyle(color: Colors.grey, fontSize: 16),
                  ),
                  Text(
                    "Expires $expiryDate",
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Row(
            children: [
              if (isPrimary)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: ColorsPalette.baseColor,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    "Primary",
                    style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
                  ),
                ),
              const SizedBox(width: 10),
              const Icon(Icons.arrow_forward_ios, color: Colors.white, size: 18),
            ],
          ),
        ],
      ),
    );
  }
}