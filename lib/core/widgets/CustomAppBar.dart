import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final String? imagePath;
  final IconData? icon;
  final VoidCallback? onIconPressed;

  const CustomAppBar({
    super.key,
    this.title,
    this.imagePath,
    this.icon,
    this.onIconPressed,
  });

  @override
  Size get preferredSize => const Size.fromHeight(90);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      toolbarHeight: 90,
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
            bottomLeft: Radius.circular(10),
            bottomRight: Radius.circular(10),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.only(bottom: 20, right: 20),
          child: Align(
            alignment: Alignment.bottomLeft,
            child:
                imagePath != null
                    ? Image.asset(imagePath!, width: 80, height: 80)
                    : const SizedBox.shrink(),
          ),
        ),
      ),
      title: Padding(
        padding: const EdgeInsets.only(left: 60),
        child: Center(
          child: Text(
            title ?? '',
            style: const TextStyle(
              fontSize: 20,
              color: Colors.white,
              fontFamily: 'Delivery',
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
