import 'package:flutter/material.dart';
import 'package:moto/general/DeliveryRequestPage/wasl.dart';
import 'package:moto/general/onboardingPages/boarding1.dart';
import 'package:moto/general/onboardingPages/boarding2.dart';
import 'package:moto/general/onboardingPages/boarding3.dart';
import 'package:moto/general/splashPage/splash_page.dart';
import 'package:moto/rider/auth/pages/LoginRiderPage.dart';
import 'package:moto/rider/auth/pages/SignupRiderPage.dart';
import 'package:moto/rider/auth/pages/ResetPassPage.dart';
import 'package:moto/rider/auth/pages/forgotPassPage.dart';
import 'package:moto/rider/home/dafualthome.dart';

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
        "Forgot_Pass_Page": (context) => ForgotpassPage(),
        "Enter_New_Pass_Page": (context) => ResetPassPage(),
        "home_page_rider": (context) => homePageDAFUALT(),

        // driver pages
        /*"driver_sign_up": (context) => DriverSignUp(),
        "driver_login": (context) => DriverLogin(),*/
      },
      debugShowCheckedModeBanner: false,
      color: Colors.white,
      home: ResetPassPage(),
    );
  }
}
