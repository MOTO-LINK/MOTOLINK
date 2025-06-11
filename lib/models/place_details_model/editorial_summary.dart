class EditorialSummary {
  String? language;
  String? overview;

  EditorialSummary({this.language, this.overview});

  factory EditorialSummary.fromJson(Map<String, dynamic> json) {
    return EditorialSummary(
      language: json['language'] as String?,
      overview: json['overview'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {'language': language, 'overview': overview};
}
