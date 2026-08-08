import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/', async (req, res) => {
  const email = String(req.body?.email ?? '')
    .trim()
    .toLowerCase()

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO preorders (email)
       VALUES (?)
       ON DUPLICATE KEY UPDATE email = VALUES(email)`,
      [email],
    )

    const inserted = result.affectedRows === 1
    const [rows] = await pool.query(
      'SELECT id, email, created_at FROM preorders WHERE email = ? LIMIT 1',
      [email],
    )
    const row = rows[0]

    return res.status(inserted ? 201 : 200).json({
      id: row.id,
      email: row.email,
      createdAt: row.created_at,
      alreadyRegistered: !inserted,
    })
  } catch (err) {
    console.error('POST /api/preorders failed:', err.message)
    return res.status(500).json({ error: 'Could not save preorder' })
  }
})

router.get('/count', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM preorders',
    )
    return res.json({ count: Number(rows[0].count) })
  } catch (err) {
    console.error('GET /api/preorders/count failed:', err.message)
    return res.status(500).json({ error: 'Could not read preorder count' })
  }
})

export default router
