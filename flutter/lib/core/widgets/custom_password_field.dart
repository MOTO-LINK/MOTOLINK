import 'package:flutter/material.dart';

import '../utils/colors_palette.dart';

class CustomPasswordField extends StatefulWidget {
  const CustomPasswordField({super.key});

  @override
  State<CustomPasswordField> createState() => _CustomPasswordFieldState();
}

class _CustomPasswordFieldState extends State<CustomPasswordField> {
  bool isVisabilty = true;

  @override
  Widget build(BuildContext context) {
    return TextField(
      obscureText: isVisabilty,
      decoration: InputDecoration(
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: ColorsPalette.borderColor)),
          focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: ColorsPalette.borderColor)),
          hintText: "Enter your Password",
          hintStyle: const TextStyle(
              color: Color(0xff696969),
              fontSize: 13,
              fontWeight: FontWeight.w400),
          labelText: "Password",
          suffixIcon: IconButton(
              onPressed: () {
                isVisabilty = !isVisabilty;
                setState(() {});
              },
              icon: isVisabilty
                  ? const Icon(Icons.visibility_off_outlined)
                  : const Icon(Icons.visibility_outlined))),
    );
  }
}
