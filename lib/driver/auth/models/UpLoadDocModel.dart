class UploadDocResponse {
  final bool success;
  final DocumentData data;
  final String message;

  UploadDocResponse({
    required this.success,
    required this.data,
    required this.message,
  });

  factory UploadDocResponse.fromJson(Map<String, dynamic> json) {
    return UploadDocResponse(
      success: json['success'] ?? false,
      data: DocumentData.fromJson(json['data'] ?? {}),
      message: json['message'] ?? '',
    );
  }
}

class DocumentData {
  final String documentId;
  final String documentType;
  final String documentUrl;
  final String verificationStatus;
  final String? verifiedBy; // قد يكون null
  final DateTime? verificationDate; // قد يكون null
  final DateTime? expiryDate; // قد يكون null
  final DateTime? createdAt;

  DocumentData({
    required this.documentId,
    required this.documentType,
    required this.documentUrl,
    required this.verificationStatus,
    this.verifiedBy,
    this.verificationDate,
    this.expiryDate,
    this.createdAt,
  });

  factory DocumentData.fromJson(Map<String, dynamic> json) {
    // دالة مساعدة لتحويل النص إلى تاريخ بأمان
    DateTime? _parseDate(String? dateString) {
      if (dateString == null) return null;
      return DateTime.tryParse(dateString);
    }

    return DocumentData(
      documentId: json['document_id'] ?? '',
      documentType: json['document_type'] ?? '',
      documentUrl: json['document_url'] ?? '',
      verificationStatus: json['verification_status'] ?? 'pending',
      verifiedBy: json['verified_by'],
      verificationDate: _parseDate(json['verification_date']),
      // لاحظ أن API قد يرسل تاريخ انتهاء الصلاحية بتنسيق مختلف
      expiryDate: _parseDate(json['expiry_date']),
      createdAt: _parseDate(json['created_at']),
    );
  }
}