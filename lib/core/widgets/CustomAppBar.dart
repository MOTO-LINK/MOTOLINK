import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({
    super.key,
  });

  @override
  Size get preferredSize => const Size.fromHeight(90);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      toolbarHeight: 90,
      actions: [
        IconButton(
          onPressed: () {},
          icon: FaIcon(  Icons.arrow_back  , color: Colors.white),
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
            child: Image.asset(
              'assets/icons/fast-delivery-transport-3d-rendering.png',
              width: 80,
              height: 80,
            ),
          ),
        ),
      ),
      title: Padding(
        padding: const EdgeInsets.only(left: 60),
        child: Center(
          child: Text(
            'Deliver Anything',
            style: TextStyle(
              fontSize: 20,
              color: Colors.white,
              fontFamily: 'Delivery',
            ),
          ),
        ),
      ),
    );
  }
}
