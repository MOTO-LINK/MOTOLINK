import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/pages/SignupDriverPage.dart';
import 'package:moto/driver/auth/pages/decision_page.dart';
import 'package:moto/driver/auth/pages/password/ForgotPassPageDR.dart';
import 'package:moto/general/core/models/login_response_model.dart';
import 'package:moto/general/core/service/auth_service.dart';
import 'package:moto/general/core/service/storage_service.dart';
import 'package:moto/rider/auth/widgets/customText.dart';
import 'package:moto/rider/home/dafualthome.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginDriverPage extends StatefulWidget {
  const LoginDriverPage({super.key});

  @override
  State<LoginDriverPage> createState() => _LoginRiderPageState();
}

class _LoginRiderPageState extends State<LoginDriverPage> {
  bool isVisabilty = true;
  bool isLoading = false;
  String? password;
  String? phoneNumber;

  final GlobalKey<FormState> formState = GlobalKey();
  final AuthService _authService = AuthService();
  final StorageService storageService = StorageService();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return ModalProgressHUD(
      inAsyncCall: isLoading,
      child: Scaffold(
        backgroundColor: ColorsApp().backgroundColor,
        appBar: CustomAppBar(
          title: "Welcome, log in.",
          imagePath: "assets/images/DELIVERY.png",
          appBarHeight: 110,
          onBackPressed: () {},
        ),
        body: Padding(
          padding: const EdgeInsets.all(15),
          child: SingleChildScrollView(
            child: Form(
              key: formState,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "*Phone Number",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 5),
                  CustomText(
                    controller: _phoneController,
                    hintTxt: "Enter your Phone Number",
                    icon: Icon(Icons.call, color: Color(0xFFB5022F)),
                    textInputType: TextInputType.phone,
                    validatorEdit: (value) {
                      if (value == null || value.isEmpty) {
                        return "Phone Number is required";
                      }
                      if (value.length < 10) {
                        return "Phone Number must be at least 10 digits";
                      }
                      return null;
                    },
                    onChanged: (data) {
                      phoneNumber = data;
                    },
                  ),

                  SizedBox(height: 10),
                  Text(
                    "*Password",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 5),
                  TextFormField(
                    controller: _passwordController,
                    decoration: InputDecoration(
                      hintText: "Enter your Password",
                      hintStyle: TextStyle(color: Colors.grey),
                      prefixIcon: Icon(
                        FontAwesomeIcons.userLock,
                        color: Color(0xFFB5022F),
                        size: 20,
                      ),
                      suffixIcon: IconButton(
                        onPressed: () {
                          setState(() {
                            isVisabilty = !isVisabilty;
                          });
                        },
                        icon: Icon(
                          isVisabilty
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          color: Color(0xFFB5022F),
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: Colors.grey, width: 2),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: Color(0xFFB5022F),
                          width: 2,
                        ),
                      ),
                    ),
                    keyboardType: TextInputType.text,
                    obscureText: isVisabilty,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Password is required";
                      }
                      if (value.length < 6) {
                        return "Password must be at least 6 characters";
                      }
                      return null;
                    },
                    onChanged: (data) {
                      password = data;
                    },
                  ),

                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ForgotpassPageDR(),
                          ),
                        );
                      },
                      child: Text(
                        "Forgot Password ?",
                        style: TextStyle(color: Color(0xFFB5022F)),
                      ),
                    ),
                  ),
                  SizedBox(height: 350),
                  GestureDetector(
                    onTap: _handleLoginDriver,
                    child: Container(
                      width: double.infinity,
                      height: 55,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFFB5022F), Colors.black],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Center(
                        child: Text(
                          "Login",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),

                  SizedBox(height: 5),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Don't have an account?",
                        style: TextStyle(color: Colors.black),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const SignupDriverPage(),
                            ),
                          );
                        },
                        child: const Text(
                          "Sign Up",
                          style: TextStyle(
                            color: Color(0xFFB5022F),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _handleLoginDriver() async {
    if (formState.currentState!.validate()) {
      setState(() => isLoading = true);
      try {
        final response = await _authService.login(
          phone: _phoneController.text.trim(),
          password: _passwordController.text.trim(),
        );

        if (!mounted) return;

        if (response is LoginResponseModel) {
          await storageService.saveLoginSession(response);
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const DecisionPage()),
          );
        } else if (response is LoginErrorResponse) {
          CustomSnackBar(context, 'ERROR: ${response.error.message}');
        } else {
          CustomSnackBar(context, 'ERROR');
        }
      } catch (e) {
        CustomSnackBar(context, 'حدث خطأ. الرجاء المحاولة مرة أخرى.');
        print("Login Exception: $e");
      } finally {
        if (mounted) {
          setState(() => isLoading = false);
        }
      }
    }
  }
}
