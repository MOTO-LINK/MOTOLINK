import 'package:flutter/material.dart';

class BuildStateCard extends StatelessWidget {
  const BuildStateCard({super.key, required this.label, required this.amount, required this.nextPage, this.isSmall = false});
  final bool isSmall;
  final String label;
  final String amount;
  final String nextPage;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: GestureDetector(
        onTap: (){
          Navigator.of(context).pushNamed(nextPage);
        },
        child: Container(
          height: isSmall ? 70 : 160,
          width: isSmall ? 210 : 150,
          decoration: BoxDecoration(
            color: Colors.red.shade50,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFB5022F)),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(amount,
                    style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFFB5022F),
                        fontWeight: FontWeight.w800)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
