import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/general/map/utils/location_service.dart';

class PlacesBottomSheet extends StatefulWidget {
  const PlacesBottomSheet({super.key});

  @override
  State<PlacesBottomSheet> createState() => _PlacesBottomSheetState();
}

class _PlacesBottomSheetState extends State<PlacesBottomSheet> {
  bool isLoading = false;
  LocationService locationService = LocationService();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 60,
            height: 5,
            decoration: BoxDecoration(
              color: Colors.grey[400],
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          SizedBox(height: 20),
          Text(
            'Choose Your Current Location',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 25),
          isLoading
              ? CircularProgressIndicator()
              : SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      setState(() {
                        isLoading = true;
                      });
                      try {
                        await locationService
                            .checkAndRequestLocationService();
                        await locationService.checkAndRequestPermission();
                        var locationData =
                            await locationService.getLocation();
                        LatLng currentLocation = LatLng(
                          locationData.latitude!,
                          locationData.longitude!,
                        );
                        Navigator.pop(context, currentLocation);
                      } catch (e) {
                        print("Error getting location: $e");
                      } finally {
                        setState(() {
                          isLoading = false;
                        });
                      }
                    },
                    icon: Icon(Icons.my_location),
                    label: Text("Use My Current Location"),
                    style: OutlinedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 15),
                      side: BorderSide(color: ColorsApp().secondaryColor),
                      foregroundColor: Colors.black,
                      backgroundColor: ColorsApp().backgroundColor,
                      textStyle: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
        ],
      ),
    );
  }
}
