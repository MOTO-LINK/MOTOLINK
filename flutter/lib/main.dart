import 'package:flutter/material.dart';
import 'package:motolink/features/driver/authentication/presentation/views/driver_login.dart';
import 'package:motolink/features/driver/authentication/presentation/views/driver_sign_up.dart';
import 'package:motolink/features/general/onboarding_pages/boarding_one.dart';
import 'package:motolink/features/general/onboarding_pages/boarding_three.dart';
import 'package:motolink/features/general/onboarding_pages/boarding_two.dart';
import 'package:motolink/features/general/select_user_type.dart';
import 'package:motolink/features/general/splash_view/presentation/views/splash_view.dart';
import 'package:motolink/features/home/booking.dart';
import 'package:motolink/features/home/homepage.dart';
import 'package:motolink/features/rider/authentication/presentation/views/rider_login.dart';
import 'package:motolink/features/rider/authentication/presentation/views/rider_sign_up.dart';
import 'package:motolink/features/rider/authentication/presentation/views/verification_page.dart';

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
        "verification_page": (context) => VerficodePage(),
        "home_page": (context) => HomePage(),

        // rider pages
        "rider_sign_up": (context) => RiderSignUp(),
        "rider_login": (context) => RiderLogin(),

        // driver pages
        "driver_sign_up": (context) => DriverSignUp(),
        "driver_login": (context) => DriverLogin(),
      },
      debugShowCheckedModeBanner: false,
      color: Colors.white,
      home: SplashView(),
    );
  }
}
