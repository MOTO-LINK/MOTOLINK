import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/rider/auth/widgets/api.dart';

class ForgotpassPage extends StatefulWidget {
  const ForgotpassPage({super.key});

  @override
  State<ForgotpassPage> createState() => _ConfirmPassState();
}

class _ConfirmPassState extends State<ForgotpassPage> {
  final Api api = Api();
  final _formKey = GlobalKey<FormState>();
  bool isPhoneValid = false;

  void _validatePhone(String value) {
    final isValid = value.isNotEmpty && value.length >= 10;
    if (isPhoneValid != isValid) {
      setState(() {
        isPhoneValid = isValid;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title:
            "Recover your password!\nYou will receive a message\ncontaining a secret code to\nconfirm your phone number.",
        imagePath: "assets/images/DELIVERY.png",
        appBarHeight: 150,
      ),
      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "*Phone Number",
                style: TextStyle(fontWeight: FontWeight.bold),
                textAlign: TextAlign.start,
              ),
              SizedBox(height: 5),
              TextFormField(
                controller: api.phoneNumberRider,
                decoration: InputDecoration(
                  hintText: "Enter your Phone Number",
                  hintStyle: TextStyle(color: Colors.grey),
                  prefixIcon: Icon(Icons.call, color: Color(0xFFB5022F)),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey, width: 2),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Color(0xFFB5022F), width: 2),
                  ),
                  suffixIcon: GestureDetector(
                    onTap:
                        isPhoneValid
                            ? () {
                              if (_formKey.currentState!.validate()) {
                                Navigator.pushNamed(
                                  context,
                                  "Verfication_Page",
                                );
                              }
                            }
                            : null,
                    child: Padding(
                      padding: EdgeInsets.symmetric(
                        horizontal: 15,
                        vertical: 10,
                      ),
                      child: Text(
                        "Send",
                        style: TextStyle(
                          color: isPhoneValid ? Color(0xFFB5022F) : Colors.grey,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Phone Number is required";
                  }
                  if (value.length < 10) {
                    return "Phone Number must be at least 10 digits";
                  }
                  return null;
                },
                onChanged: _validatePhone,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
