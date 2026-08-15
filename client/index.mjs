import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { join, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { default as startServer } from './dist/server/server.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const CLIENT_DIR = join(__dirname, 'dist', 'client')

const port = process.env.PORT || 3000

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
}

// Coba serve file statis dari dist/client. Return true kalau berhasil di-handle.
function tryServeStatic(req, res) {
  const urlPath = req.url.split('?')[0]

  // Jangan serve "/" sebagai file statis biar tetap lewat SSR (untuk index.html hasil render TanStack Start)
  if (urlPath === '/') return false

  const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  const filePath = join(CLIENT_DIR, safePath)

  // Pastikan tidak keluar dari folder dist/client (path traversal guard)
  if (!filePath.startsWith(CLIENT_DIR)) return false
  if (!existsSync(filePath)) return false

  const stat = statSync(filePath)
  if (!stat.isFile()) return false

  const ext = extname(filePath)
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  res.statusCode = 200
  res.setHeader('Content-Type', contentType)

  // Asset yang punya hash di nama file (misal assets/index-ABC123.css) aman di-cache lama
  if (safePath.startsWith('/assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  }

  createReadStream(filePath).pipe(res)
  return true
}

const server = createServer(async (req, res) => {
  try {
    if (tryServeStatic(req, res)) return

    const host = req.headers.host || `localhost:${port}`
    const request = new Request(`http://${host}${req.url}`, {
      method: req.method,
      headers: req.headers,
    })
    const response = await startServer.fetch(request)
    res.statusCode = response.status
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })
    const body = await response.arrayBuffer()
    res.end(Buffer.from(body))
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.end('Internal Server Error')
  }
})

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})