import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/mainPage.module.css';
import MainWeather from '../component/mainWeather';
import MainPopularMenu from '../component/mainPopularMenu';
import MainUnpopularMenu from '../component/mainUnpopularMenu';
import MainChart from '../component/mainChart';
import MainChatBot from '../component/mainChatBot';
import Header from '../component/header';
import Sales from '../component/mainSales';

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (!token) {
      // 토큰 없으면 로그인 페이지로 튕김
      navigate("/", { replace: true });
    }
  }, [navigate]);

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
