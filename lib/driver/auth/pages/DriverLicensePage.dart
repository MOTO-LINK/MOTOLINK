import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:image_picker/image_picker.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/services/profileService.dart';
import 'package:moto/driver/auth/widgets/upload_photo.dart'; 
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:shared_preferences/shared_preferences.dart';

// الرخصه
class DriverLicensePage extends StatefulWidget {
  const DriverLicensePage({super.key});

  @override
  State<DriverLicensePage> createState() => _DriverLicensePageState();
}

class _DriverLicensePageState extends State<DriverLicensePage> {
  final GlobalKey<FormState> _formKey =
      GlobalKey<FormState>(); 
  final TextEditingController licenseNumberController = TextEditingController();
  final ProfileService _profileService = ProfileService();

  // State variables
  File? licenseImageFile;
  String? savedLicenseImageUrl;
  bool isUploading = false;
  bool isSaving = false;

  @override
  void initState() {
    super.initState();
    _loadSavedData();
  }
  Future<void> _loadSavedData() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        savedLicenseImageUrl = prefs.getString('driver_license_url');
        licenseNumberController.text =
            prefs.getString('driver_license_number') ?? '';
      });
    }
  }

  Future<void> _pickAndUploadImage() async {
    final pickedFile = await ImagePicker().pickImage(
      source: ImageSource.gallery,
    );
    if (pickedFile == null) return;

    setState(() => isUploading = true);

    try {
      final tempDir = await getTemporaryDirectory();
      final targetPath = path.join(
        tempDir.path,
        '${DateTime.now().millisecondsSinceEpoch}.jpg',
      );
      final compressedFile = await FlutterImageCompress.compressAndGetFile(
        pickedFile.path,
        targetPath,
        quality: 80,
        format: CompressFormat.jpeg,
      );

      if (compressedFile == null) throw Exception("Failed to compress image");

      final imageToUpload = File(compressedFile.path);

      final response = await _profileService.uploadDriverDocument(
        file: imageToUpload,
        documentType: "license_front",
      );

      if (mounted && response != null && response.success) {
        CustomSnackBar(
          context,
          response.message.isNotEmpty
              ? response.message
              : 'Uploaded successfully',
        );
        setState(() {
          savedLicenseImageUrl = response.data.documentUrl;
        });

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('driver_license_url', response.data.documentUrl);
      } else {
        throw Exception(response?.message ?? "Failed to upload image");
      }
    } catch (e) {
      if (mounted) CustomSnackBar(context, e.toString());
    } finally {
      if (mounted) setState(() => isUploading = false);
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
          child: Form(
            key: _formKey,
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
                  child: ImageUploadfield(
                    title: "Upload license photo",
                    imageFile: licenseImageFile,
                    imageUrl: savedLicenseImageUrl,
                    isLoading: isUploading,
                    onTap: () => _pickAndUploadImage(),
                    primaryColor: colors.secondaryColor,
                  ),
                ),
                const SizedBox(height: 30),
                TextFormField(
                  controller: licenseNumberController,
                  keyboardType: TextInputType.text,
                  decoration: InputDecoration(
                    labelText: 'License Number',
                    hintText: 'Enter the license number',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(
                        color: colors.secondaryColor,
                        width: 2,
                      ),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the license number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 40),
                const SizedBox(height: 200),
                GestureDetector(
                  onTap: isSaving ? null : _onNextPressed,
                  child: Container(
                    width: double.infinity,
                    height: 60,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [const Color(0xFFB5022F), Colors.black],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Center(
                      child:
                          isSaving
                              ? const CircularProgressIndicator(
                                color: Colors.white,
                              )
                              : const Text(
                                "Next",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 24,
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
      ),
    );
  }

  Future<void> _onNextPressed() async {
    if (savedLicenseImageUrl == null) {
      CustomSnackBar(context, "Please upload the license photo first");
      return;
    }
    if (!_formKey.currentState!.validate()) {
      return;
    }
    setState(() => isSaving = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
        'driver_license_number',
        licenseNumberController.text,
      );
      if (mounted) {
        CustomSnackBar(context, 'Data has been saved successfully');
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        CustomSnackBar(context, "An error occurred while saving data: $e");
      }
    } finally {
      if (mounted) setState(() => isSaving = false);
    }
  }
}
