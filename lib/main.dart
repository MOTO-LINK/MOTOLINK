import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:moto/driver/auth/pages/LoginDriverPage.dart';
import 'package:moto/driver/auth/pages/SignupDriverPage.dart';
import 'package:moto/driver/wallet/pages/accounts_page.dart';
import 'package:moto/general/DeliveryRequestPage/wasl.dart';
import 'package:moto/general/SelectUserTypePage.dart';
import 'package:moto/general/map/utils/views/PickupLocation.dart';
import 'package:moto/general/map/utils/views/adresses.dart';
import 'package:moto/general/map/utils/widgets/custom_google_map.dart';
import 'package:moto/general/map/utils/widgets/google_map_view.dart';
import 'package:moto/general/onboardingPages/boarding1.dart';
import 'package:moto/general/onboardingPages/boarding2.dart';
import 'package:moto/general/onboardingPages/boarding3.dart';
import 'package:moto/general/splashPage/splash_page.dart';
import 'package:moto/rider/auth/pages/LoginRiderPage.dart';
import 'package:moto/rider/auth/pages/SignupRiderPage.dart';
import 'package:moto/rider/auth/pages/ResetPassPage.dart';
import 'package:moto/rider/auth/pages/VerficationPage.dart';
import 'package:moto/rider/auth/pages/forgotPassPage.dart';
import 'package:moto/rider/home/dafualthome.dart';

import 'driver/wallet/controller/wallet_cubit.dart';
import 'driver/wallet/pages/commetion_page.dart';
import 'driver/wallet/pages/dues_page.dart';
import 'driver/wallet/pages/order_page.dart';

void main() {
  runApp(MultiBlocProvider(
    providers: [
      BlocProvider(create: (_) => WalletCubit()),
    ],
    child: const MyApp(),
  ),);
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
        "Forgot_Pass_Page": (context) => ForgotpassPage(),
        "Enter_New_Pass_Page": (context) => ResetPassPage(),
        "Verfication_Page": (context) => VerficodePage(),

        "home_page_dafult": (context) => homePageDAFUALT(),
        "Rider_OR_Driver": (context) => SelectUserType(),

        //rider pages
        "Signup_Rider_Page": (context) => SignupRiderPage(),
        "Login_Rider_Page": (context) => LoginRiderPage(),

        // driver pages
        "Signup_driver_page": (context) => SignupDriverPage(),
        "Login_driver_page": (context) => LoginDriverPage(),
        //wallet page
        "AccountPage":(context)=>  AccountsPage(),
        "DuesPage": (context) =>  DuesPage(),
        "CommissionPage": (context) =>  CommissionPage(),
        "OrdersPage": (context) =>  OrdersPage(),
      },
      debugShowCheckedModeBanner: false,
      color: Colors.white,
      home: LoginDriverPage()
    );
  }
}
