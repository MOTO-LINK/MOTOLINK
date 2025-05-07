import 'package:flutter/material.dart';

import '../utils/colors_palette.dart';

class CustomBirthdayPart extends StatefulWidget {
  const CustomBirthdayPart({super.key});

  @override
  State<CustomBirthdayPart> createState() => _CustomBirthdayPartState();
}

class _CustomBirthdayPartState extends State<CustomBirthdayPart> {
  String? selectedDay = "27";
  String? selectedMonth = "11";
  String? selectedYear = "2020";
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Enter your Birthday"),
        const SizedBox(height: 10),
        const Row(
          children: [
            SizedBox(
              width: 55,
            ),
            Text("Days"),
            SizedBox(
              width: 60,
            ),
            Text("Month"),
            SizedBox(
              width: 60,
            ),
            Text("Year"),
          ],
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            DropdownButton<String>(
              value: selectedDay,
              dropdownColor: Colors.black,
              style: TextStyle(
                color: ColorsApp.second,
              ),
              items: List.generate(31, (index) {
                String day = (index + 1).toString();
                return DropdownMenuItem(value: day, child: Text(day));
              }),
              onChanged: (value) {
                setState(() {
                  selectedDay = value;
                });
              },
            ),
            DropdownButton<String>(
              value: selectedMonth,
              dropdownColor: Colors.black,
              style: TextStyle(
                color: ColorsApp.second,
              ),
              items: List.generate(12, (index) {
                String month = (index + 1).toString();
                return DropdownMenuItem(value: month, child: Text(month));
              }),
              onChanged: (value) {
                setState(() {
                  selectedMonth = value;
                });
              },
            ),
            DropdownButton<String>(
              value: selectedYear,
              dropdownColor: Colors.black,
              style: TextStyle(
                color: ColorsApp.second,
              ),
              items: List.generate(50, (index) {
                String year = (1975 + index).toString();
                return DropdownMenuItem(value: year, child: Text(year));
              }),
              onChanged: (value) {
                setState(() {
                  selectedYear = value;
                });
              },
            ),
          ],
        ),
      ],
    );
  }
}
