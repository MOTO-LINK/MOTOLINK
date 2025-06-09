import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/custom_button.dart';
import 'package:moto/general/onboardingPages/boarding_image.dart';

class BoardingTwo extends StatefulWidget {
  const BoardingTwo({super.key});

  @override
  State<BoardingTwo> createState() => _BoardingTwoState();
}

class _BoardingTwoState extends State<BoardingTwo> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SizedBox(
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              children: [
                Expanded(child: Container()),
                Container(
                  margin: EdgeInsets.only(top: 50, right: 10),
                  height: 40,
                  width: 70,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: ColorsApp().SkipColor.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: MaterialButton(
                    onPressed: () {
                      Navigator.of(context).pushNamed("Login_Rider_Page");
                    },
                    child: Text(
                      "Skip",
                      style: TextStyle(fontSize: 17, color: Colors.black),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 50),
            ImageBoarding(
              image: "assets/images/rider.png",
              colorBG: ColorsApp().backgroundColor,
            ),
            Container(
              margin: EdgeInsets.only(top: 50),
              child: Text(
                "MotoLink",
                style: TextStyle(fontSize: 32, color: ColorsApp().textColor),
              ),
            ),
            Container(
              margin: EdgeInsets.symmetric(horizontal: 70, vertical: 30),
              child: Text(
                textAlign: TextAlign.center,
                "From groceries to gifts, MotoLink delivers everything you need — fast, safe, and right on time!",
                style: TextStyle(fontSize: 21, color: ColorsApp().textColor),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircleAvatar(
                  radius: 5,
                  backgroundColor: ColorsApp().primaryColor,
                ),
                SizedBox(width: 5),
                Container(
                  height: 10,
                  width: 30,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: ColorsApp().secondaryColor,
                  ),
                ),
                SizedBox(width: 5),
                CircleAvatar(
                  radius: 5,
                  backgroundColor: ColorsApp().primaryColor,
                ),
              ],
            ),
            Expanded(child: Container()),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: CustomButton(txt: "Next", nameNextPage: "boarding_three"),
            ),
            Expanded(child: Container()),
          ],
        ),
      ),
    );
  }
}
