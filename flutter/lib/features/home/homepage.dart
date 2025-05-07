import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';
import 'package:motolink/features/home/widgets/nev_bar.dart';
import 'package:motolink/features/home/widgets/photos.dart';
import 'package:motolink/features/home/widgets/tileslist.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: ColorsApp.main,
          title: const Text(
            'SohaG, EGYPT',
            style: TextStyle(color: Colors.white, fontSize: 19),
          ),
          actions: [
            IconButton(
                onPressed: () {},
                icon: const CircleAvatar(
                  backgroundImage:
                      AssetImage('assets/images/avatarprofile.jpg'),
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
        backgroundColor: Colors.white,
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
                    backgroundColor: WidgetStateProperty.resolveWith(
                      (states) {
                        if (states.contains(WidgetState.pressed)) {
                          return const Color.fromARGB(255, 255, 249, 249);
                        }
                        return ColorsApp.main;
                      },
                    ),
                  ),
                  IconButton(
                      onPressed: () {},
                      icon: Icon(
                        Icons.info,
                        color: ColorsApp.icon,
                      )),
                  IconButton(
                      onPressed: () {},
                      icon: Icon(
                        size: 30,
                        Icons.favorite,
                        color: ColorsApp.icon,
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
                  const Padding(
                    padding: EdgeInsets.only(top: 40, left: 40),
                    child: Column(
                      children: [
                        photos(pic: 'assets/images/deliveryService.jpg'),
                        SizedBox(
                          height: 12,
                        ),
                        photos(pic: 'assets/images/ridesservice.jpg'),
                        SizedBox(
                          height: 12,
                        ),
                        photos(pic: 'assets/images/toktoksevice.jpg')
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
