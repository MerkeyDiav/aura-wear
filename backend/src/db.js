import mysql from 'mysql2/promise'

const connectionString =
  process.env.DATABASE_URL ||
  'mysql://aura:aura@localhost:3306/aura_wear'

export const pool = mysql.createPool({
  uri: connectionString,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
})

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS preorders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function checkDb() {
  const [rows] = await pool.query('SELECT 1 AS ok')
  return rows[0]?.ok === 1
}
