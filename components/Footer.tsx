import React from 'react'
import styles from '../styles/Footer.module.css'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; {new Date().getFullYear()} Document Scanner. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
