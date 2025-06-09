import 'package:flutter/material.dart';

class Textfieldmodel {
  final Icon prefixIcon;
  final Icon suffixIcon;
  final TextInputType keyboardType;
  final TextEditingController controller;
  final String hintText;
  final bool? isReadOnly;
  final VoidCallback? onTap;

  Textfieldmodel(
    this.suffixIcon,
    this.keyboardType,
    this.controller,
    this.hintText,
    this.isReadOnly,
    this.onTap, {
    required this.prefixIcon,
  });
}
