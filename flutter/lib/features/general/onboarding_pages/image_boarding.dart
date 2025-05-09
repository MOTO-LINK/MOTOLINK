import 'package:flutter/material.dart';

class ImageBoarding extends StatelessWidget {
  ImageBoarding({super.key, required this.image, required this.colorBG});

  final String image;
  final Color colorBG;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(30),
      height: 250,
      width: 250,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(150),
        color: colorBG,
      ),
      child: Image.asset(image),
    );
  }
}
