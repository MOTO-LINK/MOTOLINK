import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';

class Personaldetailspage extends StatefulWidget {
  const Personaldetailspage({super.key});

  @override
  State<Personaldetailspage> createState() => _PersonaldetailspageState();
}

class _PersonaldetailspageState extends State<Personaldetailspage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "Complete your information!",
        imagePath: "assets/images/DELIVERY.png", onBackPressed: () {  },
      ),
    );
  }
}
