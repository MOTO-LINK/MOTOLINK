import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/custom_button.dart';
import 'package:moto/rider/auth/widgets/inputCodeOTP.dart';

class VerficodePage extends StatelessWidget {
  const VerficodePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: CustomAppBar(
        title:
            "Recover your password!\nYou will receive a message\ncontaining a secret code to\nconfirm your phone number.",
        imagePath: "assets/images/DELIVERY.png",
        appBarHeight: 150,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.all(12),
            child: Column(
              children: [
                SizedBox(height: 120),
                Container(
                  margin: EdgeInsets.symmetric(horizontal: 70, vertical: 50),
                  child: RichText(
                    text: TextSpan(
                      style: TextStyle(
                        color: ColorsApp().primaryColor,
                        fontSize: 20,
                      ),
                      children: [TextSpan(text: "Enter the secret code.")],
                    ),
                  ),
                ),
                SizedBox(
                  width: 250,
                  height: 60,
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
                SizedBox(height: 6),
                TextButton(
                  onPressed: () {},
                  child: Text(
                    "Resend code",
                    style: TextStyle(color: ColorsApp().primaryColor),
                  ),
                ),
                SizedBox(height: 20),
                CustomButton(txt: "Next", nameNextPage: "Enter_New_Pass_Page"),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
