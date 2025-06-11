import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomTextField.dart';
import 'package:moto/general/map/utils/google_maps_places_services.dart';
import 'package:moto/models/place_autocomplete_model/place_autocomplete_model.dart';
import 'package:moto/models/place_details_model/place_details_model.dart';
import 'package:moto/models/textfieldmodel.dart';

class PlacesBottomSheet extends StatefulWidget {
  final GoogleMapsPlacesServices googleMapsPlacesServices;
  final ColorsApp colorsApp;

  const PlacesBottomSheet({
    super.key,
    required this.googleMapsPlacesServices,
    required this.colorsApp,
  });

  @override
  State<PlacesBottomSheet> createState() => _PlacesBottomSheetState();
}

class _PlacesBottomSheetState extends State<PlacesBottomSheet> {
  final TextEditingController textEditingController = TextEditingController();
  List<PlaceAutocompleteModel> places = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    textEditingController.addListener(() async {
      if (textEditingController.text.isNotEmpty) {
        setState(() => isLoading = true);
        var result = await widget.googleMapsPlacesServices.getPredictions(
          textEditingController.text,
        );
        setState(() {
          places = result;
          isLoading = false;
        });
      } else {
        setState(() {
          places.clear();
          isLoading = false;
        });
      }
    });
  }

  @override
  void dispose() {
    textEditingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SizedBox(
        height: 350,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(width: 60, height: 3),
            SizedBox(height: 15),
            CustomTextfield(
              Textfieldmodels: Textfieldmodel(
                Icon(FontAwesome.arrow_circle_o_right),
                TextInputType.streetAddress,
                textEditingController,
                "Enter your pickup location",
                false,
                () async {},
                prefixIcon: Icon(FontAwesome.search),
              ),
              color: widget.colorsApp,
            ),
            SizedBox(height: 5),
            Expanded(
              child: isLoading
                  ? Center(child: CircularProgressIndicator())
                  : places.isEmpty
                      ? Center(child: Text(""))
                      : ListView.separated(
                          itemBuilder: (context, index) {
                            return ListTile(
                              leading: Icon(
                                Icons.location_on_outlined,
                                color: widget.colorsApp.secondaryColor,
                              ),
                              title: Text(
                                places[index].description ?? "No Description",
                                style: TextStyle(fontSize: 15),
                              ),
                              onTap: () async {
                                final placeId = places[index].placeId;
                                if (placeId != null) {
                                  // جلب تفاصيل المكان عند الضغط
                                  PlaceDetailsModel details =
                                      await widget.googleMapsPlacesServices
                                          .getPlaceDteails(placeId);
                                  Navigator.pop(context, details);
                                }
                              },
                            );
                          },
                          separatorBuilder: (context, index) => Divider(),
                          itemCount: places.length,
                          shrinkWrap: true,
                        ),
            ),
            Divider(),
            SizedBox(height: 2),
            Text(
              '',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}