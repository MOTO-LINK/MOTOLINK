import 'package:flutter/material.dart';
import 'package:motolink/core/widgits/custom_app_bar.dart';
import 'package:motolink/features/driver/authentication/presentation/views/widgets/sign_in_body.dart';

class SignIn extends StatelessWidget {
  const SignIn({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:CustomAppBar(txt: 'Sign Up',),
      body: SignInBody(),
    );
  }
}
