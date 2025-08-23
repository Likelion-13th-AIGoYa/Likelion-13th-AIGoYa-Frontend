import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/MainPage.module.css';
import MainWeather from '../component/MainWeather';
import MainPopularMenu from '../component/MainPopularMenu';
import MainUnpopularMenu from '../component/MainUnpopularMenu';
import MainChart from '../component/MainChart';
import MainChatBot from '../component/MainChatBot';
import Header from '../component/Header';
import Sales from '../component/MainSales';

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
