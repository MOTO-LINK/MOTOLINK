import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/widgets/Botton.dart';
import 'package:moto/driver/auth/widgets/UploadImageBox.dart';
import 'package:moto/driver/auth/widgets/national_id_input.dart';

// الرخصه
class DriverLicensePage extends StatefulWidget {
  const DriverLicensePage({super.key});

  @override
  State<DriverLicensePage> createState() => _DriverLicensePageState();
}

class _DriverLicensePageState extends State<DriverLicensePage> {
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
        title: "Driver's License",
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
                "Upload a driver's license Photo",
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
              NationalIdInput(
                labtext: 'License Number',
                controller: licenseNumberController,
              ),
              const SizedBox(height: 40),
              // The CustomButton is now used directly here
              const SizedBox(height: 200),

              Button(
                text: 'Next',
                onPressed: () {
                  if (licenseImage != null &&
                      licenseNumberController.text.isNotEmpty) {
                    // Proceed to next step
                  } else {
                    CustomSnackBar(
                      context,
                      'Please upload the photo and enter the license number',
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


