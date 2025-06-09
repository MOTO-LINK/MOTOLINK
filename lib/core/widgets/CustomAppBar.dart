import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final String? imagePath;
  final IconData? icon;
  final VoidCallback? onIconPressed;
  final double appBarHeight;

  const CustomAppBar({
    super.key,
    this.title,
    this.imagePath,
    this.icon,
    this.onIconPressed,
    this.appBarHeight = 100,
  });

  @override
  Size get preferredSize => Size.fromHeight(appBarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      toolbarHeight: appBarHeight,
      actions: [
        if (icon != null)
          IconButton(
            onPressed: onIconPressed ?? () {},
            icon: FaIcon(icon, color: Colors.white),
          ),
      ],
      flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFB5022F), Colors.black],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(20),
            bottomRight: Radius.circular(20),
          ),
        ),
        child: Align(
          alignment: Alignment.bottomRight,
          child:
              imagePath != null
                  ? Image.asset(imagePath!, width: 130, height: 130)
                  : const SizedBox.shrink(),
        ),
      ),
      title: Text(
        title ?? '',
        style: const TextStyle(
          fontSize: 20,
          color: Colors.white,
          fontFamily: 'Delivery',
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
