import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/custom_button.dart';

class Selectvehiclepage extends StatefulWidget {
  const Selectvehiclepage({super.key});

  @override
  State<Selectvehiclepage> createState() => _SelectvehiclepageState();
}

class _SelectvehiclepageState extends State<Selectvehiclepage> {
  int selectedIndex = 0;

  final List<String> imageUrls = [
    "assets/images/car_removebg.png", // car
    "assets/images/motorcycle.png",
    "assets/images/Scooter.png", // bicycle
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      appBar: CustomAppBar(
        title: "Complete your information!",
        imagePath: "assets/images/DELIVERY.png",
      ),
      body: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          children: [
            Text(
              "Choose the Vehicle",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            // الكاونترات فوق
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(3, (index) {
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      selectedIndex = index;
                    });
                  },
                  child: Column(
                    children: [
                      Container(
                        padding: EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color:
                              selectedIndex == index
                                  ? ColorsApp().secondaryColor
                                  : Colors.grey[200],
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: Image.asset(
                          imageUrls[index],
                          width: 60,
                          height: 60,
                        ),
                      ),
                      SizedBox(height: 5),
                      Text(
                        ['Tok tok', 'Scooter', 'Motorcycle'][index],
                        style: TextStyle(
                          color:
                              selectedIndex == index
                                  ? ColorsApp().secondaryColor
                                  : ColorsApp().primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),
            SizedBox(height: 10),
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  child: Container(
                    height: 2,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(2),
                      gradient: LinearGradient(
                        colors: [Colors.black, Color(0xFFB5022F)],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Container(
                    height: 2,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(2),
                      gradient: LinearGradient(
                        colors: [Color(0xFFB5022F), Colors.black],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 10),

            // الجزء المتغير حسب المركبة
            Expanded(
              child: AnimatedSwitcher(
                duration: Duration(milliseconds: 500),
                transitionBuilder: (Widget child, Animation<double> animation) {
                  final slide = Tween<Offset>(
                    begin: Offset(0.0, 0.2),
                    end: Offset.zero,
                  ).animate(animation);

                  return FadeTransition(
                    opacity: animation,
                    child: SlideTransition(position: slide, child: child),
                  );
                },
                child: getSelectedWidget(),
              ),
            ),

            CustomButton(txt: "Next", nameNextPage: "Personal_details_page"),
            SizedBox(height: 50),
          ],
        ),
      ),
    );
  }

  Widget getSelectedWidget() {
    switch (selectedIndex) {
      case 0:
        //  TOK TOK
        return Container(key: ValueKey(0), child: Column(children: [

            ],
          ));

      case 1:
        // SCOOTER
        return Container(
          key: ValueKey(1),
          padding: EdgeInsets.all(16),
          child: Column(children: [
              
            ],
          ),
        );

      case 2:
        // MOTOCYCLE
        return Container(
          key: ValueKey(2),
          padding: EdgeInsets.all(16),
          child: Column(children: [
              
            ],
          ),
        );

      default:
        return SizedBox.shrink();
    }
  }
}
