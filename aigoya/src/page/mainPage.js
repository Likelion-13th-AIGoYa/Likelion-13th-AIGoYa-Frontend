import React from 'react';
import styles from '../css/mainPage.module.css';
import MainWeather from '../component/mainWeather'

const mainPage = () => {
  return (
    <div className={styles.mainContainer}>
      <MainWeather/>
    </div>
  );
}

export default mainPage;
