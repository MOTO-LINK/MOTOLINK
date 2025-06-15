import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/driver/auth/widgets/Botton.dart';
import 'package:moto/driver/auth/widgets/LicensePlate.dart';
import 'package:moto/driver/auth/widgets/UploadImageBox.dart';

class VehicleLicensePage extends StatefulWidget {
  const VehicleLicensePage({super.key});

  @override
  State<VehicleLicensePage> createState() => _VehicleLicensePageState();
}

class _VehicleLicensePageState extends State<VehicleLicensePage> {
  File? _frontImage;
  File? _backImage;
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage(bool isFront) async {
    try {
      final pickedFile = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80,
      );
      if (pickedFile != null) {
        setState(() {
          if (isFront) {
            _frontImage = File(pickedFile.path);
          } else {
            _backImage = File(pickedFile.path);
          }
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
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(title: "Vehicle License", onBackPressed: () {}),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Upload Vehicle License Photo",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              const SizedBox(height: 8),
              const Text(
                "Ensure that all data is readable, not blurry, and that all corners of the document are visible.",
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 30),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  ImageUploadBox(
                    title: "Upload Front Photo",
                    image: _frontImage,
                    onTap: () => _pickImage(true),
                    primaryColor: ColorsApp().secondaryColor,
                  ),
                  ImageUploadBox(
                    title: "Upload Back Photo",
                    image: _backImage,
                    onTap: () => _pickImage(false),
                    primaryColor: ColorsApp().secondaryColor,
                  ),
                ],
              ),
              const SizedBox(height: 40),
              const Divider(thickness: 1),
              const SizedBox(height: 20),
              const LicensePlateWidget(),
              const SizedBox(height: 40),
              Button(
                text: 'Next',
                onPressed: () {
                  // Add your validation logic here
                  if (_frontImage != null && _backImage != null) {
                    // All good, proceed.
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                          'Please upload both photos of the license.',
                        ),
                        backgroundColor: Colors.red,
                      ),
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
