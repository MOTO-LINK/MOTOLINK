import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/general/home/widgets/Home_Bar.dart';
import 'package:moto/general/home/widgets/TilesListview.dart';
import 'package:moto/general/home/widgets/photos.dart';

class homePage extends StatefulWidget {
  const homePage({super.key});

  @override
  State<homePage> createState() => _homePageState();
}

class _homePageState extends State<homePage> {
  final colors = ColorsApp();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        extendBodyBehindAppBar: true, // هذا السطر يجعل الـ body خلف الـ AppBar
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(80),
          child: CustomAppBar(
            title: 'MotoLink',
            titleStyle: const TextStyle(
              fontFamily: "Schyler" ,
              color: Colors.white,
              fontSize: 25,
            ),
            imagePath: "assets/images/DELIVERY.png",
            
            onIconPressed: () {},
            onBackPressed: () {},
            backgroundColor: Colors.transparent, // اجعل خلفية الـ AppBar شفافة
          ),
        ),
        backgroundColor: Colors.transparent, // مهم جداً
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                colors.primaryColor,
                colors.secondaryColor,
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: ListView(
            children: [
              const SizedBox(height: 20),
              SizedBox(
                height: 300,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Image.asset('assets/images/0024.png'),
                    Padding(
                      padding: const EdgeInsets.only(top: 40, left: 40),
                      child: Column(
                        children: const [
                          photos(pic: 'assets/images/deliveryService.jpg', index: 0),
                          SizedBox(
                            height: 12,
                          ),
                          photos(pic: 'assets/images/ridesservice.jpg', index: 1),
                          SizedBox(
                            height: 12,
                          ),
                          photos(pic: 'assets/images/toktoksevice.jpg', index: 2),
                        ],
                      ),
                    )
                  ],
                ),
              ),
              const Padding(
                padding: EdgeInsets.only(left: 20, top: 8),
                child: SizedBox(
                  height: 30,
                  child: Text(
                    textAlign: TextAlign.start,
                    'Quick access',
                    style: TextStyle(color: Colors.white, fontSize: 15),
                  ),
                ),
              ),
              const tiles_list(),
            ],
          ),
        ),
        bottomNavigationBar: const home_Bar(),
      ),
    );
  }
}