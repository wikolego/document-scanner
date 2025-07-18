import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../../styles/Home.module.css'

const EditDocument: NextPage = () => {
  const router = useRouter()
  // const { imageUrl, fileName } = router.query
  const { fileName } = router.query
  const [modifiedImageName, setModifiedImageName] = useState(fileName)
  const [modifiedImageUrl, setModifiedImageUrl] = useState<string | undefined>(
    `http://localhost:5000/temp/${fileName}`
  )

  async function adjustImage() {
    const response = await fetch('http://localhost:5000/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName })
    })

    if (!response.ok) {
      throw new Error('Failed to process image')
    }

    const data = await response.json()

    // Set the modified image URL
    if (data.savedImage) {
      setModifiedImageName(data.savedImage)
      setModifiedImageUrl(`http://localhost:5000/temp/${data.savedImage}`)
    }
  }

  async function saveImage() {
    if (!modifiedImageUrl) return

    try {
      // Fetch the image
      const response = await fetch(modifiedImageUrl)
      const blob = await response.blob()

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      console.log(url)

      const link = document.createElement('a')
      link.href = url
      link.download = (modifiedImageName as string) || 'document.png'

      // Trigger the download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error saving image:', error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Edit Document</title>
        <meta name='description' content='Edit your scanned document' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Edit Document</h1>

        <div className={styles.imageContainer}>
          <img src={modifiedImageUrl} alt='Modified document' className={styles.documentImage} />
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={adjustImage}>
            Adjust
          </button>
          <button className={styles.button}>Crop</button>
          <button className={styles.button} onClick={saveImage}>
            Save
          </button>
        </div>

        <div className={styles.linkContainer}>
          <a href='/scan_document' className='pageLink'>
            Scan a Document
          </a>
          <a href='/' className='pageLink'>
            Go to Home Page
          </a>
        </div>
      </main>
    </div>
  )
}

export default EditDocument
