// ===== ملف: personalPage.dart =====

import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:image_picker/image_picker.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/driver/auth/services/profileService.dart';
import 'package:moto/driver/auth/widgets/upload_photo.dart';
import 'package:path/path.dart' as path;
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'IDCardPage.dart';
import 'DriverLicensePage.dart';
import 'CriminalRecordPage.dart';
import 'VehicleLicensePage.dart';
import 'decision_page.dart'; // استيراد الصفحة التي تحتوي على HomePageDefault


class PersonalPage extends StatefulWidget {
  const PersonalPage({super.key});

  @override
  State<PersonalPage> createState() => _PersonalPageState();
}

class _PersonalPageState extends State<PersonalPage> {
  bool _isDataComplete = false;
  bool _isLoading = true;
    bool _isUploading = false;
  String _vehicleType = 'car';
  final ProfileService _profileService = ProfileService();

  // يمكنك إضافة متغيرات أخرى لحفظ الـ URLs والصور إذا أردت عرض علامة (صح) بجانب كل عنصر
  String? _profilePicUrl;
  String? _idFrontUrl;
  String? _idBackUrl;
  String? _driverLicenseUrl;
  String? _criminalRecordUrl;
  String? _vehicleLicenseFrontUrl;
  String? _vehicleLicenseBackUrl;
  File? _image; // لحفظ الصورة المختارة مؤقتاً
String? _savedProfilePictureUrl;
  @override
  void initState() {
    super.initState();
    _loadAndCheckData();
  }

Future<void> _loadProfilePicture() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _savedProfilePictureUrl = prefs.getString('profile_picture');
      });
    }
  }

  Future<void> _pickAndCompressImage() async {
    final pickedFile = await ImagePicker().pickImage(
      source: ImageSource.gallery,
    );

    if (pickedFile == null) return;

    setState(() {
      _isUploading = true;
    });

    try {
      final tempDir = await getTemporaryDirectory();
      final targetPath = path.join(
        tempDir.path,
        '${DateTime.now().millisecondsSinceEpoch}.jpg',
      );

      final compressedXFile = await FlutterImageCompress.compressAndGetFile(
        pickedFile.path,
        targetPath,
        quality: 60,
        minWidth: 1024,
        minHeight: 1024,
        format: CompressFormat.jpeg,
      );

      if (compressedXFile == null) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(const SnackBar(content: Text('فشل ضغط الصورة')));
        }
        return;
      }

      final compressedImageFile = File(compressedXFile.path);

      setState(() {
        _image = compressedImageFile; // عرض الصورة المضغوطة في الواجهة مؤقتاً
      });

      final response = await _profileService.uploadProfilePicture(
        compressedImageFile,
      );

      if (mounted) {
        if (response != null && response.success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                response.message.isNotEmpty
                    ? response.message
                    : 'تم رفع الصورة بنجاح!',
              ),
            ),
          );
          // ٤. تحديث الواجهة برابط الصورة الجديد وإزالة الصورة المؤقتة
          setState(() {
            _savedProfilePictureUrl = response.profilePicture;
            _image = null; // إزالة الصورة المحلية لعرض الصورة القادمة من الشبكة
          });
        } else {
          print("Image upload failed");
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('فشل رفع الصورة. الرجاء المحاولة مرة أخرى.'),
            ),
          );
        }
      }
    } catch (e) {
      print("Error during picking/compressing/uploading: $e");
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('حدث خطأ غير متوقع.')));
      }
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  Future<void> _loadAndCheckData() async {
    setState(() {
      _isLoading = true;
    });
    final prefs = await SharedPreferences.getInstance();

    _profilePicUrl = prefs.getString('profile_picture');
    _idFrontUrl = prefs.getString('national_id_front_url');
    _idBackUrl = prefs.getString('national_id_back_url');
    _driverLicenseUrl = prefs.getString(
      'driver_license_url',
    ); 
    _criminalRecordUrl = prefs.getString(
      'criminal_record_url',
    ); 
    _vehicleLicenseFrontUrl = prefs.getString('vehicle_license_front_url');
    _vehicleLicenseBackUrl = prefs.getString('vehicle_license_back_url');
    _vehicleType = prefs.getString('vehicleType') ?? 'car';
    if (_profilePicUrl != null &&
        _idFrontUrl != null &&
        _idBackUrl != null &&
        _driverLicenseUrl != null &&
        _criminalRecordUrl != null &&
        _vehicleLicenseFrontUrl != null &&
        _vehicleLicenseBackUrl != null) {
      setState(() {
        _isDataComplete = true;
      });
    } else {
      setState(() {
        _isDataComplete = false;
      });
    }

    setState(() {
      _isLoading = false;
    });
  }

  Future<void> _navigateTo(BuildContext context, Widget page) async {
    await Navigator.push(context, MaterialPageRoute(builder: (_) => page));
    _loadAndCheckData(); 
  }

  String getVehicleName(String type) {
    switch (type.toLowerCase()) {
      case 'motorcycle':
        return "motorcycle";
      case 'rickshaw':
        return "rickshaw";
      case 'scooter':
        return 'scotor';
      default:
        return 'car';
    }
  }

  Future<void> _confirmAndGoHome() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isProfileComplete', true);

    if (mounted) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const HomePageDefault()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "Complete the verification\ninformation",
        imagePath: "assets/images/DELIVERY.png",
        onBackPressed: () {
          
        },
      ),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                padding: const EdgeInsets.all(15),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // يمكنك وضع ويدجت رفع الصورة الشخصية هنا
                    const SizedBox(height: 20),
              Center(
                child: GestureDetector(
                  onTap: _isUploading ? null : _pickAndCompressImage,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      CircleAvatar(
                        radius: 100,
                        backgroundColor: Colors.grey[300],
                        // ٥. تعديل منطق عرض الصورة
                        backgroundImage:
                            _image != null
                                ? FileImage(_image!)
                                    as ImageProvider // عرض الصورة المحلية المختارة
                                : _savedProfilePictureUrl != null &&
                                    _savedProfilePictureUrl!.isNotEmpty
                                ? NetworkImage(
                                  _savedProfilePictureUrl!,
                                ) // عرض الصورة المحفوظة من الإنترنت
                                : null, // لا تعرض أي صورة
                        child:
                            _image == null &&
                                    (_savedProfilePictureUrl == null ||
                                        _savedProfilePictureUrl!.isEmpty) &&
                                    !_isUploading
                                ? const Icon(
                                  Icons.camera_alt,
                                  color: Colors.white,
                                  size: 50,
                                )
                                : null,
                      ),
                      if (_isUploading) const CircularProgressIndicator(),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Center(
                child: GestureDetector(
                  onTap: _isUploading ? null : _pickAndCompressImage,
                  child: const Text(
                    "Upload your profile picture",
                    style: TextStyle(
                      color: Colors.blue,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 30),

                    const SizedBox(height: 30),
                    buildSectionHeader("Driver's Information"),
                    _buildBox(
                      context,
                      "ID Card (front and back)",
                      const IdCardPage(),
                      _idFrontUrl != null && _idBackUrl != null,
                    ),
                    _buildBox(
                      context,
                      "Driving License",
                      const DriverLicensePage(),
                      _driverLicenseUrl != null,
                    ),
                    _buildBox(
                      context,
                      "Criminal Record",
                      const CriminalRecordPage(),
                      _criminalRecordUrl != null,
                    ),
                    const SizedBox(height: 20),
                    buildSectionHeader("Vehicle Information"),
                    _buildBox(
                      context,
                      'License ${getVehicleName(_vehicleType)}',
                      const VehicleLicensePage(),
                      _vehicleLicenseFrontUrl != null &&
                          _vehicleLicenseBackUrl != null,
                    ),
                    const SizedBox(height: 40),
                    if (_isDataComplete)
                      GestureDetector(
                        onTap: _confirmAndGoHome,
                        child: Container(
                          width: double.infinity,
                          height: 55,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFB5022F), Colors.black],
                              begin: Alignment.centerLeft,
                              end: Alignment.centerRight,
                            ),
                            borderRadius: BorderRadius.circular(15),
                          ),
                          child: const Center(
                            child: Text(
                              "Confirm and Start",
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

  Widget buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 12.0, bottom: 8.0),
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.black,
          fontWeight: FontWeight.bold,
          fontSize: 16,
        ),
      ),
    );
  }

  Widget _buildBox(
    BuildContext context,
    String txt,
    Widget page,
    bool isCompleted,
  ) {
    return GestureDetector(
      onTap: () => _navigateTo(context, page),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: ColorsApp().secondaryColor),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 1,
              blurRadius: 3,
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              txt,
              style: const TextStyle(fontSize: 15, color: Colors.black),
            ),
            // إظهار أيقونة صح عند اكتمال العنصر
            isCompleted
                ? const Icon(Icons.check_circle, color: Colors.green)
                : const Icon(
                  Icons.arrow_forward_ios,
                  size: 20,
                  color: Color(0xFFB5022F),
                ),
          ],
        ),
      ),
    );
  }
}
