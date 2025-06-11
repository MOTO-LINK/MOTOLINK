class Open {
  String? date;
  int? day;
  String? time;

  Open({this.date, this.day, this.time});

  factory Open.fromJson(Map<String, dynamic> json) => Open(
    date: json['date'] as String?,
    day: json['day'] as int?,
    time: json['time'] as String?,
  );

  Map<String, dynamic> toJson() => {'date': date, 'day': day, 'time': time};
}
