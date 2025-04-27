import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';

class ImageBoarding extends StatelessWidget {
  ImageBoarding({super.key, required this.image});

  final String image;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(30),
      height: 250,
      width: 250,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(150),
        color: ColorsPalette.baseColor,
      ),
      child: Image.asset(image),
    );
  }
}
