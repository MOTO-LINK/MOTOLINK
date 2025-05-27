import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors_palette.dart';
import 'package:moto/core/widgets/custom_button.dart';
import 'package:moto/general/onboardingPages/boarding_image.dart';

class BoardingThree extends StatefulWidget {
  const BoardingThree({super.key});

  @override
  State<BoardingThree> createState() => _BoardingThreeState();
}

class _BoardingThreeState extends State<BoardingThree> {
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
                      style: TextStyle(fontSize: 17, color: Colors.black),
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
                style: TextStyle(fontSize: 32, color: ColorsApp.main),
              ),
            ),
            Container(
              margin: EdgeInsets.symmetric(horizontal: 70, vertical: 30),
              child: Text(
                textAlign: TextAlign.center,
                "Need it now? Our motorcycles are ready to deliver your packages in record time.",
                style: TextStyle(fontSize: 21, color: ColorsApp.main),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircleAvatar(
                  radius: 6,
                  backgroundColor: ColorsApp.main.withOpacity(0.8),
                ),
                SizedBox(width: 5),
                CircleAvatar(
                  radius: 6,
                  backgroundColor: ColorsApp.main.withOpacity(0.8),
                ),
                SizedBox(width: 5),
                Container(
                  height: 11,
                  width: 30,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: ColorsApp.second,
                  ),
                ),
              ],
            ),
            Expanded(child: Container()),
            CustomButton(txt: "Next", nameNextPage: "chooseRiderOrDriverPage"),
            Expanded(child: Container()),
          ],
        ),
      ),
    );
  }
}
