import 'package:flutter/material.dart';

import '../utils/colors_palette.dart';

class CustomPhoneField extends StatelessWidget {
  const CustomPhoneField({super.key});

  @override
  Widget build(BuildContext context) {
    return  TextField(
      keyboardType: TextInputType.phone,
      decoration: InputDecoration(
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: ColorsPalette.borderColor)),
          focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: ColorsPalette.borderColor)),
          hintStyle: const TextStyle(
              color: Color(0xffDADADA),
              fontSize: 18,
              fontWeight: FontWeight.w400),
          hintText: "015*******68",
          labelText: "Phone Number",
          prefixText:
          "+20  ",
          prefixStyle:
          const TextStyle(fontSize: 15, fontWeight: FontWeight.w400),

          prefixIcon: Image.asset("assets/images/egypt_flag.jpg",  scale: 160,)),
    );
  }
}
