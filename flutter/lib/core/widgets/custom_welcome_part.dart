import 'package:flutter/material.dart';

import '../utils/colors_palette.dart';

class CustomWelcomePart extends StatelessWidget {
  const CustomWelcomePart({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              "Welcome to",
              style: TextStyle(fontSize: 25, fontWeight: FontWeight.w400),
            ),
            Text(
              " Motolink",
              style: TextStyle(
                fontSize: 25,
                fontWeight: FontWeight.w400,
                color: ColorsApp.second,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        const Text(
          "Choose your role: Driver or Rider",
          style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w400,
              color: Color(0xffA7A7A7)),
        ),
        const SizedBox(height: 23),
        LinearProgressIndicator(
          value: 0.7,
          backgroundColor: Colors.grey,
          color: ColorsApp.second,
        ),
      ],
    );
  }
}
