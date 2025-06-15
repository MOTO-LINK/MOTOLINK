import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:moto/driver/wallet/controller/constant_api.dart';
import 'package:moto/driver/wallet/pages/accounts_page.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../../core/utils/showSnackBar.dart';
import '../../../core/widgets/CustomAppBar.dart';
import '../widgets/custom_loading_indicator.dart';

class PaymentPage extends StatefulWidget {
  final String paymentMethod; // 'vodafone_cash' or 'visa'
  final String token;
  final double amount;

  const PaymentPage({
    super.key,
    required this.paymentMethod,
    required this.token,
    required this.amount,
  });

  @override
  State<PaymentPage> createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  late final WebViewController _controller;
  bool _isLoading = true;
  String? paymentUrl;

  @override
  void initState() {
    super.initState();
    initializePayment();
  }

  Future<void> initializePayment() async {

    try {
      final response = await Dio().post(
        '${ConstantApi.baseUrl}/${ConstantApi.walletTopUpInit}',
        data: {
          "amount": widget.amount,
          "method": widget.paymentMethod,
        },
        options: Options(
          headers: {
            "Authorization": "Bearer ${widget.token}",
            "Content-Type": "application/json",
          },
        ),
      );
      print("amount: ${widget.amount}");
      print("method: ${widget.paymentMethod}");
      print("token: ${widget.token}");

      if (response.data['success'] == true &&
          response.data['data']?['paymentUrl'] != null) {
        paymentUrl = response.data['data']['paymentUrl'];

        final controller = WebViewController()
          ..setJavaScriptMode(JavaScriptMode.unrestricted)
          ..setNavigationDelegate(
            NavigationDelegate(
              onPageFinished: (url) {
                print("Navigated to: $url");
                print("paymentUrl: ${response.data['data']['paymentUrl']}");

                setState(() => _isLoading = false);
                if (url.contains("success=true") && url.contains("txn_response_code=00000")) {
                  print("✅ Payment succeeded");
                  Navigator.of(context).pop(true);
                } else if (url.contains("success=false")) {
                  print("❌ Payment failed");
                  showSnackBar(context, "Payment failed");
                  Navigator.of(context).pop(false);
                }

                 if (url.contains("paymob/callback")) {
                  print("Payment complete++++++++");
                  Navigator.of(context).pop(true); // الدفع تم

                }
              },
            ),
          )
          ..loadRequest(Uri.parse(paymentUrl!));

        setState(() => _controller = controller);
      } else {
        showError('Failed to create payment link');
      }
    } catch (e) {
      print("Error ${e.toString()}");
      showError("An error occurred: ${e.toString()}");
    }
  }

  void showError(String message) {
    showSnackBar(context, message);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: "Complete Payment",centerTitle: true,
        showBackButton: true,
        onBackPressed: () {  },),
      body: paymentUrl == null
          ? const CustomLoadingIndicator()
          : Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_isLoading) const CustomLoadingIndicator()
        ],
      ),
    );
  }
}
