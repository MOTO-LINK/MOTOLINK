import 'dart:io';
import 'package:flutter/material.dart';

class ImageUploadBox extends StatelessWidget {
  final String title;
  final File? image;
  final VoidCallback onTap;
  final IconData icon;
  final Color primaryColor;
  final Color backgroundColor;
  final double? width;
  final double height;

  const ImageUploadBox({
    super.key,
    required this.title,
    required this.onTap,
    this.image,
    this.icon = Icons.credit_card_outlined, 
    this.primaryColor = Colors.blue, 
    this.backgroundColor = Colors.white,
    this.width,
    this.height = 120.0,
  });

  @override
  Widget build(BuildContext context) {
    final boxWidth = width ?? MediaQuery.of(context).size.width * 0.4;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: boxWidth,
        height: height,
        decoration: BoxDecoration(
          color: backgroundColor,
          image:
              image != null
                  ? DecorationImage(
                    image: FileImage(image!),
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
        // The child is only shown if there is no image
        child:
            image != null
                ? null // When image is set, the container's decoration handles it
                : Column(
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
      ),
    );
  }
}
