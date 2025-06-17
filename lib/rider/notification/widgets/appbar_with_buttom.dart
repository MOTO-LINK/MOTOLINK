import 'package:flutter/material.dart';

class AppBarNotification extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final String? imagePath;
  final List<Widget>? actions; // <-- تم التعديل هنا ليقبل قائمة
  final double appBarHeight;
  final bool showBackButton;
  final bool centerTitle;

  const AppBarNotification({
    super.key,
    this.title,
    this.imagePath,
    this.actions, // <-- تم التعديل هنا
    this.appBarHeight = 100,
    this.showBackButton = false,
    this.centerTitle = false,
  });

  @override
  Size get preferredSize => Size.fromHeight(appBarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      centerTitle: centerTitle,
      // التحكم في سهم الرجوع
      automaticallyImplyLeading: false,
      leading: showBackButton
          ? IconButton(
              icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
              onPressed: () => Navigator.of(context).maybePop(),
            )
          : null,
      toolbarHeight: appBarHeight,
      // استخدام قائمة الـ actions التي تم تمريرها
      actions: actions,
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
          child: imagePath != null
              ? Image.asset(imagePath!, width: 130, height: 130)
              : const SizedBox.shrink(),
        ),
      ),
      title: Text(
        title ?? '',
        style: const TextStyle(
          fontSize: 20,
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
