import 'package:flutter/material.dart';

class SplashView extends StatefulWidget {
  const SplashView({super.key});

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView>
    with SingleTickerProviderStateMixin {
  late AnimationController animationController;
  late Animation<Offset> slidingAnimation;

  @override
  void initState() {
    super.initState();
    initSlidingAnimation();
  }

  @override
  void dispose() {
    animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: SlideTransition(
          position: slidingAnimation,
          child: Image.asset(
            "assets/images/logo.jpeg",
            scale: 3,
          ),
        ),
      ),
    );
  }

  void initSlidingAnimation() {
    animationController =
        AnimationController(duration: const Duration(seconds: 2), vsync: this);

    slidingAnimation = Tween<Offset>(
      begin: const Offset(0, 2),
      end: const Offset(0, 0),
    ).animate(CurvedAnimation(
      parent: animationController,
      curve: Curves.easeInOutBack,
    ));

    animationController.forward().then((_) => navigateToHome());
  }

  void navigateToHome() {
    Future.delayed(const Duration(seconds: 1), () {
      Navigator.pushReplacementNamed(
        context,
        "boarding_one",
      );
    });
  }
}
