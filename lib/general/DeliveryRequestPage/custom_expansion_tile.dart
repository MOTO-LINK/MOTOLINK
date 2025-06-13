import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../core/utils/colors.dart';


class CustomExpansionTile extends StatelessWidget {
  const CustomExpansionTile(
      {super.key, required this.titleText, required this.details});
  final String titleText, details;
  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      title: Text(titleText),
      collapsedIconColor: ColorsApp().secondaryColor,
      collapsedBackgroundColor: Colors.grey.shade200,
      backgroundColor: Colors.grey.shade200,
      collapsedShape: OutlineInputBorder(
        borderRadius: BorderRadius.circular(15),
        borderSide: BorderSide(color: ColorsApp().secondaryColor),
      ),
      shape: OutlineInputBorder(
        borderRadius: BorderRadius.circular(15),
        borderSide: const BorderSide(color: Colors.black),
      ),
      children: [
        ListTile(title: Text(details)),
      ],
    );
  }
}
