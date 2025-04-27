import 'package:flutter/material.dart';
import '../../../../../core/widgets/custom_app_bar.dart';

class RecentRidesView extends StatelessWidget {
  const RecentRidesView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(txt: "Recent Rides"),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [

                CircleAvatar(
                  radius: 24,
                  backgroundImage: AssetImage('assets/images/test.jpeg'),
                ),

                Text('Your rated', style: TextStyle(color: Colors.white)),
                SizedBox(width: 5),
                Row(
                  children: [
                    Icon(Icons.star, color: Colors.yellow),
                    Icon(Icons.star, color: Colors.yellow),
                    Icon(Icons.star, color: Colors.yellow),
                    Icon(Icons.star, color: Colors.yellow),
                    Icon(Icons.star, color: Colors.white),
                  ],
                ),
              ],
            ),
            SizedBox(height: 20),
            Card(
              color: Colors.grey[900],
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 50,horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Scooter Rides', style: TextStyle(
                        fontSize: 20,
                        color: Colors.white, fontWeight: FontWeight.w900)),
                    SizedBox(height: 60),
                    RideDataRow(value: '\$15', label: 'Trip Fare',),
                    SizedBox(height: 60),
                    RideDataRow(label: 'Subtotal', value: '\$15'),
                    SizedBox(height: 60),
                    RideDataRow(label: 'Tolls, Surcharges, and Fees',value:  '\$5'),
                    SizedBox(height: 60),
                    Divider(color: Colors.grey),
                    SizedBox(height: 24),
                    RideDataRow(label: 'Total', value: '\$20', isTotal: true),
                  ],
                ),
              ),
            ),
          ],
        ),
      )
    );
  }
}


class RideDataRow extends StatelessWidget {
  const RideDataRow({super.key, required this.label,  required this.value,  this.isTotal= false});
  final String  label,value;
  final bool isTotal ;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: isTotal ? Colors.yellow : Colors.white,
              fontWeight: isTotal ? FontWeight.w600 : FontWeight.w400,
              fontSize: isTotal ? 20 : 18,
            ),
          ),
          Text(
            value,
            style: TextStyle(
                color: isTotal ? Colors.yellow : Colors.white,
                fontWeight: isTotal ? FontWeight.w800 : FontWeight.normal,
                fontSize: 20
            ),
          ),
        ],
      ),
    );
  }
}