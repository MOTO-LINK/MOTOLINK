import 'package:moto/general/core/models/login_response_model.dart';
import 'package:moto/general/core/models/signup_response_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const String _tokenKey = 'auth_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userIdKey = 'user_id';
  static const String _userNameKey = 'user_name';
  static const String _userEmailKey = 'user_email';
  static const String _userPhoneKey = 'user_phone';
  static const String _userTypeKey = 'user_type';

  // 🆕 مفاتيح حالة السواق
  static const String _driverOnlineKey = 'is_driver_online';
  static const String _driverAvailableKey = 'is_driver_available';

  Future<void> saveUserSession(SignUpSuccessResponse response) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, response.data.token);
    await prefs.setString(_refreshTokenKey, response.data.refreshToken);
    final user = response.data.user;
    await prefs.setString(_userIdKey, user.userId);
    await prefs.setString(_userNameKey, user.name);
    await prefs.setString(_userEmailKey, user.email);
    await prefs.setString(_userPhoneKey, user.phone);
    await prefs.setString(_userTypeKey, user.userType);
    print("Session Saved Successfully with ALL user data!");
  }

  Future<void> saveLoginSession(LoginResponseModel response) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, response.data.token);
    await prefs.setString(_refreshTokenKey, response.data.refreshToken);
    final user = response.data.user;
    await prefs.setString(_userIdKey, user.userId);
    await prefs.setString(_userNameKey, user.name);
    await prefs.setString(_userEmailKey, user.email);
    await prefs.setString(_userPhoneKey, user.phone);
    await prefs.setString(_userTypeKey, user.userType);
    print("Login Session Saved Successfully!");
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userNameKey);
  }

  Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userIdKey);
  }

  Future<String?> getUserEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userEmailKey);
  }

  Future<String?> getUserPhone() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userPhoneKey);
  }

  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    print("Session Cleared (Logout).");
  }

  Future<String?> getUserType() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userTypeKey);
  }

  Future<String?> getRefreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_refreshTokenKey);
  }

  // 🟢 سويتش الأونلاين
  Future<void> saveDriverOnlineStatus(bool online) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_driverOnlineKey, online);
  }

  Future<bool> getDriverOnlineStatus() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_driverOnlineKey) ?? false;
  }

  // 🟢 سويتش التوفر
  Future<void> saveDriverAvailability(bool available) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_driverAvailableKey, available);
  }

  Future<bool> getDriverAvailability() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_driverAvailableKey) ?? false;
  }
}
