import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:moto/driver/wallet/controller/balance_cubit.dart';
import '../../../core/widgets/CustomAppBar.dart';
import '../../../rider/auth/core/services/storage_service.dart';
import '../controller/wallet_cubit.dart';
import '../widgets/content_model_sheet.dart';

class DuesPage extends StatefulWidget {
  const DuesPage({super.key});

  @override
  State<DuesPage> createState() => _DuesPageState();
}

class _DuesPageState extends State<DuesPage> {
  String? token;

  @override
  void initState() {
    super.initState();
    _loadTokenAndFetchData();
  }

  Future<void> _loadTokenAndFetchData() async {
    final storage = StorageService();
    final fetchedToken = await storage.getToken();

    if (fetchedToken != null) {
      setState(() {
        token = fetchedToken;
      });
      context.read<BalanceCubit>().fetchBalance();
      context.read<WalletCubit>().fetchTransactions();
    } else {
      print("❌ No token found");
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<BalanceCubit, BalanceState>(
      builder: (context, state) {
        double duesAmount = 0;
        double availableBalance = 0;

        if (state is BalanceSuccess) {
          duesAmount = state.balance.amountOwed;
          availableBalance = state.balance.balance;
        }

        return Scaffold(
          appBar: CustomAppBar(
            title: 'Dues',
            showBackButton: true,
            amount: "${duesAmount.toStringAsFixed(2)} EGP",
            centerTitle: true,
            appBarHeight: 80,
            onBackPressed: () {},
          ),
          body: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Flexible(
                      child: GestureDetector(
                        onTap: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            shape: const RoundedRectangleBorder(
                              borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                            ),
                            builder: (context) {
                              return ContentModelSheet(
                                label: 'Pay Dues',
                                amount: '$duesAmount EGP',
                                hint: 'The amount required to be paid',
                                txtButton: "Confirm payment",
                                availableBalance: availableBalance.toInt(),
                                onTransactionComplete: (amount) {
                                  context.read<BalanceCubit>().fetchBalance();
                                  context.read<WalletCubit>().fetchTransactions();
                                },  isWithdraw: true,
                              );
                            },
                          );
                        },
                        child: buildActionButton('Pay Dues', Icons.arrow_circle_up_outlined, Colors.red),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Flexible(
                      child: GestureDetector(
                        onTap: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            shape: const RoundedRectangleBorder(
                              borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                            ),
                            builder: (context) {
                              return ContentModelSheet(
                                isWithdraw: true,
                                label: 'Withdraw Request',
                                amount: '$availableBalance EGP',
                                hint: 'Your outstanding balance',
                                txtButton: "Confirm request",
                                availableBalance: availableBalance.toInt(),
                                onTransactionComplete: (amount) {
                                  context.read<BalanceCubit>().fetchBalance();
                                  context.read<WalletCubit>().fetchTransactions();
                                },
                              );
                            },
                          );
                        },
                        child: buildActionButton('Withdraw Request', Icons.arrow_circle_down_outlined, Colors.green),
                      ),
                    )
                  ],
                ),
                const SizedBox(height: 24),
                const Divider(color: Color(0xFFB5022F)),
                const SizedBox(height: 14),
                const Text("The Transactions", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
                const SizedBox(height: 10),
                Expanded(
                  child: BlocBuilder<WalletCubit, WalletState>(
                    builder: (context, state) {
                      if (state is TransactionsLoading) {
                        return Center(
                          child: LoadingAnimationWidget.fourRotatingDots(
                            color: const Color(0xFFB5022F),
                            size: 80,
                          ),
                        );
                      } else if (state is TransactionsLoaded) {
                        final transactions = state.transactions;

                        if (transactions.isEmpty) {
                          return const Center(child: Text("No transactions found."));
                        }

                        return ListView.builder(
                          itemCount: transactions.length,
                          itemBuilder: (_, index) {
                            final tx = transactions[index];
                            return Card(
                              color: Colors.red.shade50,
                              margin: const EdgeInsets.symmetric(vertical: 10),
                              child: ListTile(
                                leading: Icon(
                                  tx.type == 'debit'
                                      ? Icons.arrow_circle_up_outlined
                                      : Icons.arrow_circle_down_outlined,
                                  color: tx.type == 'debit' ? Colors.red : Colors.green,
                                ),
                                title: Text(tx.purpose),
                                subtitle: Text(
                                  "${tx.amount.toStringAsFixed(2)} EGP • ${tx.createdAt.toLocal().toString().split('.')[0]}",
                                ),
                              ),
                            );
                          },
                        );
                      } else if (state is TransactionsError) {
                        return const Center(child: Text("There was an error, please try again later"));
                      } else {
                        return const SizedBox();
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
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
        child: FittedBox(
          fit: BoxFit.scaleDown,
          child: Row(
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(width: 8),
              Icon(icon, color: iconColor),
            ],
          ),
        ),
      ),
    );
  }
}
