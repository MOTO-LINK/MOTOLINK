import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/pages/LoginDriverPage.dart';
import 'package:moto/general/core/service/auth_service.dart';

class ResetPassPageDR extends StatefulWidget {
  final String phone;
  final String code;

  const ResetPassPageDR({super.key, required this.phone, required this.code});

  @override
  State<ResetPassPageDR> createState() => _ResetPassPageDRState();
}

class _ResetPassPageDRState extends State<ResetPassPageDR> {
  final _formKey = GlobalKey<FormState>();
  final AuthService _authService = AuthService();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  bool _isLoading = false;

  Future<void> _resetPassword() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    final success = await _authService.resetPassword(
      phone: widget.phone,
      code: widget.code,
      newPassword: _passwordController.text,
    );
    if (!mounted) return;

    if (success) {
      CustomSnackBar(
        context,
        "Your password has been changed successfully. Please log in."
      );
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const LoginDriverPage()),
        (route) => false,
      );
    } else {
CustomSnackBar(context, "Password change failed. The code may be incorrect.");    }
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "New password",
        imagePath: "assets/images/DELIVERY.png",
        onBackPressed: () {},
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: "New password"),
                validator:
                    (value) =>
                        value!.length < 6
                            ? "Must not be less than 6 characters"
                            : null,
              ),
              const SizedBox(height: 10),
              TextFormField(
                controller: _confirmPasswordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: "Confirm password",
                ),
                validator:
                    (value) =>
                        value != _passwordController.text
                            ? "The passwords do not match."
                            : null,
              ),
              const SizedBox(height: 30),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                    onPressed: _resetPassword,
                    child: const Text("Next"),
                  ),
            ],
          ),
        ),
      ),
    );
  }
}
