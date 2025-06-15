import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:moto/driver/auth/models/ProfileDriverModel.dart';
import 'package:moto/driver/auth/models/UpLoadDocModel.dart';
import 'package:path/path.dart';
import 'package:moto/driver/auth/models/ProfileModel.dart';
import 'package:moto/driver/auth/models/UploadPicModel.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http_parser/http_parser.dart';

class ProfileService {
  final String _baseUrl =
      "http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api";

  Future<UpdateProfileResponse?> updateProfile({
    required String name,
    required String email,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        print("❌ No token found");
        return null;
      }
      final Uri url = Uri.parse("$_baseUrl/profile");
      final response = await http.patch(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'name': name, 'email': email}),
      );

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final updateResponse = UpdateProfileResponse.fromJson(body);
        print("✅ Profile updated successfully");
        return updateResponse;
      } else {
        print("❌ Failed to update profile. Status: ${response.statusCode}");
        print("Body: ${response.body}");
        return null;
      }
    } catch (e) {
      print("❌ Exception in updateProfile: $e");
      return null;
    }
  }

  Future<UploadPictureResponse?> uploadProfilePicture(File imageFile) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) {
        print("❌ No token found");
        return null;
      }
      final uri = Uri.parse("$_baseUrl/profile/picture");
      final request = http.MultipartRequest('POST', uri);
      // Headers
      request.headers['Authorization'] = 'Bearer $token';
      // File
      final fileName = basename(imageFile.path);
      final file = await http.MultipartFile.fromPath(
        'file',
        imageFile.path,
        filename: fileName,
        contentType: MediaType('image', 'jpeg'),
      );
      request.files.add(file);

      print("======= DEBUGGING UPLOAD =======");
      print("Endpoint URL: ${request.url}");
      print("Request Method: ${request.method}");
      print("Authorization Header: ${request.headers['Authorization']}");
      print("Multipart Field Name: ${file.field}");
      print("File Path: ${file.filename}");
      // print("File Length: ${await file.length()} bytes");
      print("File ContentType: ${file.contentType}");
      print("==============================");

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final uploadResponse = UploadPictureResponse.fromJson(body);
        await prefs.setString('profile_picture', uploadResponse.profilePicture);
        print("✅ Profile picture uploaded: ${uploadResponse.profilePicture}");
        return uploadResponse;
      } else {
        print("❌ Upload failed with status ${response.statusCode}");
        print("Body: ${response.body}");
        return null;
      }
    } catch (e) {
      print("❌ Exception in uploadProfilePicture: $e");
      return null;
    }
  }

Future<UploadDocResponse?> uploadDriverDocument({
    required File file,
    required String documentType, // e.g., "national_id_front" or "national_id_back"
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) {
        print("❌ No token found");
        return null;
      }

      final uri = Uri.parse("$_baseUrl/driver/documents/upload");
      final request = http.MultipartRequest('POST', uri);

      // ١. إضافة الـ Headers والـ Fields
      request.headers['Authorization'] = 'Bearer $token';
      request.fields['documentType'] = documentType;

      // ٢. إنشاء وإضافة الملف
      final fileName = basename(file.path);
      final multipartFile = await http.MultipartFile.fromPath(
        'file', // هذا هو اسم الحقل الذي يتوقعه الخادم
        file.path,
        filename: fileName,
        contentType: MediaType('image', 'jpeg'), // تحديد نوع الملف يدوياً
      );
      request.files.add(multipartFile);

      // ٣. إرسال الطلب واستقبال الاستجابة
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      // ٤. تحليل الاستجابة
      if (response.statusCode == 201) {
        final body = jsonDecode(response.body);
        final result = UploadDocResponse.fromJson(body);
        print("✅ Document '$documentType' uploaded: ${result.data.documentUrl}");

        // ٥. حفظ البيانات المهمة محلياً (كما طلبت)
        await _saveDocumentData(prefs, result.data);

        return result;
      } else {
        print("❌ Document upload failed: ${response.statusCode}");
        print("Body: ${response.body}");
        return null;
      }
    } catch (e) {
      print("❌ Exception in uploadDriverDocument: $e");
      return null;
    }
  }

  // دالة مساعدة لتخزين بيانات المستند في SharedPreferences
  Future<void> _saveDocumentData(SharedPreferences prefs, DocumentData data) async {
    // سنستخدم نوع المستند كمفتاح لضمان عدم التضارب
    // مثال: national_id_front_id, national_id_front_url
    final prefix = data.documentType;
    await prefs.setString('${prefix}_id', data.documentId);
    await prefs.setString('${prefix}_url', data.documentUrl);
    await prefs.setString('${prefix}_status', data.verificationStatus);
    print("✅ Saved document data for '$prefix'");
  }

  Future<DriverProfileModel?> getDriverProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) {
        print("❌ Token missing");
        return null;
      }

      final uri = Uri.parse("$_baseUrl/driver/profile");
      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        final driver = DriverProfileModel.fromJson(jsonData['data']);
        print("✅ Driver Profile fetched successfully.");
        return driver;
      } else {
        print("❌ Failed to fetch driver profile: ${response.statusCode}");
        print(response.body);
        return null;
      }
    } catch (e) {
      print("❌ Exception in getDriverProfile: $e");
      return null;
    }
  }
}
