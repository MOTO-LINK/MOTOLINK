import 'package:flutter/material.dart';
import 'package:moto/general/DeliveryRequestPage/wasl.dart';

class photos extends StatelessWidget {
  const photos({
    super.key,
    required this.pic,
    required this.index,
  });

  final String pic;
  final int index;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        String? rideType;
        if (index == 0) {
          rideType = 'motorcycle';
        } else if (index == 1) {
          rideType = 'scooter';
        } else if (index == 2) {
          rideType = 'rickshaw';
        }
        if (rideType != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => DeliveryRequestPage(initialRideType: rideType),
            ),
          );
        }
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Image.asset(width: 140, pic),
      ),
    );
  }
}