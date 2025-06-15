import 'package:flutter/material.dart';

class Normaltext extends StatelessWidget {
  const Normaltext({super.key, required this.text});
  final String text;
  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textDirection: TextDirection.rtl,
      style: const TextStyle(
        fontSize: 14,
        color: Colors.black87,
        fontWeight: FontWeight.normal,
      ),
    );
  }
}
