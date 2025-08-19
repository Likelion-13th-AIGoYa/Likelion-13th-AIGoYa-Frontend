import React from 'react';
import styles from '../css/mainPage.module.css';
import MainWeather from '../component/mainWeather'
import MainPopularMenu from '../component/mainPopularMenu'
import MainUnpopularMenu from '../component/mainUnpopularMenu';
import MainChart from '../component/mainChart';
import MainChatBot from '../component/mainChatBot';
import Header from '../component/header';
const mainPage = () => {
  return (
    <div className={styles.mainContainer}>
      <Header />
      <div className={styles.mainSection}>
        <div className={styles.leftSection}>
          <MainChart />
          <MainChatBot />
        </div>
        <div className={styles.rightSection}>
          <MainWeather />
          <MainPopularMenu />
          <MainUnpopularMenu />
        </div>
      </div>
    </div>
  );
}

export default mainPage;
