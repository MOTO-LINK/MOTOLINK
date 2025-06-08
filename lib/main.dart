import 'package:flutter/material.dart';
import 'package:moto/general/DeliveryRequestPage/wasl.dart';
import 'package:moto/general/onboardingPages/boarding1.dart';
import 'package:moto/general/onboardingPages/boarding2.dart';
import 'package:moto/general/onboardingPages/boarding3.dart';
import 'package:moto/general/splashPage/splash_page.dart';
import 'package:moto/rider/auth/pages/LoginRiderPage.dart';
import 'package:moto/rider/auth/pages/SignupRiderPage.dart';

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

        //rider pages
        "Signup_Rider_Page": (context) => SignupRiderPage(),
        "Login_Rider_Page": (context) => LoginRiderPage(),
        //"home_page_rider": (context) => HomePageRider(),*/

        // driver pages
        /*"driver_sign_up": (context) => DriverSignUp(),
        "driver_login": (context) => DriverLogin(),*/
      },
      debugShowCheckedModeBanner: false,
      color: Colors.white,
      home: LoginRiderPage(),
    );
  }
}
