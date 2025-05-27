import 'package:flutter/material.dart';
import 'package:moto/general/onboardingPages/boarding1.dart';
import 'package:moto/general/onboardingPages/boarding2.dart';
import 'package:moto/general/onboardingPages/boarding3.dart';
import 'package:moto/general/splashPage/splash_page.dart';

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
        //"chooseRiderOrDriverPage": (context) => SelectUserType(),
        // "verification_page": (context) => VerficodePage(),

        // rider pages
        /*"rider_sign_up": (context) => RiderSignUp(),
        "rider_login": (context) => RiderLogin(),
        "home_page_rider": (context) => HomePageRider(),*/

        // driver pages
        /*"driver_sign_up": (context) => DriverSignUp(),
        "driver_login": (context) => DriverLogin(),*/
      },
      debugShowCheckedModeBanner: false,
      color: Colors.white,
      home: SplashView(),
    );
  }
}
