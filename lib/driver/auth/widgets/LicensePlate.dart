// LicensePlate.dart
import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/driver/auth/widgets/national_id_input.dart';

class LicensePlateWidget extends StatefulWidget {
  final TextEditingController numbersController; //
  final TextEditingController lettersController; //

  const LicensePlateWidget({
    super.key,
    required this.numbersController, //
    required this.lettersController, //
  });

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
        Expanded(
          flex: 2,
          child: NationalIdInput(
            labtext: 'Plate Number',
            controller: widget.numbersController,
          ),
        ), // استخدام الـ controller الممرر
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
        Expanded(
          flex: 3,
          child: NationalIdInput(
            labtext: 'Numbers',
            controller: widget.numbersController,
          ),
        ), // استخدام الـ controller الممرر
        const SizedBox(width: 8),
        _buildLetterInputBox(widget.lettersController), // تمرير الـ controller
        const SizedBox(width: 8),
        _buildLetterInputBox(
          null,
        ), // للتبسيط، إذا كنت تحتاج فقط لـ controller واحد لكل الحروف، وإلا ستحتاج controllers منفصلة.
        const SizedBox(width: 8),
        _buildLetterInputBox(null), //
      ],
    );
  }

  Widget _buildLetterInputBox(TextEditingController? controller) {
    //
    return SizedBox(
      width: 50,
      child: TextFormField(
        controller: controller, // تعيين الـ controller
        textAlign: TextAlign.center,
        maxLength: 1,

        decoration: InputDecoration(
          hintText: "*",
          counterText: "",
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }
}
