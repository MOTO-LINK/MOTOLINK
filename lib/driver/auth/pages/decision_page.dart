import 'package:flutter/material.dart';
import 'package:moto/driver/auth/pages/personalPage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomePageDefault extends StatelessWidget {
  const HomePageDefault({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("الصفحة الرئيسية"),
        backgroundColor: Colors.black,
        automaticallyImplyLeading: false,
      ),
      body: const Center(
        child: Text(
          "أهلاً بك في الصفحة الرئيسية!",
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}

class DecisionPage extends StatefulWidget {
  const DecisionPage({super.key});

  @override
  State<DecisionPage> createState() => _DecisionPageState();
}

class _DecisionPageState extends State<DecisionPage> {
  @override
  void initState() {
    super.initState();
    _checkProfileStatusAndNavigate();
  }

  Future<void> _checkProfileStatusAndNavigate() async {
    final prefs = await SharedPreferences.getInstance();

    final bool isProfileComplete = prefs.getBool('isProfileComplete') ?? false;

    await Future.delayed(const Duration(milliseconds: 1500));

    if (!mounted) return;

    if (isProfileComplete) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const HomePageDefault()),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const PersonalPage()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 20),
            Text("...loading"),
          ],
        ),
      ),
    );
  }
}
