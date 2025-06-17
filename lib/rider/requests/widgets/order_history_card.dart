import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:moto/rider/requests/models/ride_request_model.dart';
import 'package:moto/rider/requests/pages/order_details_page.dart';

class OrderHistoryCard extends StatelessWidget {
  const OrderHistoryCard({super.key, required this.ride});
  final RideRequestModel ride;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 15),
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: InkWell(
        onTap: () {
          // الانتقال لشاشة التفاصيل عند الضغط
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => OrderDetailsPage(ride: ride),
            ),
          );
        },
        borderRadius: BorderRadius.circular(15),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Row(
            children: [
              // أيقونة الطلب
              Image.asset("assets/images/DELIVERY.png", width: 50, height: 50),
              const SizedBox(width: 15),
              // تفاصيل الطلب
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      ride.serviceType, // اسم الخدمة
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      // تنسيق التاريخ والوقت
                      DateFormat(
                        'd MMMM yyyy, hh:mm a',
                      ).format(ride.requestTime),
                      style: TextStyle(color: Colors.grey[600], fontSize: 12),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              // السعر أو الحالة
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'EGP ${ride.estimatedFee.toStringAsFixed(2)}', // السعر
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                  ),
                  Text(
                    ride.status, // الحالة
                    style: TextStyle(
                      color:
                          ride.status == 'canceled' ? Colors.red : Colors.grey,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
