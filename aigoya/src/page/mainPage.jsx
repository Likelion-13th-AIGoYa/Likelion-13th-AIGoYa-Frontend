import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from '../css/mainPage.module.css';
import MainWeather from '../component/mainWeather'
import MainPopularMenu from '../component/mainPopularMenu'
import MainUnpopularMenu from '../component/mainUnpopularMenu';
import MainChart from '../component/mainChart';
import MainChatBot from '../component/mainChatBot';
import Header from '../component/header';
import Sales from '../component/mainSales';


const MainPage = () => {


const navigate = useNavigate();
const navigateToPosMachine = () => {
  navigate('/posMachine');
};


  return (
    <div className={styles.pageWithHeader}>
      <Header />
      <div className={styles.mainContainer}>
        <div className={styles.mainSection}>
          <div className={styles.leftSection}>
            <Sales />
            <MainChart />
            <MainChatBot />
          </div>
          <div className={styles.rightSection}>
            <MainWeather />
            <MainPopularMenu />
            <MainUnpopularMenu />
            <button className={`${styles.posMachinePageLink} ${styles.simple}`} onClick={navigateToPosMachine}>포스기 연결</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
