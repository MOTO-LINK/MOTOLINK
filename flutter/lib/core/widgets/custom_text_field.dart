import 'package:flutter/material.dart';

import '../utils/colors_palette.dart';

class CustomTextField extends StatefulWidget {
  const CustomTextField(
      {super.key,
      required this.hint,
      required this.label,
      required this.keyboardType,
      this.passwordIcon = false,
      this.phoneIcon = false});
  final String hint, label;
  final TextInputType? keyboardType;
  final bool passwordIcon;
  final bool phoneIcon;

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  bool isVisabilty = true;

  @override
  Widget build(BuildContext context) {
    return TextField(
      obscureText: widget.passwordIcon ? isVisabilty : false,
      keyboardType: widget.keyboardType,
      decoration: InputDecoration(
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide(color: ColorsPalette.borderColor)),
          focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: ColorsPalette.borderColor)),
          hintText: widget.hint,
          hintStyle: const TextStyle(
              color: Color(0xff696969),
              fontSize: 13,
              fontWeight: FontWeight.w400),
          labelText: widget.label,
          suffixIcon: widget.passwordIcon
              ? IconButton(
                  onPressed: () {
                    isVisabilty = !isVisabilty;
                    setState(() {});
                  },
                  icon: isVisabilty
                      ? const Icon(Icons.visibility_off_outlined)
                      : const Icon(Icons.visibility_outlined))
              : null,
          prefixText: widget.phoneIcon ? "+20  " : null,
          prefixStyle: widget.phoneIcon
              ? const TextStyle(fontSize: 15, fontWeight: FontWeight.w400)
              : null,
          prefixIcon: widget.phoneIcon
              ? Image.asset(
                  "assets/images/egypt_flag.jpg",
                  scale: 160,
                )
              : null),
    );
  }
}
