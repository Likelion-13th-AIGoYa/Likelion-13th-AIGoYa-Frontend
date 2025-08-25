import React, { useState, useEffect } from 'react';
import { Menu, X, Star, BarChart3 } from 'lucide-react';
import styles from '../css/Header.module.css';
import { useNavigate } from "react-router-dom";
import SideBar from './SideBar';
import logo from "../image/mainLogoRemove.png";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("storeId");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("storeId");

    navigate("/", { replace: true });
  };

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\. /g, '.').replace('. ', ' ');
  };

  return (
    <>
      {/* 헤더 컨테이너 - 두 줄 포함 */}
      <div className={styles.headerWrapper}>

        {/* 첫 번째 줄 - 흰색 배경 */}
        <header className={styles.headerTop}>
          <div className={styles.headerTopContainer}>
            {/* 왼쪽: 메뉴 버튼과 로고 */}
            <div className={styles.leftSection}>
              <button
                className={styles.menuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="메뉴"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className={styles.logo}>
                <img src={logo} alt='logo' className={styles.hederLogo} />
              </div>
            </div>

            {/* 오른쪽: 매장명과 시간 */}
            <div className={styles.rightSection}>
              <div className={styles.storeInfo}>
                <span className={styles.storeName}>맛있는집</span>
              </div>
              <span className={styles.divider}>|</span>
              <div className={styles.timeContainer}>
                <span className={styles.time}>{formatTime(currentTime)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 두 번째 줄 - 파란색 배경 (리뷰 알림) */}
        <div className={styles.headerBottom}>
          <div className={styles.notificationContainer}>
            <div className={styles.notificationItem}>
              <Star className={styles.starIcon} size={12} />
              <span className={styles.notificationText}>
                "음식이 정말 맛있어요! 김치찌개 강추합니다" - 네이버리뷰

              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 사이드바 컴포넌트 */}
      <SideBar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        handleLogout={handleLogout} 
      />
    </>
  )
};

export default Header;
