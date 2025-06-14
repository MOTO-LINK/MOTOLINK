import 'package:flutter/material.dart';

class DriverStatusHeader extends StatelessWidget {
  final bool isOnline;
  final Function(bool) onToggle;

  const DriverStatusHeader({
    super.key,
    required this.isOnline,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.7),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          CircleAvatar(radius: 25, backgroundColor: Colors.white),
          Text(
            isOnline ? "Online" : "Offline",
            style: TextStyle(color: Colors.white, fontSize: 20),
          ),
          Switch(
            value: isOnline,
            onChanged: onToggle,
            activeColor: Colors.green,
          ),
        ],
      ),
    );
  }
}
