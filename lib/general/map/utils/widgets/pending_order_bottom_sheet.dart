import 'package:flutter/material.dart';

class PendingOrderBottomSheet extends StatelessWidget {
  final VoidCallback onAccept;

  const PendingOrderBottomSheet({
    super.key,
    required this.onAccept,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text("طلب جديد", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          SizedBox(height: 10),
          Text("Pickup: العنوان الاول"),
          Text("Dropoff: العنوان التاني"),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: onAccept,
            child: Text("قبول"),
          ),
        ],
      ),
    );
  }
}
