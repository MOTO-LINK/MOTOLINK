import 'package:flutter/material.dart';

class photos extends StatelessWidget {
  const photos({
    super.key,
    required this.pic,
  });
  final String pic;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {},
      child: ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Image.asset(width: 140, pic)),
    );
  }
}
