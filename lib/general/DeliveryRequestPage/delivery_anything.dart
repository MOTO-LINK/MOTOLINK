import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../core/widgets/CustomAppBar.dart';
import 'cancel_rider_cubit.dart';
import 'cancel_rider_state.dart';
import 'custom_expansion_tile.dart';
import 'delivery_cubit.dart';
import 'delivery_state.dart';

class DeliveryAnything extends StatelessWidget {
  const DeliveryAnything({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => DeliveryCubit()..fetchOffers(),
      child: const DeliveryAnythingView(),
    );
  }
}

class DeliveryAnythingView extends StatefulWidget {
  const DeliveryAnythingView({super.key});

  @override
  State<DeliveryAnythingView> createState() => _DeliveryAnythingViewState();
}

class _DeliveryAnythingViewState extends State<DeliveryAnythingView> {
  bool acceptAuto = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Delivery Anything",
        centerTitle: true,
        onBackPressed: () {},
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            BlocBuilder<DeliveryCubit, DeliveryState>(
              builder: (context, state) {
                if (state is DeliveryLoading) {
                  return const CircularProgressIndicator();
                } else if (state is DeliveryLoaded) {
                  final ride = state.ride;

                  return Column(
                    children: [
                      CustomExpansionTile(
                        titleText: "Order Details",
                        details: '''
                Ride Type: ${ride.rideType}
                Service Type: ${ride.serviceType}
                Payment Type: ${ride.paymentType}
                Status: ${ride.status}
                Request Time: ${ride.requestTime}
                Notes: ${ride.notes ?? "None"}''',
                      ),
                      const SizedBox(height: 10),
                      CustomExpansionTile(
                        titleText: "Price Details",
                        details: "${ride.estimatedFee} EGP",
                      ),
                    ],
                  );
                } else if (state is DeliveryError) {
                  return Text("❌ Error: ${state.message}");
                } else {
                  return const Text("⏳ Loading order details...");
                }
              },
            ),

            const SizedBox(height: 20),

            BlocBuilder<DeliveryCubit, DeliveryState>(
              builder: (context, deliveryState) {
                if (deliveryState is DeliveryLoaded) {
                  final ride = deliveryState.ride;

                  return BlocProvider(
                    create: (_) => CancelRideCubit(),
                    child: BlocConsumer<CancelRideCubit, CancelRideState>(
                      listener: (context, state) {
                        if (state is CancelRideSuccess) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(state.message)),
                          );
                        } else if (state is CancelRideError) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(state.error)),
                          );
                        }
                      },
                      builder: (context, state) {
                        return ElevatedButton(
                          onPressed: () {
                            context.read<CancelRideCubit>().cancelRide(ride);
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                          child: state is CancelRideLoading
                              ? const CircularProgressIndicator(color: Colors.white)
                              : const Text("Cancel Order"),
                        );
                      },
                    ),
                  );
                } else {
                  return const Text("Not Available Details now");
                }
              },
            ),

            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}
