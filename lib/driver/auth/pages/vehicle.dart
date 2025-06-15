
import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/driver/auth/widgets/selectService.dart';

class vehiclePage extends StatefulWidget {
  const vehiclePage({super.key});

  @override
  State<vehiclePage> createState() => _vehiclePageState();
}

class _vehiclePageState extends State<vehiclePage> {
  String selectedIndex = "";
  bool isChecked = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "Welcome to Your Journey!",
        imagePath: "assets/test.jpg", onBackPressed: () {  },
        // appBarHeight: 140, onBackPressed: () {  },
      ),
      body: Container(
        width: double.infinity,
        padding: EdgeInsets.all(12),
        child: Column(
          // mainAxisAlignment: MainAxisAlignment.center,
          // crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(height: 30),
            Center(
              child: Text(
                "Let's get rolling! Are you a Rider or a Driver?",
                style: TextStyle(fontSize: 17),
              ),
            ),
            SizedBox(height: 60),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                MaterialButton(
                  onPressed: () {
                    setState(() {
                      selectedIndex = "CAR";
                    });
                    print("CAR");
                  },
                  child: Container(
                    height: 100,
                    width: 95,
                    decoration: BoxDecoration(
                      color:
                          selectedIndex == "CAR"
                              ? ColorsApp().secondaryColor
                              : Colors.grey,
                      border: Border.all(color: ColorsApp().primaryColor),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset("assets/test.jpg", scale: 15),
                          Text(
                            "CAR",
                            style: TextStyle(color: Colors.white, fontSize: 15),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                MaterialButton(
                  onPressed: () {
                    setState(() {
                      selectedIndex = "TOK TOK";
                    });
                    print("TOK TOK");
                  },
                  child: Container(
                    height: 100,
                    width: 95,
                    decoration: BoxDecoration(
                      color:
                          selectedIndex == "TOK TOK"
                              ? ColorsApp().secondaryColor
                              : Colors.grey,
                      border: Border.all(color: ColorsApp().primaryColor),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset("assets/test.jpg", scale: 15),
                          Text(
                            "TOK TOK",
                            style: TextStyle(color: Colors.white, fontSize: 15),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                MaterialButton(
                  onPressed: () {
                    setState(() {
                      selectedIndex = "MOTOCYCLE";
                    });
                    print("MOTOCYCLE");
                  },
                  child: Container(
                    height: 100,
                    width: 95,
                    decoration: BoxDecoration(
                      color:
                          selectedIndex == "MOTOCYCLE"
                              ? ColorsApp().secondaryColor
                              : Colors.grey,
                      border: Border.all(color: ColorsApp().primaryColor),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset("assets/test.jpg", scale: 15),
                          Text(
                            "MOTOCYCLE",
                            style: TextStyle(color: Colors.white, fontSize: 15),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 50),

            Selectservice(
              txt: "esteer",
              value: isChecked,
              onChanged: (val) {
                setState(() {
                  isChecked = val ?? false;
                });
              },
            ),

            SizedBox(height: 230),
            Container(
              width: double.infinity,
              height: 60,
              decoration: BoxDecoration(
                gradient:
                    (selectedIndex.isNotEmpty && isChecked)
                        ? LinearGradient(
                          colors: [
                            ColorsApp().secondaryColor,
                            ColorsApp().primaryColor,
                          ],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        )
                        : null,
                color:
                    (selectedIndex.isNotEmpty && isChecked)
                        ? null
                        : Colors.grey,
                borderRadius: BorderRadius.circular(15),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(15),
                  onTap:
                      (selectedIndex.isNotEmpty && isChecked)
                          ? () {
                            print("Next button pressed");
                            // Navigator.push(...);
                          }
                          : null,
                  child: Center(
                    child: Text(
                      "Next",
                      style: TextStyle(fontSize: 20, color: Colors.white),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
