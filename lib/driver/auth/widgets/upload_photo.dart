import 'dart:io';
import 'package:flutter/material.dart';

class ImageUploadfield extends StatelessWidget {
  final String title;
  final VoidCallback onTap;
  
  // تمت إضافة وتعديل هذه المتغيرات
  final File? imageFile;          // لعرض الصورة من ملف محلي
  final String? imageUrl;         // لعرض الصورة من الإنترنت
  final bool isLoading;           // لإظهار مؤشر التحميل

  final IconData icon;
  final Color primaryColor;
  final Color backgroundColor;
  final double? width;
  final double height;

  const ImageUploadfield({
    super.key,
    required this.title,
    required this.onTap,
    this.imageFile,
    this.imageUrl,
    this.isLoading = false,
    this.icon = Icons.credit_card_outlined,
    this.primaryColor = Colors.blue,
    this.backgroundColor = Colors.white,
    this.width,
    this.height = 120.0,
  });

  @override
  Widget build(BuildContext context) {
    final boxWidth = width ?? MediaQuery.of(context).size.width * 0.4;

    // تحديد مصدر الصورة بناءً على الأولوية: ملف محلي ثم رابط إنترنت
    ImageProvider? finalImageProvider;
    if (imageFile != null) {
      finalImageProvider = FileImage(imageFile!);
    } else if (imageUrl != null && imageUrl!.isNotEmpty) {
      finalImageProvider = NetworkImage(imageUrl!);
    }

    return GestureDetector(
      onTap: isLoading ? null : onTap, // منع الضغط أثناء التحميل
      child: Container(
        width: boxWidth,
        height: height,
        decoration: BoxDecoration(
          color: backgroundColor,
          image: finalImageProvider != null
              ? DecorationImage(
                  image: finalImageProvider,
                  fit: BoxFit.cover,
                  colorFilter: ColorFilter.mode(
                    Colors.black.withOpacity(0.1),
                    BlendMode.darken,
                  ),
                )
              : null,
          border: Border.all(color: primaryColor.withOpacity(0.5)),
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 1,
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        // استخدام Stack لوضع مؤشر التحميل فوق المحتوى
        child: Stack(
          alignment: Alignment.center,
          children: [
            // المحتوى الأساسي (الأيقونة والنص) يظهر فقط إذا لم يكن هناك صورة أو تحميل
            if (finalImageProvider == null && !isLoading)
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(icon, color: primaryColor, size: 40),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: Text(
                      title,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[700],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            
            // إظهار مؤشر التحميل
            if (isLoading)
              CircularProgressIndicator(
                color: primaryColor,
              ),
          ],
        ),
      ),
    );
  }
}