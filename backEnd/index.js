import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Static files for frontend (Vite dist)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, './dist')))


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})


app.get("/:anything", (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
