import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/utils/showSnackBar.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomGoogleField.dart';
import 'package:moto/rider/auth/widgets/api.dart';
import 'package:intl/intl.dart';

class SignupDriverPage extends StatefulWidget {
  const SignupDriverPage({super.key});

  @override
  State<SignupDriverPage> createState() => _SignupRiderPageState();
}

class _SignupRiderPageState extends State<SignupDriverPage> {
  bool isVisabiltyPass1 = true;
  bool isVisabiltyPass2 = true;
  String? email;
  String? password;
  String? name;
  String? phoneNumber;
  String? confirmPassword;
  bool isLoading = false;

  final Api api = Api();
  final GlobalKey<FormState> formState = GlobalKey();
  final TextEditingController _dateController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return ModalProgressHUD(
      inAsyncCall: isLoading,
      child: Scaffold(
        backgroundColor: ColorsApp().backgroundColor,
        appBar: CustomAppBar(
          title: "Welcome,\nCreate your account",
          imagePath: "assets/images/DELIVERY.png",
          appBarHeight: 110,
          //icon: FontAwesomeIcons.arrowLeft,
          /* onIconPressed: () {
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
                  Text("*Name", style: TextStyle(fontWeight: FontWeight.bold)),
                  SizedBox(height: 5),
                  TextFormField(
                    //controller: api.nameRider,
                    decoration: InputDecoration(
                      hintText: "Enter your Name",
                      hintStyle: TextStyle(color: Colors.grey),
                      prefixIcon: Icon(
                        FontAwesomeIcons.solidCircleUser,
                        color: Color(0xFFB5022F),
                        size: 20,
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
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Name is required";
                      }
                      return null;
                    },
                    onChanged: (data) {
                      name = data;
                    },
                  ),
                  SizedBox(height: 10),

                  Text(
                    "*Phone Number",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 5),
                  TextFormField(
                    //controller: api.phoneNumberRider,
                    decoration: InputDecoration(
                      hintText: "Enter your Phone Number",
                      hintStyle: TextStyle(color: Colors.grey),
                      prefixIcon: Icon(
                        FontAwesomeIcons.mobileScreenButton,
                        color: Color(0xFFB5022F),
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
                    onChanged: (data) {
                      phoneNumber = data;
                    },
                  ),
                  SizedBox(height: 10),

                  Text("*Email", style: TextStyle(fontWeight: FontWeight.bold)),
                  SizedBox(height: 5),
                  TextFormField(
                    //controller: api.emailRider,
                    decoration: InputDecoration(
                      hintText: "Enter your Email",
                      hintStyle: TextStyle(color: Colors.grey),
                      prefixIcon: Icon(
                        FontAwesomeIcons.solidEnvelope,
                        color: Color(0xFFB5022F),
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
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) {
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
                    "*Date of Birth",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 5),
                  TextFormField(
                    //controller: api.emailRider,
                    controller: _dateController,

                    readOnly: true,
                    decoration: InputDecoration(
                      hintText: "Enter your date of birth",
                      hintStyle: TextStyle(color: Colors.grey),
                      prefixIcon: Icon(
                        FontAwesomeIcons.calendarDays,
                        color: Color(0xFFB5022F),
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
                    keyboardType: TextInputType.datetime,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Date of birth is required";
                      }
                      return null;
                    },
                    onChanged: (data) {
                      email = data;
                    },
                    onTap: () async {
                      DateTime? picked = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now(),
                        firstDate: DateTime(1900),
                        lastDate: DateTime.now(),
                      );
                      if (picked != null) {
                        setState(() {
                          _dateController.text = DateFormat(
                            'dd/MM/yyyy',
                          ).format(picked);
                        });
                      }
                    },
                  ),
                  SizedBox(height: 10),

                  Text(
                    "*Password",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 5),
                  TextFormField(
                    //controller: api.passwordRider,
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
                            isVisabiltyPass1 = !isVisabiltyPass1;
                          });
                        },
                        icon:
                            isVisabiltyPass1 == false
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
                    obscureText: isVisabiltyPass1,
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

                  SizedBox(height: 10),

                  Text(
                    "*Confirm the password",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 5),
                  TextFormField(
                    //controller: api.confirmPasswordRider,
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
                            isVisabiltyPass2 = !isVisabiltyPass2;
                          });
                        },
                        icon:
                            isVisabiltyPass2 == false
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
                    obscureText: isVisabiltyPass2,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Confirm password is required";
                      }
                      if (value != api.passwordRider.text) {
                        return "Passwords do not match";
                      }
                      return null;
                    },
                    onChanged: (data) {
                      confirmPassword = data;
                    },
                  ),

                  SizedBox(height: 40),

                  GestureDetector(
                    onTap: () async {
                      if (formState.currentState!.validate()) {
                        isLoading = true;
                        setState(() {});
                        //api.ip = "http://";
                        await api.signUpRider();
                        showSnackBar(context, 'Sign Up Successful.');
                        //Navigator.pushNamed(context, "Login_driver_page");
                        try {
                          UserCredential user = await FirebaseAuth.instance
                              .createUserWithEmailAndPassword(
                                email: email!,
                                password: password!,
                              );
                          print(user);
                          Navigator.pushNamed(context, "Login_driver_page");
                        } on FirebaseAuthException catch (ex) {
                          if (ex.code == 'weak-password') {
                            showSnackBar(context, 'The password is too weak.');
                          } else if (ex.code == 'email-already-in-use') {
                            showSnackBar(
                              context,
                              'The account already used for this email.',
                            );
                          }
                        } catch (ex) {
                          //showSnackBar(context, 'Error: $ex');
                        }
                        isLoading = false;
                        setState(() {});
                        Navigator.pushNamed(context, "Login_driver_page");
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
                          "Sign Up",
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
                        "Have an account?",
                        style: TextStyle(color: Colors.black),
                      ),

                      TextButton(
                        onPressed: () {
                          Navigator.of(context).pushNamed("Login_driver_page");
                        },
                        child: Text(
                          "Login",
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
