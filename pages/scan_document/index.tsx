import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import styles from '../../styles/Home.module.css'

const Home: NextPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!file) return

      try {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64String = reader.result as string

          // Send image to server
          const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              imageData: base64String
            })
          })

          if (!response.ok) {
            throw new Error('Failed to upload image')
          }

          const data = await response.json()

          // After successful upload, redirect to edit page
          router.push({
            pathname: '/edit_document',
            query: { fileName: data.savedImage }
          })
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error processing file:', error)
        // You might want to show an error message to the user here
      }
    },
    [file, router]
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Document Scanner</title>
        <meta name='description' content='Document Scanner Application' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Choose the file to scan</h1>

        <form onSubmit={handleSubmit}>
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p className={styles.description}>
              {file ? `Selected file: ${file.name}` : 'Drag and drop your document here'}
            </p>
          </div>

          <div className={styles.fileInputContainer}>
            <label htmlFor='fileInput' className={styles.fileInputLabel}>
              Or click to select a file
            </label>
            <input
              id='fileInput'
              type='file'
              onChange={handleFileSelect}
              className={styles.fileInput}
              accept='.pdf,.jpg,.jpeg,.png'
            />
          </div>

          <div className={styles.buttonContainer}>
            <button type='submit' className={styles.submitButton} disabled={!file}>
              Process Document
            </button>
          </div>
        </form>

        <a href='/' className='pageLink'>
          Go to Home Page
        </a>
      </main>
    </div>
  )
}

export default Home
