import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';

class SelectGender extends StatefulWidget {
  const SelectGender({super.key});

  @override
  State<SelectGender> createState() => _SelectGenderState();
}

class _SelectGenderState extends State<SelectGender> {
  String? selectedGender;
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: RadioListTile(
            tileColor: const Color(0xff303F4A),
            activeColor: ColorsApp.second,
            title: const Text("Male", style: TextStyle(color: Colors.white)),
            value: "Male",
            groupValue: selectedGender,
            onChanged: (value) {
              setState(() {
                selectedGender = value.toString();
              });
            },
          ),
        ),
        Expanded(
          child: RadioListTile(
            activeColor: ColorsApp.second,
            tileColor: const Color(0xff303F4A),
            title: const Text("Female", style: TextStyle(color: Colors.white)),
            value: "Female",
            groupValue: selectedGender,
            onChanged: (value) {
              setState(() {
                selectedGender = value.toString();
              });
            },
          ),
        ),
      ],
    );
  }
}
