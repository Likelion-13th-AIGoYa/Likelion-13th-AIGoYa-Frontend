import React from 'react';
import styles from '../css/mainPage.module.css';
import MainWeather from '../component/mainWeather'
import MainPopularMenu from '../component/mainPopularMenu'
import MainUnpopularMenu from '../component/mainUnpopularMenu';
const mainPage = () => {
  return (
    <div className={styles.mainContainer}>
      <MainWeather/>
      <MainPopularMenu/>
      <MainUnpopularMenu/>
    </div>
  );
}

export default mainPage;
