import 'package:country_code_picker/country_code_picker.dart';
import 'package:flutter/material.dart';
import '../utils/colors_palette.dart';

class CustomTextField extends StatefulWidget {
  const CustomTextField({
    super.key,
    required this.hint,
    required this.label,
    required this.keyboardType,
    this.passwordIcon = false,
    this.phoneIcon = false,
  });

  final String hint, label;
  final TextInputType? keyboardType;
  final bool passwordIcon;
  final bool phoneIcon;

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  bool isVisabilty = true;
  String selectedCountryCode = "+20"; // كود مصر الافتراضي 🇪🇬

  @override
  Widget build(BuildContext context) {
    return TextField(
      obscureText: widget.passwordIcon ? isVisabilty : false,
      keyboardType: widget.keyboardType,
      decoration: InputDecoration(
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: ColorsPalette.borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: ColorsPalette.borderColor),
        ),
        hintText: widget.hint,
        hintStyle: const TextStyle(
          color: Color(0xff696969),
          fontSize: 13,
          fontWeight: FontWeight.w400,
        ),
        labelText: widget.label,
        suffixIcon: widget.passwordIcon
            ? IconButton(
          onPressed: () {
            setState(() {
              isVisabilty = !isVisabilty;
            });
          },
          icon: isVisabilty
              ? const Icon(Icons.visibility_off_outlined)
              : const Icon(Icons.visibility_outlined),
        )
            : null,
        prefixIcon: widget.phoneIcon
            ? Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: CountryCodePicker(
            onChanged: (code) {
              setState(() {
                selectedCountryCode = code.dialCode!;
              });
            }, dialogBackgroundColor: Colors.black,
            initialSelection: 'EG',
            favorite: const ['EG', 'SA', 'AE'],
            showCountryOnly: false,
            showOnlyCountryWhenClosed: false,
            alignLeft: false,
            padding: EdgeInsets.zero,
          ),
        )
            : null,
      ),
    );
  }
}
