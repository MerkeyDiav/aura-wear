import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { checkDb, initDb } = await import('./db.js')
const { default: preordersRouter } = await import('./routes/preorders.js')

const PORT = Number(process.env.PORT) || 3000
const isProd = process.env.NODE_ENV === 'production'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    const dbOk = await checkDb()
    return res.json({
      status: 'ok',
      db: dbOk ? 'connected' : 'unreachable',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    // Keep HTTP 200 so K8s liveness does not crash-loop when DB is warming up.
    return res.json({
      status: 'degraded',
      db: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString(),
    })
  }
})

app.use('/api/preorders', preordersRouter)

if (isProd) {
  const distPath = path.resolve(__dirname, '../../dist')
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    return res.sendFile(path.join(distPath, 'index.html'))
  })
}

async function start() {
  try {
    await initDb()
    console.log('Database ready')
  } catch (err) {
    console.error('Database init failed:', err.message)
    console.error('Server will start anyway — fix DATABASE_URL and restart.')
  }

  app.listen(PORT, () => {
    console.log(`Aura Wear API listening on http://localhost:${PORT}`)
  })
}

start()
