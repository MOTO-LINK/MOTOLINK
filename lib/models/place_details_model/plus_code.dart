class PlusCode {
  String? compoundCode;
  String? globalCode;

  PlusCode({this.compoundCode, this.globalCode});

  factory PlusCode.fromJson(Map<String, dynamic> json) => PlusCode(
    compoundCode: json['compound_code'] as String?,
    globalCode: json['global_code'] as String?,
  );

  Map<String, dynamic> toJson() => {
    'compound_code': compoundCode,
    'global_code': globalCode,
  };
}
