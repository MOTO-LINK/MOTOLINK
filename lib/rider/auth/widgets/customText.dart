import 'package:flutter/material.dart';

class CustomText extends StatelessWidget {
  CustomText({
    super.key,
    this.onChanged,
    this.hintTxt,
    this.controller,
    this.icon,
    this.textInputType,
    this.validatorEdit,
  });

  Function(String)? onChanged;
  String? hintTxt;
  Icon? icon;
  TextEditingController? controller = TextEditingController();
  TextInputType? textInputType;
  String? Function(String?)? validatorEdit;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        hintText: hintTxt,
        hintStyle: TextStyle(color: Colors.grey),
        prefixIcon: icon,
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey, width: 2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Color(0xFFB5022F), width: 2),
        ),
      ),
      keyboardType: textInputType,
      validator: validatorEdit,
      onChanged: onChanged,
    );
  }
}
