import 'package:flutter/material.dart';
import 'package:motolink/features/general/profile_page/presentation/views/widgets/setting_item.dart';


class SettingScreenBody extends StatelessWidget {
  const SettingScreenBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
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
    );
  }
}
