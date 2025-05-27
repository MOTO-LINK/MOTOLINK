import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors_palette.dart';

class CustomButton extends StatelessWidget {
  const CustomButton(
      {super.key, required this.txt, required this.nameNextPage});
  final String txt;
  final String nameNextPage;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        Navigator.of(context).pushNamed(nameNextPage);
      },
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