import 'period.dart';

class CurrentOpeningHours {
  bool? openNow;
  List<Period>? periods;
  List<String>? weekdayText;

  CurrentOpeningHours({this.openNow, this.periods, this.weekdayText});

  factory CurrentOpeningHours.fromJson(Map<String, dynamic> json) {
    return CurrentOpeningHours(
      openNow: json['open_now'] as bool?,
      periods: (json['periods'] as List<dynamic>?)
          ?.map((e) => Period.fromJson(e as Map<String, dynamic>))
          .toList(),
      weekdayText: (json['weekday_text'] as List<dynamic>?)
          ?.map((e) => e.toString())
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'open_now': openNow,
        'periods': periods?.map((e) => e.toJson()).toList(),
        'weekday_text': weekdayText,
      };
}