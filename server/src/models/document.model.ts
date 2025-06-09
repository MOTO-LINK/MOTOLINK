import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";
import { DocumentType, VerificationStatus } from "../utils/types";

export interface Document {
	document_id: string;
	user_id: string;
	document_type: DocumentType;
	document_url: string;
	verification_status: VerificationStatus;
	verified_by?: string;
	verification_date?: Date;
	expiry_date?: Date;
	created_at?: Date;
	updated_at?: Date;
}

export interface CreateDocumentInput {
	user_id: string;
	document_type: DocumentType;
	document_url: string;
	expiry_date?: Date;
}

export interface PendingVerificationDocument extends Document {
	user_name: string;
	user_email: string;
	phone_number: string;
}

export class DocumentModel {
	async create(documentData: CreateDocumentInput): Promise<Document> {
		const result = await pool.query(
			`INSERT INTO documents (
        document_id, user_id, document_type, document_url, 
        verification_status, expiry_date
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
			[
				uuidv4(),
				documentData.user_id,
				documentData.document_type,
				documentData.document_url,
				VerificationStatus.PENDING,
				documentData.expiry_date || null
			]
		);
		return result.rows[0];
	}

	async findByUserId(userId: string): Promise<Document[]> {
		const result = await pool.query(
			"SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC",
			[userId]
		);
		return result.rows;
	}

	async findByUserAndType(userId: string, documentType: DocumentType): Promise<Document | null> {
		const result = await pool.query(
			"SELECT * FROM documents WHERE user_id = $1 AND document_type = $2",
			[userId, documentType]
		);
		return result.rows[0] || null;
	}

	async updateVerificationStatus(
		documentId: string,
		status: VerificationStatus,
		verifiedBy: string
	): Promise<Document> {
		const result = await pool.query(
			`UPDATE documents 
       SET verification_status = $1, 
           verified_by = $2, 
           verification_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE document_id = $3
       RETURNING *`,
			[status, verifiedBy, documentId]
		);
		return result.rows[0];
	}

	async areAllDocumentsVerified(userId: string): Promise<boolean> {
		const result = await pool.query(
			`SELECT COUNT(*) as total,
              COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified
       FROM documents 
       WHERE user_id = $1`,
			[userId]
		);

		const { total, verified } = result.rows[0];
		return total > 0 && total === verified;
	}

	async getExpiredDocuments(userId: string): Promise<Document[]> {
		const result = await pool.query(
			`SELECT * FROM documents 
       WHERE user_id = $1 
         AND expiry_date IS NOT NULL 
         AND expiry_date < CURRENT_DATE`,
			[userId]
		);
		return result.rows;
	}

	async deleteDocument(documentId: string, userId: string): Promise<boolean> {
		const result = await pool.query(
			"DELETE FROM documents WHERE document_id = $1 AND user_id = $2",
			[documentId, userId]
		);
		return result.rowCount! > 0;
	}

	getRequiredDocumentTypes(userType: string): DocumentType[] {
		if (userType === "driver") {
			return [
				DocumentType.NATIONAL_ID_FRONT,
				DocumentType.NATIONAL_ID_BACK,
				DocumentType.LICENSE_FRONT,
				DocumentType.VEHICLE_REGISTRATION_FRONT,
				DocumentType.VEHICLE_REGISTRATION_BACK
			];
		}
		return [];
	}

	async getDocumentsByStatus(status: VerificationStatus, limit: string | number, offset: string | number): Promise<PendingVerificationDocument[]> {
		const result = await pool.query(
			`
        SELECT d.*, u.name as user_name, u.email as user_email, p.phone_number
        FROM documents d
        JOIN users u ON d.user_id = u.user_id
        LEFT JOIN phone_numbers p ON u.user_id = p.user_id
        WHERE d.verification_status = $1
        ORDER BY d.created_at ASC
        LIMIT $2 OFFSET $3
      `,
			[status, limit, offset]
		);
		return result.rows;
	}

	async getDocumentsCountByStatus(status: VerificationStatus): Promise<string> {
		const result = await pool.query(
			"SELECT COUNT(*) as total FROM documents WHERE verification_status = $1",
			[status]
		);
		return result.rows[0].total;
	}
}

export default new DocumentModel();
