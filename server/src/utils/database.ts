import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const {
	POSTGRES_HOST,
	POSTGRES_HOST_TEST,
	POSTGRES_DB,
	POSTGRES_DB_DEV,
	POSTGRES_DB_TEST,
	POSTGRES_USER,
	POSTGRES_USER_TEST,
	POSTGRES_PORT,
	POSTGRES_PORT_TEST,
	POSTGRES_PASSWORD,
	POSTGRES_PASSWORD_TEST,
	ENV
} = process.env;

let pool: Pool;

switch(ENV) {
	case "dev":
		pool = new Pool({
			host: POSTGRES_HOST,
			database: POSTGRES_DB_DEV,
			user: POSTGRES_USER,
			password: POSTGRES_PASSWORD,
			port: parseInt(POSTGRES_PORT!)
		})
		break;
	case "test":
		pool = new Pool({
			host: POSTGRES_HOST_TEST,
			database: POSTGRES_DB_TEST,
			user: POSTGRES_USER_TEST,
			password: POSTGRES_PASSWORD_TEST,
			port: parseInt(POSTGRES_PORT_TEST!)
		})
		break;
	default:
		pool = new Pool({
			host: POSTGRES_HOST,
			database: POSTGRES_DB,
			user: POSTGRES_USER,
			password: POSTGRES_PASSWORD,
			port: parseInt(POSTGRES_PORT!)
		})
}

export default pool;
