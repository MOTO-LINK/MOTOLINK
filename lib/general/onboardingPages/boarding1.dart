import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors_palette.dart';
import 'package:moto/core/widgets/custom_button.dart';
import 'package:moto/general/onboardingPages/boarding_image.dart';

class BoardingOne extends StatefulWidget {
  const BoardingOne({super.key});

  @override
  State<BoardingOne> createState() => _BoardingOneState();
}

class _BoardingOneState extends State<BoardingOne> {
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
                    color: ColorsApp.four,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: MaterialButton(
                    onPressed: () {},
                    child: Text(
                      "Skip",
                      style: TextStyle(fontSize: 17, color: ColorsApp.text),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 50),
            ImageBoarding(
              image: "assets/images/rider.png",
              colorBG: ColorsApp.second,
            ),
            Container(
              margin: EdgeInsets.only(top: 50),
              child: Text(
                "MotoLink",
                style: TextStyle(fontSize: 32, color: ColorsApp.text),
              ),
            ),
            Container(
              margin: EdgeInsets.symmetric(horizontal: 70, vertical: 30),
              child: Text(
                textAlign: TextAlign.center,
                "Get around your city quickly and safely. Request a Tuk-Tuk anytime and anywhere.",
                style: TextStyle(fontSize: 21, color: ColorsApp.main),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  height: 10,
                  width: 30,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: ColorsApp.second,
                  ),
                ),
                SizedBox(width: 5),
                CircleAvatar(
                  radius: 5,
                  backgroundColor: ColorsApp.main.withOpacity(0.8),
                ),
                SizedBox(width: 5),
                CircleAvatar(
                  radius: 5,
                  backgroundColor: ColorsApp.main.withOpacity(0.8),
                ),
              ],
            ),
            Expanded(child: Container()),
            CustomButton(txt: "Next", nameNextPage: "boarding_two"),
            Expanded(child: Container()),
          ],
        ),
      ),
    );
  }
}
