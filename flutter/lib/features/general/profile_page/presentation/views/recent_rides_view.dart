import 'package:flutter/material.dart';
import 'package:motolink/features/general/profile_page/presentation/views/widgets/recent_rides_view_body.dart';

import '../../../../../core/widgets/custom_app_bar.dart';

class RecentRidesView extends StatelessWidget {
  const RecentRidesView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(txt: "Recent Rides"),
      body: RecentRidesViewBody(),
    );
  }
}
