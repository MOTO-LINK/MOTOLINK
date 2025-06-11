import 'close.dart';
import 'open.dart';

class Period {
  Close? close;
  Open? open;

  Period({this.close, this.open});

  factory Period.fromJson(Map<String, dynamic> json) => Period(
    close:
        json['close'] == null
            ? null
            : Close.fromJson(json['close'] as Map<String, dynamic>),
    open:
        json['open'] == null
            ? null
            : Open.fromJson(json['open'] as Map<String, dynamic>),
  );

  Map<String, dynamic> toJson() => {
    'close': close?.toJson(),
    'open': open?.toJson(),
  };
}
