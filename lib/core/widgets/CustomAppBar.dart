import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final String? imagePath;
  final IconData? icon;
  final VoidCallback? onIconPressed;
  final double appBarHeight;
  final bool showBackButton;
  final String? amount;
  final bool? centerTitle;

  const CustomAppBar({
    super.key,
    this.title,
    this.imagePath,
    this.icon,
    this.onIconPressed,
    this.appBarHeight = 100,
    this.showBackButton = false, required Null Function() onBackPressed,
    this.amount, this.centerTitle = false,
  });

  @override
  Size get preferredSize => Size.fromHeight(appBarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      centerTitle: centerTitle,
      automaticallyImplyLeading: false,
      // لو عايزه السهم يظهر هعمل showBackButton true
      leading:
          showBackButton
              ? IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => Navigator.of(context).maybePop(),
              )
              : null,
      toolbarHeight: appBarHeight,
      actions: [
        (amount != null)?Text(amount! , style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600 , color: Colors.white)):Text(""),
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
