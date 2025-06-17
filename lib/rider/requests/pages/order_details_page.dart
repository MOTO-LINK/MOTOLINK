import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/rider/requests/models/driver_profile_model.dart';
import 'package:moto/rider/requests/models/ride_request_model.dart';
import 'package:moto/rider/requests/models/submit_rating_request_model.dart';
import 'package:moto/rider/requests/services/orders_service.dart';
import 'package:moto/rider/requests/services/ratings_service.dart';

class OrderDetailsPage extends StatefulWidget {
  final RideRequestModel ride;
  const OrderDetailsPage({super.key, required this.ride});

  @override
  State<OrderDetailsPage> createState() => _OrderDetailsPageState();
}

class _OrderDetailsPageState extends State<OrderDetailsPage> {
  DriverProfileModel? _driverProfile;
  bool _isLoadingDriver = true;

  // متغيرات خاصة بالتقييم
  int _userRating = 0;
  final _feedbackController = TextEditingController();
  bool _isSubmittingRating = false;

  @override
  void initState() {
    super.initState();
    _fetchDriverData();
  }

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  Future<void> _fetchDriverData() async {
    if (widget.ride.driverId.isNotEmpty) {
      final profile = await OrdersServiceRequests().fetchDriverProfile(
        widget.ride.driverId,
      );
      if (mounted) {
        setState(() {
          _driverProfile = profile;
          _isLoadingDriver = false;
        });
      }
    } else {
      if (mounted) {
        setState(() {
          _isLoadingDriver = false;
        });
      }
    }
  }

  Future<void> _submitRating() async {
    if (_userRating == 0) {
      // إظهار رسالة خطأ إذا لم يتم تحديد تقييم
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a rating from 1 to 5 stars.'),
        ),
      );
      return;
    }

    setState(() {
      _isSubmittingRating = true;
    });

    final requestModel = SubmitRatingRequestModel(
      rideTransactionId:
          widget.ride.requestId, // افترض أن requestId هو rideTransactionId
      rating: _userRating,
      feedback: _feedbackController.text,
    );

    final response = await RatingsServiceRequests().submitRating(requestModel);

    setState(() {
      _isSubmittingRating = false;
    });

    if (response != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Thank you for your feedback!'),
          backgroundColor: Colors.green,
        ),
      );
      // يمكنك تحديث الواجهة هنا لتعكس أن التقييم تم
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to submit rating. Please try again.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final status = widget.ride.status.toLowerCase();
    final isCanceled = status == 'canceled';
    final isCompleted = status == 'completed';
    final isOngoing = !isCanceled && !isCompleted;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [ColorsApp().secondaryColor, ColorsApp().primaryColor],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
            //stops: const [0.0, 0.5],
          ),
        ),
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              title: Text(
                isCanceled
                    ? 'Canceled Order'
                    : (isCompleted ? 'Completed Order' : 'Ongoing Order'),
              ),
              backgroundColor: Colors.transparent,
              elevation: 0,
              centerTitle: true,
              iconTheme: const IconThemeData(color: Colors.white),
              titleTextStyle: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    _buildTopStatusCard(status),
                    const SizedBox(height: 16),
                    _buildInfoCard(child: _buildLocationSection()),
                    const SizedBox(height: 16),

                    if (widget.ride.notes != null &&
                        widget.ride.notes!.isNotEmpty) ...[
                      _buildInfoCard(
                        title: 'Order Details',
                        child: Text(widget.ride.notes!),
                      ),
                      const SizedBox(height: 16),
                    ],

                    if (isCanceled)
                      _buildInfoCard(
                        title: 'Reason for Cancellation',
                        child: Text(
                          widget.ride.cancelReason ?? 'N/A',
                          style: const TextStyle(color: Colors.red),
                        ),
                      )
                    else
                      _buildPriceDetailsCard(),

                    const SizedBox(height: 16),

                    if (isCompleted) _buildRatingCard(),

                    const SizedBox(height: 16),

                    _buildDriverInfoCard(isOngoing),
                    const SizedBox(height: 24),
                    _buildBottomActionButton(status),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- Helper Widgets for Building UI Sections ---

  Widget _buildTopStatusCard(String status) {
    IconData icon;
    Color color;
    switch (status) {
      case 'completed':
        icon = Icons.check_circle_outline;
        color = Colors.green;
        break;
      case 'canceled':
        icon = Icons.cancel_outlined;
        color = Colors.red;
        break;
      default:
        icon = Icons.more_horiz_rounded;
        color = Colors.blue;
    }

    return _buildInfoCard(
      child: Column(
        children: [
          CircleAvatar(
            radius: 40,
            backgroundColor: color.withOpacity(0.15),
            child: Icon(icon, color: color, size: 32),
          ),
          const SizedBox(height: 16),
          const Text(
            'Order Details',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const Divider(height: 24),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Image.asset("assets/images/DELIVERY.png", width: 45),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.ride.serviceType,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(
                    widget.ride.requestId,
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                  ),
                ],
              ),
              Text(
                DateFormat('d MMM, yyyy').format(widget.ride.requestTime),
                style: TextStyle(color: Colors.grey.shade700),
              ),
              SizedBox(width: 10),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLocationSection() {
    return Column(
      children: [
        ListTile(
          contentPadding: EdgeInsets.zero,
          leading: Icon(Icons.my_location, color: Colors.blue),
          title: const Text(
            'Pickup Location',
            style: TextStyle(fontWeight: FontWeight.w500),
          ),
          subtitle: Text(
            widget.ride.startLocation.address,
            style: TextStyle(color: Colors.grey.shade700),
          ),
        ),
        ListTile(
          contentPadding: EdgeInsets.zero,
          leading: Icon(Icons.location_on, color: ColorsApp().secondaryColor),
          title: const Text(
            'Delivery Location',
            style: TextStyle(fontWeight: FontWeight.w500),
          ),
          subtitle: Text(
            widget.ride.endLocation.address,
            style: TextStyle(color: Colors.grey.shade700),
          ),
        ),
      ],
    );
  }

  Widget _buildPriceDetailsCard() {
    return _buildInfoCard(
      title: 'Price Details',
      child: Column(
        children: [
          // ملاحظة: هذه البيانات غير موجودة في الموديل، لذلك هي قيم ثابتة مؤقتاً
          _buildPriceRow('Items', 'EGP 60.00'),
          _buildPriceRow('Discount', 'EGP 0.00'),
          _buildPriceRow('Delivery', 'EGP 15.00'),
          const Divider(height: 24),
          _buildPriceRow(
            'Total',
            'EGP ${widget.ride.estimatedFee.toStringAsFixed(2)}',
            isTotal: true,
          ),
        ],
      ),
    );
  }

  Widget _buildRatingCard() {
    return _buildInfoCard(
      title: 'Rate your experience',
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              5,
              (index) => IconButton(
                onPressed: () => setState(() => _userRating = index + 1),
                icon: Icon(
                  index < _userRating
                      ? Icons.star_rounded
                      : Icons.star_border_rounded,
                  color: Colors.amber,
                  size: 35,
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _feedbackController,
            decoration: InputDecoration(
              hintText: 'Add a comment...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            maxLines: 2,
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isSubmittingRating ? null : _submitRating,
              child:
                  _isSubmittingRating
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Confirm'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDriverInfoCard(bool isOngoing) {
    if (_isLoadingDriver) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_driverProfile == null) {
      return _buildInfoCard(
        child: const Text('Could not load driver details.'),
      );
    }

    return _buildInfoCard(
      child: Row(
        children: [
          if (isOngoing) ...[
            IconButton(
              onPressed: () {},
              icon: Icon(
                Icons.call_outlined,
                color: ColorsApp().secondaryColor,
              ),
            ),
            IconButton(
              onPressed: () {},
              icon: Icon(
                Icons.message_outlined,
                color: ColorsApp().secondaryColor,
              ),
            ),
          ],
          Expanded(
            child: ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                radius: 25,
                // TODO: استبدل الرابط المؤقت بـ _driverProfile.photoUrl عندما يضيفه الباك اند
                backgroundImage: const NetworkImage(
                  'https://via.placeholder.com/150',
                ),
              ),
              title: Text(
                _driverProfile!.name ?? 'Driver',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Row(
                children: [
                  const Icon(Icons.star, color: Colors.amber, size: 16),
                  const SizedBox(width: 4),
                  Text(_driverProfile!.rating.toStringAsFixed(1)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomActionButton(String status) {
    String text;
    VoidCallback? onPressed;

    switch (status) {
      case 'completed':
      case 'canceled':
        text = 'Reorder';
        onPressed = () {
          /* TODO: Implement Reorder Logic */
        };
        break;
      default: // ongoing
        text = 'Track Order';
        onPressed = () {
          /* TODO: Implement Tracking Logic */
        };
    }
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: ColorsApp().secondaryColor,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          foregroundColor: Colors.white,
        ),
        child: Text(
          text,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _buildPriceRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 15,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  // A generic card widget to reduce code duplication
  Widget _buildInfoCard({String? title, required Widget child}) {
    return Card(
      elevation: 2,
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (title != null) ...[
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const Divider(height: 24),
            ],
            child,
          ],
        ),
      ),
    );
  }
}
