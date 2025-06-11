import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/core/widgets/CustomTextField.dart';
import 'package:moto/general/map/utils/Services/google_maps_places_services.dart';
import 'package:moto/models/place_autocomplete_model/place_autocomplete_model.dart';
import 'package:moto/models/place_details_model/place_details_model.dart';
import 'package:moto/models/textfieldmodel.dart';

class PlacesSearchBar extends StatefulWidget {
  final GoogleMapsPlacesServices googleMapsPlacesServices;
  final ColorsApp colorsApp;
  final Function(PlaceDetailsModel) onPlaceSelected;

  const PlacesSearchBar({
    super.key,
    required this.googleMapsPlacesServices,
    required this.colorsApp,
    required this.onPlaceSelected,
  });

  @override
  State<PlacesSearchBar> createState() => _PlacesSearchBarState();
}

class _PlacesSearchBarState extends State<PlacesSearchBar> {
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
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
        SizedBox(height: 10),
        if (isLoading)
          Center(child: CircularProgressIndicator())
        else if (places.isNotEmpty)
          Container(
            constraints: BoxConstraints(maxHeight: 200),
            child: ListView.separated(
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
                      PlaceDetailsModel details =
                          await widget.googleMapsPlacesServices.getPlaceDteails(placeId);
                      widget.onPlaceSelected(details);
                    }
                  },
                );
              },
              separatorBuilder: (context, index) => Divider(),
              itemCount: places.length,
              shrinkWrap: true,
            ),
          ),
      ],
    );
  }
}