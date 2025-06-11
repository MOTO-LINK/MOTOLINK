class Close {
  String? date;
  int? day;
  String? time;

  Close({this.date, this.day, this.time});

  factory Close.fromJson(Map<String, dynamic> json) => Close(
    date: json['date'] as String?,
    day: json['day'] as int?,
    time: json['time'] as String?,
  );

  Map<String, dynamic> toJson() => {'date': date, 'day': day, 'time': time};
}
