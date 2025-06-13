import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/general/core/service/auth_service.dart';

class ResetPassPage extends StatefulWidget {
  const ResetPassPage({super.key});

  @override
  State<ResetPassPage> createState() => _ResetPassPageState();
}

class _ResetPassPageState extends State<ResetPassPage> {
  bool isVisabilty1 = true;
  bool isVisabilty2 = true;
  String? password;
  String? confirmPassword;
  late String phone;
  late String code;

  final GlobalKey<FormState> formState = GlobalKey();
  final AuthService _authService = AuthService();
  final TextEditingController newPasswordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)!.settings.arguments as Map?;
    phone = args?['phone'] ?? '';
    code = args?['code'] ?? '';
    print("Reset page received phone: $phone, code: $code");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "New Password!\nCreate a new password",
        imagePath: "assets/images/DELIVERY.png",
        appBarHeight: 150,
        onBackPressed: () {},
      ),
      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Form(
          key: formState,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "*New Password",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 5),
              TextFormField(
                controller: newPasswordController,
                decoration: InputDecoration(
                  hintText: "Enter your New Password",
                  hintStyle: TextStyle(color: Colors.grey),
                  prefixIcon: Icon(
                    FontAwesomeIcons.userLock,
                    color: Color(0xFFB5022F),
                    size: 20,
                  ),
                  suffixIcon: IconButton(
                    onPressed: () {
                      setState(() {
                        isVisabilty1 = !isVisabilty1;
                      });
                    },
                    icon:
                        isVisabilty1 == false
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
                    borderSide: BorderSide(color: Color(0xFFB5022F), width: 2),
                  ),
                ),
                keyboardType: TextInputType.text,
                obscureText: isVisabilty1,
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

              SizedBox(height: 15),

              Text(
                "*Confirm New password",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 5),
              TextFormField(
                controller: confirmPasswordController,
                decoration: InputDecoration(
                  hintText: "Enter your New Password",
                  hintStyle: TextStyle(color: Colors.grey),
                  prefixIcon: Icon(
                    FontAwesomeIcons.userLock,
                    color: Color(0xFFB5022F),
                    size: 20,
                  ),
                  suffixIcon: IconButton(
                    onPressed: () {
                      setState(() {
                        isVisabilty2 = !isVisabilty2;
                      });
                    },
                    icon:
                        isVisabilty2 == false
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
                    borderSide: BorderSide(color: Color(0xFFB5022F), width: 2),
                  ),
                ),
                keyboardType: TextInputType.text,
                obscureText: isVisabilty2,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Confirm password is required";
                  }
                  if (value != newPasswordController.text) {
                    return "Passwords do not match";
                  }
                  return null;
                },
                onChanged: (data) {
                  confirmPassword = data;
                },
              ),

              SizedBox(height: 50),

              GestureDetector(
                onTap: () async {
                  if (formState.currentState!.validate()) {
                    print(
                      "Sending to backend => phone: $phone, code: $code, newPassword: ${newPasswordController.text}",
                    );
                    /*ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text("phone: $phone, code: $code"),
                        duration: Duration(seconds: 3),
                      ),
                    );*/
                    final success = await _authService.resetPassword(
                      phone: phone,
                      code: code,
                      newPassword: newPasswordController.text,
                    );
                    if (success) {
                      Navigator.of(context).pushNamed("Login_Rider_Page");
                    } else {
                      CustomSnackBar(context, "Reset password failed");
                    }
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
                      "Next",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
