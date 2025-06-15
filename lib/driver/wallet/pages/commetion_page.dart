import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/widgets/CustomAppBar.dart';
import '../../../rider/auth/core/services/storage_service.dart';

import '../controller/balance_cubit.dart';
import '../controller/commetion_cubit.dart';
import '../controller/commetion_state.dart';
import '../widgets/content_model_sheet.dart';
import '../widgets/custom_loading_indicator.dart';

class CommissionPage extends StatefulWidget {
  const CommissionPage({super.key});

  @override
  State<CommissionPage> createState() => _CommissionPageState();
}

class _CommissionPageState extends State<CommissionPage> {
  String? token;
  String selectedYear = '2025';
  final List<String> years = ['2025', '2024', '2023', '2022'];
  final List<String> monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  final Map<String, bool> expanded = {
    for (var month in [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ])
      month: false,
  };
  bool isLoadingYear = false;


  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    final tokenFromStorage = await StorageService().getToken();
    print("TokenBalance+++++++ $tokenFromStorage");
    if (tokenFromStorage != null) {
      setState(() => token = tokenFromStorage);
      context.read<RidesCubit>().fetchRides();
      context.read<BalanceCubit>().fetchBalance();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: BlocBuilder<BalanceCubit, BalanceState>(
          builder: (context, state) {
            String amountText = '0 EGP';
            double balanceValue = 0;
            if (state is BalanceSuccess) {
              balanceValue = state.balance.balance;
              amountText = '${balanceValue.toStringAsFixed(2)} EGP';
            }

            return CustomAppBar(
              title: "Balance",
              centerTitle: true,
              amount: amountText,
              showBackButton: true,
              appBarHeight: 90,
              onBackPressed: () {},
            );
          },
        ),
      ),
      body: token == null
          ? const CustomLoadingIndicator()
          : Padding(
        padding: const EdgeInsets.all(18.0),
        child: BlocBuilder<BalanceCubit, BalanceState>(
          builder: (context, state) {
            double balanceValue = 0;
            if (state is BalanceSuccess) {
              balanceValue = state.balance.balance;
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Flexible(
                      child: GestureDetector(
                        onTap: () => _showBottomSheet('Deposit', balanceValue),
                        child: buildActionButton('Deposit', Icons.arrow_circle_up_outlined, Colors.red),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Flexible(
                      child: GestureDetector(
                        onTap: () => _showBottomSheet('Withdraw', balanceValue),
                        child: buildActionButton('Withdraw', Icons.arrow_circle_down_outlined, Colors.green),
                      ),
                    ),
                  ],
                ),
                DropdownButton<String>(
                  value: selectedYear,
                  onChanged: (val) async {
                    if (val != null) {
                      setState(() {
                        isLoadingYear = true;
                        selectedYear = val;
                        for (var key in expanded.keys) {
                          expanded[key] = false;
                        }
                      });


                      await Future.delayed(const Duration(seconds: 1));

                      setState(() {
                        isLoadingYear = false;
                      });
                    }
                  },

                  items: years
                      .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                      .toList(),
                ),
                const SizedBox(height: 10),
                Expanded(
                  child: BlocBuilder<RidesCubit, RidesState>(
                    builder: (context, state) {
                      if (isLoadingYear) {
                        return const CustomLoadingIndicator();
                      }

                      if (state is RidesLoading) {
                        return const CustomLoadingIndicator();
                      } else if (state is RidesLoaded) {
                        print("Successfully++++");
                        final ridesByMonth = <String, List<Map<String, dynamic>>>{};
                        for (var month in monthNames) {
                          ridesByMonth[month] = [];
                        }
                        for (final ride in state.rides) {
                          final rideYear = ride.requestTime.year.toString();
                          if (rideYear == selectedYear) {
                            final month = _getMonthName(ride.requestTime.month);
                            final commission = (ride.estimatedFee * 0.2).toInt();

                            ridesByMonth[month]?.add({
                              'icon': ride.rideType == 'delivery' ? '📦' : '🛵',
                              'title': ride.serviceType,
                              'amount': commission,
                              'code': ride.requestId,
                              'date': '${ride.requestTime.day}-${ride.requestTime.month}-${ride.requestTime.year}'
                            });
                          }
                        }

                        return ListView(
                          children: monthNames.map((month) {
                            final orders = ridesByMonth[month] ?? [];
                            final isExpanded = expanded[month]!;
                            final monthTotal = orders.fold(0, (int sum, o) => sum + (o['amount'] as int));

                            return Card(
                              margin: const EdgeInsets.symmetric(vertical: 8),
                              child: Column(
                                children: [
                                  ListTile(
                                    title: Text('Commission of $month'),
                                    trailing: IconButton(
                                      icon: Icon(isExpanded ? Icons.expand_less : Icons.expand_more),
                                      onPressed: () {
                                        setState(() {
                                          expanded[month] = !isExpanded;
                                        });
                                      },
                                    ),
                                  ),
                                  if (isExpanded)
                                    orders.isEmpty
                                        ? const Padding(
                                      padding: EdgeInsets.all(12.0),
                                      child: Text('No commission data available'),
                                    )
                                        : Column(
                                      children: [
                                        ...orders.map((o) => ListTile(
                                          leading: Text(o['icon'], style: const TextStyle(fontSize: 24)),
                                          title: Text(o['title']),
                                          subtitle: Text('${o['date']} • ${o['code']}'),
                                          trailing: Text(
                                            '${o['amount']} EGP',
                                            style: const TextStyle(
                                                color: Color(0xFFB5022F),
                                                fontWeight: FontWeight.bold),
                                          ),
                                        )),
                                        Align(
                                          alignment: Alignment.centerRight,
                                          child: Padding(
                                            padding: const EdgeInsets.only(right: 12.0, bottom: 10),
                                            child: Text(
                                              'Total: $monthTotal EGP',
                                              style: const TextStyle(
                                                  color: Colors.green, fontWeight: FontWeight.bold),
                                            ),
                                          ),
                                        )
                                      ],
                                    )
                                ],
                              ),
                            );
                          }).toList(),
                        );
                      }
                      return const SizedBox();
                    },
                  ),
                )
              ],
            );
          },
        ),
      ),
    );
  }

  void _showBottomSheet(String label, double balanceValue) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return ContentModelSheet(
          isWithdraw: true,
          label: label,
          amount: '${balanceValue.toStringAsFixed(2)} EGP',
          hint: label == 'Deposit'
              ? 'The amount required to be paid'
              : 'Your outstanding balance',
          txtButton: label == 'Deposit' ? 'Confirm payment' : 'Confirm request',
          availableBalance: balanceValue.toInt(),
          onTransactionComplete: (_) {},
        );
      },
    );
  }

  Widget buildActionButton(String label, IconData icon, Color iconColor) {
    return Container(
      width: 200,
      height: 70,
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFB5022F)),
      ),
      child: Center(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
            Icon(icon, color: iconColor),
          ],
        ),
      ),
    );
  }

  String _getMonthName(int monthNumber) {
    return monthNames[monthNumber - 1];
  }
}
