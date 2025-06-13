import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomTextField.dart';
import 'package:moto/core/widgets/OrderdetailsTextField.dart';
import 'package:moto/core/widgets/RatioListTileForPayement.dart';
import 'package:moto/core/widgets/custom_button.dart';
import 'package:moto/models/textfieldmodel.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DeliveryRequestPage extends StatefulWidget {
  const DeliveryRequestPage({super.key});

  @override
  State<DeliveryRequestPage> createState() => _DeliveryRequestPageState();
}

class _DeliveryRequestPageState extends State<DeliveryRequestPage> {
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController dateController = TextEditingController();
  String pickupLocation = 'Choose location';
  String dropoffLocation = 'Choose location';
  DateTime? selectedDateTime;
  String selectedpayment = 'Cash';

  List<String> paymentMethods = ['Cash', 'Credit Card', 'Vodafone Cash'];
  File? selectedimage;

  // متغير محلي للعناوين المحفوظة
  List<Map<String, dynamic>> savedAddresses = [];

  // تحميل العناوين من SharedPreferences عند فتح الصفحة
  @override
  void initState() {
    super.initState();
    _loadSavedAddresses();
  }

  Future<void> _loadSavedAddresses() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString('saved_addresses');
    if (jsonString != null) {
      final List decoded = jsonDecode(jsonString);
      setState(() {
        savedAddresses = decoded.cast<Map<String, dynamic>>();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Delivery Request',
        imagePath: "assets/images/DELIVERY.png",
        icon: FontAwesome.arrow_left,
        onIconPressed: () {
          Navigator.pop(context);
        },
        onBackPressed: () {},
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '*Order Details',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  selectedimage == null
                      ? IconButton(
                        style: ButtonStyle(
                          backgroundColor: WidgetStateProperty.all(
                            ColorsApp().backgroundColor,
                          ),
                          shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                            RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                              side: BorderSide.none,
                            ),
                          ),
                        ),
                        iconSize: 25,
                        onPressed: () {},
                        icon: Icon(
                          FontAwesome.camera,
                          color: ColorsApp().secondaryColor,
                        ),
                      )
                      : SizedBox.shrink(),
                ],
              ),
              SizedBox(height: 10),
              OrderDetailsTextField(
                descriptionController: descriptionController,
              ),
              SizedBox(height: 15),

              Text(
                '*Pickup Location',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              CustomTextfield(
                Textfieldmodels: Textfieldmodel(
                  Icon(FontAwesome.arrow_circle_o_right),
                  TextInputType.text,
                  TextEditingController(text: pickupLocation),
                  "Enter your pickup location",
                  true,
                  () async {
                    await showModalBottomSheet(
                      context: context,
                      builder: (BuildContext context) {
                        return Padding(
                          padding: const EdgeInsets.all(20),
                          child: SizedBox(
                            height: 350,
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 60,
                                  height: 7,
                                  decoration: BoxDecoration(
                                    color: ColorsApp().secondaryColor,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                                SizedBox(height: 15),
                                Divider(),
                                SizedBox(height: 20),
                                Text(
                                  'Select From Saved Locations',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: 30),
                                Expanded(
                                  child: ListView.builder(
                                    shrinkWrap: true,
                                    itemCount: savedAddresses.length,
                                    itemBuilder: (context, index) {
                                      final address = savedAddresses[index];
                                      return Container(
                                        margin: EdgeInsets.symmetric(vertical: 5),
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius: BorderRadius.circular(10),
                                          boxShadow: [
                                            BoxShadow(
                                              color: Colors.black12,
                                              blurRadius: 6,
                                              offset: Offset(0, 3),
                                            ),
                                          ],
                                        ),
                                        child: ListTile(
                                          leading: Icon(Icons.location_on, color: ColorsApp().secondaryColor),
                                          title: Text(address['label'] ?? 'No Label'),
                                          subtitle: Text(address['autoAddress'] ?? ''),
                                          onTap: () {
                                            setState(() {
                                              pickupLocation = address['autoAddress'] ?? '';
                                              Navigator.pop(context);
                                            });
                                          },
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  },
                  prefixIcon: Icon(FontAwesome.map_marker),
                ),
                color: ColorsApp(),
              ),

              SizedBox(height: 15),
              Text(
                '*Dropoff Location',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              CustomTextfield(
                Textfieldmodels: Textfieldmodel(
                  Icon(FontAwesome.arrow_circle_o_right),
                  TextInputType.text,
                  TextEditingController(text: dropoffLocation),
                  "Enter your dropoff location",
                  true,
                  () async {
                    await showModalBottomSheet(
                      context: context,
                      builder: (BuildContext context) {
                        return Padding(
                          padding: const EdgeInsets.all(20),
                          child: SizedBox(
                            height: 350,
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 60,
                                  height: 7,
                                  decoration: BoxDecoration(
                                    color: ColorsApp().secondaryColor,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                                SizedBox(height: 15),
                                Divider(),
                                SizedBox(height: 20),
                                Text(
                                  'Select From Saved Locations',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: 30),
                                Expanded(
                                  child: ListView.builder(
                                    shrinkWrap: true,
                                    itemCount: savedAddresses.length,
                                    itemBuilder: (context, index) {
                                      final address = savedAddresses[index];
                                      return Container(
                                        margin: EdgeInsets.symmetric(vertical: 5),
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius: BorderRadius.circular(10),
                                          boxShadow: [
                                            BoxShadow(
                                              color: Colors.black12,
                                              blurRadius: 6,
                                              offset: Offset(0, 3),
                                            ),
                                          ],
                                        ),
                                        child: ListTile(
                                          leading: Icon(Icons.location_on, color: ColorsApp().secondaryColor),
                                          title: Text(address['label'] ?? 'No Label'),
                                          subtitle: Text(address['autoAddress'] ?? ''),
                                          onTap: () {
                                            setState(() {
                                              dropoffLocation = address['autoAddress'] ?? '';
                                              Navigator.pop(context);
                                            });
                                          },
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  },
                  prefixIcon: Icon(FontAwesome.map_marker),
                ),
                color: ColorsApp(),
              ),

              SizedBox(height: 15),
              Text(
                '*Contact Number',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              CustomTextfield(
                Textfieldmodels: Textfieldmodel(
                  Icon(FontAwesome.edit),
                  TextInputType.phone,
                  phoneController,
                  "Enter your phone number",
                  false,
                  null,
                  prefixIcon: Icon(FontAwesome.mobile_phone),
                ),
                color: ColorsApp(),
              ),
              SizedBox(height: 15),
              Text(
                '*Delivery date',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              CustomTextfield(
                Textfieldmodels: Textfieldmodel(
                  Icon(FontAwesome.calendar),
                  TextInputType.datetime,
                  dateController,
                  "Select delivery date",
                  true,
                  () async {
                    DateTime? pickedDate = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2101),
                    );
                    setState(() {
                      selectedDateTime = pickedDate;
                      if (pickedDate != null) {
                        dateController.text =
                            "${pickedDate.day}/${pickedDate.month}/${pickedDate.year}";
                      }
                    });
                  },
                  prefixIcon: Icon(FontAwesome.clock_o),
                ),
                color: ColorsApp(),
              ),
              SizedBox(height: 15),
              Text(
                '*Payment Method',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              CustomTextfield(
                Textfieldmodels: Textfieldmodel(
                  Icon(FontAwesome.arrow_circle_o_right),
                  TextInputType.text,
                  TextEditingController(text: selectedpayment),
                  "Select payment method",
                  true,
                  () async {
                    showModalBottomSheet(
                      context: context,
                      builder: (BuildContext context) {
                        return Padding(
                          padding: const EdgeInsets.all(20),
                          child: SizedBox(
                            height: 350,
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 60,
                                  height: 7,
                                  decoration: BoxDecoration(
                                    color: ColorsApp().secondaryColor,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                                SizedBox(height: 15),
                                Divider(),
                                SizedBox(height: 20),
                                Text(
                                  'Select Payment Method',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: 30),
                                Ratiolisttile(
                                  groupValue: selectedpayment,
                                  onChanged: (String value) {
                                    setState(() {
                                      selectedpayment = value;
                                      Navigator.pop(context);
                                    });
                                  },
                                  value: 'Cash',
                                  title: 'Cash',
                                ),
                                Ratiolisttile(
                                  groupValue: selectedpayment,
                                  onChanged: (String value) {
                                    setState(() {
                                      selectedpayment = value;
                                      Navigator.pop(context);
                                    });
                                  },
                                  value: 'Credit Card',
                                  title: 'Credit Card',
                                ),
                                Ratiolisttile(
                                  groupValue: selectedpayment,
                                  onChanged: (String value) {
                                    setState(() {
                                      selectedpayment = value;
                                      Navigator.pop(context);
                                    });
                                  },
                                  value: 'Vodafone Cash',
                                  title: 'Vodafone Cash',
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  },
                  prefixIcon: Icon(FontAwesome.cc_visa),
                ),
                color: ColorsApp(),
              ),

              SizedBox(height: 20),

              CustomButton(txt: "Submit Request", nameNextPage: "DeliveryAnything"),
            ],
          ),
        ),
      ),
    );
  }
}