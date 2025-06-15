import 'package:flutter/material.dart';

// الكلاس الذي يحتوي على شريط العدادات
class OrdersCounterBar extends StatefulWidget {
  // دالة Callback لإعلام الصفحة الرئيسية عند تغيير الاختيار
  final Function(int) onTabSelected;

  const OrdersCounterBar({
    super.key, 
    required this.onTabSelected,
  });

  @override
  State<OrdersCounterBar> createState() => _OrdersCounterBarState();
}

class _OrdersCounterBarState extends State<OrdersCounterBar> {
  // متغير الحالة موجود الآن داخل هذا الكلاس فقط
  int _selectedIndex = 2;

  final Color activeColor = Colors.white;
  final Color inactiveColor = Colors.white.withOpacity(0.7);

  @override
  Widget build(BuildContext context) {
    // الجزء الذي طلبته بالضبط: الحاوية المتدرجة مع الصف
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          colors: [
            Colors.cyan.shade400,
            Colors.blue.shade500,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.3),
            spreadRadius: 2,
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildNavItem(
            icon: Icons.cancel_outlined,
            label: 'Car',
            index: 0,
          ),
          _buildDivider(),
          _buildNavItem(
            icon: Icons.checklist_rtl_outlined,
            label: 'TokTok',
            index: 1,
          ),
          _buildDivider(),
          _buildNavItem(
            icon: Icons.bubble_chart_outlined,
            label: 'MotoCycle',
            index: 2,
          ),
        ],
      ),
    );
  }

  // دالة لبناء الفاصل الرأسي
  Widget _buildDivider() {
    return Container(
      height: 40,
      width: 1,
      color: Colors.white.withOpacity(0.5),
    );
  }

  // دالة بناء العنصر القابل للضغط
  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required int index,
  }) {
    final bool isSelected = _selectedIndex == index;

    return InkWell(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });
        // استدعاء الدالة لإخبار الصفحة المستدعية بالتغيير
        widget.onTabSelected(index);
      },
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 28,
              color: isSelected ? activeColor : inactiveColor,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isSelected ? activeColor : inactiveColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}