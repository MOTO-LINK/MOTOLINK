import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/models/textfieldmodel.dart';

class CustomTextfield extends StatelessWidget {
  const CustomTextfield({
    super.key,
    required this.Textfieldmodels,
    required this.color,
  });

  final Textfieldmodel Textfieldmodels;
  final ColorsApp color;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      readOnly: Textfieldmodels.isReadOnly ?? false,
      controller: Textfieldmodels.controller,
      keyboardType: Textfieldmodels.keyboardType,
      decoration: InputDecoration(
        prefixIcon: Textfieldmodels.prefixIcon,
        prefixIconColor: ColorsApp().secondaryColor,
        suffixIcon: Textfieldmodels.suffixIcon != null
            ? GestureDetector(
                onTap: Textfieldmodels.onTap,
                child: Textfieldmodels.suffixIcon,
              )
            : null,
        suffixIconColor: ColorsApp().secondaryColor,
        iconColor: color.secondaryColor,
        contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
        filled: true,
        fillColor: ColorsApp().TextField.withOpacity(0.1),
        hintText: Textfieldmodels.hintText,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
      textDirection: TextDirection.rtl,
      onTap: Textfieldmodels.isReadOnly ?? false ? Textfieldmodels.onTap : null,
    );
  }
}
