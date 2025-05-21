const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const app = express()
// const port = process.env.PORT || 3010
const port = 5000

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir)
}

// Middleware
app.use(cors())
// Increase JSON payload size limit to 50MB
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Example route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' })
})

// Example POST route
app.post('/api/data', (req, res) => {
  const data = req.body

  // Save the image to temp folder
  if (data.imageUrl) {
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
    const base64Data = data.imageUrl.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Generate a unique filename using timestamp
    const filename = `image_${Date.now()}.jpg`
    const filepath = path.join(tempDir, filename)

    fs.writeFile(filepath, buffer, err => {
      if (err) {
        console.error('Error saving image:', err)
        return res.status(500).json({ error: 'Failed to save image' })
      }
      console.log('Image saved successfully:', filename)

      // Run Python script
      const pythonProcess = spawn('python', ['scripts/modify_image.py', filepath])

      pythonProcess.stdout.on('data', data => {
        console.log('Python script output:', data.toString())
      })

      pythonProcess.stderr.on('data', data => {
        console.error('Python script error:', data.toString())
      })

      pythonProcess.on('close', code => {
        console.log(`Python script exited with code ${code}`)
        res.json({
          message: 'Data received, image saved, and Python script executed successfully',
          receivedData: data,
          savedImage: filename
        })
      })
    })
  } else {
    res.json({
      message: 'Data received successfully',
      receivedData: data
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
