import 'dart:convert';

import 'package:http/http.dart'as http;
import 'package:moto/models/place_autocomplete_model/place_autocomplete_model.dart';
import 'package:moto/models/place_details_model/place_details_model.dart';

class GoogleMapsPlacesServices {
  final String baseUrl = 'https://maps.googleapis.com/maps/api/place';

  final String apiKey="AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q";
  // Example method to fetch places by keyword
  Future<List<PlaceAutocompleteModel>> getPredictions (String input) async {
  var response= await http.get(Uri.parse("$baseUrl/autocomplete/json?key=$apiKey&input=$input"));
  if (response.statusCode == 200) {
   var date=jsonDecode(response.body)['predictions'];
    List<PlaceAutocompleteModel> places = [];
    for (var item in date) {
      places.add(PlaceAutocompleteModel.fromJson(item));
    }
    return places; 
  } else {
    throw Exception('Failed to load predictions');}
  }

  Future<PlaceDetailsModel> getPlaceDteails (String PlaceId) async {
  var response= await http.get(Uri.parse("$baseUrl/details/json?key=$apiKey&place_id=$PlaceId"));
  if (response.statusCode == 200) {
   var date=jsonDecode(response.body)['result'];
   
    return PlaceDetailsModel.fromJson(date); 
  } else {
    throw Exception('Failed to load places');}
  }
  
}