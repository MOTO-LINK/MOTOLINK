import 'package:flutter/material.dart';

class homePageDAFUALT extends StatelessWidget {
  const homePageDAFUALT({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(
          'Welcome to the Default Home Page',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
