import 'package:flutter/material.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import 'package:motolink/features/general/profile_page/presentation/views/widgets/payment_method_view_body.dart';

class PaymentMethodView extends StatelessWidget {
  const PaymentMethodView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(txt: "Payment Method"),
      body: PaymentMethodViewBody(),
    );
  }
}
