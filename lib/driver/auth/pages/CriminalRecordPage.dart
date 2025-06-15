import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/widgets/UploadImageBox.dart';

// الرخصه
class CriminalRecordPage extends StatefulWidget {
  const CriminalRecordPage({super.key});

  @override
  State<CriminalRecordPage> createState() => _CriminalRecordPageState();
}

class _CriminalRecordPageState extends State<CriminalRecordPage> {
  final TextEditingController licenseNumberController = TextEditingController();
  File? licenseImage;
  final ImagePicker _picker = ImagePicker();

  Future<void> pickImage() async {
    try {
      final pickedFile = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80,
      );
      if (pickedFile != null) {
        setState(() {
          licenseImage = File(pickedFile.path);
        });
      }
    } on PlatformException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to pick image: ${e.message}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = ColorsApp();

    return Scaffold(
      backgroundColor: colors.backgroundColor,
      appBar: CustomAppBar(
        title: "Criminal Record",
        onBackPressed: () {},
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Upload a Criminal Record Photo",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              const SizedBox(height: 8),
              const Text(
                "Ensure that all data is readable, not blurry, and that all corners of the document are visible.",
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 30),
              Center(
                child: ImageUploadBox(
                  title: "Upload license photo",
                  image: licenseImage,
                  onTap: () => pickImage(),
                  primaryColor: colors.secondaryColor,
                  width: MediaQuery.of(context).size.width * 0.5,
                  icon: Icons.credit_card_outlined,
                ),
              ),
              const SizedBox(height: 30),
              // The CustomButton is now used directly here
              const SizedBox(height: 250),

              Button(
                text: 'Next',
                onPressed: () {
                  if (licenseImage != null) {
                    // Proceed to next step
                  } else {
                    CustomSnackBar(
                      context,
                      'Please upload the photo and enter the Criminal Record',
                    );
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class Button extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color? textColor;
  final double? width;
  final double height;

  const Button({
    super.key,
    required this.text,
    required this.onPressed,
    this.textColor,
    this.width,
    this.height = 50.0,
  });

  @override
  Widget build(BuildContext context) {
    final buttonTextColor = textColor ?? Colors.white;

    return Container(
      width: width ?? double.infinity,
      height: height,
      decoration: BoxDecoration(
        // The gradient you requested is applied here.
        gradient: const LinearGradient(
          colors: [Color(0xFFB5022F), Colors.black],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(12),
          child: Center(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: buttonTextColor,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
