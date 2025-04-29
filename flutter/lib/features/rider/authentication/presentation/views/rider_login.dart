import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import 'package:motolink/core/widgets/custom_button.dart';
import 'package:motolink/core/widgets/custom_text_field.dart';

class RiderLogin extends StatelessWidget {
  const RiderLogin({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: CustomAppBar(txt: "Login"),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset(
                  "assets/images/logo.jpeg",
                  height: 250,
                  width: double.infinity,
                ),
                const SizedBox(height: 10),
                CustomTextField(
                  hint: "Enter Phone Number",
                  label: "Phone Number",
                  keyboardType: TextInputType.number,
                  phoneIcon: true,
                ),
                const SizedBox(height: 35),
                CustomTextField(
                  hint: "Enter your Password",
                  label: "Password",
                  keyboardType: TextInputType.visiblePassword,
                  passwordIcon: true,
                ),
                Container(
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(top: 10, bottom: 50),
                  child: TextButton(
                    onPressed: () {},
                    child: Text(
                      "Forget password?",
                      style: TextStyle(
                        color: ColorsPalette.baseColor,
                      ),
                    ),
                  ),
                ),
                CustomButton(
                  txt: "Next",
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      "Don't have an account ?",
                      style: TextStyle(color: Colors.white),
                    ),
                    TextButton(
                      onPressed: () {},
                      child: Text(
                        "Sign up",
                        style: TextStyle(color: ColorsPalette.baseColor),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
