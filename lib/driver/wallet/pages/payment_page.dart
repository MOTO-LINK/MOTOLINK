import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:moto/driver/wallet/controller/constant_api.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../../core/utils/showSnackBar.dart';
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
          },
        ),
      );

      if (response.data['success'] == true &&
          response.data['data']?['paymentUrl'] != null) {
        paymentUrl = response.data['data']['paymentUrl'];

        final controller = WebViewController()
          ..setJavaScriptMode(JavaScriptMode.unrestricted)
          ..setNavigationDelegate(
            NavigationDelegate(
              onPageFinished: (url) {
                setState(() => _isLoading = false);
                if (url.contains("paymob/callback")) {
                  Navigator.of(context).pop(true); // الدفع تم
                }
              },
            ),
          )
          ..loadRequest(Uri.parse(paymentUrl!));

        setState(() => _controller = controller);
      } else {
        showError('فشل إنشاء رابط الدفع');
      }
    } catch (e) {
      showError("حدث خطأ: ${e.toString()}");
    }
  }

  void showError(String message) {
    showSnackBar(context, message);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("إكمال الدفع")),
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
