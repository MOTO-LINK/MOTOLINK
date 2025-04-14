import pool from "./database";

async function clearDatabase() {
	await pool.query("DELETE FROM phone_numbers");
	await pool.query("DELETE FROM users");
	await pool.query("DELETE FROM drivers");
	await pool.query("DELETE FROM riders");
}

export default clearDatabase;