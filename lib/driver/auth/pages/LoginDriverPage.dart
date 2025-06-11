import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/utils/showSnackBar.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomGoogleField.dart';
import 'package:moto/rider/auth/widgets/api.dart';
import 'package:moto/rider/auth/widgets/customText.dart';

class LoginDriverPage extends StatefulWidget {
  const LoginDriverPage({super.key});

  @override
  State<LoginDriverPage> createState() => _LoginRiderPageState();
}

class _LoginRiderPageState extends State<LoginDriverPage> {
  bool isVisabilty = true;
  bool isLoading = false;
  String? email;
  String? password;
  String? phoneNumber;

  final Api api = Api();
  final GlobalKey<FormState> formState = GlobalKey();

  @override
  Widget build(BuildContext context) {
    return ModalProgressHUD(
      inAsyncCall: isLoading,
      child: Scaffold(
        backgroundColor: ColorsApp().backgroundColor,
        appBar: CustomAppBar(
          title: "Welcome, log in.",
          imagePath: "assets/images/DELIVERY.png",
          appBarHeight: 110, onBackPressed: () {  },
          //icon: FontAwesomeIcons.arrowLeft,
          /*onIconPressed: () {
            Navigator.pop(context);
          },*/
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
                    controller: api.phoneNumberLoginRider,
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
                  Text("*Email", style: TextStyle(fontWeight: FontWeight.bold)),
                  SizedBox(height: 5),
                  CustomText(
                    controller: api.emailLoginRider,
                    hintTxt: "Enter your Email",
                    icon: Icon(
                      FontAwesomeIcons.solidEnvelope,
                      color: Color(0xFFB5022F),
                    ),
                    textInputType: TextInputType.emailAddress,
                    validatorEdit: (value) {
                      if (value == null || value.isEmpty) {
                        return "Email is required";
                      }
                      if (!value.contains('@')) {
                        return "Enter a valid email must contain '@'";
                      }
                      return null;
                    },
                    onChanged: (data) {
                      email = data;
                    },
                  ),
                  SizedBox(height: 10),

                  Text(
                    "*Password",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 5),
                  TextFormField(
                    controller: api.passwordLoginRider,
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
                        icon:
                            isVisabilty == false
                                ? const Icon(
                                  Icons.visibility_off_outlined,
                                  color: Color(0xFFB5022F),
                                )
                                : const Icon(
                                  Icons.visibility_outlined,
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
                        Navigator.pushNamed(context, "Forgot_Pass_Page");
                      },
                      child: Text(
                        "Forgot Password ?",
                        style: TextStyle(color: Color(0xFFB5022F)),
                      ),
                    ),
                  ),
                  SizedBox(height: 40),

                  GestureDetector(
                    onTap: () async {
                      // Navigator.pushNamed(context, "home_page_rider");

                      if (formState.currentState!.validate()) {
                        //api.ip = "";
                        setState(() {
                          isLoading = true;
                        });
                        await api.loginRider();
                        showSnackBar(context, 'Login Successful');
                        try {
                          //هدخل الداتا بتاعتي الايميل والباس
                          UserCredential user = await FirebaseAuth.instance
                              .signInWithEmailAndPassword(
                                email: email!,
                                password: password!,
                              );
                          print(user);
                          //Navigator.pushReplacementNamed(context, ChatPage.id,
                          // arguments: email);
                        } on FirebaseAuthException catch (ex) {
                          setState(() {
                            isLoading = false;
                          });
                          if (ex.code == 'user-not-found') {
                            showSnackBar(
                              context,
                              'No user found for that email.',
                            );
                          } else if (ex.code == 'wrong-password') {
                            showSnackBar(
                              context,
                              'Wrong password provided for that user.',
                            );
                          } else {
                            showSnackBar(
                              context,
                              'Authentication error: ${ex.message}',
                            );
                          }
                        } catch (ex) {
                          setState(() {
                            isLoading = false;
                          });
                          // showSnackBar(context, 'There was an Error.');
                        }
                        Navigator.pushNamed(context, "home_page_dafult");
                      }
                    },
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

                  SizedBox(height: 20),

                  CustomGoogle(),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Don't have an account?",
                        style: TextStyle(color: Colors.black),
                      ),

                      TextButton(
                        onPressed: () {
                          Navigator.of(context).pushNamed("Signup_driver_page");
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
}
