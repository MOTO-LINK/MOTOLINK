import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:moto/general/map/utils/Services/SendAdress.dart';

import 'package:moto/rider/auth/core/services/storage_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomAppBar.dart';
import 'package:moto/general/map/utils/views/mappicker.dart';
class Adresses extends StatefulWidget {
  const Adresses({super.key});

  @override
  State<Adresses> createState() => _AdressesState();
}

class _AdressesState extends State<Adresses> {
  List<Map<String, dynamic>> savedAddresses = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadSavedAddresses();
    });
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

  Future<void> _saveAddresses() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = jsonEncode(savedAddresses);
    await prefs.setString('saved_addresses', jsonString);
  }

  Future<void> _navigateToSelectLocation({int? indexToEdit}) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SelectLocationScreen(),
      ),
    );

    if (result != null && result is Map<String, dynamic>) {
      try {
        final storageService = StorageService(); 
        final token = await storageService.getToken(); 
        print("📦 Token used: $token"); 

        final latLng = result['latLng'] as LatLng;

        await sendLocationToBackend(
          latLng: latLng,
          autoAddress: result['autoAddress'],
          label: result['label'],
          token: token ?? '',
        );

        print("✅ Address sent to backend!");
      } catch (e) {
        print("❌ Failed to send to backend: $e");
      }

      setState(() {
        if (indexToEdit != null) {
          savedAddresses[indexToEdit] = result;
        } else {
          savedAddresses.add(result);
        }
      });
      await _saveAddresses();
    }
  }

  Future<void> _deleteAddress(int index) async {
    setState(() {
      savedAddresses.removeAt(index);
    });
    await _saveAddresses();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Adresses',
        imagePath: 'assets/images/DELIVERY.png',
        onBackPressed: () {
          Navigator.pop(context);
        },
      ),
      body: Column(
        children: [
          SizedBox(height: 20),
          Center(
            child: SizedBox(
              width: 400,
              height: 130,
              child: OutlinedButton(
                onPressed: () => _navigateToSelectLocation(),
                style: OutlinedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: ColorsApp().primaryColor,
                  side: BorderSide(color: ColorsApp().secondaryColor, width: 3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(FontAwesomeIcons.mapLocationDot,
                        color: ColorsApp().secondaryColor, size: 30),
                    SizedBox(width: 10),
                    Text(
                      'Add Address!',
                      style: TextStyle(
                          fontSize: 22, color: ColorsApp().primaryColor),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SizedBox(height: 20),
          savedAddresses.isEmpty
              ? Center(
                  child: Text(
                    'No saved addresses yet.',
                    style:
                        TextStyle(color: ColorsApp().TextField, fontSize: 16),
                  ),
                )
              : Expanded(
                  child: ListView.builder(
                    itemCount: savedAddresses.length,
                    itemBuilder: (context, index) {
                      final address = savedAddresses[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16.0, vertical: 8),
                        child: Container(
                          padding: EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12,
                                blurRadius: 6,
                                offset: Offset(0, 3),
                              )
                            ],
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.location_on,
                                  color: ColorsApp().secondaryColor),
                              SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      address['label'] ?? 'No Label',
                                      style: TextStyle(
                                          color: ColorsApp().primaryColor,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16),
                                    ),
                                    SizedBox(height: 4),
                                    Text(
                                      address['autoAddress'] ?? '',
                                      style: TextStyle(
                                          color: ColorsApp().TextField,
                                          fontSize: 14),
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                icon: Icon(Icons.edit,
                                    color: ColorsApp().primaryColor),
                                onPressed: () => _navigateToSelectLocation(
                                    indexToEdit: index),
                              ),
                              IconButton(
                                icon: Icon(Icons.delete,
                                    color: ColorsApp().secondaryColor),
                                onPressed: () => _deleteAddress(index),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
        ],
      ),
    );
  }
}
