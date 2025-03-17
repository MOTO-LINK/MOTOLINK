import 'package:flutter/material.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import 'package:motolink/features/general/profile_page/presentation/views/widgets/setting_screen_body.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(txt: "Setting"),
      body: SettingScreenBody()
    );
  }
}

