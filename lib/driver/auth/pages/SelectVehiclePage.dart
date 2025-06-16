import 'package:flutter/material.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/pages/password/VerficationPageDR.dart';
import 'package:moto/driver/auth/widgets/selectService.dart';
import 'package:moto/general/core/models/signup_request_model.dart';
import 'package:moto/general/core/models/signup_response_model.dart';
import 'package:moto/general/core/service/auth_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SelectVehiclePage extends StatefulWidget {
  final Map<String, dynamic> personalData;

  const SelectVehiclePage({super.key, required this.personalData});

  @override
  State<SelectVehiclePage> createState() => _SelectVehiclePageState();
}

class _SelectVehiclePageState extends State<SelectVehiclePage> {
  String selectedVehicle = "";
  bool isDeliveryChecked = true; // افترض أنها دائماً محددة
  bool isLoading = false;
  final AuthService authService = AuthService();

  Future<void> handleRegistration() async {
    if (selectedVehicle.isEmpty) {
      CustomSnackBar(context, "الرجاء اختيار نوع المركبة أولاً");
      return;
    }

    setState(() => isLoading = true);

    final request = SignUpRequest(
      name: widget.personalData['name'],
      email: widget.personalData['email'],
      password: widget.personalData['password'],
      phone: widget.personalData['phone'],
      dob: widget.personalData['dob'],
      userType: 'driver',
      vehicleType: selectedVehicle.toLowerCase(),
      orderTypes: isDeliveryChecked ? ['anything'] : [],
    );

    final result = await authService.signUp(request);

    if (!mounted) return;

    if (result is SignUpSuccessResponse) {
      // *** الحل الرئيسي هنا ***
      // بما أن الـ response لا يحتوي على نوع المركبة، سنقوم بحفظه يدوياً
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('vehicleType', selectedVehicle);

      CustomSnackBar(context, "Create an account succesfully");
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder:
              (context) => VerficodePageDR(
                phone: request.phone,
                isForPasswordReset: false,
              ),
        ),
        (route) => false, // حذف كل الصفحات السابقة
      );
    } else if (result is SignUpErrorResponse) {
      CustomSnackBar(context, 'خطأ: ${result.error.message}');
    } else {
      CustomSnackBar(context, 'حدث خطأ غير متوقع.');
    }

    setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return ModalProgressHUD(
      inAsyncCall: isLoading,
      child: Scaffold(
        backgroundColor: ColorsApp().backgroundColor,
        appBar: CustomAppBar(
          title: "Choose the vehicle",
          imagePath: "assets/images/DELIVERY.png",
          onBackPressed: () {},
        ),
        body: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              const SizedBox(height: 30),
              const Center(
                child: Text(
                  "Choose the vehicle you use",
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 60),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  buildVehicleOption(
                    "scooter",
                    "assets/images/DELIVERY.png",
                    "scooter",
                  ),
                  buildVehicleOption(
                    "rickshaw",
                    "assets/images/DELIVERY.png",
                    "rickshaw",
                  ),
                  buildVehicleOption(
                    "motorcycle",
                    "assets/images/DELIVERY.png",
                    "motorcycle",
                  ),
                ],
              ),
              SizedBox(height: 10),
              Selectservice(
                txt: "Delivery Anything",
                value: isDeliveryChecked,
                onChanged: (val) {
                  setState(() {
                    isDeliveryChecked = val ?? false;
                  });
                },
              ),
              const Spacer(),

              GestureDetector(
                onTap: (selectedVehicle.isNotEmpty) ? handleRegistration : null,
                child: Container(
                  width: double.infinity,
                  height: 60,
                  decoration: BoxDecoration(
                    color: (selectedVehicle.isNotEmpty) ? null : Colors.grey,
                    gradient:
                        (selectedVehicle.isNotEmpty)
                            ? const LinearGradient(
                              colors: [Color(0xFFB5022F), Colors.black],
                            )
                            : null,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: const Center(
                    child: Text(
                      "Create an account",
                      style: TextStyle(
                        fontSize: 24,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 60),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildVehicleOption(String vehicleType, String imagePath, String name) {
    bool isSelected = selectedVehicle == vehicleType;
    return GestureDetector(
      onTap: () => setState(() => selectedVehicle = vehicleType),
      child: Container(
        height: 160,
        width: 120,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFB5022F) : Colors.white,
          border: Border.all(
            color: isSelected ? Colors.transparent : Colors.grey,
          ),
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(color: Colors.grey.withOpacity(0.3), blurRadius: 5),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(imagePath, scale: 5),
            const SizedBox(height: 8),
            Text(
              name,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
