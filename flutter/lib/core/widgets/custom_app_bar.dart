import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({super.key, required this.txt});
  final String txt;
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: ColorsApp.main,
      leading: IconButton(
        onPressed: () {},
        icon: Icon(
          Icons.arrow_back_ios,
          color: Colors.white,
        ),
      ),
      title: Text(
        txt,
        style: TextStyle(color: Colors.white),
      ),
      centerTitle: true,
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
