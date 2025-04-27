import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';
import 'package:motolink/core/widgets/custom_button.dart';
import 'package:motolink/features/general/onboarding_pages/image_boarding.dart';

class BoardingThree extends StatefulWidget {
  BoardingThree({super.key});

  @override
  State<BoardingThree> createState() => _BoardingThreeState();
}

class _BoardingThreeState extends State<BoardingThree> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                      color: ColorsPalette.borderColor,
                      borderRadius: BorderRadius.circular(30)),
                  child: MaterialButton(
                    onPressed: () {},
                    child: Text(
                      "Skip",
                      style: TextStyle(
                        fontSize: 17,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(
              height: 50,
            ),
            ImageBoarding(image: "assets/images/test.jpeg"),
            Container(
              margin: EdgeInsets.only(top: 50),
              child: Text(
                "MotoLink",
                style: TextStyle(
                  fontSize: 32,
                  color: Colors.white,
                ),
              ),
            ),
            Container(
              margin: EdgeInsets.symmetric(horizontal: 70, vertical: 30),
              child: Text(
                textAlign: TextAlign.center,
                "Need it now? Our motorcycles are ready to deliver your packages in record time.",
                style: TextStyle(
                  fontSize: 21,
                  color: Colors.white,
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircleAvatar(
                  radius: 6,
                  backgroundColor: ColorsPalette.borderColor.withOpacity(0.8),
                ),
                SizedBox(
                  width: 5,
                ),
                CircleAvatar(
                  radius: 6,
                  backgroundColor: ColorsPalette.borderColor.withOpacity(0.8),
                ),
                SizedBox(
                  width: 5,
                ),
                Container(
                  height: 11,
                  width: 30,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: ColorsPalette.baseColor,
                  ),
                ),
              ],
            ),
            Expanded(child: Container()),
            CustomButton(
              txt: "Next",
            ),
            Expanded(child: Container()),
          ],
        ),
      ),
    );
  }
}
