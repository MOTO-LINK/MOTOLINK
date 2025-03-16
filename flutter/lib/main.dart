import 'package:flutter/material.dart';
import 'package:motolink/features/general/profile_page/presentation/views/payment_method_view.dart';
import 'package:motolink/features/general/profile_page/presentation/views/personal_details_view.dart';
import 'package:motolink/features/general/splash_view/presentation/views/splash_view.dart';
import 'package:motolink/features/rider/authentication/presentation/views/rider_sign_up.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        debugShowCheckedModeBanner: false, theme: ThemeData.dark(),
      home: PaymentMethodView(),
    );

  }
}
