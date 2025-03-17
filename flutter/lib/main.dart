import 'package:flutter/material.dart';
import 'package:motolink/features/general/profile_page/presentation/views/recent_rides_view.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        debugShowCheckedModeBanner: false, theme: ThemeData.dark(),
      home: RecentRidesView(),
    );

  }
}

 





