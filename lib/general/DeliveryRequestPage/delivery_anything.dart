import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:moto/core/utils/showSnackBar.dart';
import 'package:moto/driver/wallet/widgets/custom_loading_indicator.dart';
import '../../core/utils/colors.dart';
import '../../core/widgets/CustomAppBar.dart';
import 'custom_expansion_tile.dart';
import 'delivery_cubit.dart';

class DeliveryAnything extends StatefulWidget {
  const DeliveryAnything({super.key});

  @override
  State<DeliveryAnything> createState() => _DeliveryAnythingState();
}

class _DeliveryAnythingState extends State<DeliveryAnything> {
  bool acceptAuto = false;
  String? _selectedValue = 'Highest Rate';

  @override
  void initState() {
    super.initState();
    context.read<DeliveryCubit>().fetchOffers();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Delivery Anything",
        centerTitle: true, onBackPressed: () {},
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            BlocBuilder<DeliveryCubit, DeliveryState>(
              builder: (context, state) {
                if (state is DeliveryLoaded) {
                  final orderDetails = state.orderDetails;
                  return Column(
                    children: [
                      CustomExpansionTile(
                        titleText: "Order Details",
                        details: "Service Type: ${orderDetails['service_type']}",
                      ),
                      const SizedBox(height: 10),
                      CustomExpansionTile(
                        titleText: "Price Details",
                        details: "${orderDetails['estimated_fee']} EGP",
                      ),
                    ],
                  );
                } else {
                  return const Column(
                    children: [
                      CustomExpansionTile(titleText: "Order Details", details: "No Details yet"),
                      SizedBox(height: 10),
                      CustomExpansionTile(titleText: "Price Details", details: "0 EGP"),
                    ],
                  );
                }
              },
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("Accept Automatically"),
                Switch(
                  activeTrackColor: ColorsApp().secondaryColor,
                  value: acceptAuto,
                  onChanged: (val) async {
                    if (val) {
                      setState(() => acceptAuto = true);

                      await showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        shape: const RoundedRectangleBorder(
                          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                        ),
                        builder: (context) {
                          return Padding(
                            padding: const EdgeInsets.all(28.0),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  height: 5,
                                  width: 50,
                                  decoration: BoxDecoration(
                                    color: Colors.grey,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                const Divider(thickness: 2),
                                const SizedBox(height: 16),
                                const Text(
                                  "Automatic acceptance",
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
                                ),
                                const SizedBox(height: 16),
                                const Text(
                                  "When automatic offer acceptance is enabled, we will\n"
                                      "accept the first offer within the expected price",
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 25),
                                GestureDetector(
                                  onTap: () => Navigator.pop(context),
                                  child: Container(
                                    decoration: BoxDecoration(
                                      gradient: const LinearGradient(
                                          colors: [Color(0xFFB5022F), Colors.black]),
                                      borderRadius: BorderRadius.circular(15),
                                    ),
                                    width: 364,
                                    height: 67,
                                    child: const Center(
                                      child: Text(
                                        "Automatic acceptance",
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w800,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      );
                      setState(() => acceptAuto = false);
                    }
                  },
                ),
              ],
            ),
            const SizedBox(height: 20),
            Center(
              child: BlocConsumer<DeliveryCubit, DeliveryState>(
                listener: (context, state) {
                  if (state is CancelRideSuccess) {
                    showSnackBar(context, state.message);

                  } else if (state is CancelRideError) {
                    showSnackBar(context, state.message);
                  }
                },
                builder: (context, state) {
                  if (state is CancelRideLoading) {
                    return const CustomLoadingIndicator();
                  }
                  return TextButton(
                    child: const Text("Cancel Order", style: TextStyle(color: Colors.red)),
                    onPressed: () {
                      context.read<DeliveryCubit>().cancelRide(reason: "User canceled");
                    },
                  );
                },
              ),
            ),

            const SizedBox(height: 10),
            Expanded(
              child: BlocBuilder<DeliveryCubit, DeliveryState>(
                builder: (context, state) {
                  if (state is DeliveryLoading) {
                    return Center(
                      child: Column(
                        children: [
                          CustomLoadingIndicator(),
                          const SizedBox(height: 15),
                          const Text("Waiting Offers", style: TextStyle(fontWeight: FontWeight.w800)),
                        ],
                      ),
                    );
                  } else if (state is DeliveryLoaded) {
                    final offers = state.offers;

                    return Column(
                      children: [
                        Divider(color: ColorsApp().secondaryColor),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            TextButton(
                              onPressed: () {
                                showModalBottomSheet(
                                  context: context,
                                  shape: const RoundedRectangleBorder(
                                    borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                                  ),
                                  builder: (context) {
                                    return Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Container(
                                            height: 5,
                                            width: 50,
                                            decoration: BoxDecoration(
                                              color: Colors.grey,
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                          ),
                                          const SizedBox(height: 16),
                                          const Divider(thickness: 2),
                                          const SizedBox(height: 16),
                                          const Text("Show list of offers by: "),
                                          const SizedBox(height: 16),
                                          RadioListTile<String>(
                                            title: const Text('Highest Rate'),
                                            value: 'Highest Rate',
                                            activeColor: ColorsApp().secondaryColor,
                                            groupValue: _selectedValue,
                                            onChanged: (value) {
                                              setState(() => _selectedValue = value);
                                              Navigator.pop(context);
                                            },
                                          ),
                                          RadioListTile<String>(
                                            title: const Text('Lowest price'),
                                            value: 'Lowest price',
                                            activeColor: ColorsApp().secondaryColor,
                                            groupValue: _selectedValue,
                                            onChanged: (value) {
                                              setState(() => _selectedValue = value);
                                              Navigator.pop(context);
                                            },
                                          ),
                                        ],
                                      ),
                                    );
                                  },
                                );
                              },
                              child: Text("Show by: $_selectedValue",
                                  style: TextStyle(color: ColorsApp().secondaryColor)),
                            ),
                            Icon(Icons.swap_horiz, color: ColorsApp().secondaryColor),
                          ],
                        ),
                        Expanded(
                          child: ListView.builder(
                            shrinkWrap: true,
                            physics: const AlwaysScrollableScrollPhysics(),
                            itemCount: offers.length,
                            itemBuilder: (context, index) {
                              final offer = offers[index];
                              return Card(
                                color: Colors.grey.shade200,
                                margin: const EdgeInsets.symmetric(vertical: 8),
                                child: ListTile(
                                  leading: const CircleAvatar(
                                    backgroundImage: AssetImage("assets/images/technology.jpg"),
                                  ),
                                  title: Text(offer['name']),
                                  subtitle: Row(
                                    children: List.generate(
                                      5,
                                          (i) => Icon(
                                        Icons.star,
                                        color: i < offer['rating'] ? Colors.amber : Colors.grey,
                                        size: 16,
                                      ),
                                    ),
                                  ),
                                  trailing: SizedBox(
                                    height: 56,
                                    child: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text("${offer['price']} EGP",
                                            style: const TextStyle(fontSize: 12)),
                                        const SizedBox(height: 4),
                                        ElevatedButton(
                                          onPressed: () {},
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: ColorsApp().secondaryColor,
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8, vertical: 4),
                                            minimumSize: Size.zero,
                                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                          ),
                                          child: const Text("Accept",
                                              style: TextStyle(fontSize: 12, color: Colors.white)),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    );
                  } else if (state is DeliveryError) {
                    return Center(child: Text(state.message));
                  } else {
                    return const Center(child: Text("No Offers Available"));
                  }
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}
