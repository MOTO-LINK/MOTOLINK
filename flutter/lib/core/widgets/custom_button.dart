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
        backgroundColor: ColorsApp.second,
        minimumSize: const Size(180, 55),
      ),
      child: Text(
        txt,
        style: TextStyle(
          color: ColorsApp.title,
          fontWeight: FontWeight.w600,
          fontSize: 25,
        ),
      ),
    );
  }
}
