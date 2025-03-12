import 'package:flutter/material.dart';

import '../utils/colors_palette.dart';

class CustomButton extends StatelessWidget {
  const CustomButton({super.key, required this.txt});
final String txt;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        backgroundColor: ColorsPalette.baseColor,
        minimumSize: const Size(double.infinity, 50),
      ),
      child:   Text(txt,
          style: TextStyle(
              color: Colors.black,
              fontWeight: FontWeight.w600,
              fontSize: 20)),
    );
  }
}
