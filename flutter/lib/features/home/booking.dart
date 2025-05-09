import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';

class Riderhome extends StatefulWidget {
  const Riderhome({super.key});

  @override
  State<Riderhome> createState() => _RiderhomeState();
}

class _RiderhomeState extends State<Riderhome> {
  String? selectedVehicle;
  String? selectedOption;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage("assets/images/gps.jpeg"),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Positioned(
            top: 60,
            left: 20,
            right: 20,
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 15),
              decoration: BoxDecoration(
                color: ColorsApp.main,
                borderRadius: BorderRadius.circular(30),
                boxShadow: [BoxShadow(color: ColorsApp.second, blurRadius: 5)],
              ),
              child: TextField(
                decoration: InputDecoration(
                  hintText: "Search ...",
                  hintStyle: TextStyle(color: ColorsApp.title),
                  border: InputBorder.none,
                  icon: Icon(Icons.search, color: ColorsApp.icon),
                ),
              ),
            ),
          ),
          DraggableScrollableSheet(
            initialChildSize: 0.2,
            minChildSize: 0.2,
            maxChildSize: 0.7,
            builder: (context, scrollController) {
              return Container(
                padding: EdgeInsets.symmetric(horizontal: 15, vertical: 15),
                margin: EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: ColorsApp.main,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(color: ColorsApp.second, blurRadius: 5)
                  ],
                ),
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildVehicleOption(
                            'Scooter',
                            selectedVehicle == 'Scooter',
                            "assets/images/scooter.png",
                          ),
                          _buildVehicleOption(
                            'Motorcycle',
                            selectedVehicle == 'Motorcycle',
                            "assets/images/motocycle.png",
                          ),
                          _buildVehicleOption(
                            'Tuktuk',
                            selectedVehicle == 'Tuktuk',
                            "assets/images/tuktuk.png",
                          ),
                        ],
                      ),
                      //BuildSelectService(),
                      SizedBox(height: 15),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: EdgeInsets.only(left: 10, right: 10),
                            height: 60,
                            width: 175,
                            decoration: BoxDecoration(
                              border: Border.all(color: ColorsApp.second),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.add_ic_call_outlined,
                                  color: ColorsApp.second,
                                ),
                                SizedBox(width: 10),
                                Text(
                                  "From",
                                  style: TextStyle(color: Colors.white),
                                ),
                                Expanded(child: Container()),
                              ],
                            ),
                          ),
                          Container(
                            padding: EdgeInsets.only(left: 10, right: 10),
                            height: 60,
                            width: 175,
                            decoration: BoxDecoration(
                              border: Border.all(color: ColorsApp.second),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.add_ic_call_outlined,
                                  color: ColorsApp.second,
                                ),
                                SizedBox(width: 10),
                                Text(
                                  "Pick From Map",
                                  style: TextStyle(color: Colors.white),
                                ),
                                Expanded(child: Container()),
                              ],
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 15),
                      Container(
                        height: 60,
                        width: double.infinity,
                        padding: EdgeInsets.only(left: 10, right: 10),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: ColorsApp.second),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.ad_units_rounded,
                              color: ColorsApp.second,
                            ),
                            SizedBox(width: 10),
                            Text("To",
                                style: TextStyle(
                                  color: Colors.white,
                                )),
                          ],
                        ),
                      ),
                      Divider(
                        color: ColorsApp.second,
                        height: 30,
                        thickness: 1,
                      ),
                      Row(
                        children: [
                          Expanded(
                            child: _infoItem(Icons.location_on, '15 Km'),
                          ),
                          Expanded(
                            child: _infoItem(Icons.access_time, '30 min'),
                          ),
                          Expanded(
                            child: _infoItem(Icons.attach_money, '180 EGP'),
                          ),
                        ],
                      ),
                      Divider(
                        color: ColorsApp.second,
                        height: 30,
                        thickness: 1,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildVehicleOption(
    String vehicle,
    bool isSelected,
    String imagename,
  ) {
    return GestureDetector(
      onTap: () {},
      child: Padding(
        padding: const EdgeInsets.only(top: 15, bottom: 15),
        child: Container(
          height: 90,
          width: 112,
          padding: EdgeInsets.only(top: 15, bottom: 15),
          //margin: EdgeInsets.only(top: 10, bottom: 10),
          decoration: BoxDecoration(
            color: isSelected ? ColorsApp.second : ColorsApp.main,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: ColorsApp.second),
          ),

          child: Column(
            children: [
              Image.asset(imagename, width: 35, height: 35),
              Text(
                vehicle,
                style: TextStyle(
                  fontSize: 12,
                  color: isSelected ? ColorsApp.second : Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  //******************************************** */

  Widget buildOption(String title) {
    final isSelected = selectedOption == title;
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedOption = title;
        });
      },
      child: Container(
        padding: EdgeInsets.only(left: 10, right: 10),
        height: 60,
        width: 175,
        decoration: BoxDecoration(
          border: Border.all(color: ColorsApp.second),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Text(
              title,
              style: TextStyle(
                  color: isSelected ? ColorsApp.second : Colors.white),
            ),
            Expanded(child: Container()),
            Icon(
              Icons.radio_button_checked,
              color: isSelected ? ColorsApp.second : Colors.white,
            ),
          ],
        ),
      ),
    );
  }

  //******************************* */
}

Widget _infoItem(IconData icon, String text) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(icon, color: ColorsApp.second),
      SizedBox(width: 6),
      Flexible(child: Text(text, style: TextStyle(color: Colors.white))),
    ],
  );
}

class BuildSelectService extends StatelessWidget {
  BuildSelectService({super.key});

  final List myItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.amber,
      padding: EdgeInsets.symmetric(horizontal: 10),
      child: DropdownMenu(
        hintText: 'Select Service',
        width: double.infinity,
        textStyle: TextStyle(color: Colors.black),
        inputDecorationTheme: InputDecorationTheme(
          border: InputBorder.none,
          hintStyle: TextStyle(color: Colors.black),
        ),
        dropdownMenuEntries:
            myItems.map((e) => DropdownMenuEntry(value: e, label: e)).toList(),
        onSelected: (value) {
          debugPrint('Value : $value');
          FocusManager.instance.primaryFocus?.unfocus();
        },
        enableSearch: true,
        requestFocusOnTap: true,
        enableFilter: true,
      ),
    );
  }
}
