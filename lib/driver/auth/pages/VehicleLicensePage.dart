import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:image_picker/image_picker.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/services/profileService.dart';
import 'package:moto/driver/auth/widgets/LicensePlate.dart';
import 'package:moto/driver/auth/widgets/upload_photo.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:shared_preferences/shared_preferences.dart';

class VehicleLicensePage extends StatefulWidget {
  const VehicleLicensePage({super.key});

  @override
  State<VehicleLicensePage> createState() => _VehicleLicensePageState();
}

class _VehicleLicensePageState extends State<VehicleLicensePage> {
  final ProfileService _profileService = ProfileService();
  final TextEditingController plateNumbersController = TextEditingController();
  final TextEditingController plateLettersController = TextEditingController();

  File? _frontImageFile;
  File? _backImageFile;

  String? _savedFrontImageUrl;
  String? _savedBackImageUrl;

  bool _isUploadingFront = false;
  bool _isUploadingBack = false;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _loadSavedData();
  }

  Future<void> _loadSavedData() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _savedFrontImageUrl = prefs.getString('vehicle_license_front_url');
        _savedBackImageUrl = prefs.getString('vehicle_license_back_url');
        plateNumbersController.text = prefs.getString('plate_numbers') ?? '';
        plateLettersController.text = prefs.getString('plate_letters') ?? '';
      });
    }
  }

  Future<void> _pickAndUploadImage(bool isFront) async {
    final pickedFile = await ImagePicker().pickImage(
      source: ImageSource.gallery,
    );
    if (pickedFile == null) return;

    setState(
      () => isFront ? _isUploadingFront = true : _isUploadingBack = true,
    );

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

      if (compressedFile == null) throw Exception("Failed Compressed Image");

      final imageToUpload = File(compressedFile.path);
      setState(
        () =>
            isFront
                ? _frontImageFile = imageToUpload
                : _backImageFile = imageToUpload,
      );

      final documentType =
          isFront ? "vehicle_license_front" : "vehicle_license_back";
      final response = await _profileService.uploadDriverDocument(
        file: imageToUpload,
        documentType: "license_front",
      );

      if (mounted && response != null && response.success) {
        CustomSnackBar(
          context,
          response.message.isNotEmpty ? response.message : "Upload succes",
        );
        setState(() {
          if (isFront) {
            _savedFrontImageUrl = response.data.documentUrl;
            _frontImageFile = null;
          } else {
            _savedBackImageUrl = response.data.documentUrl;
            _backImageFile = null;
          }
        });
      } else {
        setState(
          () => isFront ? _frontImageFile = null : _backImageFile = null,
        );
        throw Exception(response?.message ?? 'Faild upload picture');
      }
    } catch (e) {
      if (mounted) CustomSnackBar(context, e.toString());
    } finally {
      if (mounted)
        setState(
          () => isFront ? _isUploadingFront = false : _isUploadingBack = false,
        );
    }
  }

  Future<void> _onNextPressed() async {
    if (_savedFrontImageUrl == null || _savedBackImageUrl == null) {
      CustomSnackBar(context, 'الرجاء رفع صورتي الرخصة أولاً');
      return;
    }
    if (plateNumbersController.text.isEmpty ||
        plateLettersController.text.isEmpty) {
      CustomSnackBar(context, 'الرجاء إدخال أرقام وحروف اللوحة');
      return;
    }

    setState(() => _isSaving = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('plate_numbers', plateNumbersController.text);
      await prefs.setString('plate_letters', plateLettersController.text);

      if (mounted) {
        CustomSnackBar(context, 'Saved successfully');
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) CustomSnackBar(context, 'ُERROR: $e');
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "Vehicle License",
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
                  ImageUploadfield(
                    title: "Upload Front Photo",
                    imageFile: _frontImageFile,
                    imageUrl: _savedFrontImageUrl,
                    isLoading: _isUploadingFront,
                    onTap: () => _pickAndUploadImage(true),
                    primaryColor: ColorsApp().secondaryColor,
                  ),
                  ImageUploadfield(
                    title: "Upload Back Photo",
                    imageFile: _backImageFile,
                    imageUrl: _savedBackImageUrl,
                    isLoading: _isUploadingBack,
                    onTap: () => _pickAndUploadImage(false),
                    primaryColor: ColorsApp().secondaryColor,
                  ),
                ],
              ),
              const SizedBox(height: 40),
              const Divider(thickness: 1),
              const SizedBox(height: 20),
              LicensePlateWidget(
                numbersController: plateNumbersController,
                lettersController: plateLettersController,
              ),
              const SizedBox(height: 40),
              GestureDetector(
                onTap: _isSaving ? null : _onNextPressed,
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
                        _isSaving
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
}
