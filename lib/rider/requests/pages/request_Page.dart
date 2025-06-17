import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/rider/requests/pages/canceled_requests_tab.dart';
import 'package:moto/rider/requests/pages/completed_requests_tab.dart';
import 'package:moto/rider/requests/pages/ongoing_requests_tab.dart';

class RequestsPage extends StatefulWidget {
  const RequestsPage({super.key});

  @override
  State<RequestsPage> createState() => _RequestsPageState();
}

class _RequestsPageState extends State<RequestsPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<String> tabIcons = [
    "assets/images/DELIVERY.png", // يمكنك تغيير الأيقونات حسب الحاجة
    "assets/images/DELIVERY.png",
    "assets/images/DELIVERY.png",
  ];

  final List<String> tabTitles = ['Ongoing', 'Completed', 'Canceled'];

  @override
  void initState() {
    super.initState();
    // نهيئة الـ TabController
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(240),
        child: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          flexibleSpace: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFB5022F), Colors.black],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  const SizedBox(height: 35),
                  const Text(
                    "Requests",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 25),
                  // بناء التابات المخصصة
                  _buildCustomTabBar(),
                ],
              ),
            ),
          ),
        ),
      ),
      // TabBarView لعرض محتوى كل تاب
      body: TabBarView(
        controller: _tabController,
        children: const [
          OngoingRequestsTab(),
          CompletedRequestsTab(),
          CanceledRequestsTab(),
        ],
      ),
    );
  }

  // ويدجت لبناء التابات العلوية
  Widget _buildCustomTabBar() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: List.generate(3, (index) {
        // نستخدم AnimatedBuilder للاستماع لتغيرات الـ TabController
        return AnimatedBuilder(
          animation: _tabController.animation!,
          builder: (context, child) {
            final bool isSelected = (_tabController.index == index);
            return GestureDetector(
              onTap: () {
                _tabController.animateTo(index);
              },
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color:
                          isSelected
                              ? ColorsApp().secondaryColor
                              : Colors.grey[200],
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Image.asset(tabIcons[index], width: 60, height: 60),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    tabTitles[index],
                    style: TextStyle(
                      color:
                          isSelected
                              ? ColorsApp().secondaryColor
                              : Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            );
          },
        );
      }),
    );
  }
}
