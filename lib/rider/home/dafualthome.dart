import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/driver/wallet/pages/accounts_page.dart';
import 'package:moto/general/DeliveryRequestPage/delivery_anything.dart';

import '../../general/map/utils/views/adresses.dart';

class homePageDAFUALT extends StatelessWidget {
  const homePageDAFUALT({super.key});

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
              
              Navigator.push(context, MaterialPageRoute(builder: (context) => DeliveryAnything(),));
            })

          ],
        ),
      ),
    );
  }
}
