import 'package:convex_bottom_bar/convex_bottom_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:moto/core/utils/colors.dart'; // تأكد من المسار الصحيح

class home_Bar extends StatelessWidget {
  const home_Bar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final colors = ColorsApp();
    return ConvexAppBar(
      top: -30,
      shadowColor: colors.primaryColor.withAlpha(130),
      style: TabStyle.reactCircle,
      backgroundColor: colors.primaryColor,
      activeColor: colors.secondaryColor,
      color: ColorsApp().backgroundColor,
      items: const [
        TabItem(
          icon: Icon(FontAwesomeIcons.cog,color: Colors.white,),
          title: 'Settings',
        ),
        TabItem(
          icon: Icon(FontAwesomeIcons.clipboardList,color: Colors.white,),
          title: 'Orders',
        ),
        TabItem(
          icon: Icons.home,
          title: 'Home',
        ),
        TabItem(
          icon: Icons.notifications,
          title: 'Notification',
        ),
        TabItem(
          icon: Icons.wallet,
          title: 'Wallet',
        )
      ],
      initialActiveIndex: 2,
      curveSize: 75,
      elevation: 10,
    );
  }
}