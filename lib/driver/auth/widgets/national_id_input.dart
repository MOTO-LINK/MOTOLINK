import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';

class NationalIdInput extends StatelessWidget {
  const NationalIdInput({super.key, required this.labtext, this.controller});

  final String labtext;
  final TextEditingController? controller;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          labelText: labtext,
          labelStyle: TextStyle(color: Colors.grey),
          filled: true,
          fillColor: Colors.white,
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: ColorsApp().secondaryColor),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: ColorsApp().secondaryColor, width: 2),
          ),
        ),
        keyboardType: TextInputType.number,
      ),
    );
  }
}
