import 'package:flutter/material.dart';

class Boldtext extends StatelessWidget {
  const Boldtext({super.key, required this.text});
  final String text ;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 50),
      child: Text(
        text,
        textDirection: TextDirection.rtl,
        style: const TextStyle(
          fontSize: 18,
          color: Colors.black,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
