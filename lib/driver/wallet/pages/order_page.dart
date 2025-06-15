import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:moto/driver/wallet/controller/commetion_cubit.dart';
import '../../../core/widgets/CustomAppBar.dart';
import '../../../rider/auth/core/services/storage_service.dart';
import '../controller/commetion_state.dart';
import '../controller/rider_model.dart';
import '../controller/wallet_cubit.dart';
import '../widgets/custom_loading_indicator.dart';

class OrdersPage extends StatelessWidget {
  const OrdersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => WalletCubit(),
      child: const OrdersView(),
    );
  }
}

class OrdersView extends StatefulWidget {
  const OrdersView({super.key});

  @override
  State<OrdersView> createState() => _OrdersViewState();
}

class _OrdersViewState extends State<OrdersView> {
  List<RideModel> rides = [];
  bool isLoading = true;
  final Map<String, List<Map<String, String>>> monthlyOrders = {};
  final Map<String, bool> expandedMonths = {};
  final List<String> years = ['2023', '2024', '2025'];
  String selectedYear = '2025';

  final Map<String, String> monthNames = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  };

  @override
  void initState() {
    super.initState();
    _loadRides();
  }

  Future<void> _loadRides() async {
    final token = await StorageService().getToken();
    if (token != null) {
      final cubit = context.read<RidesCubit>();
      await cubit.fetchRides();
      final state = cubit.state;
      if (state is RidesLoaded) {
        setState(() {
          rides = state.rides;
          _buildMonthlyOrders();
          isLoading = false;
        });
      } else {
        setState(() {
          isLoading = false;
        });
      }
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }

  void _buildMonthlyOrders() {
    monthlyOrders.clear();
    expandedMonths.clear();

    for (var i = 1; i <= 12; i++) {
      final month = i.toString().padLeft(2, '0');
      monthlyOrders[month] = [];
      expandedMonths[month] = false;
    }

    for (var ride in rides) {
      if (ride.requestTime.year.toString() == selectedYear) {
        final month = ride.requestTime.month.toString().padLeft(2, '0');
        final title = '${ride.serviceType} - ${ride.rideType}';
        final date = '${ride.requestTime.year}-$month-${ride.requestTime.day.toString().padLeft(2, '0')}';
        final amount = '${ride.estimatedFee} EGP';

        monthlyOrders[month]!.add({
          'title': title,
          'date': date,
          'amount': amount,
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Orders',
        showBackButton: true,
        amount: '${rides.length} Order   ',
        centerTitle: true,
        onBackPressed: () {},
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            DropdownButton<String>(
              value: selectedYear,
              onChanged: (val) async {
                if (val != null && val != selectedYear) {
                  setState(() {
                    selectedYear = val;
                    isLoading = true;
                  });
                  await _loadRides();
                }
              },
              items: years.map((String year) {
                return DropdownMenuItem<String>(
                  value: year,
                  child: Text(year, style: const TextStyle(fontSize: 18)),
                );
              }).toList(),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: isLoading
                  ? const CustomLoadingIndicator()
                  : ListView(
                children: monthNames.keys.map((month) {
                  final orders = monthlyOrders[month]!;
                  final isExpanded = expandedMonths[month]!;
                  final total = orders.fold<int>(
                    0,
                        (sum, item) => sum + int.parse(item['amount']!.split(' ').first),
                  );
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Column(
                      children: [
                        ListTile(
                          title: Text('Orders of ${monthNames[month]}'),
                          trailing: IconButton(
                            icon: Icon(isExpanded ? Icons.expand_less : Icons.expand_more),
                            onPressed: () {
                              setState(() {
                                expandedMonths[month] = !isExpanded;
                              });
                            },
                          ),
                        ),
                        if (isExpanded)
                          orders.isNotEmpty
                              ? Column(
                            children: [
                              ...orders.map((order) {
                                return ListTile(
                                  title: Text(order['title']!),
                                  subtitle: Text(order['date']!),
                                  trailing: Text(
                                    order['amount']!,
                                    style: const TextStyle(color: Color(0xFFB5022F)),
                                  ),
                                );
                              }),
                              Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: Align(
                                  alignment: Alignment.centerRight,
                                  child: Text(
                                    'Total: $total EGP',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.green,
                                    ),
                                  ),
                                ),
                              )
                            ],
                          )
                              : const Padding(
                            padding: EdgeInsets.all(12.0),
                            child: Text(
                              'No orders this month.',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
