import 'package:flutter/material.dart';
import 'package:motolink/features/driver/authentication/presentation/views/sign_in.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: SignIn(),
        debugShowCheckedModeBanner: false, theme: ThemeData.dark());

  }
}
