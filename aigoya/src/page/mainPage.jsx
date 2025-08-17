import React from 'react';
import styles from '../css/mainPage.module.css';
import MainWeather from '../component/mainWeather'
import MainPopularMenu from '../component/mainPopularMenu'
import MainUnpopularMenu from '../component/mainUnpopularMenu';
import MainChart from '../component/mainChart';
import MainChatBot from '../component/mainChatBot';
const mainPage = () => {
  return (
    <div className={styles.mainContainer}>
      <MainWeather/>
      <MainPopularMenu/>
      <MainUnpopularMenu/>
      <MainChart/>
      <MainChatBot/>
    </div>
  );
}

export default mainPage;
