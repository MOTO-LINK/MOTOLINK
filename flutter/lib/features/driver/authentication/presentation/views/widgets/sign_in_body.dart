import 'package:flutter/material.dart';
import 'package:motolink/core/widgits/custom_welcome_part.dart';

class SignInBody extends StatefulWidget {
  const SignInBody({super.key});

  @override
  State<SignInBody> createState() => _SignInBodyState();
}

class _SignInBodyState extends State<SignInBody> {
  String? selectedGender;

  String? selectedDay = "27";
  String? selectedMonth = "11";
  String? selectedYear = "2020";
  bool isVisabilty = true;

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomWelcomePart()


            ],
          ),
        ),
      );

  }
}
