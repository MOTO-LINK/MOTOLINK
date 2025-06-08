import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomTextField.dart';
import 'package:moto/core/widgets/OrderdetailsTextField.dart';
import 'package:moto/core/widgets/RatioListTileForPayement.dart';
import 'package:moto/core/widgets/custom_button.dart';
import 'package:moto/models/textfieldmodel.dart';

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
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    '*Order Details',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  selectedimage == null
                      ? Padding(
                        padding: const EdgeInsets.only(left: 220),
                        child: IconButton(
                          style: ButtonStyle(
                            backgroundColor: WidgetStateProperty.all(
                              ColorsApp().backgroundColor,
                            ),
                            shape:
                                WidgetStateProperty.all<RoundedRectangleBorder>(
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
                  () async {},

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
                  TextEditingController(text: pickupLocation),
                  "Enter your pickup location",
                  true,
                  () async {},

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
                    if (pickedDate != null) {
                      setState(() {
                        selectedDateTime = pickedDate;
                        dateController.text =
                            "${pickedDate.day}/${pickedDate.month}/${pickedDate.year}";
                      });
                    }
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

              CustomButton(txt: "Submit Request", nameNextPage: "splash_page"),
            ],
          ),
        ),
      ),
    );
  }
}
