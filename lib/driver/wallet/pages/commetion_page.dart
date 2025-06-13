import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/widgets/CustomAppBar.dart';
import '../../../rider/auth/core/services/storage_service.dart';
import '../controller/wallet_cubit.dart';
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
  final Map<String, bool> expanded = {
    for (var month in [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ])
      month: false,
  };

  int availableBalance = 0;

  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    final tokenFromStorage = await StorageService().getToken();
    if (tokenFromStorage != null) {
      setState(() => token = tokenFromStorage);
      final walletCubit = context.read<WalletCubit>();
      walletCubit.fetchRides();
      walletCubit.fetchBalance();
    } else {
      print("⚠️ Token not found!");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: BlocBuilder<WalletCubit, WalletState>(
          builder: (context, walletState) {
            String amountText = '0 EGP';
            if (walletState is BalanceSuccess) {
              amountText = '${walletState.balance.amountOwed.toStringAsFixed(2)} EGP';
              availableBalance = walletState.balance.amountOwed.toInt();
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                GestureDetector(
                  onTap: () => _showBottomSheet('Deposit'),
                  child: buildActionButton('Deposit', Icons.arrow_circle_up_outlined, Colors.red),
                ),
                GestureDetector(
                  onTap: () => _showBottomSheet('Withdraw'),
                  child: buildActionButton('Withdraw', Icons.arrow_circle_down_outlined, Colors.green),
                ),
              ],
            ),
            DropdownButton<String>(
              value: selectedYear,
              onChanged: (val) {
                if (val != null) {
                  setState(() {
                    selectedYear = val;
                  });
                }
              },
              items: years.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: BlocBuilder<WalletCubit, WalletState>(
                builder: (context, state) {
                  if (state is RidesLoading) {
                    return const CustomLoadingIndicator();
                  } else if (state is RidesLoaded) {
                    final ridesByMonth = <String, List<Map<String, dynamic>>>{};
                    int totalCommission = 0;

                    for (final ride in state.rides) {
                      final month = _getMonthName(ride.requestTime.month);
                      final commission = (ride.estimatedFee * 0.2).toInt();
                      totalCommission += commission;

                      ridesByMonth.putIfAbsent(month, () => []).add({
                        'icon': ride.rideType == 'delivery' ? '📦' : '🛵',
                        'title': ride.serviceType,
                        'amount': commission,
                        'code': ride.requestId,
                        'date': '${ride.requestTime.day}-${ride.requestTime.month}-${ride.requestTime.year}'
                      });
                    }

                    availableBalance += totalCommission;

                    return ListView(
                      children: ridesByMonth.entries.map((entry) {
                        final month = entry.key;
                        final orders = entry.value;
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
                                Column(
                                  children: [
                                    ...orders.map((o) => ListTile(
                                      leading: Text(o['icon'], style: const TextStyle(fontSize: 24)),
                                      title: Text(o['title']),
                                      subtitle: Text('${o['date']} • ${o['code']}'),
                                      trailing: Text(
                                        '${o['amount']} EGP',
                                        style: const TextStyle(color: Color(0xFFB5022F), fontWeight: FontWeight.bold),
                                      ),
                                    )),
                                    Align(
                                      alignment: Alignment.centerRight,
                                      child: Padding(
                                        padding: const EdgeInsets.only(right: 12.0, bottom: 10),
                                        child: Text(
                                          'Total: $monthTotal EGP',
                                          style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
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
        ),
      ),
    );
  }

  void _showBottomSheet(String label) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return ContentModelSheet(
          label: label,
          amount: '$availableBalance EGP',
          hint: label == 'Deposit' ? 'The amount required to be paid' : 'Your outstanding balance',
          txtButton: label == 'Deposit' ? 'Confirm payment' : 'Confirm request',
          availableBalance: availableBalance,
          onTransactionComplete: (amount) {
            setState(() {
              availableBalance -= amount;
            });
          },
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
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1];
  }
}
