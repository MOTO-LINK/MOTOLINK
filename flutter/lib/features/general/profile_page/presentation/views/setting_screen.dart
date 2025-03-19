import 'package:flutter/material.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';

import '../../../../../core/utils/colors_palette.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(txt: "Setting"),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16 , vertical: 40),
        child: Column(
          children: [
            Expanded(
              child: ListView(
                children: [
                  SettingItem(title: "Account Info"),
                  SettingItem(title: "Change E-Mail"),
                  SettingItem(title: "Change Password"),
                  SettingItem(title: "Saved Address"),
                  SettingItem(
                    title: "Language",
                    subtitle: "English",
                  ),
                  SettingItem(
                    title: "Country",
                    subtitle: "Egypt",
                  ),
                ],
              ),
            ),
          ],
        ),
      )
    );
  }
}



class SettingItem extends StatelessWidget {
  final String title;
  final String? subtitle;

  const SettingItem({
    super.key,
    required this.title,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
      decoration: BoxDecoration(

        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: ColorsPalette.baseColor, width: 1),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: const TextStyle(color: Colors.grey, fontSize: 16),
          ),
          Row(
            children: [
              if (subtitle != null)
                Text(
                  subtitle!,
                  style: TextStyle(color: Colors.grey.shade400, fontSize: 14),
                ),
              const SizedBox(width: 10),
              const Icon(Icons.arrow_forward_ios, color: Colors.white, size: 18),
            ],
          ),
        ],
      ),
    );
  }
}