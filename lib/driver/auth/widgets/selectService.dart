import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';

class Selectservice extends StatelessWidget {
  final String txt;
  final bool value;
  final ValueChanged<bool?> onChanged;

  const Selectservice({
    super.key,
    required this.txt,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade300, width: 1),
      ),
      child: Row(
        children: [
          Image.asset("assets/images/Delivery_man.png", height: 60),
          SizedBox(width: 10),
          Text(
            txt,
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          Spacer(),
          Checkbox(
            value: value,
            onChanged: onChanged,
            activeColor: ColorsApp().secondaryColor,
          ),
        ],
      ),
    );
  }
}
