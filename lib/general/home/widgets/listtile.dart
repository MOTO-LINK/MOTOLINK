import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/general/home/models/listtilemodel.dart';

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
        color: Colors.black,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.only(bottom: 15),
        child: ListTile(
          leading: IconTheme(
            data: const IconThemeData(color: Colors.white),
            child: tilemodel.firsticon,
          ),
          title: Text(
            tilemodel.title,
            style: const TextStyle(color: Colors.white),
          ),
          subtitle: Text(
            tilemodel.subtitle,
            style: const TextStyle(color: Colors.white),
          ),
          trailing: IconTheme(
            data: const IconThemeData(color: Colors.white),
            child: tilemodel.secondicon,
          ),
          iconColor: Colors.white,
        ),
      ),
    );
  }
}