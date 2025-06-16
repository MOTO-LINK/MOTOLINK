import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:http/http.dart' as http;
import 'package:moto/general/core/service/storage_service.dart';
import 'package:moto/general/map/utils/Services/driverService.dart';

class DriverHomePage extends StatefulWidget {
  const DriverHomePage({super.key});

  @override
  State<DriverHomePage> createState() => _DriverHomePageState();
}

class _DriverHomePageState extends State<DriverHomePage> {
  final DriverService driverService = DriverService();
  final StorageService storageService = StorageService();
  final Location location = Location();

  bool _isOnline = false;
  bool _isDriverOnline = false;
  bool _isLoading = false;
  bool _showBigMap = false;
  bool _hasAcceptedOrder = false;
  bool _hasPickedUp = false;
  bool _isMapInitialized = false;
  bool _isCameraLocked = false;
  Map<String, dynamic>? _pendingOrder;
  String _userName = '';
  String? _pickupAddress;
  String? _dropoffAddress;

  GoogleMapController? _mapController;
  LatLng? _currentLatLng;
  LatLng? _lastRouteLatLng;
  Timer? _locationTimer;
  Timer? _ridesTimer;

  Set<Polyline> _polylines = {};
  Set<Marker> _markers = {};

  static const Color primaryColor = Color(0xFFB5022F);
  static const Color secondaryColor = Colors.black;
  static const Color accentColor = Colors.white;

  @override
  void initState() {
    super.initState();
    _initialize();
    _startFetchingRides();
  }

  void _startFetchingRides() {
    _ridesTimer?.cancel();
    _ridesTimer = Timer.periodic(const Duration(seconds: 5), (_) async {
      if (_hasAcceptedOrder) {
        print('تخطي جلب الطلبات: الطلب مقبول بالفعل');
        return;
      }
      bool online = await storageService.getDriverOnlineStatus();
      bool available = await storageService.getDriverAvailability();
      print('حالة السائق: أونلاين=$online, متاح=$available');
      if (online && available) {
        try {
          final availableRides = await driverService.fetchAvailableRides();
          print('الطلبات المتاحة: ${jsonEncode(availableRides)}');
          setState(() {
            _pendingOrder = availableRides.isNotEmpty ? availableRides.first : null;
            _pickupAddress = null;
            _dropoffAddress = null;
            _updateMarkers();
          });
          if (_pendingOrder != null) {
            print('طلب جديد: ${jsonEncode(_pendingOrder)}');
            await _fetchAddresses();
            await _drawRouteToPickup();
          }
        } catch (e) {
          print('خطأ في جلب الطلبات: $e');
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('❌ خطأ في جلب الطلبات: $e')),
          );
        }
      } else {
        setState(() {
          _pendingOrder = null;
          _pickupAddress = null;
          _dropoffAddress = null;
          _polylines = {};
          _markers = {};
        });
      }
    });
  }

  @override
  void dispose() {
    _locationTimer?.cancel();
    _ridesTimer?.cancel();
    _mapController?.dispose();
    super.dispose();
  }

  Future<bool> _checkAndRequestLocationPermissions() async {
    bool serviceEnabled = await location.serviceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await location.requestService();
      if (!serviceEnabled) {
        print('خدمة الموقع غير مفعلة');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ يرجى تفعيل خدمة الموقع')),
        );
        return false;
      }
    }

    PermissionStatus permission = await location.hasPermission();
    if (permission == PermissionStatus.denied) {
      permission = await location.requestPermission();
      if (permission != PermissionStatus.granted) {
        print('إذن الموقع مرفوض');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ يرجى منح إذن الموقع')),
        );
        return false;
      }
    }
    return true;
  }

  Future<LocationData?> _getCurrentLocation({int retries = 3}) async {
    for (int i = 0; i < retries; i++) {
      try {
        LocationData locationData = await location.getLocation();
        if (locationData.latitude != null && locationData.longitude != null) {
          print('تم جلب الموقع: lat=${locationData.latitude}, lng=${locationData.longitude}');
          return locationData;
        } else {
          print('إحداثيات الموقع فارغة: lat=${locationData.latitude}, lng=${locationData.longitude}');
        }
      } catch (e) {
        print('خطأ جلب الموقع (محاولة ${i + 1}): $e');
        if (i < retries - 1) await Future.delayed(const Duration(seconds: 2));
      }
    }
    print('فشل جلب الموقع بعد $retries محاولات');
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('❌ فشل جلب الموقع، تحقق من إعدادات GPS')),
    );
    return null;
  }

  Future<void> _initialize() async {
    setState(() => _isLoading = true);
    print('بدء التهيئة');
    try {
      if (!await _checkAndRequestLocationPermissions()) {
        throw Exception('فشل في تفعيل الموقع أو الحصول على الإذن');
      }

      final name = await storageService.getUserName();
      final availableRides = await driverService.fetchAvailableRides();
      print('الطلبات المتاحة الأولية: ${jsonEncode(availableRides)}');
      _isOnline = await storageService.getDriverAvailability();
      _isDriverOnline = await storageService.getDriverOnlineStatus();

      LocationData? locationData = await _getCurrentLocation();
      if (locationData?.latitude != null && locationData?.longitude != null) {
        _currentLatLng = LatLng(locationData!.latitude!, locationData!.longitude!);
        print('موقع السائق الأولي: $_currentLatLng');
        _updateMarkers();
      } else {
        print('فشل جلب الموقع الأولي، استخدام إحداثيات افتراضية');
        _currentLatLng = const LatLng(30.0444, 31.2357);
        _updateMarkers();
      }

      setState(() {
        _userName = name ?? 'سائق';
        _pendingOrder = availableRides.isNotEmpty ? availableRides.first : null;
        _isLoading = false;
      });

      if (_pendingOrder != null) {
        print('طلب أولي موجود: ${jsonEncode(_pendingOrder)}');
        await _fetchAddresses();
        await _drawRouteToPickup();
      } else {
        print('لا توجد طلبات أولية');
      }

      _locationTimer = Timer.periodic(const Duration(seconds: 10), (_) async {
        try {
          LocationData? locationData = await _getCurrentLocation(retries: 2);
          if (locationData?.latitude != null && locationData?.longitude != null) {
            LatLng newLatLng = LatLng(locationData!.latitude!, locationData!.longitude!);
            bool significantChange = _currentLatLng == null ||
                _calculateDistance(_currentLatLng!, newLatLng) > 0.05;
            _currentLatLng = newLatLng;
            print('تحديث موقع السائق: $_currentLatLng');
            await driverService.updateDriverLocation(locationData!.latitude!, locationData!.longitude!);
            _updateMarkers();
            if (!_hasPickedUp) {
              await _drawRouteToPickup();
            } else {
              await _drawRouteToDropoff();
            }
            if (significantChange && !_isCameraLocked) {
              await _updateCameraPosition();
            }
            setState(() {});
          } else {
            print('فشل تحديث الموقع: لا توجد إحداثيات');
          }
        } catch (e) {
          print('خطأ تحديث الموقع: $e');
        }
      });
    } catch (e) {
      print('خطأ التهيئة: $e');
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('❌ خطأ أثناء التهيئة: $e')),
      );
    }
  }

  Future<void> _fetchAddresses() async {
    if (_pendingOrder == null) return;
    String pickupAddress = 'غير متوفر';
    String dropoffAddress = 'غير متوفر';
    if (_pendingOrder!['start_location'] != null &&
        _pendingOrder!['start_location'] is Map &&
        _pendingOrder!['start_location']['address'] != null) {
      pickupAddress = _pendingOrder!['start_location']['address'].toString();
    } else if (_pendingOrder!['start_address'] != null) {
      pickupAddress = _pendingOrder!['start_address'].toString();
    } else if (_pendingOrder!['pickup_address'] != null) {
      pickupAddress = _pendingOrder!['pickup_address'].toString();
    } else if (_pendingOrder!['pickup_location'] != null) {
      pickupAddress = _pendingOrder!['pickup_location'].toString();
    } else if (_pendingOrder!['start_lat'] != null && _pendingOrder!['start_lng'] != null) {
      final lat = double.tryParse(_pendingOrder!['start_lat'].toString().trim());
      final lng = double.tryParse(_pendingOrder!['start_lng'].toString().trim());
      if (lat != null && lng != null) {
        pickupAddress = await _getAddressFromCoordinates(lat, lng);
        if (pickupAddress.startsWith('خطأ') || pickupAddress.startsWith('فشل')) {
          pickupAddress = 'إحداثيات: ($lat, $lng)';
        }
      }
    }
    if (_pendingOrder!['end_location'] != null &&
        _pendingOrder!['end_location'] is Map &&
        _pendingOrder!['end_location']['address'] != null) {
      dropoffAddress = _pendingOrder!['end_location']['address'].toString();
    } else if (_pendingOrder!['end_address'] != null) {
      dropoffAddress = _pendingOrder!['end_address'].toString();
    } else if (_pendingOrder!['dropoff_address'] != null) {
      dropoffAddress = _pendingOrder!['dropoff_address'].toString();
    } else if (_pendingOrder!['dropoff_location'] != null) {
      dropoffAddress = _pendingOrder!['dropoff_location'].toString();
    } else if (_pendingOrder!['end_lat'] != null && _pendingOrder!['end_lng'] != null) {
      final lat = double.tryParse(_pendingOrder!['end_lat'].toString().trim());
      final lng = double.tryParse(_pendingOrder!['end_lng'].toString().trim());
      if (lat != null && lng != null) {
        dropoffAddress = await _getAddressFromCoordinates(lat, lng);
        if (dropoffAddress.startsWith('خطأ') || dropoffAddress.startsWith('فشل')) {
          dropoffAddress = 'إحداثيات: ($lat, $lng)';
        }
      }
    }
    pickupAddress = pickupAddress.length > 80 ? '${pickupAddress.substring(0, 77)}...' : pickupAddress;
    dropoffAddress = dropoffAddress.length > 80 ? '${dropoffAddress.substring(0, 77)}...' : dropoffAddress;
    setState(() {
      _pickupAddress = pickupAddress;
      _dropoffAddress = dropoffAddress;
    });
    print('عنوان الاستلام: $pickupAddress');
    print('عنوان التوصيل: $dropoffAddress');
  }

  Future<void> _updateCameraPosition() async {
    if (_mapController != null && _currentLatLng != null && _isMapInitialized && !_isCameraLocked) {
      try {
        await _mapController!.animateCamera(CameraUpdate.newLatLng(_currentLatLng!));
        print('تم تحديث كاميرا الخريطة إلى: $_currentLatLng');
      } catch (e) {
        print('خطأ تحريك الكاميرا: $e');
      }
    } else {
      print('لا يمكن تحديث الكاميرا: mapController=$_mapController, currentLatLng=$_currentLatLng, isMapInitialized=$_isMapInitialized, isCameraLocked=$_isCameraLocked');
    }
  }

  Future<void> _toggleOnlineStatus() async {
    try {
      setState(() => _isOnline = !_isOnline);
      await driverService.updateAvailability(_isOnline);
      await storageService.saveDriverAvailability(_isOnline);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_isOnline ? "✅ أنت الآن متاح للطلبات" : "⛔ تم إيقاف التوفر")),
      );
    } catch (e) {
      print('خطأ تبديل التوفر: $e');
      setState(() => _isOnline = !_isOnline);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء تحديث التوفر')),
      );
    }
  }

  Future<void> _toggleDriverOnlineSwitch() async {
    try {
      setState(() => _isDriverOnline = !_isDriverOnline);
      bool success = await driverService.setOnlineStatus(_isDriverOnline);
      if (success) {
        await storageService.saveDriverOnlineStatus(_isDriverOnline);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_isDriverOnline ? "✅ تم تفعيل وضع الأونلاين" : "⛔ تم إيقاف وضع الأونلاين"),
          ),
        );
      } else {
        setState(() => _isDriverOnline = !_isDriverOnline);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ حصلت مشكلة أثناء التحديث")),
        );
      }
    } catch (e) {
      print('خطأ تبديل الأونلاين: $e');
      setState(() => _isDriverOnline = !_isDriverOnline);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء تحديث الحالة')),
      );
    }
  }

  Future<void> _handleAcceptOrder() async {
    try {
      bool online = await storageService.getDriverOnlineStatus();
      bool available = await storageService.getDriverAvailability();
      if (!online || !available) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ لازم تكون أونلاين ومتاح عشان تستلم طلب")),
        );
        return;
      }
      if (_pendingOrder == null) {
        print('خطأ: _pendingOrder فارغ في _handleAcceptOrder');
        return;
      }
      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.acceptOrder(requestId);
      if (success) {
        setState(() {
          _hasAcceptedOrder = true;
          _isCameraLocked = true;
          print('قبول الطلب: _hasAcceptedOrder=$_hasAcceptedOrder, _pendingOrder=${jsonEncode(_pendingOrder)}');
        });
        await _drawRouteToPickup();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم قبول الطلب")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في قبول الطلب")),
        );
      }
    } catch (e) {
      print('خطأ قبول الطلب: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء قبول الطلب')),
      );
    }
  }

  Future<void> _handleDeclineOrder() async {
    try {
      bool online = await storageService.getDriverOnlineStatus();
      bool available = await storageService.getDriverAvailability();
      if (!online || !available) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ لازم تكون أونلاين ومتاح عشان ترفض طلب")),
        );
        return;
      }
      if (_pendingOrder == null) return;
      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.declineOrder(requestId);
      if (success) {
        setState(() {
          _pendingOrder = null;
          _pickupAddress = null;
          _dropoffAddress = null;
          _polylines = {};
          _markers = {};
          _isCameraLocked = false;
          _lastRouteLatLng = null;
        });
        await _updateCameraPosition();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم رفض الطلب")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في رفض الطلب")),
        );
      }
    } catch (e) {
      print('خطأ رفض الطلب: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء رفض الطلب')),
      );
    }
  }

  Future<void> _handleCancelOrder() async {
    try {
      if (_pendingOrder == null) return;
      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.cancelOrder(requestId);
      if (success) {
        setState(() {
          _hasAcceptedOrder = false;
          _hasPickedUp = false;
          _pendingOrder = null;
          _pickupAddress = null;
          _dropoffAddress = null;
          _polylines = {};
          _markers = {};
          _isCameraLocked = false;
          _lastRouteLatLng = null;
        });
        _startFetchingRides();
        await _updateCameraPosition();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم إلغاء الطلب")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في إلغاء الطلب")),
        );
      }
    } catch (e) {
      print('خطأ إلغاء الطلب: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء إلغاء الطلب')),
      );
    }
  }

  Future<void> _handlePickupConfirmation() async {
    try {
      if (_pendingOrder == null) return;
      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.updateRideStatus(requestId, "in_progress");
      print('تأكيد الاستلام لـ requestId: $requestId، الحالة: in_progress');
      if (success) {
        LocationData? locationData = await _getCurrentLocation();
        if (locationData?.latitude != null && locationData?.longitude != null) {
          _currentLatLng = LatLng(locationData!.latitude!, locationData!.longitude!);
          print('موقع السائق بعد الاستلام: $_currentLatLng');
          await driverService.updateDriverLocation(locationData!.latitude!, locationData!.longitude!);
        } else {
          print('فشل جلب الموقع بعد الاستلام');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('❌ فشل في جلب موقعك الحالي')),
          );
        }

        setState(() {
          _hasPickedUp = true;
          _polylines = {};
          _lastRouteLatLng = null;
          _updateMarkers();
        });

        await _drawRouteToDropoff();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم تأكيد الاستلام")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في تأكيد الاستلام")),
        );
      }
    } catch (e) {
      print('خطأ تأكيد الاستلام: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء تأكيد الاستلام')),
      );
    }
  }

  Future<void> _handleDeliveryConfirmation() async {
    try {
      if (_pendingOrder == null) return;
      String requestId = _pendingOrder!['request_id'];
      bool success = await driverService.updateRideStatus(requestId, "arrived");
      print('تأكيد التوصيل لـ requestId: $requestId، الحالة: arrived');
      if (success) {
        LocationData? locationData = await _getCurrentLocation();
        if (locationData?.latitude != null && locationData?.longitude != null) {
          _currentLatLng = LatLng(locationData!.latitude!, locationData!.longitude!);
          print('موقع السائق بعد التوصيل: $_currentLatLng');
          await driverService.updateDriverLocation(locationData!.latitude!, locationData!.longitude!);
        }

        setState(() {
          _hasAcceptedOrder = false;
          _hasPickedUp = false;
          _pendingOrder = null;
          _pickupAddress = null;
          _dropoffAddress = null;
          _polylines = {};
          _markers = {};
          _isCameraLocked = false;
          _lastRouteLatLng = null;
        });
        _startFetchingRides();
        await _updateCameraPosition();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ تم تأكيد التوصيل")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("❌ فشل في تأكيد التوصيل")),
        );
      }
    } catch (e) {
      print('خطأ تأكيد التوصيل: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ حدث خطأ أثناء تأكيد التوصيل')),
      );
    }
  }

  void _updateMarkers() {
    print('بدء تحديث المؤشرات: currentLatLng=$_currentLatLng, pendingOrder=${_pendingOrder != null}');
    _markers.clear();
    if (_currentLatLng != null) {
      _markers.add(Marker(
        markerId: const MarkerId('driver'),
        position: _currentLatLng!,
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        infoWindow: const InfoWindow(title: 'موقع السائق'),
      ));
      print('تم إضافة مؤشر السائق: $_currentLatLng');
    } else {
      print('تخطي مؤشر السائق: _currentLatLng=null');
    }
    if (_pendingOrder != null) {
      print('إحداثيات الطلب: start_lat=${_pendingOrder!['start_lat']}, start_lng=${_pendingOrder!['start_lng']}, end_lat=${_pendingOrder!['end_lat']}, end_lng=${_pendingOrder!['end_lng']}');
      if (!_hasPickedUp) {
        final pickupLat = double.tryParse(_pendingOrder!['start_lat']?.toString().trim() ?? '');
        final pickupLng = double.tryParse(_pendingOrder!['start_lng']?.toString().trim() ?? '');
        if (pickupLat != null &&
            pickupLng != null &&
            pickupLat >= -90 &&
            pickupLat <= 90 &&
            pickupLng >= -180 &&
            pickupLng <= 180) {
          _markers.add(Marker(
            markerId: const MarkerId('pickup'),
            position: LatLng(pickupLat, pickupLng),
            icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
            infoWindow: const InfoWindow(title: 'موقع العميل'),
          ));
          print('تم إضافة مؤشر الاستلام: LatLng($pickupLat, $pickupLng)');
        } else {
          print('إحداثيات الاستلام غير صالحة: start_lat=${_pendingOrder!['start_lat']}, start_lng=${_pendingOrder!['start_lng']}');
        }
      } else {
        final dropoffLat = double.tryParse(_pendingOrder!['end_lat']?.toString().trim() ?? '');
        final dropoffLng = double.tryParse(_pendingOrder!['end_lng']?.toString().trim() ?? '');
        if (dropoffLat != null &&
            dropoffLng != null &&
            dropoffLat >= -90 &&
            dropoffLat <= 90 &&
            dropoffLng >= -180 &&
            dropoffLng <= 180) {
          _markers.add(Marker(
            markerId: const MarkerId('dropoff'),
            position: LatLng(dropoffLat, dropoffLng),
            icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
            infoWindow: const InfoWindow(title: 'موقع التسليم'),
          ));
          print('تم إضافة مؤشر التوصيل: LatLng($dropoffLat, $dropoffLng)');
        } else {
          print('إحداثيات التوصيل غير صالحة: end_lat=${_pendingOrder!['end_lat']}, end_lng=${_pendingOrder!['end_lng']}');
        }
      }
    } else {
      print('لا يوجد طلب معلق: _pendingOrder=null');
    }
    setState(() {});
    print('عدد المؤشرات بعد التحديث: ${_markers.length}');
  }

  Future<void> _drawRouteToPickup() async {
    print('بدء رسم مسار الاستلام: hasPickedUp=$_hasPickedUp, pendingOrder=${_pendingOrder != null}, currentLatLng=$_currentLatLng');
    if (_hasPickedUp || _pendingOrder == null || _currentLatLng == null) {
      print('تخطي مسار الاستلام: hasPickedUp=$_hasPickedUp, pendingOrder=$_pendingOrder, currentLatLng=$_currentLatLng');
      setState(() => _polylines = {});
      return;
    }
    final pickupLat = double.tryParse(_pendingOrder!['start_lat']?.toString().trim() ?? '');
    final pickupLng = double.tryParse(_pendingOrder!['start_lng']?.toString().trim() ?? '');
    if (pickupLat == null ||
        pickupLng == null ||
        pickupLat < -90 ||
        pickupLat > 90 ||
        pickupLng < -180 ||
        pickupLng > 180) {
      print('إحداثيات الاستلام غير صالحة: start_lat=${_pendingOrder!['start_lat']}, start_lng=${_pendingOrder!['start_lng']}');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ إحداثيات العميل غير صالحة')),
      );
      setState(() => _polylines = {});
      return;
    }
    final pickupLatLng = LatLng(pickupLat, pickupLng);
    final distance = _calculateDistance(_currentLatLng!, pickupLatLng);
    print('المسافة إلى الاستلام: $distance كم');
    if (distance > 100) {
      print('المسافة كبيرة جدًا: $distance كم');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ المسافة كبيرة جدًا، تحقق من إحداثيات العميل')),
      );
      setState(() => _polylines = {});
      return;
    }
    if (_lastRouteLatLng != null &&
        _calculateDistance(_currentLatLng!, _lastRouteLatLng!) < 0.05 &&
        _polylines.isNotEmpty) {
      print('تخطي إعادة رسم المسار: التغيير في الموقع < 50 متر');
      return;
    }
    const apiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q';
    final url =
        'https://maps.googleapis.com/maps/api/directions/json?origin=${_currentLatLng!.latitude},${_currentLatLng!.longitude}&destination=$pickupLat,$pickupLng&mode=driving&language=ar&key=$apiKey';
    print('رابط API المسارات: $url');
    try {
      final response = await http.get(Uri.parse(url));
      print('استجابة API المسارات (الاستلام): statusCode=${response.statusCode}');
      if (response.statusCode != 200) {
        print('خطأ HTTP: ${response.statusCode} - ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ فشل جلب المسار، تحقق من الاتصال')),
        );
        setState(() => _polylines = {});
        return;
      }
      final data = jsonDecode(response.body);
      print('بيانات API: status=${data['status']}, routes=${data['routes']?.length ?? 0}');
      if (data['status'] != 'OK') {
        print('خطأ API: ${data['status']} - ${data['error_message']}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ خطأ جلب المسار: ${data['error_message'] ?? 'غير معروف'}')),
        );
        setState(() => _polylines = {});
        return;
      }
      if (data['routes'] != null && data['routes'].isNotEmpty) {
        final route = data['routes'][0];
        final legs = route['legs'];
        if (legs != null && legs.isNotEmpty) {
          final distanceText = legs[0]['distance']['text'] ?? 'غير معروف';
          final durationText = legs[0]['duration']['text'] ?? 'غير معروف';
          print('مسار الاستلام: مسافة=$distanceText, مدة=$durationText');
          final points = route['overview_polyline']['points'];
          final List<LatLng> polylinePoints = _decodePolyline(points);
          print('نقاط المسار: ${polylinePoints.length}');
          if (polylinePoints.isNotEmpty) {
            setState(() {
              _polylines = {
                Polyline(
                  polylineId: const PolylineId('route'),
                  color: primaryColor,
                  width: 5,
                  points: polylinePoints,
                ),
              };
              _lastRouteLatLng = _currentLatLng;
            });
            print('تم رسم المسار: _polylines=${_polylines.length}');
            if (_isMapInitialized && !_isCameraLocked) {
              await _updateCameraToFitRoute(_currentLatLng!, pickupLatLng);
              setState(() => _isCameraLocked = true);
            }
          } else {
            print('لا توجد نقاط مسار');
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('❌ فشل رسم المسار')),
            );
            setState(() => _polylines = {});
          }
        } else {
          print('لا توجد legs في المسار');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('❌ لا يوجد مسار متاح')),
          );
          setState(() => _polylines = {});
        }
      } else {
        print('لا توجد مسارات');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ لا يوجد مسار متاح')),
        );
        setState(() => _polylines = {});
      }
    } catch (e) {
      print('استثناء API المسارات: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ خطأ جلب المسار، تحقق من الاتصال')),
      );
      setState(() => _polylines = {});
    }
  }

  Future<void> _drawRouteToDropoff() async {
    print('بدء رسم مسار التوصيل: hasPickedUp=$_hasPickedUp, pendingOrder=${_pendingOrder != null}, currentLatLng=$_currentLatLng');
    if (!_hasPickedUp || _pendingOrder == null || _currentLatLng == null) {
      print('تخطي مسار التوصيل: hasPickedUp=$_hasPickedUp, pendingOrder=$_pendingOrder, currentLatLng=$_currentLatLng');
      setState(() => _polylines = {});
      return;
    }
    final dropoffLat = double.tryParse(_pendingOrder!['end_lat']?.toString().trim() ?? '');
    final dropoffLng = double.tryParse(_pendingOrder!['end_lng']?.toString().trim() ?? '');
    if (dropoffLat == null ||
        dropoffLng == null ||
        dropoffLat < -90 ||
        dropoffLat > 90 ||
        dropoffLng < -180 ||
        dropoffLng > 180) {
      print('إحداثيات التوصيل غير صالحة: end_lat=${_pendingOrder!['end_lat']}, end_lng=${_pendingOrder!['end_lng']}');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ إحداثيات التسليم غير صالحة')),
      );
      setState(() => _polylines = {});
      return;
    }
    final dropoffLatLng = LatLng(dropoffLat, dropoffLng);
    final distance = _calculateDistance(_currentLatLng!, dropoffLatLng);
    print('المسافة إلى التوصيل: $distance كم');
    if (distance > 100) {
      print('مسافة التوصيل كبيرة: $distance كم');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ المسافة كبيرة جدًا، تحقق من إحداثيات التسليم')),
      );
      setState(() => _polylines = {});
      return;
    }
    if (_lastRouteLatLng != null &&
        _calculateDistance(_currentLatLng!, _lastRouteLatLng!) < 0.05 &&
        _polylines.isNotEmpty) {
      print('تخطي إعادة رسم المسار: التغيير في الموقع < 50 متر');
      return;
    }
    const apiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q';
    final url =
        'https://maps.googleapis.com/maps/api/directions/json?origin=${_currentLatLng!.latitude},${_currentLatLng!.longitude}&destination=$dropoffLat,$dropoffLng&mode=driving&language=ar&key=$apiKey';
    print('رابط API المسارات: $url');
    try {
      final response = await http.get(Uri.parse(url));
      print('استجابة API المسارات (التوصيل): statusCode=${response.statusCode}');
      if (response.statusCode != 200) {
        print('خطأ HTTP: ${response.statusCode} - ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ فشل جلب المسار، تحقق من الاتصال')),
        );
        setState(() => _polylines = {});
        return;
      }
      final data = jsonDecode(response.body);
      print('بيانات API: status=${data['status']}, routes=${data['routes']?.length ?? 0}');
      if (data['status'] != 'OK') {
        print('خطأ API: ${data['status']} - ${data['error_message']}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ خطأ جلب المسار: ${data['error_message'] ?? 'غير معروف'}')),
        );
        setState(() => _polylines = {});
        return;
      }
      if (data['routes'] != null && data['routes'].isNotEmpty) {
        final route = data['routes'][0];
        final legs = route['legs'];
        if (legs != null && legs.isNotEmpty) {
          final distanceText = legs[0]['distance']['text'] ?? 'غير معروف';
          final durationText = legs[0]['duration']['text'] ?? 'غير معروف';
          print('مسار التوصيل: مسافة=$distanceText, مدة=$durationText');
          final points = route['overview_polyline']['points'];
          final List<LatLng> polylinePoints = _decodePolyline(points);
          print('نقاط المسار: ${polylinePoints.length}');
          if (polylinePoints.isNotEmpty) {
            setState(() {
              _polylines = {
                Polyline(
                  polylineId: const PolylineId('route'),
                  color: primaryColor,
                  width: 5,
                  points: polylinePoints,
                ),
              };
              _lastRouteLatLng = _currentLatLng;
            });
            print('تم رسم المسار: _polylines=${_polylines.length}');
            if (_isMapInitialized && !_isCameraLocked) {
              await _updateCameraToFitRoute(_currentLatLng!, dropoffLatLng);
              setState(() => _isCameraLocked = true);
            }
          } else {
            print('لا توجد نقاط مسار');
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('❌ فشل رسم المسار')),
            );
            setState(() => _polylines = {});
          }
        } else {
          print('لا توجد legs في المسار');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('❌ لا يوجد مسار متاح')),
          );
          setState(() => _polylines = {});
        }
      } else {
        print('لا توجد مسارات');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ لا يوجد مسار متاح')),
        );
        setState(() => _polylines = {});
      }
    } catch (e) {
      print('استثناء API المسارات: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ خطأ جلب المسار، تحقق من الاتصال')),
      );
      setState(() => _polylines = {});
    }
  }

  Future<String> _getAddressFromCoordinates(double lat, double lng) async {
    const apiKey = 'AIzaSyDGpmZp2VIQqerj6ZOm9k-0ECoDovTAS8Q';
    final url =
        'https://maps.googleapis.com/maps/api/geocode/json?latlng=$lat,$lng&language=ar&key=$apiKey';
    print('رابط API الجيوكودينج: $url');
    try {
      final response = await http.get(Uri.parse(url));
      print('استجابة API الجيوكودينج لـ ($lat, $lng): ${response.statusCode}');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('بيانات الجيوكودينج: status=${data['status']}');
        if (data['status'] == 'OK' && data['results'] != null && data['results'].isNotEmpty) {
          final address = data['results'][0]['formatted_address'] ?? 'عنوان غير معروف';
          print('العنوان المجيوكود: $address');
          return address.length > 80 ? '${address.substring(0, 77)}...' : address;
        } else {
          print('فشل الجيوكودينج: ${data['status']} - ${data['error_message']}');
          return 'فشل في جلب العنوان';
        }
      } else {
        print('خطأ HTTP جيوكودينج: ${response.statusCode} - ${response.body}');
        return 'خطأ في جلب العنوان';
      }
    } catch (e) {
      print('استثناء الجيوكودينج: $e');
      return 'خطأ في جلب العنوان';
    }
  }

  double _calculateDistance(LatLng start, LatLng end) {
    const double R = 6371;
    final lat1 = start.latitude * pi / 180;
    final lat2 = end.latitude * pi / 180;
    final deltaLat = (end.latitude - start.latitude) * pi / 180;
    final deltaLng = (end.longitude - start.longitude) * pi / 180;
    final a = sin(deltaLat / 2) * sin(deltaLat / 2) +
        cos(lat1) * cos(lat2) * sin(deltaLng / 2) * sin(deltaLng / 2);
    final c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return R * c;
  }

  Future<void> _updateCameraToFitRoute(LatLng driver, LatLng target) async {
    if (_mapController != null && _isMapInitialized) {
      try {
        final bounds = LatLngBounds(
          southwest: LatLng(
            min(driver.latitude, target.latitude),
            min(driver.longitude, target.longitude),
          ),
          northeast: LatLng(
            max(driver.latitude, target.latitude),
            max(driver.longitude, target.longitude),
          ),
        );
        await _mapController!.animateCamera(
          CameraUpdate.newLatLngBounds(bounds, 100),
        );
        print('تم تهيئة الكاميرا للمسار: driver=$driver, target=$target');
      } catch (e) {
        print('خطأ تهيئة الكاميرا للمسار: $e');
      }
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
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      polyline.add(LatLng(lat / 1E5, lng / 1E5));
    }
    return polyline;
  }

  Widget _buildStatusBar(String? status) {
    final steps = [
      {'status': 'pending', 'label': 'في الانتظار', 'icon': Icons.hourglass_empty},
      {'status': 'accepted', 'label': 'مقبول', 'icon': Icons.check_circle},
      {'status': 'in_progress', 'label': 'في الطريق', 'icon': Icons.directions_bike},
      {'status': 'arrived', 'label': 'تم الوصول', 'icon': Icons.location_on},
      {'status': 'completed', 'label': 'مكتمل', 'icon': Icons.flag},
      {'status': 'cancelled', 'label': 'ملغى', 'icon': Icons.cancel},
    ];
    String effectiveStatus = (status ?? 'pending').toString().length > 20
        ? '${status!.substring(0, 17)}...'
        : status ?? 'pending';
    if (_hasAcceptedOrder && !_hasPickedUp) effectiveStatus = 'accepted';
    else if (_hasAcceptedOrder && _hasPickedUp) effectiveStatus = 'in_progress';
    int currentStep = steps.indexWhere((step) => step['status'] == effectiveStatus);
    if (currentStep == -1) currentStep = 0;

    return LayoutBuilder(
      builder: (context, constraints) {
        debugPrint('StatusBar constraints: ${constraints.maxWidth}');
        return ConstrainedBox(
          constraints: BoxConstraints(maxWidth: constraints.maxWidth),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
            child: Column(
              children: [
                SizedBox(
                  height: 60,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: steps.length,
                    itemBuilder: (context, index) {
                      bool isActive = index <= currentStep;
                      bool isCancelled = effectiveStatus == 'cancelled' && index == steps.length - 1;
                      Color color = isCancelled
                          ? Colors.red
                          : isActive
                              ? primaryColor
                              : Colors.grey[300]!;
                      return Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              CircleAvatar(
                                radius: 14,
                                backgroundColor: color,
                                child: Icon(
                                  steps[index]['icon'] as IconData,
                                  color: accentColor,
                                  size: 16,
                                ),
                              ),
                              const SizedBox(height: 4),
                              SizedBox(
                                width: 60,
                                child: Text(
                                  steps[index]['label'] as String,
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: isActive ? secondaryColor : Colors.grey,
                                    fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                                  ),
                                  textAlign: TextAlign.center,
                                  overflow: TextOverflow.ellipsis,
                                  softWrap: true,
                                  maxLines: 2,
                                ),
                              ),
                            ],
                          ),
                          if (index < steps.length - 1)
                            Container(
                              width: 20,
                              height: 2,
                              color: index < currentStep ? primaryColor : Colors.grey[300],
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                            ),
                        ],
                      );
                    },
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: constraints.maxWidth - 16,
                  child: Text(
                    steps[currentStep]['label'] as String,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: effectiveStatus == 'cancelled' ? Colors.red : primaryColor,
                    ),
                    textAlign: TextAlign.center,
                    overflow: TextOverflow.ellipsis,
                    softWrap: true,
                    maxLines: 1,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildOrderInfoCard() {
    return LayoutBuilder(
      builder: (context, constraints) {
        debugPrint('OrderInfoCard constraints: ${constraints.maxWidth}');
        return ConstrainedBox(
          constraints: BoxConstraints(maxWidth: constraints.maxWidth),
          child: (!_isOnline || !_isDriverOnline)
              ? Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.white, Colors.grey.shade50],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: const [
                      BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4)),
                    ],
                  ),
                  child: SizedBox(
                    width: constraints.maxWidth - 32,
                    child: const Text(
                      'أنت غير متاح أو أوفلاين. فعّل الخيارين لاستقبال الطلبات.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 16, color: Colors.grey),
                      overflow: TextOverflow.ellipsis,
                      softWrap: true,
                      maxLines: 2,
                    ),
                  ),
                )
              : (_pendingOrder == null && !_hasAcceptedOrder)
                  ? Container(
                      margin: const EdgeInsets.all(16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.white, Colors.grey.shade50],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: const [
                          BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4)),
                        ],
                      ),
                      child: SizedBox(
                        width: constraints.maxWidth - 32,
                        child: const Text(
                          'بانتظار طلبات جديدة...',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                          overflow: TextOverflow.ellipsis,
                          softWrap: true,
                          maxLines: 2,
                        ),
                      ),
                    )
                  : Card(
                      elevation: 8,
                      margin: const EdgeInsets.all(16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            _buildStatusBar(_pendingOrder?['status']),
                            const Divider(height: 24),
                            _buildInfoRow(
                              Icons.info,
                              'الحالة: ${(_pendingOrder!['status']?.toString().length ?? 0) > 20 ? '${_pendingOrder!['status'].toString().substring(0, 17)}...' : _pendingOrder!['status']?.toUpperCase() ?? 'غير معروف'}',
                              primaryColor,
                            ),
                            const SizedBox(height: 8),
                            _buildInfoRow(
                              Icons.directions_car,
                              'نوع الرحلة: ${(_pendingOrder!['ride_type']?.toString().length ?? 0) > 20 ? '${_pendingOrder!['ride_type'].toString().substring(0, 17)}...' : _pendingOrder!['ride_type'] ?? 'غير محدد'}',
                              Colors.blue,
                            ),
                            const SizedBox(height: 8),
                            _buildInfoRow(
                              Icons.room_service,
                              'نوع الخدمة: ${(_pendingOrder!['service_type']?.toString().length ?? 0) > 20 ? '${_pendingOrder!['service_type'].toString().substring(0, 17)}...' : _pendingOrder!['service_type'] ?? 'غير محددة'}',
                              Colors.orange,
                            ),
                            const SizedBox(height: 8),
                            _buildInfoRow(
                              Icons.payment,
                              'الدفع: ${(_pendingOrder!['payment_type']?.toString().length ?? 0) > 20 ? '${_pendingOrder!['payment_type'].toString().substring(0, 17)}...' : _pendingOrder!['payment_type'] ?? 'غير معروف'}',
                              Colors.green,
                            ),
                            const SizedBox(height: 8),
                            _buildInfoRow(
                              Icons.location_on,
                              'الاستلام: ${_pickupAddress ?? 'جاري التحميل...'}',
                              Colors.red,
                            ),
                            const SizedBox(height: 8),
                            _buildInfoRow(
                              Icons.flag,
                              'التوصيل: ${_dropoffAddress ?? 'جاري التحميل...'}',
                              Colors.blue,
                            ),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                if (!_hasAcceptedOrder) ...[
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 4),
                                      child: ElevatedButton.icon(
                                        onPressed: _handleAcceptOrder,
                                        icon: const Icon(Icons.check_circle, color: accentColor),
                                        label: const Text('قبول', style: TextStyle(color: accentColor)),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.green,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
                                        ),
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 4),
                                      child: ElevatedButton.icon(
                                        onPressed: _handleDeclineOrder,
                                        icon: const Icon(Icons.cancel, color: accentColor),
                                        label: const Text('رفض', style: TextStyle(color: accentColor)),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.red,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
                                        ),
                                      ),
                                    ),
                                  ),
                                ] else if (!_hasPickedUp) ...[
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 4),
                                      child: ElevatedButton.icon(
                                        onPressed: _handlePickupConfirmation,
                                        icon: const Icon(Icons.check_circle, color: accentColor),
                                        label: const Text('استلام', style: TextStyle(color: accentColor)),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.blue,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
                                        ),
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 4),
                                      child: ElevatedButton.icon(
                                        onPressed: _handleCancelOrder,
                                        icon: const Icon(Icons.cancel, color: accentColor),
                                        label: const Text('إلغاء', style: TextStyle(color: accentColor)),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.red,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
                                        ),
                                      ),
                                    ),
                                  ),
                                ] else ...[
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 4),
                                      child: ElevatedButton.icon(
                                        onPressed: _handleDeliveryConfirmation,
                                        icon: const Icon(Icons.check_circle, color: accentColor),
                                        label: const Text('توصيل', style: TextStyle(color: accentColor)),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.green,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
        );
      },
    );
  }

  Widget _buildInfoRow(IconData icon, String text, Color iconColor) {
    final truncatedText = text.length > 80 ? '${text.substring(0, 77)}...' : text;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: iconColor, size: 20),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            truncatedText,
            style: const TextStyle(fontSize: 14, color: secondaryColor),
            overflow: TextOverflow.ellipsis,
            softWrap: true,
            maxLines: 2,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    print('بناء واجهة السائق: isLoading=$_isLoading, markers=${_markers.length}, polylines=${_polylines.length}');
    if (_showBigMap) {
      return Scaffold(
        body: Stack(
          children: [
            GoogleMap(
              initialCameraPosition: CameraPosition(
                target: _currentLatLng ?? const LatLng(30.0444, 31.2357),
                zoom: 15,
              ),
              markers: _markers,
              polylines: _polylines,
              myLocationEnabled: true,
              myLocationButtonEnabled: true,
              zoomControlsEnabled: true,
              onMapCreated: (controller) {
                print('خريطة تم إنشاؤها: controller=$controller');
                _mapController = controller;
                setState(() {
                  _isMapInitialized = true;
                  print('تم تهيئة الخريطة: _isMapInitialized=true');
                });
                if (!_isCameraLocked && _currentLatLng != null) {
                  _updateCameraPosition();
                  print('محاولة تحديث الكاميرا عند إنشاء الخريطة: _currentLatLng=$_currentLatLng');
                } else {
                  print('تخطي تحديث الكاميرا عند إنشاء الخريطة: isCameraLocked=$_isCameraLocked, currentLatLng=$_currentLatLng');
                }
              },
              onTap: (_) {
                setState(() {
                  _showBigMap = false;
                });
              },
              onCameraMoveStarted: () {
                setState(() => _isCameraLocked = true);
                print('بدء تحريك الكاميرا بواسطة المستخدم: _isCameraLocked=true');
              },
            ),
            Positioned(
              top: 40,
              right: 20,
              child: FloatingActionButton(
                backgroundColor: accentColor,
                onPressed: () {
                  setState(() {
                    _showBigMap = false;
                  });
                },
                child: const Icon(Icons.close, color: secondaryColor),
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryColor,
        title: const Text(
          'لوحة تحكم السائق',
          style: TextStyle(color: accentColor, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: accentColor),
            onPressed: _startFetchingRides,
            tooltip: 'تحديث',
          ),
        ],
      ),
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: CameraPosition(
              target: _currentLatLng ?? const LatLng(30.0444, 31.2357),
              zoom: 15,
            ),
            markers: _markers,
            polylines: _polylines,
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
            zoomControlsEnabled: true,
            onMapCreated: (controller) {
              print('خريطة تم إنشاؤها: controller=$controller');
              _mapController = controller;
              setState(() {
                _isMapInitialized = true;
                print('تم تهيئة الخريطة: _isMapInitialized=true');
              });
              if (!_isCameraLocked && _currentLatLng != null) {
                _updateCameraPosition();
                print('محاولة تحديث الكاميرا عند إنشاء الخريطة: _currentLatLng=$_currentLatLng');
              } else {
                print('تخطي تحديث الكاميرا عند إنشاء الخريطة: isCameraLocked=$_isCameraLocked, currentLatLng=$_currentLatLng');
              }
            },
            onTap: (_) {
              setState(() {
                _showBigMap = true;
              });
            },
            onCameraMoveStarted: () {
              setState(() => _isCameraLocked = true);
              print('بدء تحريك الكاميرا بواسطة المستخدم: _isCameraLocked=true');
            },
          ),
          if (_isLoading)
            Container(
              color: Colors.black54,
              child: const Center(child: CircularProgressIndicator(color: primaryColor)),
            ),
          Positioned(
            top: 10,
            left: 10,
            right: 10,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Card(
                    child: SwitchListTile(
                      title: const Text('متاح', style: TextStyle(color: secondaryColor)),
                      value: _isOnline,
                      onChanged: (_) => _toggleOnlineStatus(),
                      activeColor: primaryColor,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Card(
                    child: SwitchListTile(
                      title: const Text('أونلاين', style: TextStyle(color: secondaryColor)),
                      value: _isDriverOnline,
                      onChanged: (_) => _toggleDriverOnlineSwitch(),
                      activeColor: primaryColor,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _buildOrderInfoCard(),
          ),
        ],
      ),
    );
  }
}