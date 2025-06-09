import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/utils/toast_message.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/custom_button.dart';

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
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "Welcome to Your Journey!",
        imagePath: "assets/images/DELIVERY.png",
        appBarHeight: 140,
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
                      selectedType = "driver";
                    });
                    print("driver");
                  },
                  child: Container(
                    height: 120,
                    width: 150,
                    decoration: BoxDecoration(
                      color:
                          selectedType == "driver"
                              ? ColorsApp().secondaryColor
                              : Colors.grey,
                      border: Border.all(color: ColorsApp().primaryColor),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset("assets/images/rider.png", scale: 15),
                          Text(
                            "Driver",
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
                      color:
                          selectedType == "rider"
                              ? ColorsApp().secondaryColor
                              : Colors.grey,
                      border: Border.all(color: ColorsApp().primaryColor),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset("assets/images/rider.png", scale: 15),
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
            SizedBox(height: 100),
            Container(
              width: double.infinity,
              height: 60,
              decoration: BoxDecoration(
                gradient:
                    selectedType.isEmpty
                        ? LinearGradient(colors: [Colors.grey, Colors.grey])
                        : LinearGradient(
                          colors: [
                            ColorsApp().secondaryColor,
                            ColorsApp().primaryColor,
                          ],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ),
                borderRadius: BorderRadius.circular(15),
              ),
              child: ElevatedButton(
                onPressed:
                    selectedType.isEmpty
                        ? () {
                          showToast("Please select a user type first");
                        }
                        : () {
                          if (selectedType == "rider") {
                            Navigator.of(context).pushNamed("Login_Rider_Page");
                          } else if (selectedType == "driver") {
                            Navigator.of(
                              context,
                            ).pushNamed("Login_driver_page");
                          }
                        },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
                child: Center(
                  child: Text(
                    "Next",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
            Expanded(child: Container()),
          ],
        ),
      ),
    );
  }
}
