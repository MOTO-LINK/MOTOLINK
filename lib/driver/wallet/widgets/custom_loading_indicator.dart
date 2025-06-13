import 'package:flutter/material.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

class CustomLoadingIndicator extends StatelessWidget {
  const CustomLoadingIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(child: LoadingAnimationWidget.fourRotatingDots(
      color: const Color(0xFFB5022F),
      size: 80,
    ),);
  }
}
