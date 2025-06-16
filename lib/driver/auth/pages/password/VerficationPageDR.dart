import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/pages/LoginDriverPage.dart';
import 'package:moto/driver/auth/pages/password/ResetPassPageDR.dart'; // ستحتاج لإنشاء هذا الملف
import 'package:moto/general/core/models/login_response_model.dart';
import 'package:moto/general/core/service/auth_service.dart';

class VerficodePageDR extends StatefulWidget {
  final String phone;
  final bool isForPasswordReset;

  const VerficodePageDR({
    super.key,
    required this.phone,
    this.isForPasswordReset = false,
  });

  @override
  State<VerficodePageDR> createState() => _VerficodePageDRState();
}

class _VerficodePageDRState extends State<VerficodePageDR> {
  final TextEditingController codeController = TextEditingController();
  final AuthService _authService = AuthService();
  bool _isLoading = false;

  Future<void> _handleNext() async {
    if (codeController.text.length != 6) {
      CustomSnackBar(context, "Enter the 6-digit secret code");
      return;
    }
    setState(() => _isLoading = true);

    if (widget.isForPasswordReset) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder:
              (context) => ResetPassPageDR(
                phone: widget.phone,
                code: codeController.text.trim(),
              ),
        ),
      );
    } else {
      final result = await _authService.verify(
        phone: widget.phone,
        code: codeController.text.trim(),
      );

      if (!mounted) return;

      if (result is String) {
        CustomSnackBar(context, "Account activation successful! Please log in");
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const LoginDriverPage()),
          (route) => false,
        );
      } else if (result is LoginErrorResponse) {
        CustomSnackBar(context, result.error.message);
      } else {
CustomSnackBar(context, "An unexpected error occurred or the code is invalid");      }
    }
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "Activate the account",
        imagePath: "assets/images/DELIVERY.png",
        appBarHeight: 150,
        onBackPressed: () {},
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 50),
            const Text("Enter the secret code", style: TextStyle(fontSize: 20)),
            const SizedBox(height: 30),
            TextFormField(
              controller: codeController,
              maxLength: 6,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: "Enter the secret code.",
                hintText: "Enter the 6-digit secret code",
                counterText: "",
              ),
            ),
            const SizedBox(height: 40),
            _isLoading
                ? const CircularProgressIndicator()
                : GestureDetector(
                  onTap: _handleNext,
                  child: Container(
                    width: double.infinity,
                    height: 55,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFB5022F), Colors.black],
                      ),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: const Center(
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
    );
  }
}
