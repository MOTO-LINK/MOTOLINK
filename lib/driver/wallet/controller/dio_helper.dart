import 'package:dio/dio.dart';

class DioHelper {
  static Dio createDio(String baseUrl) {
    return Dio(
      BaseOptions(
        baseUrl: baseUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      ),
    );
  }

  static Future<Response> postData({
    required String baseUrl,
    required String endpoint,
    required dynamic data,
    required String token ,
  }) async {
    final dio = createDio(baseUrl);
    return await dio.post(
      endpoint,
      data: data,
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
  }

  static Future<Response> getData({
    required String baseUrl,
    required String endpoint,
    required String token,
  }) async {
    final dio = createDio(baseUrl);
    return await dio.get(
      endpoint,
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
  }
}
