import 'package:flutter/material.dart';
import 'package:moto/rider/requests/models/ride_request_model.dart';
import 'package:moto/rider/requests/services/orders_service.dart';
import 'package:moto/rider/requests/widgets/order_history_card.dart';

class CanceledRequestsTab extends StatefulWidget {
  const CanceledRequestsTab({super.key});

  @override
  State<CanceledRequestsTab> createState() => _CanceledRequestsTabState();
}

class _CanceledRequestsTabState extends State<CanceledRequestsTab> {
  late Future<List<RideRequestModel>> futureCanceledRides;

  @override
  void initState() {
    super.initState();
    futureCanceledRides = _fetchData();
  }

  // دالة لجلب وتصفية الطلبات الملغية
  Future<List<RideRequestModel>> _fetchData() async {
    final history = await OrdersServiceRequests().fetchRideHistory();
    if (history != null) {
      // **الفرق هنا**: فلترة الطلبات لعرض الملغية فقط
      return history.items.where((ride) => ride.status == 'canceled').toList();
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<RideRequestModel>>(
      future: futureCanceledRides,
      builder: (context, snapshot) {
        // حالة التحميل
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        // حالة الخطأ
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }
        // حالة عدم وجود بيانات
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text('No canceled requests found.'));
        }

        // عرض القائمة في حالة النجاح
        final rides = snapshot.data!;
        return ListView.builder(
          padding: const EdgeInsets.all(15),
          itemCount: rides.length,
          itemBuilder: (context, index) {
            return OrderHistoryCard(ride: rides[index]);
          },
        );
      },
    );
  }
}
