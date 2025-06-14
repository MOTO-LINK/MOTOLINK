import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
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

  bool isOnline = false;
  bool isDriverOnline = false;
  bool isLoading = false;
  Map<String, dynamic>? pendingOrder;
  String userName = '';

  GoogleMapController? mapController;
  LatLng? currentLatLng;
  Timer? locationTimer;

  @override
  void initState() {
    super.initState();
    initialize();
  }

  @override
  void dispose() {
    locationTimer?.cancel();
    super.dispose();
  }

  Future<void> initialize() async {
    setState(() => isLoading = true);

    final name = await storageService.getUserName();
    final available = await driverService.fetchAvailableRides();

    LocationData locationData = await location.getLocation();
    currentLatLng = LatLng(locationData.latitude!, locationData.longitude!);

    setState(() {
      userName = name ?? 'Driver';
      pendingOrder = available.isNotEmpty ? available.first : null;
      isLoading = false;
    });

    locationTimer = Timer.periodic(const Duration(seconds: 1), (_) async {
      LocationData locationData = await location.getLocation();
      currentLatLng = LatLng(locationData.latitude!, locationData.longitude!);
      await driverService.updateDriverLocation(locationData.latitude!, locationData.longitude!);
      if (mapController != null) {
        mapController!.animateCamera(CameraUpdate.newLatLng(currentLatLng!));
      }
      setState(() {});
    });
  }

  Future<void> toggleOnlineStatus() async {
    setState(() => isOnline = !isOnline);
    await driverService.updateAvailability(isOnline);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(isOnline ? "✅ أنت الآن متاح للطلبات" : "⛔ تم إيقاف التوفر")),
    );
  }

  Future<void> toggleDriverOnlineSwitch() async {
    setState(() => isDriverOnline = !isDriverOnline);
    bool success = await driverService.setOnlineStatus(isDriverOnline);
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(isDriverOnline ? "✅ تم تفعيل وضع الأونلاين" : "⛔ تم إيقاف وضع الأونلاين"),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("❌ حصلت مشكلة أثناء التحديث")),
      );
    }
  }

  Future<void> handleAcceptOrder() async {
    if (pendingOrder == null) return;

    String requestId = pendingOrder!['request_id'];
    bool success = await driverService.acceptOrder(requestId);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("✅ تم قبول الطلب")),
      );
      initialize();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("❌ فشل في قبول الطلب")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9F9),
      body: SafeArea(
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: [
                  _buildHeader(),
                  const SizedBox(height: 20),
                  _buildAvailabilityCard(),
                  const SizedBox(height: 20),
                  _buildOnlineModeCard(),
                  const SizedBox(height: 20),
                  _buildMiniMap(),
                  const SizedBox(height: 20),
                  Expanded(child: _buildPendingOrderCard()),
                ],
              ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 30,
            backgroundImage: AssetImage('assets/images/driver_avatar.png'),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("مرحبا 👋", style: TextStyle(fontSize: 16, color: Colors.grey)),
              Text(userName, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            ],
          ),
          const Spacer(),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.notifications_none, size: 28),
          ),
        ],
      ),
    );
  }

  Widget _buildAvailabilityCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 5, offset: Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.directions_bike, size: 40, color: Colors.green),
          const SizedBox(width: 20),
          Expanded(
            child: Text(
              isOnline ? "أنت متاح الآن" : "أنت غير متاح",
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          Switch(
            value: isOnline,
            onChanged: (_) => toggleOnlineStatus(),
          ),
        ],
      ),
    );
  }

  Widget _buildOnlineModeCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 5, offset: Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.wifi, size: 40, color: Colors.blue),
          const SizedBox(width: 20),
          Expanded(
            child: Text(
              isDriverOnline ? "أنت أونلاين الآن" : "أنت أوفلاين",
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          Switch(
            value: isDriverOnline,
            onChanged: (_) => toggleDriverOnlineSwitch(),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniMap() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      height: 200,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 5, offset: Offset(0, 3)),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: GoogleMap(
          initialCameraPosition: CameraPosition(
            target: currentLatLng ?? const LatLng(30.0444, 31.2357),
            zoom: 16,
          ),
          onMapCreated: (controller) => mapController = controller,
          myLocationEnabled: true,
          myLocationButtonEnabled: true,
          zoomControlsEnabled: false,
        ),
      ),
    );
  }

  Widget _buildPendingOrderCard() {
    if (pendingOrder == null) {
      return Center(
        child: Text(
          "لا يوجد طلبات حالياً",
          style: TextStyle(fontSize: 18, color: Colors.grey[600]),
        ),
      );
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 5, offset: Offset(0, 3)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("طلب جديد", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Text("نوع الرحلة: ${pendingOrder!['ride_type']}"),
          Text("نوع الخدمة: ${pendingOrder!['service_type']}"),
          Text("الدفع: ${pendingOrder!['payment_type']}"),
          const Spacer(),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              minimumSize: const Size.fromHeight(50),
            ),
            onPressed: handleAcceptOrder,
            child: const Text("قبول الطلب", style: TextStyle(fontSize: 18)),
          ),
        ],
      ),
    );
  }
}