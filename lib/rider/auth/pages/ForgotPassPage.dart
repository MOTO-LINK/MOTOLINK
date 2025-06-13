import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/general/core/service/auth_service.dart';

class ForgotpassPage extends StatefulWidget {
  const ForgotpassPage({super.key});

  @override
  State<ForgotpassPage> createState() => _ForgotPassPageState();
}

class _ForgotPassPageState extends State<ForgotpassPage> {
  final _formKey = GlobalKey<FormState>();
  final AuthService _authService = AuthService();
  final TextEditingController _phoneController = TextEditingController();

  bool isPhoneValid = false;

  void _validatePhone(String value) {
    final isValid =
        value.isNotEmpty && value.length == 11 && value.startsWith("01");
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
        onBackPressed: () {},
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
                controller: _phoneController,
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
                            ? () async {
                              if (_formKey.currentState!.validate()) {
                                final phone = _phoneController.text;
                                final response = await _authService
                                    .forgotPassword(phone);

                                if (response["success"] == true) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(
                                        response["message"] ?? "Success",
                                      ),
                                    ),
                                  );
                                  Navigator.pushNamed(
                                    context,
                                    "Verfication_Page",
                                    arguments: {"phone": _phoneController.text},
                                  );
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text("Phone number not found"),
                                    ),
                                  );
                                }
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
