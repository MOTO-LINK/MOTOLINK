import 'package:flutter/material.dart';
import '../../../../../../core/utils/colors_palette.dart';
import '../../../../../../core/widgets/custom_birthday_part.dart';
import '../../../../../../core/widgets/custom_button.dart';
import '../../../../../../core/widgets/custom_name_field.dart';
import '../../../../../../core/widgets/custom_password_field.dart';
import '../../../../../../core/widgets/custom_phone_field.dart';
import '../../../../../../core/widgets/custom_welcome_part.dart';
import '../../../../../../core/widgets/select_gender.dart';

class RiderSignUpBody extends StatelessWidget {
  const RiderSignUpBody({super.key});

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
            CustomNameField(hint: "Enter your Full Name", label: "Full Name",keyboardType:TextInputType.name,),
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
