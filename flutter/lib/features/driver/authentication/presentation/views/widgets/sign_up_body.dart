import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';

import '../../../../../../core/widgets/custom_birthday_part.dart';
import '../../../../../../core/widgets/custom_button.dart';
import '../../../../../../core/widgets/custom_name_field.dart';
import '../../../../../../core/widgets/custom_password_field.dart';
import '../../../../../../core/widgets/custom_phone_field.dart';
import '../../../../../../core/widgets/custom_welcome_part.dart';
import '../../../../../../core/widgets/select_gender.dart';

class DriverSignUpBody extends StatefulWidget {
  const DriverSignUpBody({super.key});

  @override
  State<DriverSignUpBody> createState() => _DriverSignUpBodyState();
}

class _DriverSignUpBodyState extends State<DriverSignUpBody> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CustomWelcomePart(),
            const SizedBox(height: 50),
            CustomNameField(hint: "Enter your Full Name", label: "Full Name",keyboardType:TextInputType.name),
            const SizedBox(
              height: 35,
            ),
            CustomPhoneField(),
            const SizedBox(
              height: 35,
            ),
            CustomPasswordField(),
            const SizedBox(height: 35),
            SelectGender(),

            const SizedBox(height: 15),
            const Text("Enter registration data", style: TextStyle(fontWeight: FontWeight.w600,fontSize: 20),),
            const SizedBox(height: 10),
            const Text("You must meet the terms and conditions and any dispute will expose you to accountability.",
              style: TextStyle(fontWeight: FontWeight.w400,fontSize: 12,color: Color(0xff9F9F9F)),),
            const SizedBox(
              height: 30,
            ),
            CustomNameField(hint: "Enter your National ID", label: "National ID",keyboardType:TextInputType.number),


            const SizedBox(
              height: 30,
            ),
            TextField(
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                  enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Color(0xffBEB58F))),
                  focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Color(0xffBEB58F))),
                  hintStyle: const TextStyle(
                      color: Color(0xff696969),
                      fontSize: 13,
                      fontWeight: FontWeight.w400),
                  labelText: "Machine number",
                  hintText: "Enter your National Machine number",
                  suffixIcon: const Icon(Icons.qr_code_scanner)

              ),
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
    );
  }
}
