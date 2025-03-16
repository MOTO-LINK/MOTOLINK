import 'package:flutter/material.dart';
import 'package:motolink/core/widgets/custom_button.dart';
import 'package:motolink/core/widgets/custom_name_field.dart';
import 'package:motolink/core/widgets/select_gender.dart';

class PersonalDetailsViewBody extends StatelessWidget {
  const PersonalDetailsViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 23.0,vertical: 55),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomNameField(hint: "Enter your First Name", label: "First Name",keyboardType: TextInputType.name,),
          SizedBox(height: 35,),
          CustomNameField(hint: "Enter your Last Name", label: "Last Name" , keyboardType: TextInputType.name,),
          SizedBox(height: 35,),
          CustomNameField(hint: "24-6-1990", label: "Date of birthday",keyboardType: TextInputType.datetime,),
          SizedBox(height: 24,),
          Text("Gender",style: TextStyle(fontSize: 22,fontWeight: FontWeight.w500),),
          SizedBox(height: 16,),
          SelectGender(),
          SizedBox(height: 80,),
          CustomButton(txt: "Delete account")
        ],
      ),
    );
  }
}
