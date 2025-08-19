import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Receipt, Target } from 'lucide-react';
import styles from '../css/mainSales.module.css';

const MainSales = () => {
  // TODO: 백엔드 API에서 받아올 데이터
  const [statsData, setStatsData] = useState({
    todaySales: {
      value: 1247000,
      change: 15.3,
      trend: 'up',
      label: '오늘 총 매출'
    },
    transactions: {
      value: 156,
      unit: '건',
      change: -3.2,
      trend: 'down',
      label: '거래 건수'
    },
    averagePrice: {
      value: 7994,
      change: 8.1,
      trend: 'up',
      label: '평균 단가'
    },
    targetRate: {
      value: 103.9,
      unit: '%',
      isAchieved: true,
      label: '목표 달성률'
    }
  });

  // TODO: 실제 API 호출
  useEffect(() => {
    // const fetchStats = async () => {
    //   try {
    //     const response = await fetch('/api/stats/today');
    //     const data = await response.json();
    //     setStatsData(data);
    //   } catch (error) {
    //     console.error('통계 데이터 로딩 실패:', error);
    //   }
    // };
    // fetchStats();
  }, []);

  // 숫자 포맷팅 함수
  const formatNumber = (num) => {
    return num.toLocaleString('ko-KR');
  };

  // 금액 포맷팅 함수
  const formatCurrency = (num) => {
    return `₩${formatNumber(num)}`;
  };

  return (
    <div className={styles.statsContainer}>
      {/* 오늘 총 매출 */}
      <div className={styles.statsCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <DollarSign className={styles.icon} size={20} />
          </div>
          <span className={styles.label}>{statsData.todaySales.label}</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.mainValue}>
            {formatCurrency(statsData.todaySales.value)}
          </div>
          <div className={`${styles.changeRate} ${statsData.todaySales.trend === 'up' ? styles.up : styles.down}`}>
            {statsData.todaySales.trend === 'up' ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>
              {statsData.todaySales.change > 0 ? '+' : ''}{statsData.todaySales.change}% 
              <span className={styles.changeLabel}> (전일 대비)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 거래 건수 */}
      <div className={styles.statsCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <ShoppingCart className={styles.icon} size={20} />
          </div>
          <span className={styles.label}>{statsData.transactions.label}</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.mainValue}>
            {formatNumber(statsData.transactions.value)}{statsData.transactions.unit}
          </div>
          <div className={`${styles.changeRate} ${statsData.transactions.trend === 'up' ? styles.up : styles.down}`}>
            {statsData.transactions.trend === 'up' ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>
              {statsData.transactions.change > 0 ? '+' : ''}{statsData.transactions.change}%
              <span className={styles.changeLabel}> (전일 대비)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 평균 단가 */}
      <div className={styles.statsCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <Receipt className={styles.icon} size={20} />
          </div>
          <span className={styles.label}>{statsData.averagePrice.label}</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.mainValue}>
            {formatCurrency(statsData.averagePrice.value)}
          </div>
          <div className={`${styles.changeRate} ${statsData.averagePrice.trend === 'up' ? styles.up : styles.down}`}>
            {statsData.averagePrice.trend === 'up' ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>
              {statsData.averagePrice.change > 0 ? '+' : ''}{statsData.averagePrice.change}%
              <span className={styles.changeLabel}> (전일 대비)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 목표 달성률 */}
      <div className={styles.statsCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <Target className={styles.icon} size={20} />
          </div>
          <span className={styles.label}>{statsData.targetRate.label}</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.mainValue}>
            {statsData.targetRate.value}{statsData.targetRate.unit}
          </div>
          <div className={`${styles.achievementStatus} ${statsData.targetRate.isAchieved ? styles.achieved : styles.notAchieved}`}>
            {statsData.targetRate.isAchieved ? (
              <>
                <span className={styles.achievedIcon}>✓</span>
                <span>목표 달성</span>
              </>
            ) : (
              <span>목표 미달성</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSales;