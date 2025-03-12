import 'package:flutter/material.dart';
import 'package:motolink/features/rider/authentication/presentation/views/widgets/sign_up_body.dart';

import '../../../../../core/widgets/custom_app_bar.dart';

class RiderSignUp extends StatelessWidget {
  const RiderSignUp({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:CustomAppBar(txt: 'Sign Up',),
      body: RiderSignUpBody(),
    );
  }
}
