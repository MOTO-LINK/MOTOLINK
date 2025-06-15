import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/driver/auth/services/profileService.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:shared_preferences/shared_preferences.dart'; // ١. إضافة import لجلب البيانات
import 'IDCardPage.dart';
import 'DriverLicensePage.dart';
import 'CriminalRecordPage.dart';

class PersonalPage extends StatefulWidget {
  const PersonalPage({super.key});

  @override
  State<PersonalPage> createState() => _PersonalPageState();
}

class _PersonalPageState extends State<PersonalPage> {
  final ProfileService _profileService = ProfileService();
  File? _image; // لحفظ الصورة المختارة مؤقتاً
  bool _isUploading = false;
  String? _savedProfilePictureUrl; // لحفظ رابط الصورة القادم من الخادم

  // ٢. إضافة دالة initState ليتم استدعاؤها عند فتح الصفحة أول مرة
  @override
  void initState() {
    super.initState();
    _loadProfilePicture(); // استدعاء دالة تحميل الصورة عند بدء التشغيل
  }

  // ٣. دالة جديدة لقراءة رابط الصورة المحفوظ من SharedPreferences
  Future<void> _loadProfilePicture() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _savedProfilePictureUrl = prefs.getString('profile_picture');
      });
    }
  }

  // دالة لاختيار الصورة وضغطها ورفعها
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

  void _navigateTo(BuildContext context, Widget page) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => page));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "Complete your personal\ninformation",
        imagePath: "assets/images/DELIVERY.png",
        onBackPressed: () {},
      ),
      body: Padding(
        padding: const EdgeInsets.all(15),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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

              // --- قسم بيانات السائق ---
              const Padding(
                padding: EdgeInsets.only(left: 12.0),
                child: Text(
                  "Driver Data",
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              _buildBox(
                context,
                "Front and Back of the ID Card",
                const IdCardPage(),
              ),
              _buildBox(context, "Driver's License", const DriverLicensePage()),
              _buildBox(context, 'Criminal Record', const CriminalRecordPage()),
              const SizedBox(height: 20),

              // --- قسم بيانات السيارة ---
              const Padding(
                padding: EdgeInsets.only(left: 12.0),
                child: Text(
                  "Car Data",
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              _buildBox(context, 'Car License', const CriminalRecordPage()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBox(BuildContext context, String txt, Widget page) {
    return GestureDetector(
      onTap: () => _navigateTo(context, page),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: ColorsApp().secondaryColor),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              txt,
              style: const TextStyle(fontSize: 15, color: Colors.black),
            ),
            const Icon(
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
