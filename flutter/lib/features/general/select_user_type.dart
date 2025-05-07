import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import 'package:motolink/core/widgets/custom_button.dart';

class SelectUserType extends StatefulWidget {
  const SelectUserType({super.key});

  @override
  State<SelectUserType> createState() => _SelectUserTypeState();
}

class _SelectUserTypeState extends State<SelectUserType> {
  String selectedType = "";
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        txt: "Welcome",
      ),
      body: Container(
        width: double.infinity,
        padding: EdgeInsets.all(12),
        child: Column(
          children: [
            Row(
              children: [
                Text(
                  "Welcome to ",
                  style: TextStyle(color: ColorsApp.main, fontSize: 30),
                ),
                Text(
                  "MotoLink",
                  style: TextStyle(color: ColorsApp.second, fontSize: 30),
                ),
              ],
            ),
            SizedBox(
              height: 4,
            ),
            Row(
              children: [
                Text(
                  "Join our community today",
                  style: TextStyle(color: Color(0xffA7A7A7), fontSize: 20),
                ),
              ],
            ),
            SizedBox(
              height: 10,
            ),
            Row(
              children: [
                Container(
                  height: 10,
                  width: 130,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: ColorsApp.second,
                  ),
                ),
                SizedBox(width: 6),
                Container(
                  height: 10,
                  width: 120,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: ColorsApp.main,
                  ),
                ),
                SizedBox(width: 6),
                Container(
                  height: 10,
                  width: 120,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: ColorsApp.main,
                  ),
                ),
              ],
            ),
            SizedBox(height: 180),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                MaterialButton(
                  onPressed: () {
                    setState(() {
                      selectedType = "driver";
                    });
                    print("driver");
                  },
                  child: Container(
                    height: 120,
                    width: 150,
                    decoration: BoxDecoration(
                      color: selectedType == "driver"
                          ? ColorsApp.second
                          : Colors.black,
                      border: Border.all(color: ColorsApp.second),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset("assets/images/driver.png", scale: 10),
                          Text(
                            "driver",
                            style: TextStyle(color: Colors.white, fontSize: 20),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                MaterialButton(
                  onPressed: () {
                    setState(() {
                      selectedType = "rider";
                    });
                    print("Rider");
                  },
                  child: Container(
                    height: 120,
                    width: 150,
                    decoration: BoxDecoration(
                      color: selectedType == "rider"
                          ? Color(0x80F4DD81)
                          : Colors.black,
                      border: Border.all(color: Color(0xffD7B634)),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset("assets/images/ridder.png", scale: 15),
                          Text(
                            "Rider",
                            style: TextStyle(color: Colors.white, fontSize: 20),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            Expanded(child: Container()),
            CustomButton(txt: "Next"),
            Expanded(child: Container()),
          ],
        ),
      ),
    );
  }
}
