import 'package:flutter/material.dart';
import 'package:moto/rider/requests/models/ride_request_model.dart';
import 'package:moto/rider/requests/services/orders_service.dart';
import 'package:moto/rider/requests/widgets/order_history_card.dart';

class CompletedRequestsTab extends StatefulWidget {
  const CompletedRequestsTab({super.key});

  @override
  State<CompletedRequestsTab> createState() => _CompletedRequestsTabState();
}

class _CompletedRequestsTabState extends State<CompletedRequestsTab> {
  late Future<List<RideRequestModel>> futureCompletedRides;

  @override
  void initState() {
    super.initState();
    // هنا تقوم بجلب البيانات
    futureCompletedRides = _fetchData();
  }

  // دالة لجلب وتصفية الطلبات المكتملة
  Future<List<RideRequestModel>> _fetchData() async {
    final history = await OrdersServiceRequests().fetchRideHistory();
    if (history != null) {
      // فلترة الطلبات لعرض المكتملة فقط
      return history.items.where((ride) => ride.status == 'completed').toList();
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<RideRequestModel>>(
      future: futureCompletedRides,
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
          return const Center(child: Text('No completed requests found.'));
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
