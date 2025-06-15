import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/driver/auth/widgets/national_id_input.dart';

class LicensePlateWidget extends StatefulWidget {
  const LicensePlateWidget({super.key});

  @override
  State<LicensePlateWidget> createState() => _LicensePlateWidgetState();
}

class _LicensePlateWidgetState extends State<LicensePlateWidget> {
  bool _isLettersAndNumbers = true;
  String? _selectedGovernorate;
  final List<String> _governorates = [
    'Cairo',
    'Giza',
    'Alexandria',
    'Dakahlia',
    'Red Sea',
    'Beheira',
    'Faiyum',
    'Gharbia',
    'Ismailia',
    'Menofia',
    'Minya',
    'Qaliubiya',
    'New Valley',
    'Suez',
    'Aswan',
    'Assiut',
    'Beni Suef',
    'Port Said',
    'Damietta',
    'Sharqia',
    'Sohag',
    'Kafr El Sheikh',
    'Matrouh',
    'Luxor',
    'Qena',
    'North Sinai',
    'South Sinai',
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Vehicle License Plate",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildToggleButton(
                'Letters & Numbers',
                _isLettersAndNumbers,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildToggleButton('Numbers Only', !_isLettersAndNumbers),
            ),
          ],
        ),
        const SizedBox(height: 20),
        if (_isLettersAndNumbers)
          _buildLettersAndNumbersInputs()
        else
          _buildNumbersOnlyInputs(),
      ],
    );
  }

  Widget _buildToggleButton(String text, bool isSelected) {
    return OutlinedButton(
      onPressed:
          () => setState(
            () => _isLettersAndNumbers = text == 'Letters & Numbers',
          ),
      style: OutlinedButton.styleFrom(
        foregroundColor: isSelected ? Colors.white : Colors.black,
        backgroundColor:
            isSelected ? ColorsApp().secondaryColor : Colors.grey[200],
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        side: BorderSide(
          color: isSelected ? ColorsApp().primaryColor : Colors.grey,
        ),
      ),
      child: Text(text),
    );
  }

  Widget _buildNumbersOnlyInputs() {
    return Row(
      children: [
        Expanded(flex: 2, child: NationalIdInput(labtext: 'Plate Number')),
        const SizedBox(width: 10),
        Expanded(
          flex: 3,
          child: DropdownButtonFormField<String>(
            decoration: InputDecoration(
              labelText: 'Governorate',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            value: _selectedGovernorate,
            items:
                _governorates
                    .map(
                      (String value) => DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      ),
                    )
                    .toList(),
            onChanged:
                (newValue) => setState(() => _selectedGovernorate = newValue),
          ),
        ),
      ],
    );
  }

  Widget _buildLettersAndNumbersInputs() {
    return Row(
      children: [
        Expanded(flex: 3, child: NationalIdInput(labtext: 'Numbers')),
        const SizedBox(width: 8),
        _buildLetterInputBox(),
        const SizedBox(width: 8),
        _buildLetterInputBox(),
        const SizedBox(width: 8),
        _buildLetterInputBox(),
      ],
    );
  }

  Widget _buildLetterInputBox() {
    return SizedBox(
      width: 50,
      child: TextFormField(
        textAlign: TextAlign.center,
        maxLength: 1,
        decoration: InputDecoration(
          counterText: "",
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }
}
