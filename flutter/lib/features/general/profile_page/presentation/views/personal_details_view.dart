import 'package:flutter/material.dart';
import 'package:motolink/core/widgets/custom_app_bar.dart';
import '../../../../../core/widgets/custom_button.dart';
import '../../../../../core/widgets/custom_text_field.dart';
import '../../../../../core/widgets/select_gender.dart';

class PersonalDetailsView extends StatelessWidget {
  const PersonalDetailsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(txt: "Personal Details"),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 23.0,vertical: 55),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CustomTextField(hint: "Enter your First Name", label: "First Name",keyboardType: TextInputType.name,),
            SizedBox(height: 35,),
            CustomTextField(hint: "Enter your Last Name", label: "Last Name" , keyboardType: TextInputType.name,),
            SizedBox(height: 35,),
            CustomTextField(hint: "24-6-1990", label: "Date of birthday",keyboardType: TextInputType.datetime,),
            SizedBox(height: 24,),
            Text("Gender",style: TextStyle(fontSize: 22,fontWeight: FontWeight.w500),),
            SizedBox(height: 16,),
            SelectGender(),
            SizedBox(height: 80,),
            CustomButton(txt: "Delete account")
          ],
        ),
      )
    );
  }
}
