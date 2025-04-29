import 'package:flutter/material.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import '../../../../../core/utils/colors_palette.dart';
import '../../../../../core/widgets/custom_birthday_part.dart';
import '../../../../../core/widgets/custom_button.dart';
import '../../../../../core/widgets/custom_text_field.dart';
import '../../../../../core/widgets/custom_welcome_part.dart';
import '../../../../../core/widgets/select_gender.dart';

class DriverSignUp extends StatelessWidget {
  const DriverSignUp({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: CustomAppBar(
          txt: 'Sign Up',
        ),
        body: Padding(
          padding: const EdgeInsets.all(20.0),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CustomWelcomePart(),
                const SizedBox(height: 50),
                CustomTextField(
                    hint: "Enter your Full Name",
                    label: "Full Name",
                    keyboardType: TextInputType.name),
                const SizedBox(
                  height: 35,
                ),
                CustomTextField(
                  hint: "Enter Phone Number",
                  label: "Phone Number",
                  keyboardType: TextInputType.number,
                  phoneIcon: true,
                ),
                const SizedBox(
                  height: 35,
                ),
                CustomTextField(
                  hint: "Enter your Password",
                  label: "Password",
                  keyboardType: TextInputType.visiblePassword,
                  passwordIcon: true,
                ),
                const SizedBox(height: 35),
                SelectGender(),
                const SizedBox(height: 15),
                const Text(
                  "Enter registration data",
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 20),
                ),
                const SizedBox(height: 10),
                const Text(
                  "You must meet the terms and conditions and any dispute will expose you to accountability.",
                  style: TextStyle(
                      fontWeight: FontWeight.w400,
                      fontSize: 12,
                      color: Color(0xff9F9F9F)),
                ),
                const SizedBox(
                  height: 30,
                ),
                CustomTextField(
                    hint: "Enter your National ID",
                    label: "National ID",
                    keyboardType: TextInputType.number),
                const SizedBox(
                  height: 30,
                ),
                TextField(
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                      enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide:
                              const BorderSide(color: Color(0xffBEB58F))),
                      focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide:
                              const BorderSide(color: Color(0xffBEB58F))),
                      hintStyle: const TextStyle(
                          color: Color(0xff696969),
                          fontSize: 13,
                          fontWeight: FontWeight.w400),
                      labelText: "Machine number",
                      hintText: "Enter your National Machine number",
                      suffixIcon: const Icon(Icons.qr_code_scanner)),
                ),
                const SizedBox(height: 20),
                CustomBirthdayPart(),
                const SizedBox(height: 20),
                CustomButton(txt: "Continue"),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("Already have an account?",
                        style: TextStyle(fontSize: 15)),
                    Text(
                      " Login",
                      style: const TextStyle(
                          color: ColorsPalette.baseColor, fontSize: 15),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 50,
                )
              ],
            ),
          ),
        ));
  }
}
