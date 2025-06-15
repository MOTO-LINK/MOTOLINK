import 'package:flutter/material.dart';
import '../../core/utils/colors.dart';

class CustomExpansionTile extends StatelessWidget {
  const CustomExpansionTile({
    super.key,
    required this.titleText,
    required this.details,
  });

  final String titleText;
  final String details;

  @override
  Widget build(BuildContext context) {
    // تقسيم التفاصيل إلى أسطر باستخدام line breaks
    final List<String> lines = details.trim().split('\n');

    return ExpansionTile(
      title: Text(titleText),
      collapsedIconColor: ColorsApp().secondaryColor,
      collapsedBackgroundColor: Colors.grey.shade200,
      backgroundColor: Colors.grey.shade200,
      collapsedShape: OutlineInputBorder(
        borderRadius: BorderRadius.circular(15),
        borderSide: BorderSide(color: ColorsApp().secondaryColor),
      ),
      shape: OutlineInputBorder(
        borderRadius: BorderRadius.circular(15),
        borderSide: const BorderSide(color: Colors.black),
      ),
      children: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: lines.map((line) => Text(line.trim())).toList(),
          ),
        ),
      ],
    );
  }
}
