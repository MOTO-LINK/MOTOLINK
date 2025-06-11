class Review {
  String? authorName;
  String? authorUrl;
  String? language;
  String? originalLanguage;
  String? profilePhotoUrl;
  int? rating;
  String? relativeTimeDescription;
  String? text;
  int? time;
  bool? translated;

  Review({
    this.authorName,
    this.authorUrl,
    this.language,
    this.originalLanguage,
    this.profilePhotoUrl,
    this.rating,
    this.relativeTimeDescription,
    this.text,
    this.time,
    this.translated,
  });

  factory Review.fromJson(Map<String, dynamic> json) => Review(
    authorName: json['author_name'] as String?,
    authorUrl: json['author_url'] as String?,
    language: json['language'] as String?,
    originalLanguage: json['original_language'] as String?,
    profilePhotoUrl: json['profile_photo_url'] as String?,
    rating: json['rating'] as int?,
    relativeTimeDescription: json['relative_time_description'] as String?,
    text: json['text'] as String?,
    time: json['time'] as int?,
    translated: json['translated'] as bool?,
  );

  Map<String, dynamic> toJson() => {
    'author_name': authorName,
    'author_url': authorUrl,
    'language': language,
    'original_language': originalLanguage,
    'profile_photo_url': profilePhotoUrl,
    'rating': rating,
    'relative_time_description': relativeTimeDescription,
    'text': text,
    'time': time,
    'translated': translated,
  };
}
