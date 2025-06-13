import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';

void CustomSnackBar(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: Colors.white,
      behavior: SnackBarBehavior.floating,
      margin: const EdgeInsets.only(bottom: 30, left: 20, right: 20),
      content: Text(
        message,
        textAlign: TextAlign.center,
        style: TextStyle(fontSize: 16, color: ColorsApp().secondaryColor),
      ),
    ),
  );
}
