import 'package:flutter/material.dart';

class RideDataRow extends StatelessWidget {
  const RideDataRow({super.key, required this.label,  required this.value,  this.isTotal= false});
final String  label,value;
 final bool isTotal ;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: isTotal ? Colors.yellow : Colors.white,
              fontWeight: isTotal ? FontWeight.w600 : FontWeight.w400,
              fontSize: isTotal ? 20 : 18,
            ),
          ),
          Text(
            value,
            style: TextStyle(
                color: isTotal ? Colors.yellow : Colors.white,
                fontWeight: isTotal ? FontWeight.w800 : FontWeight.normal,
                fontSize: 20
            ),
          ),
        ],
      ),
    );
  }
}
