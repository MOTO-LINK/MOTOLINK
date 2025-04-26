import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';

class OffersView extends StatelessWidget {
  const OffersView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(

      appBar: CustomAppBar(txt: "Offers"),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color:ColorsPalette.baseColor,
                  borderRadius: BorderRadius.circular(100),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      "Daily Reminder",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.black,
                      ),
                    ),
                    SizedBox(height: 24),
                    Image.asset("assets/images/logo.jpeg", height: 70),
                    SizedBox(height: 24),
                   Row(
                     mainAxisAlignment: MainAxisAlignment.center,
                     children: [
                     Text(
                       "M",
                       style: TextStyle(
                         fontSize: 20,
                         fontWeight: FontWeight.w900,
                         color: Colors.red,
                       ),
                     ),
                     Text(
                       "OTOLINK HOURS",
                       style: TextStyle(
                         fontSize: 20,
                         fontWeight: FontWeight.w900,
                         color: Colors.black,
                         fontFamily: "italic"
                       ),
                     )
                   ],),
                    SizedBox(height: 10),
                    Container(
                      decoration: BoxDecoration(
                        color:Colors.amber[200],
                        borderRadius: BorderRadius.circular(50),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          children: [
                            Text(
                              "SALE 20%",
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: Colors.black,
                              ),
                            ),
                            SizedBox(height: 40),
                            Text(
                              "10AM - 2PM",
                              style: TextStyle(
                                fontSize: 24,
                                color: Colors.black,
                                fontWeight: FontWeight.w800
                              ),
                            ),
                            SizedBox(height: 24),
                            Divider(thickness: 3,),
                            SizedBox(height: 24),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                Text(
                                  "Ready",
                                  style: TextStyle(fontSize: 20, color: Colors.black,
                                  fontWeight: FontWeight.w700
                                  ),
                                ),
                                Text(
                                  "Very Ready",
                                  style: TextStyle(
                                      fontWeight: FontWeight.w700,
                                      fontSize: 20, color: Colors.red),
                                ),
                              ],
                            ),
                            SizedBox(height: 20),

                          ],
                        ),
                      ),
                    ),
                    SizedBox(height: 24),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        minimumSize:  Size(263, 46),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      onPressed: () {},
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 30),
                        child: Text("Dismiss", style: TextStyle(color: Colors.white)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
