
import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';



class Ratiolisttile extends StatelessWidget {
  final String groupValue;
  final String value;
  final String title;
  final ValueChanged<String> onChanged;

  const Ratiolisttile({
    super.key,
    required this.groupValue,
    required this.value,
    required this.title,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10),
      padding: EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: ColorsApp().secondaryColor.withOpacity(0.1),
        
        borderRadius: BorderRadius.circular(10),
      ),
      child: RadioListTile<String>(
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: ColorsApp().textColor,
            fontSize: 16,
          ),
        ),
        value: value,
        groupValue: groupValue,
        controlAffinity: ListTileControlAffinity.trailing,
        activeColor: ColorsApp().secondaryColor,
        tileColor: Colors.transparent,
        onChanged: (String? val) {
          if (val != null) {
            onChanged(val);

            // حطي هنا الصفحات
            // if (val == 'credit card') {
            //   Navigator.push(
            //     context,
            //     MaterialPageRoute(builder: (context) =>), // <<< غيّر اسم الصفحة هنا لو محتاج
            //   );
            // } else {
              
            //   if (Navigator.canPop(context)) {
            //     Future.delayed(Duration(milliseconds: 200), () {
            //       Navigator.pop(context);
            //     });
            //   }
            // }
          }
        },
      ),
    );
  }
}
