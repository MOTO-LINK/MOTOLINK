import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart'; // استخدم ColorsApp بدلاً من Coloring
import 'package:moto/general/home/widgets/Home_Bar.dart';
import 'package:moto/general/home/widgets/TilesListview.dart';
import 'package:moto/general/home/widgets/photos.dart';

class home extends StatefulWidget {
  const home({super.key});

  @override
  State<home> createState() => _homeState();
}

class _homeState extends State<home> {
  final colors = ColorsApp();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: colors.primaryColor,
          title: const Text(
            'SohaG, EGYPT',
            style: TextStyle(color: Colors.white, fontSize: 19),
          ),
          actions: [
            IconButton(
                onPressed: () {},
                icon: const CircleAvatar(
                  backgroundImage: AssetImage('assets/images/avatarprofile.jpg'),
                  radius: 15,
                )),
            IconButton(
                onPressed: () {},
                icon: const Icon(
                  Icons.local_offer_outlined,
                  color: Color(0XFFF6B130),
                )),
          ],
        ),
        backgroundColor: colors.secondaryColor,
        body: ListView(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              child: Row(
                children: [
                  SearchBar(
                    constraints: const BoxConstraints(
                      maxWidth: 295,
                      minHeight: 40,
                    ),
                    leading: const Icon(
                      Icons.search,
                      color: Colors.white,
                    ),
                    shape: WidgetStateProperty.all(RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(3))),
                    hintText: 'start service',
                    hintStyle: WidgetStateProperty.all(
                        const TextStyle(color: Colors.white)),
                    backgroundColor: WidgetStateProperty.all(colors.primaryColor),
                  ),
                  IconButton(
                      onPressed: () {},
                      icon: Icon(
                        Icons.info,
                        color: colors.accentColor,
                      )),
                  IconButton(
                      onPressed: () {},
                      icon: Icon(
                        size: 30,
                        Icons.favorite,
                        color: colors.accentColor,
                      ))
                ],
              ),
            ),
            const SizedBox(
              height: 20,
            ),
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
                  style: TextStyle(color: Color(0xffFF9800), fontSize: 15),
                ),
              ),
            ),
            const tiles_list(),
          ],
        ),
        bottomNavigationBar: const home_Bar(),
      ),
    );
  }
}