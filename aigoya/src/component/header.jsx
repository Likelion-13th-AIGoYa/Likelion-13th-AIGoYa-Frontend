import React, { useState, useEffect } from 'react';
import { Menu, X, Star } from 'lucide-react';
import styles from '../css/header.module.css';
import { useNavigate } from "react-router-dom";


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
                <div className={styles.logoIcon}>📊</div>
                <span className={styles.logoText}>스마트 매장 매니저</span>
              </div>
            </div>

            {/* 오른쪽: 매장명과 시간 */}
            <div className={styles.rightSection}>
              <span className={styles.storeName}>맛있는집</span>
              <span className={styles.divider}>|</span>
              <span className={styles.time}>{formatTime(currentTime)}</span>
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
            <div className={styles.notificationItem}>
              <Star className={styles.starIcon} size={12} />
              <span className={styles.notificationText}>
                "사장님이 친절하시고 양도 푸짐해요. 재방문 의사 있습니다" - 배달앱 리뷰
              </span>
            </div>
            <div className={styles.notificationItem}>
              <Star className={`${styles.starIcon} ${styles.orange}`} size={12} />
              <span className={styles.notificationText}>
                "가격 대비 만족도 높아요. 동료들과 맛있었습니다" - 구글리뷰
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 사이드 메뉴 */}
      <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.menuHeader}>
          <h2>메뉴</h2>
          <button
            className={styles.closeButton}
            onClick={() => setIsMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            <X size={24} />
          </button>
        </div>
        <nav className={styles.menuContent}>
          {/* TODO: 메뉴 항목들 - 나중에 채울 부분 */}
          <div className={styles.menuItem}>대시보드</div>
          <div className={styles.menuItem}>매출 분석</div>
          <div className={styles.menuItem}>메뉴 관리</div>
          <div className={styles.menuItem}>고객 리뷰</div>
          <div className={styles.menuItem}>재고 관리</div>
          <div className={styles.menuItem}>직원 관리</div>
          <div className={styles.menuItem}>설정</div>

          <div className={styles.menuItem} onClick={handleLogout}> 로그아웃 </div>
          
        </nav>
      </div>

      {/* 메뉴 열렸을 때 배경 오버레이 */}
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;