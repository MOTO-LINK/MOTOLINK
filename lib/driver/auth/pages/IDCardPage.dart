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

class IdCardPage extends StatefulWidget {
  const IdCardPage({super.key});

  @override
  State<IdCardPage> createState() => _IdCardPageState();
}

class _IdCardPageState extends State<IdCardPage> {
  // Controllers and Services
  final GlobalKey<FormState> _formKey =
      GlobalKey<FormState>(); // Key for validation
  final TextEditingController idNumberController = TextEditingController();
  final ProfileService _profileService = ProfileService();

  // State variables
  File? frontImageFile;
  File? backImageFile;
  String? savedFrontImageUrl;
  String? savedBackImageUrl;
  bool isUploadingFront = false;
  bool isUploadingBack = false;
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
        savedFrontImageUrl = prefs.getString('national_id_front_url');
        savedBackImageUrl = prefs.getString('national_id_back_url');
        idNumberController.text = prefs.getString('national_id_number') ?? '';
      });
    }
  }

  Future<void> _pickAndUploadImage(bool isFront) async {
    final pickedFile = await ImagePicker().pickImage(
      source: ImageSource.gallery,
    );
    if (pickedFile == null) return;

    setState(() => isFront ? isUploadingFront = true : isUploadingBack = true);

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

      if (compressedFile == null) throw Exception("field upliad picture");

      final imageToUpload = File(compressedFile.path);
      setState(
        () =>
            isFront
                ? frontImageFile = imageToUpload
                : backImageFile = imageToUpload,
      );

      final documentType = isFront ? "national_id_front" : "national_id_back";
      final response = await _profileService.uploadDriverDocument(
        file: imageToUpload,
        documentType: documentType,
      );

      if (mounted && response != null && response.success) {
        CustomSnackBar(
          context,
          response.message.isNotEmpty
              ? response.message
              : 'Uploaded successfully',
        );
        setState(() {
          if (isFront) {
            savedFrontImageUrl = response.data.documentUrl;
            frontImageFile = null;
          } else {
            savedBackImageUrl = response.data.documentUrl;
            backImageFile = null;
          }
        });
      } else {
        setState(() => isFront ? frontImageFile = null : backImageFile = null);
        throw Exception(response?.message ?? "Failed to upload image");
      }
    } catch (e) {
      if (mounted) CustomSnackBar(context, e.toString());
    } finally {
      if (mounted)
        setState(
          () => isFront ? isUploadingFront = false : isUploadingBack = false,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = ColorsApp();
    return Scaffold(
      backgroundColor: colors.backgroundColor,
      appBar: CustomAppBar(
        title: "ID Card",
        onBackPressed: () {},
        centerTitle: true,
        onIconPressed: () {},
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
                  "Upload ID Card Photo",
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
                    ImageUploadfield(
                      title: "Upload the front photo",
                      imageFile: frontImageFile,
                      imageUrl: savedFrontImageUrl,
                      isLoading: isUploadingFront,
                      onTap: () => _pickAndUploadImage(true),
                      primaryColor: colors.secondaryColor,
                    ),
                    ImageUploadfield(
                      title: "Upload the back photo",
                      imageFile: backImageFile,
                      imageUrl: savedBackImageUrl,
                      isLoading: isUploadingBack,
                      onTap: () => _pickAndUploadImage(false),
                      primaryColor: colors.secondaryColor,
                    ),
                  ],
                ),
                const SizedBox(height: 30),
                TextFormField(
                  controller: idNumberController,
                  keyboardType: TextInputType.number,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(16),
                  ],
                  decoration: InputDecoration(
                    labelText: 'National Number',
                    hintText: 'Enter the national number',
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
                      return 'requared national number';
                    }
                    if (value.length != 14) {
                      return 'The national ID must be 14 digits.';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 40),
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
    if (savedFrontImageUrl == null || savedBackImageUrl == null) {
      CustomSnackBar(context, "upload Picture first");
      return;
    }
    if (!_formKey.currentState!.validate()) {
      CustomSnackBar(context, 'الرجاء إدخال رقم قومي صحيح');
      return;
    }
    setState(() => isSaving = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('national_id_number', idNumberController.text);

      if (mounted) {
        CustomSnackBar(context, 'The data has been saved successfully');
        // TODO: Navigate to the next page
      }
    } catch (e) {
      if (mounted)
        CustomSnackBar(
          context,
          "An error occurred while saving the national ID number.: $e",
        );
    } finally {
      if (mounted) setState(() => isSaving = false);
    }
  }
}
