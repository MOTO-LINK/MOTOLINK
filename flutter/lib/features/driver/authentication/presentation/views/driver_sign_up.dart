import 'package:flutter/material.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import 'package:motolink/features/driver/authentication/presentation/views/widgets/sign_up_body.dart';

class DriverSignUpSignUp extends StatelessWidget {
  const DriverSignUpSignUp({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:CustomAppBar(txt: 'Sign Up',),
      body: DriverSignUpBody(),
    );
  }
}
