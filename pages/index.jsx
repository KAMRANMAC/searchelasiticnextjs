import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState } from 'react'
export default function Search() {
  const [value, setValue] = useState('');
  const [course, setCourse] = useState([]);
  async function findES() {
    try {
      const response = await fetch(`api/search?value=${value}`);
      let data = await response.json()
      if (data['body']['hits']['hits']) {
        console.log('api response: ', data['body']['hits']['hits']);
        setCourse(data['body']['hits']['hits'])
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className='row'>
          <input type="text" placeholder='Search eg: big data' value={value} onChange={(e) => setValue(e.target.value)} />
          <button onClick={findES}>Search</button>
        </div>
        <br /><br /><br />
        <table className="table-striped" border="1" height={course.length ? "auto" : ""} width="100%">
          <tr className="header">
            <th className={styles.textStyle}>ID</th>
            <th className={styles.textStyle}>title</th>
            <th className={styles.textStyle}>Description</th>
            <th className={styles.textStyle}>link</th>
          </tr>
          {course && course.map(x => {
            return <tr key={x._id}>
              <td className={styles.textStyle}>{x?._id}</td>             
              <td className={styles.textStyle} 
              dangerouslySetInnerHTML={{__html: x.highlight.title.join()}} />
              <td className={styles.textStyle} dangerouslySetInnerHTML={
                {__html: x.highlight.description.join()}}/>
              <td className={styles.textStyle}>{x?._source.link}</td>
            </tr>          
          })}
        </table>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}