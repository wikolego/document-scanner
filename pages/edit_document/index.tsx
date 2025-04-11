import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'

const EditDocument: NextPage = () => {
  const router = useRouter()
  const { imageUrl } = router.query

  return (
    <div className={styles.container}>
      <Head>
        <title>Edit Document</title>
        <meta name='description' content='Edit your scanned document' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Edit Document</h1>

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
          <button className={styles.button}>Adjust</button>
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
