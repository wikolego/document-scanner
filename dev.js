const { spawn } = require('child_process')
const { createServer } = require('http')
const next = require('next')
const { parse } = require('url')
const electron = require('electron')
const path = require('path')

// Initialize Next.js
const dev = true
const hostname = 'localhost'
const port = 3001
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('Starting Next.js...')

// Prepare Next.js
app.prepare().then(() => {
  console.log('Next.js is ready!')

  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })

  // Start HTTP server
  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)

    // Start Electron after server is ready
    console.log('Starting Electron...')
    const electronProcess = spawn(electron, [path.join(__dirname, 'main.js')], {
      stdio: 'inherit'
    })

    electronProcess.on('close', () => {
      console.log('Electron closed. Shutting down server...')
      server.close()
      process.exit()
    })
  })
})
