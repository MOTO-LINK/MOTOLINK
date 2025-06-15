import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:moto/driver/wallet/controller/balance_cubit.dart';
import '../../../core/widgets/CustomAppBar.dart';
import '../../../rider/auth/core/services/storage_service.dart';
import '../controller/balance_model.dart';

import '../widgets/buils_state_card.dart';
import '../widgets/custom_loading_indicator.dart';

class AccountsPage extends StatefulWidget {
  const AccountsPage({super.key});

  @override
  State<AccountsPage> createState() => _AccountsPageState();
}

class _AccountsPageState extends State<AccountsPage> {
  int? selectedYear;
  int? selectedMonth;
  String? token;

  final List<int> years = List.generate(7, (index) => 2019 + index);
  final List<int> months = List.generate(12, (index) => index + 1);

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    selectedYear = now.year;
    selectedMonth = now.month;
    _loadTokenAndFetchData();
  }

  Future<void> _loadTokenAndFetchData() async {
    final t = await StorageService().getToken();
    print("tokenAccount++++$t");
    if (t != null) {
      token = t;

      context.read<BalanceCubit>().fetchBalance();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Accounts",
        appBarHeight: 80,
        onBackPressed: () {},
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: BlocBuilder<BalanceCubit, BalanceState>(
            builder: (context, state) {
              if (state is BalanceLoading) {
                return const CustomLoadingIndicator();
              } else if (state is BalanceFailure) {

                return Column(
                  children: [
                    Row(
                      children: [

                        Flexible(
                          flex: 2,
                          child: Column(
                            children: const [
                              BuildStateCard(
                                isSmall: true,
                                label: 'Orders',
                                amount: '700 EGP',
                                nextPage: "OrdersPage",
                              ),
                              BuildStateCard(
                                label: 'Balance',
                                amount: '0',
                                nextPage: "CommissionPage",
                                isSmall: true,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Flexible(
                          flex: 1,
                          child: BuildStateCard(
                            label: 'Dues',
                            amount: '0',
                            nextPage: "DuesPage",
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      "Account payments",
                      style: TextStyle(fontWeight: FontWeight.w900),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        DropdownButton<int>(
                          value: selectedMonth,
                          items: months
                              .map((m) => DropdownMenuItem(
                            value: m,
                            child: Text(m.toString()),
                          ))
                              .toList(),
                          onChanged: (val) {
                            setState(() {
                              selectedMonth = val;
                            });
                          },
                        ),
                        const SizedBox(width: 20),
                        DropdownButton<int>(
                          value: selectedYear,
                          items: years
                              .map((y) => DropdownMenuItem(
                            value: y,
                            child: Text(y.toString()),
                          ))
                              .toList(),
                          onChanged: (val) {
                            setState(() {
                              selectedYear = val;
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildPaymentTile('Total', '700 EGP'),
                    _buildPaymentTile('Cash', '300 EGP'),
                    _buildPaymentTile('Visa', '400 EGP'),
                    const SizedBox(height: 24),
                  ],
                );
              } else if (state is BalanceSuccess) {
                final total = context.read<BalanceCubit>().totalOrdersAmount;
                BalanceModel data = state.balance;
                return Column(
                  children: [
                    Row(
                      children: [
                        Flexible(
                          flex: 2,
                          child: Column(
                            children: [
                              BuildStateCard(
                                isSmall: true,
                                label: 'Orders',
                                amount: 'Total Orders: ${total.toStringAsFixed(2)} EGP',
                                nextPage: "OrdersPage",
                              ),
                              BuildStateCard(
                                label: 'Balance',
                                amount: '${data.balance.toStringAsFixed(2)} ${data.currency}',
                                nextPage: "CommissionPage",
                                isSmall: true,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Flexible(
                          flex: 1,
                          child: BuildStateCard(
                            label: 'Dues',
                            amount: '-${data.amountOwed.toStringAsFixed(2)} ${data.currency}',
                            nextPage: "DuesPage",
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Account payments",
                          style: TextStyle(fontWeight: FontWeight.w900),
                        ),
                        SizedBox(width: 10,),
                        DropdownButton<int>(
                          value: selectedMonth,
                          items: months
                              .map((m) => DropdownMenuItem(
                            value: m,
                            child: Text(m.toString()),
                          ))
                              .toList(),
                          onChanged: (val) {
                            setState(() {
                              selectedMonth = val;
                            });
                          },
                        ),
                        const SizedBox(width: 20),
                        DropdownButton<int>(
                          value: selectedYear,
                          items: years
                              .map((y) => DropdownMenuItem(
                            value: y,
                            child: Text(y.toString()),
                          ))
                              .toList(),
                          onChanged: (val) {
                            setState(() {
                              selectedYear = val;
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildPaymentTile('Total', '0.00 EGP'),
                    _buildPaymentTile('Cash', '0.00 EGP'),
                    const SizedBox(height: 24),
                  ],
                );
              }
              return const SizedBox();
            },
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentTile(String title, String value) {
    return Container(
      color: Colors.red.shade50,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: const Icon(
          Icons.account_balance_wallet,
          color: Color(0xFFB5022F),
          size: 27,
        ),
        title: Text(
          title,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        trailing: Text(
          value,
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
