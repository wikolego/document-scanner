import styles from '@/styles/Home.module.css'
import { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Document Scanner</title>
        <meta name='description' content='Document Scanner Application' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Document Scanner</h1>

        <p className={styles.description}>Start scanning your documents</p>
        <a href='/'>Go to Home Page</a>
      </main>
    </div>
  )
}

export default Home
