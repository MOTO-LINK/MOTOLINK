import 'package:flutter/material.dart';
import 'package:motolink/features/general/onboarding_pages/boarding_one.dart';
import 'package:motolink/features/general/onboarding_pages/boarding_three.dart';
import 'package:motolink/features/general/onboarding_pages/boarding_two.dart';
import 'package:motolink/features/general/select_user_type.dart';
import 'package:motolink/features/general/splash_view/presentation/views/splash_view.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      routes: {
        "splash_page": (context) => SplashView(),
        "boarding_one": (context) => BoardingOne(),
        "boarding_two": (context) => BoardingTwo(),
        "boarding_three": (context) => BoardingThree(),
        "chooseRiderOrDriverPage": (context) => SelectUserType(),
      },
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: SelectUserType(),
    );
  }
}
