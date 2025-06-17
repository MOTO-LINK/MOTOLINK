import 'package:flutter/material.dart';
import 'package:moto/rider/requests/models/ride_request_model.dart';
import 'package:moto/rider/requests/services/orders_service.dart';
import 'package:moto/rider/requests/widgets/order_history_card.dart';

class OngoingRequestsTab extends StatefulWidget {
  const OngoingRequestsTab({super.key});

  @override
  State<OngoingRequestsTab> createState() => _OngoingRequestsTabState();
}

class _OngoingRequestsTabState extends State<OngoingRequestsTab> {
  // هنا الـ Future سيعود بـ RideRequestModel واحد فقط وقد يكون null
  late Future<RideRequestModel?> futureOngoingRide;

  @override
  void initState() {
    super.initState();
    // استدعاء الدالة الخاصة بالطلب النشط
    futureOngoingRide = OrdersServiceRequests().fetchActiveRide();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<RideRequestModel?>(
      future: futureOngoingRide,
      builder: (context, snapshot) {
        // حالة التحميل
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        // حالة الخطأ
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }

        // في حالة النجاح، تحقق إذا كانت البيانات موجودة (ليست null)
        final ride = snapshot.data;
        if (ride == null) {
          // إذا لم يكن هناك طلب نشط
          return const Center(
            child: Text('No ongoing requests at the moment.'),
          );
        } else {
          // إذا وجد طلب نشط، اعرضه باستخدام نفس الكارت
          return Padding(
            padding: const EdgeInsets.all(15.0),
            // لا نستخدم ListView هنا لأن لدينا عنصراً واحداً فقط
            child: OrderHistoryCard(ride: ride),
          );
        }
      },
    );
  }
}
