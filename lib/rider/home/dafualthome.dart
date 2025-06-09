import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';

class homePageDAFUALT extends StatelessWidget {
  const homePageDAFUALT({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      body: Center(
        child: Text(
          'Welcome to the Default Home Page',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
