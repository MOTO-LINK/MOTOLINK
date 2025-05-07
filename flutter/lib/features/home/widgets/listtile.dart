import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';
import 'package:motolink/features/home/models/listtilemodel.dart';

class tiles extends StatelessWidget {
  const tiles({
    super.key,
    required this.tilemodel,
  });
  final tilesmodel tilemodel;

  @override
  Widget build(BuildContext context) {
    return Container(
        height: 70,
        margin: const EdgeInsets.all(7),
        decoration: BoxDecoration(
            color: ColorsApp.second, borderRadius: BorderRadius.circular(12)),
        child: Padding(
            padding: const EdgeInsets.only(bottom: 15),
            child: ListTile(
              leading: tilemodel.firsticon,
              title: Text(
                tilemodel.title,
                style: TextStyle(color: ColorsApp.text),
              ),
              subtitle: Text(
                tilemodel.subtitle,
                style: TextStyle(color: ColorsApp.title),
              ),
              trailing: tilemodel.secondicon,
              iconColor: ColorsApp.icon,
            )));
  }
}
