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
        savedAddresses = decoded.map<Map<String, dynamic>>((address) {
          if (address['latLng'] is List) {
            address['latLng'] =
                LatLng(address['latLng'][0], address['latLng'][1]);
          }
          return Map<String, dynamic>.from(address);
        }).toList();
      });
    }
  }

  Future<void> _saveAddresses() async {
    final prefs = await SharedPreferences.getInstance();
    final addressesToSave = savedAddresses.map((address) {
      final latLng = address['latLng'];
      if (latLng is LatLng) {
        address = Map<String, dynamic>.from(address);
        address['latLng'] = [latLng.latitude, latLng.longitude];
      }
      return address;
    }).toList();
    final jsonString = jsonEncode(addressesToSave);
    await prefs.setString('saved_addresses', jsonString);
  }

  Future<void> _navigateToSelectLocation({int? indexToEdit}) async {
    Map<String, dynamic>? oldAddress;
    if (indexToEdit != null) {
      oldAddress = savedAddresses[indexToEdit];
    }
    print('oldAddress: $oldAddress');

    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SelectLocationScreen(
          initialLabel: oldAddress?['label'],
          initialAutoAddress: oldAddress?['autoAddress'],
          initialLatLng: oldAddress?['latLng'],
          initialLocationId: oldAddress?['locationId'],
        ),
      ),
    );

    print('Result from SelectLocationScreen: $result');

    if (result != null && result is Map<String, dynamic>) {
      try {
        final storageService = StorageService();
        final token = await storageService.getToken();
        final latLng = result['latLng'] as LatLng;

        if (indexToEdit != null) {
          print("🟢 تعديل عنوان قديم");

          final locationId = savedAddresses[indexToEdit]['locationId'];

          if (locationId == null) {
            print("🚨 لا يوجد locationId .. بيتم إضافته كعنوان جديد");

            final newLocationId = await sendLocationToBackend(
              latLng: latLng,
              autoAddress: result['autoAddress'],
              label: result['label'],
              token: token ?? '',
            );
            result['locationId'] = newLocationId;
            result['latLng'] = latLng;

            setState(() {
              savedAddresses[indexToEdit] = result;
            });
          } else {
            await updateLocationToBackend(
              locationId: locationId,
              latLng: latLng,
              autoAddress: result['autoAddress'],
              label: result['label'],
              token: token ?? '',
            );

            result['locationId'] = locationId;
            result['latLng'] = latLng;

            setState(() {
              savedAddresses[indexToEdit] = result;
            });
          }
        } else {
          print("🟢 إضافة عنوان جديد");
          final newLocationId = await sendLocationToBackend(
            latLng: latLng,
            autoAddress: result['autoAddress'],
            label: result['label'],
            token: token ?? '',
          );
          result['locationId'] = newLocationId;
          result['latLng'] = latLng;
          setState(() {
            savedAddresses.add(result);
          });
        }
        await _saveAddresses();
      } catch (e) {
        print("❌ Failed to send/update to backend: $e");
      }
    }
  }

  Future<void> _deleteAddress(int index) async {
    final address = savedAddresses[index];
    final locationId = address['locationId'];
    try {
      final storageService = StorageService();
      final token = await storageService.getToken();

      if (token == null || token.isEmpty) {
        print("❌ Token is null or empty!");
        return;
      }

      if (locationId != null) {
        await deleteLocationFromBackend(
            locationId: locationId, token: token);
        print("✅ Address deleted from backend! locationId: $locationId");
      }
      
      setState(() {
        savedAddresses.removeAt(index);
      });
      await _saveAddresses();
    } catch (e) {
      print("❌ Failed to delete address from backend: $e");
    }
  }

  void _confirmDelete(int index) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("تأكيد الحذف"),
          content: Text("هل أنت متأكد من حذف العنوان؟"),
          actions: [
            TextButton(
              child: Text("إلغاء"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text("حذف", style: TextStyle(color: Colors.red)),
              onPressed: () {
                Navigator.of(context).pop();
                _deleteAddress(index);
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _clearAllAddresses() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('saved_addresses');
    setState(() {
      savedAddresses.clear();
    });
    print('✅ تم مسح كل العناوين القديمة');
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
                  side: BorderSide(
                      color: ColorsApp().secondaryColor, width: 3),
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
                    style: TextStyle(
                        color: ColorsApp().TextField, fontSize: 16),
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
                                onPressed: () =>
                                    _navigateToSelectLocation(indexToEdit: index),
                              ),
                              IconButton(
                                icon: Icon(Icons.delete,
                                    color: ColorsApp().secondaryColor),
                                onPressed: () => _confirmDelete(index),
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
