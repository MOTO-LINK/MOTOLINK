import 'package:flutter/material.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import 'package:motolink/features/general/profile_page/presentation/views/widgets/personal_details_view_body.dart';

class PersonalDetailsView extends StatelessWidget {
  const PersonalDetailsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(txt: "Personal Details"),
      body: PersonalDetailsViewBody(),
    );
  }
}
