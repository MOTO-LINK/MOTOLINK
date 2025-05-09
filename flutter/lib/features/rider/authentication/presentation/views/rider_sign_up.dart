import 'package:flutter/material.dart';
import '../../../../../core/utils/colors_palette.dart';
import '../../../../../core/widgets/custom_app_bar.dart';
import '../../../../../core/widgets/custom_birthday_part.dart';
import '../../../../../core/widgets/custom_button.dart';
import '../../../../../core/widgets/custom_text_field.dart';
import '../../../../../core/widgets/custom_welcome_part.dart';
import '../../../../../core/widgets/select_gender.dart';

class RiderSignUp extends StatelessWidget {
  const RiderSignUp({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        txt: 'Sign Up',
      ),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              //CustomWelcomePart(),
              Row(
                children: [
                  Text(
                    "Welcome to ",
                    style: TextStyle(color: ColorsApp.main, fontSize: 30),
                  ),
                  Text(
                    "MotoLink",
                    style: TextStyle(color: ColorsApp.second, fontSize: 30),
                  ),
                ],
              ),
              SizedBox(
                height: 4,
              ),
              Row(
                children: [
                  Text(
                    "Join our community today",
                    style: TextStyle(color: Color(0xffA7A7A7), fontSize: 20),
                  ),
                ],
              ),
              SizedBox(
                height: 10,
              ),
              Row(
                children: [
                  Container(
                    height: 10,
                    width: 120,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      color: ColorsApp.main,
                    ),
                  ),
                  SizedBox(width: 6),
                  Container(
                    height: 10,
                    width: 120,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      color: ColorsApp.second,
                    ),
                  ),
                  SizedBox(width: 6),
                  Container(
                    height: 10,
                    width: 120,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      color: ColorsApp.main,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 50),
              CustomTextField(
                hint: "Enter your Full Name",
                label: "Full Name",
                keyboardType: TextInputType.name,
              ),
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
              const SizedBox(height: 20),
              CustomBirthdayPart(),
              const SizedBox(height: 20),
              Center(
                child: CustomButton(
                  txt: "Continue",
                  nameNextPage: "verification_page",
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Already have an account?",
                      style: TextStyle(fontSize: 15)),
                  Text(
                    " Login",
                    style: TextStyle(
                      color: ColorsApp.second,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
              const SizedBox(
                height: 50,
              )
            ],
          ),
        ),
      ),
    );
  }
}
