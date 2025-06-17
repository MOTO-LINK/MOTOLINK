import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';

class homePage extends StatefulWidget {
  const homePage({super.key});

  @override
  State<homePage> createState() => _homePageState();
}

class _homePageState extends State<homePage> {
  final colors = ColorsApp();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorsApp().backgroundColor,
      body: Center(
        child: Column(
          children: [


            Text(
              'Welcome to the Default Home Page',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            MaterialButton(
                child: Text("click here"),
                onPressed: (){
              
            })


          ],
        ),
      ),
    );
  }
}

