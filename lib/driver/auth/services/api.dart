import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ApiInfo {
  final String baseUrl =
      'http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api';

  Future<dynamic> get(String endpoint) async {
    final url = Uri.parse('$baseUrl/$endpoint');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('error data (${response.statusCode})');
      }
    } catch (e) {
      print('GET Error: $e');
      return null;
    }
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    final url = Uri.parse('$baseUrl/$endpoint');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(body),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        throw Exception('error to send (${response.statusCode})');
      }
    } catch (e) {
      print('POST Error: $e');
      return null;
    }
  }

  Future<dynamic> uploadProfilePicture(File imageFile) async {
    final url = Uri.parse('$baseUrl/profile/picture');

    final request = http.MultipartRequest('POST', url);
    request.files.add(await http.MultipartFile.fromPath(
      'file', // 👈 مهم: لازم يكون نفس اسم المتغير في الـ API
      imageFile.path,
    ));

    try {
      final response = await request.send();
      final responseData = await http.Response.fromStream(response);

      if (responseData.statusCode == 200) {
        return json.decode(responseData.body);
      } else {
        throw Exception('error in upload picture (${responseData.statusCode})');
      }
    } catch (e) {
      print('UPLOAD Error: $e');
      return null;
    }
  }
}

extension MotolinkApiDocumentUpload on ApiInfo {
  Future<dynamic> uploadDriverDocument({
    required File documentFile,
    required String documentType,
  }) async {
    final url = Uri.parse('$baseUrl/driver/documents/upload');

    final request = http.MultipartRequest('POST', url);
    request.fields['documentType'] = documentType;
    request.files.add(await http.MultipartFile.fromPath(
      'file',
      documentFile.path,
    ));

    try {
      final response = await request.send();
      final responseBody = await http.Response.fromStream(response);

      if (response.statusCode == 201) {
        return json.decode(responseBody.body);
      } else {
        print("error in upload document(${response.statusCode}): ${responseBody.body}");
        return null;
      }
    } catch (e) {
      print('UPLOAD Document Error: $e');
      return null;
    }
  }
}
