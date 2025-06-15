// SelectVehiclePage.dart

import 'package:flutter/material.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart'; // <<<--- إضافة 1
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomSnackBar.dart';
import 'package:moto/driver/auth/widgets/selectService.dart';
import 'package:moto/general/core/models/signup_request_model.dart';
import 'package:moto/general/core/models/signup_response_model.dart'; // <<<--- إضافة 2
import 'package:moto/general/core/service/auth_service.dart';
import 'package:moto/general/core/service/storage_service.dart';

// <<<--- تغيير 1: تعديل الـ widget لاستقبال البيانات
class SelectVehiclePage extends StatefulWidget {
  final Map<String, dynamic> personalData;

  const SelectVehiclePage({super.key, required this.personalData});

  @override
  State<SelectVehiclePage> createState() => _SelectVehiclePageState();
}

class _SelectVehiclePageState extends State<SelectVehiclePage> {
  String selectedVehicle = "";
  bool isDeliveryChecked = false;
  bool isLoading = false; // <<<--- إضافة 3: متغير حالة التحميل
  final AuthService authService = AuthService(); // <<<--- إضافة 4: AuthService

  @override
  Widget build(BuildContext context) {
    // <<<--- إضافة 5: إضافة ModalProgressHUD للتحميل
    return ModalProgressHUD(
      inAsyncCall: isLoading,
      child: Scaffold(
        backgroundColor: ColorsApp().backgroundColor,
        appBar: CustomAppBar(
          title: "Welcome to Your Journey!",
          imagePath: "assets/images/DELIVERY.png",
          onBackPressed: () {},
        ),
        body: Container(
          width: double.infinity,
          padding: EdgeInsets.all(12),
          child: Column(
            children: [
              SizedBox(height: 30),
              Center(
                child: Text(
                  "Choose the vehicle you use",
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                ),
              ),
              SizedBox(height: 60),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // <<<--- تغيير 2: تبسيط الـ Buttons وتصحيح المتغير
                  buildVehicleOption("scooter", "assets/images/DELIVERY.png"),
                  buildVehicleOption("rickshaw", "assets/images/DELIVERY.png"),
                  buildVehicleOption(
                    "motorcycle",
                    "assets/images/DELIVERY.png",
                  ),
                ],
              ),
              SizedBox(height: 50),
              Selectservice(
                txt: "Delivery Anything",
                value: isDeliveryChecked,
                onChanged: (val) {
                  setState(() {
                    isDeliveryChecked = val ?? false;
                  });
                },
              ),
              Spacer(), // <<<--- استخدام Spacer لدفع الزر للأسفل
              Container(
                width: double.infinity,
                height: 60,
                decoration: BoxDecoration(
                  gradient:
                      (selectedVehicle.isNotEmpty && isDeliveryChecked)
                          ? LinearGradient(
                            colors: [
                              ColorsApp().secondaryColor,
                              ColorsApp().primaryColor,
                            ],
                          )
                          : null,
                  color:
                      (selectedVehicle.isNotEmpty && isDeliveryChecked)
                          ? null
                          : Colors.grey,
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(15),
                    // <<<--- تغيير 3: استدعاء دالة التسجيل الفعلية
                    onTap:
                        (selectedVehicle.isNotEmpty && isDeliveryChecked)
                            ? handleRegistration
                            : null,
                    child: Center(
                      child: Text(
                        "Sign Up", // تغيير النص ليعكس الإجراء النهائي
                        style: TextStyle(
                          fontSize: 24,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              SizedBox(height: 20), // مساحة سفلية
            ],
          ),
        ),
      ),
    );
  }

  // دالة مساعدة لبناء أزرار اختيار المركبة
  Widget buildVehicleOption(String vehicleType, String imagePath) {
    return MaterialButton(
      onPressed: () {
        setState(() {
          selectedVehicle = vehicleType;
        });
      },
      child: Container(
        height: 120,
        width: 100,
        decoration: BoxDecoration(
          color:
              selectedVehicle == vehicleType
                  ? ColorsApp().secondaryColor
                  : Colors.grey,
          border: Border.all(color: ColorsApp().primaryColor),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(imagePath, scale: 5),
            SizedBox(height: 8),
            Text(
              vehicleType,
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // <<<--- إضافة 6: دالة التسجيل الكاملة
  void handleRegistration() async {
    setState(() => isLoading = true);

    final List<String> orderTypes = [];
    if (isDeliveryChecked) {
      orderTypes.add('anything');
    }

    // بناء كائن الطلب باستخدام البيانات المستقبلة وبيانات هذه الصفحة
    final request = SignUpRequest(
      name: widget.personalData['name'],
      email: widget.personalData['email'],
      password: widget.personalData['password'],
      phone: widget.personalData['phone'],
      dob: widget.personalData['dob'],
      userType: 'driver',
      vehicleType:
          selectedVehicle
              .toLowerCase(), // تأكد من أن الـ API يقبل الأحرف الصغيرة
      orderTypes: orderTypes,
    );

    print("User Registration Data: ${request.toJson()}");

    final result = await authService.signUp(request);

    setState(() => isLoading = false);
    if (!mounted) return;

    if (result is SignUpSuccessResponse) {
      final storageService = StorageService();
      await storageService.saveUserSession(result);

      CustomSnackBar(context, 'Sign Up Successful!');
      Navigator.pushNamedAndRemoveUntil(
        context,
        "Verfication_Page_driver",
        (route) => false, // حذف كل الصفحات السابقة
        arguments: {"phone": request.phone},
      );
    } else if (result is SignUpErrorResponse) {
      CustomSnackBar(context, 'Error: ${result.error.message}');
    } else {
      CustomSnackBar(context, 'An unknown error occurred.');
    }
  }
}
