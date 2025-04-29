import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class InputCode extends StatelessWidget {
  const InputCode({required this.data, super.key});
  final String data;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(2),
      child: TextFormField(
        textAlign: TextAlign.center,
        validator: (value) {
          if (value!.isEmpty) {
            return "فارغ";
          }
          return null;
        },
        onChanged: (value) {
          if (data == "start") {
            if (value.length == 1) {
              FocusScope.of(context).nextFocus();
            }
          }
          if (data == "center") {
            if (value.length == 1) {
              FocusScope.of(context).nextFocus();
            }
            if (value.isEmpty) {
              FocusScope.of(context).previousFocus();
            }
          }
          if (data == "end") {
            if (value.isEmpty) {
              FocusScope.of(context).previousFocus();
            }
          }
        },
        inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'\d'))],
        maxLength: 1,
        keyboardType: TextInputType.number,
        decoration: InputDecoration(
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: Color(0xffD7B634)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: Color(0xffD7B634)),
          ),
          hintText: "*",
          hintStyle: TextStyle(color: Color(0xffD7B634), fontSize: 20),
        ),
      ),
    );
  }
}
