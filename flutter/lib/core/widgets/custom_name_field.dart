import 'package:flutter/material.dart';

import '../utils/colors_palette.dart';

class CustomNameField extends StatelessWidget {
  const CustomNameField({super.key, required this.hint, required this.label, this.keyboardType});
final String hint,label;
 final TextInputType? keyboardType;
  @override
  Widget build(BuildContext context) {
    return TextField(
      keyboardType: keyboardType,
      decoration: InputDecoration(
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide(color: ColorsPalette.borderColor)),
          focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: ColorsPalette.borderColor)),
          hintText: hint,
          hintStyle: const TextStyle(
              color: Color(0xff696969),
              fontSize: 13,
              fontWeight: FontWeight.w400),
          labelText: label),
    );
  }
}
