import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:image_picker/image_picker.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/services/profileService.dart';
import 'package:moto/driver/auth/widgets/upload_photo.dart'; // Re-using the widget from IDCardPage
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:shared_preferences/shared_preferences.dart';

class CriminalRecordPage extends StatefulWidget {
  const CriminalRecordPage({super.key});

  @override
  State<CriminalRecordPage> createState() => _CriminalRecordPageState();
}

class _CriminalRecordPageState extends State<CriminalRecordPage> {
  // Services
  final ProfileService _profileService = ProfileService();

  // State variables
  File? criminalRecordImageFile;
  String? savedCriminalRecordImageUrl;
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
        savedCriminalRecordImageUrl = prefs.getString('criminal_record_url');
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

      if (compressedFile == null) throw Exception("Failed to compress image.");

      final imageToUpload = File(compressedFile.path);
      setState(() => criminalRecordImageFile = imageToUpload);

      final response = await _profileService.uploadDriverDocument(
        file: imageToUpload,
        documentType: "license_front", // Endpoint document type
      );

      if (mounted && response != null && response.success) {
        CustomSnackBar(
          context,
          response.message.isNotEmpty
              ? response.message
              : 'Uploaded successfully',
        );
        setState(() {
          savedCriminalRecordImageUrl = response.data.documentUrl;
          criminalRecordImageFile = null;
        });

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('criminal_record_url', response.data.documentUrl);
      } else {
        setState(() => criminalRecordImageFile = null);
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
                child: ImageUploadfield(
                  title: "Upload criminal record photo",
                  imageFile: criminalRecordImageFile,
                  imageUrl: savedCriminalRecordImageUrl,
                  isLoading: isUploading,
                  onTap: () => _pickAndUploadImage(),
                  primaryColor: colors.secondaryColor,
                  // Custom icon for the checkmark
                  /*successIcon: const Icon(
                    Icons.check_circle,
                    color: Colors.green,
                    size: 40,
                  ),*/
                ),
              ),
              const SizedBox(height: 250),
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
    );
  }

  Future<void> _onNextPressed() async {
    if (savedCriminalRecordImageUrl == null) {
      CustomSnackBar(context, "Please upload the criminal record photo first.");
      return;
    }
    setState(() => isSaving = true);
    try {
      await Future.delayed(const Duration(milliseconds: 500));
      if (mounted) {
        CustomSnackBar(context, 'The data has been saved successfully');
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        CustomSnackBar(context, "An error occurred: $e");
      }
    } finally {
      if (mounted) setState(() => isSaving = false);
    }
  }
}
