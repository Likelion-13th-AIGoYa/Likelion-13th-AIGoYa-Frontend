import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Receipt } from 'lucide-react';
import { getTodaySales } from '../api/StoreApi';
import styles from '../css/MainSales.module.css';

const MainSales = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { today, yesterday } = await getTodaySales();
        
        // 변화율 계산
        const calculateChange = (today, yesterday) => {
          if (yesterday === 0) return 0;
          return ((today - yesterday) / yesterday * 100);
        };

        setStatsData({
          todaySales: {
            value: today.totalSales,
            change: calculateChange(today.totalSales, yesterday.totalSales),
            label: '오늘 총 매출'
          },
          transactions: {
            value: today.orderCount,
            change: calculateChange(today.orderCount, yesterday.orderCount),
            label: '거래 건수'
          },
          averagePrice: {
            value: today.averageOrderValue,
            change: calculateChange(today.averageOrderValue, yesterday.averageOrderValue),
            label: '평균 단가'
          }
        });
      } catch (error) {
        // console.error('매출 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const formatNumber = (num) => num.toLocaleString('ko-KR');
  const formatCurrency = (num) => `₩${formatNumber(num)}`;

  if (loading) {
    return (
      <div className={styles.statsContainer}>
        {[1, 2, 3].map(i => (
          <div key={i} className={styles.statsCard}>
            <div className={styles.cardContent}>
              <div style={{ color: '#999' }}>로딩 중...</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className={styles.statsContainer}>
        <div style={{ color: '#999', padding: '20px' }}>데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const cards = [
    {
      ...statsData.todaySales,
      icon: DollarSign,
      formatter: formatCurrency
    },
    {
      ...statsData.transactions,
      icon: ShoppingCart,
      formatter: (num) => `${formatNumber(num)}건`
    },
    {
      ...statsData.averagePrice,
      icon: Receipt,
      formatter: formatCurrency
    }
  ];

  return (
    <div className={styles.statsContainer}>
      {cards.map((card, index) => (
        <div key={index} className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <card.icon className={styles.icon} size={20} />
            </div>
            <span className={styles.label}>{card.label}</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.mainValue}>
              {card.formatter(card.value)}
            </div>
            <div className={`${styles.changeRate} ${card.change >= 0 ? styles.up : styles.down}`}>
              {card.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>
                {card.change >= 0 ? '+' : ''}{card.change.toFixed(1)}%
                <span className={styles.changeLabel}> (전일 대비)</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainSales;