import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/core/widgets/custom_button.dart';
import 'package:moto/general/core/models/login_response_model.dart';
import 'package:moto/general/core/service/auth_service.dart';

class VerficodePage extends StatefulWidget {
  const VerficodePage({super.key});

  @override
  State<VerficodePage> createState() => _VerficodePageState();
}

class _VerficodePageState extends State<VerficodePage> {
  final TextEditingController codeController = TextEditingController();

  late String phone;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as Map?;
    phone = args?['phone'] ?? '';
    print("Phone received in VerficodePage: $phone");
    if (phone.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Phone number is missing.")));
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      resizeToAvoidBottomInset: true,
      appBar: CustomAppBar(
        title:
            "Recover your password!\nYou will receive a message\ncontaining a secret code to\nconfirm your phone number.",
        imagePath: "assets/images/DELIVERY.png",
        appBarHeight: 150,
        onBackPressed: () {},
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
                      Expanded(
                        child: TextFormField(
                          controller: codeController,
                          maxLength: 6,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(hintText: "Enter code"),
                        ),
                      ),
                    ],
                  ),
                ),

                /*SizedBox(
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
                ),*/
                /*SizedBox(height: 6),
                TextButton(
                  onPressed: () {},
                  child: Text(
                    "Resend code",
                    style: TextStyle(color: ColorsApp().primaryColor),
                  ),
                ),
                SizedBox(height: 20),
                CustomButton(txt: "Next", nameNextPage: "Enter_New_Pass_Page"),
              */
                CustomButton(
                  txt: "Next",
                  nameNextPage: "",
                  onPressed: () async {
                    if (codeController.text.length != 6) {
                      CustomSnackBar(context, "Please enter the 6-digit code.");
                      return;
                    }
                    final auth = AuthService();
                    final result = await auth.verify(
                      phone: phone,
                      code: codeController.text,
                    );
                    if (result is String) {
                      CustomSnackBar(context, "Phone verified successfully!");
                      Navigator.pushReplacementNamed(
                        context,
                        "Login_Rider_Page",
                      );
                    } else if (result is LoginErrorResponse) {
                      CustomSnackBar(context, result.error.message);
                    } else {
                      CustomSnackBar(context, "Unexpected error occurred.");
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
