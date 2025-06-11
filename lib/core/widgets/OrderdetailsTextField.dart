import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';

class OrderDetailsTextField extends StatelessWidget {
  const OrderDetailsTextField({super.key, required this.descriptionController});

  final TextEditingController descriptionController;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 120,
      child: TextField(
        textAlign: TextAlign.center,
        minLines: 3,
        textAlignVertical: TextAlignVertical.center,
        controller: descriptionController,
        maxLines: 4,
        decoration: InputDecoration(
          filled: true,
          fillColor: ColorsApp().primaryColor.withOpacity(0.1),
          hintText: "Tell us about the contents of the order ",
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide.none,
          ),
          contentPadding: EdgeInsets.all(40),
        ),
      ),
    );
  }
}
