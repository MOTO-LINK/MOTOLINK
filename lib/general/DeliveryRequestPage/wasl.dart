import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:moto/general/DeliveryRequestPage/DelveryRequestServices.dart';
import 'package:moto/general/map/utils/widgets/custombuttonnew.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/core/widgets/CustomTextField.dart';
import 'package:moto/core/widgets/OrderdetailsTextField.dart';
import 'package:moto/models/textfieldmodel.dart';
import 'package:moto/rider/auth/core/services/storage_service.dart'; 

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
  Map<String, dynamic>? selectedPickupAddress;
  Map<String, dynamic>? selectedDropoffAddress;
  DateTime? selectedDateTime;
  String selectedPayment = 'cash';
  List<String> paymentMethods = ['cash', ];
  List<Map<String, dynamic>> savedAddresses = [];

  String? currentToken;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    final storageService = StorageService();
    currentToken = await storageService.getToken();
    await _loadSavedAddresses();
  }

  Future<void> _loadSavedAddresses() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString('saved_addresses');
    if (jsonString != null) {
      final List decoded = jsonDecode(jsonString);
      setState(() {
        savedAddresses = decoded
            .map<Map<String, dynamic>>((address) {
              if (address['latLng'] is List) {
                address['latitude'] = address['latLng'][0];
                address['longitude'] = address['latLng'][1];
              }
              return Map<String, dynamic>.from(address);
            })
            .where((address) => address['userToken'] == currentToken)
            .toList();
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
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            buildTitle('*Order Details'),
            OrderDetailsTextField(descriptionController: descriptionController),
            SizedBox(height: 20),

            buildLocationField('Pickup Location', pickupLocation, true),
            SizedBox(height: 20),

            buildLocationField('Dropoff Location', dropoffLocation, false),
            SizedBox(height: 20),

            buildTitle('*Contact Number'),
            CustomTextfield(
              Textfieldmodels: Textfieldmodel(
                Icon(FontAwesome.mobile_phone),
                TextInputType.phone,
                phoneController,
                "Enter your phone number",
                false,
                null,
                prefixIcon: Icon(FontAwesome.edit),
              ),
              color: ColorsApp(),
            ),
            SizedBox(height: 20),

            buildTitle('*Delivery Date'),
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
                    firstDate: DateTime.now(),
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
            SizedBox(height: 20),

            buildTitle('*Payment Method'),
            CustomTextfield(
              Textfieldmodels: Textfieldmodel(
                Icon(FontAwesome.cc_visa),
                TextInputType.text,
                TextEditingController(text: selectedPayment),
                "Select payment method",
                true,
                () => _selectPaymentMethod(),
                prefixIcon: Icon(FontAwesome.arrow_circle_o_right),
              ),
              color: ColorsApp(),
            ),
            SizedBox(height: 40),

            CustomButtonNew(
              txt: "Submit Request",
              onPressed: () {
                submitRequest();
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget buildTitle(String title) {
    return Text(title, style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold));
  }

  Widget buildLocationField(String label, String value, bool isPickup) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        buildTitle('*$label'),
        SizedBox(height: 10),
        GestureDetector(
          onTap: () => _selectLocation(isPickup),
          child: Container(
            padding: EdgeInsets.symmetric(vertical: 15, horizontal: 10),
            decoration: BoxDecoration(
              border: Border.all(color: ColorsApp().secondaryColor, width: 2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Icon(FontAwesome.map_marker, color: ColorsApp().secondaryColor),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    value,
                    style: TextStyle(
                      fontSize: 16,
                      color: value == 'Choose location' ? Colors.grey : ColorsApp().primaryColor,
                    ),
                  ),
                ),
                Icon(Icons.arrow_drop_down),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _selectLocation(bool isPickup) async {
    if (savedAddresses.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("No saved addresses")));
      return;
    }

    await showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Padding(
          padding: const EdgeInsets.all(20),
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
              SizedBox(height: 20),
              Text('Select From Saved Locations',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              SizedBox(height: 20),
              Expanded(
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: savedAddresses.length,
                  itemBuilder: (context, index) {
                    final address = savedAddresses[index];
                    return ListTile(
                      leading: Icon(Icons.location_on, color: ColorsApp().secondaryColor),
                      title: Text(address['autoAddress'] ?? ''),
                      subtitle: Text(
                          "Lat: ${address['latitude']}, Lng: ${address['longitude']}"),
                      onTap: () {
                        setState(() {
                          final selected = {
                            'id': address['locationId'],
                            'label': address['autoAddress'],
                            'latitude': address['latitude'],
                            'longitude': address['longitude'],
                          };

                          if (isPickup) {
                            selectedPickupAddress = selected;
                            pickupLocation = address['autoAddress'];
                          } else {
                            selectedDropoffAddress = selected;
                            dropoffLocation = address['autoAddress'];
                          }
                          Navigator.pop(context);
                        });
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _selectPaymentMethod() async {
    await showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          padding: EdgeInsets.all(20),
          height: 300,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 60,
                  height: 7,
                  decoration: BoxDecoration(
                    color: ColorsApp().secondaryColor,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              SizedBox(height: 20),
              ...paymentMethods.map((method) {
                return ListTile(
                  leading: Icon(Icons.payment, color: ColorsApp().secondaryColor),
                  title: Text(method),
                  onTap: () {
                    setState(() {
                      selectedPayment = method;
                      Navigator.pop(context);
                    });
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }

  void submitRequest() async {
  if (selectedPickupAddress == null || selectedDropoffAddress == null || descriptionController.text.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Please complete all fields")));
    return;
  }

  bool success = await DeliveryService().createDeliveryRequest(
    pickupLocation: selectedPickupAddress!,
    dropoffLocation: selectedDropoffAddress!,
    description: descriptionController.text,
    quantity: 1,
    weight: 2,
    paymentMethod: selectedPayment
  );

  if (success) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Delivery request submitted")));

    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => DeliveryRequestPage()
      ),
    );

  } else {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Submission failed")));
  }
}
}
