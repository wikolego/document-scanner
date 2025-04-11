import { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import styles from '../../styles/Home.module.css'

const Home: NextPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

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

  return (
    <div className={styles.container}>
      <Head>
        <title>Document Scanner</title>
        <meta name='description' content='Document Scanner Application' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Choose the file to scan</h1>

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

        <a href='/' className='pageLink'>
          Go to Home Page
        </a>
      </main>
    </div>
  )
}

export default Home
