import 'package:convex_bottom_bar/convex_bottom_bar.dart';
import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';

class home_Bar extends StatelessWidget {
  const home_Bar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ConvexAppBar(
      top: -30,
      shadowColor: Colors.orange.withAlpha(130),
      style: TabStyle.reactCircle,
      backgroundColor: ColorsApp.main,
      activeColor: ColorsApp.second,
      color: Colors.white,
      items: const [
        TabItem(
          icon: Icons.card_giftcard,
          title: 'gift',
        ),
        TabItem(
          icon: Icons.chat,
          title: 'Chats',
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
