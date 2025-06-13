import 'dart:convert';

import 'package:http/http.dart'as http;
import 'package:moto/models/place_autocomplete_model/place_autocomplete_model.dart';
import 'package:moto/models/place_details_model/place_details_model.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';


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


class GoogleDirectionsService {
  final String _apiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q';

  Future<List<LatLng>> getRoute(LatLng origin, LatLng destination) async {
    final String url =
        'https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}'
        '&destination=${destination.latitude},${destination.longitude}&key=$_apiKey';

    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);

      final List<LatLng> polylinePoints = [];

      final routes = data['routes'];
      if (routes.isNotEmpty) {
        final points = routes[0]['overview_polyline']['points'];
        polylinePoints.addAll(_decodePolyline(points));
      }

      return polylinePoints;
    } else {
      throw Exception('فشل في تحميل الاتجاهات');
    }
  }

  List<LatLng> _decodePolyline(String encoded) {
    List<LatLng> polyline = [];
    int index = 0, len = encoded.length;
    int lat = 0, lng = 0;

    while (index < len) {
      int b, shift = 0, result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      polyline.add(LatLng(lat / 1E5, lng / 1E5));
    }

    return polyline;
  }
}
