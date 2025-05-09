import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import 'package:motolink/core/widgets/custom_button.dart';
import 'package:motolink/features/rider/widgets/inputcode_otp.dart';

class VerficodePage extends StatelessWidget {
  const VerficodePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: CustomAppBar(txt: "Sign up"),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.all(12),
            child: Column(
              children: [
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
                      width: 130,
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
                  ],
                ),
                SizedBox(height: 130),
                Container(
                  margin: EdgeInsets.symmetric(horizontal: 70, vertical: 50),
                  child: RichText(
                    text: TextSpan(
                      style: TextStyle(color: ColorsApp.main, fontSize: 20),
                      children: [
                        TextSpan(
                            text:
                                "Please Enter the 4 digit code send to your number."),
                      ],
                    ),
                  ),
                ),
                SizedBox(
                  width: 250,
                  height: 70,
                  child: Row(
                    children: [
                      Expanded(child: InputCode(data: "start")),
                      SizedBox(width: 7),
                      Expanded(child: InputCode(data: "center")),
                      SizedBox(width: 7),
                      Expanded(child: InputCode(data: "center")),
                      SizedBox(width: 7),
                      Expanded(child: InputCode(data: "end")),
                    ],
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                CustomButton(
                  txt: "Next",
                  nameNextPage: "home_page",
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
