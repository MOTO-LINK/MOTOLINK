import 'package:fluttertoast/fluttertoast.dart';
import 'package:moto/core/utils/colors_palette.dart';

void showToast(String message) {
  Fluttertoast.showToast(
    msg: message,
    toastLength: Toast.LENGTH_SHORT,
    gravity: ToastGravity.BOTTOM,
    textColor: ColorsApp.main,
    fontSize: 16,
  );
}
