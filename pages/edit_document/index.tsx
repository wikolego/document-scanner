import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../../styles/Home.module.css'

const EditDocument: NextPage = () => {
  const router = useRouter()
  const { imageUrl } = router.query
  const [message, setMessage] = useState('')

  async function test() {
    const response = await fetch('http://localhost:5000/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({ message: 'Some message' })
      body: JSON.stringify({ imageUrl })
    })

    if (!response.ok) {
      throw new Error('Failed to process image')
    }

    const data = await response.json()
    setMessage(data.message)
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

        {message && <p>{message}</p>}

        {imageUrl && (
          <div className={styles.imageContainer}>
            <img
              src={imageUrl as string}
              alt='Uploaded document'
              className={styles.documentImage}
            />
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={test}>
            Adjust
          </button>
          <button className={styles.button}>Crop</button>
          <button className={styles.button}>Save</button>
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
