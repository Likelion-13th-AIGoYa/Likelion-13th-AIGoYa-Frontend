import React, { useRef, useEffect, useState, useMemo } from "react";
import styles from '../css/MainChart.module.css';
import { getSalesByHour } from '../api/StoreApi';

const MainChart = () => {
  const chartRef = useRef(null);
  const [rawSalesData, setRawSalesData] = useState([]); // API 원본: [{hour, totalSales}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 시간 필터 상태 (기본: 00:00 ~ 23:59)
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  // API 호출
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSalesByHour(); // date 미지정 시 오늘
      setRawSalesData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || '데이터 조회에 실패했습니다.');
      setRawSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  // 시:분을 "시 정수"로 변환 (분은 30분 이상이면 다음 시로 포함할지 정책 결정 필요)
  // 여기서는 포함 범위를 직관적으로: startHour <= hour <= endHour
  // end가 23:59면 23 포함, 10:00이면 10 포함
  const parseHourInclusive = (hhmm) => {
    const [hh, mm] = hhmm.split(':').map(Number);
    // 종료쪽은 분이 0이라도 같은 시를 포함하는 정책으로 갑니다.
    // 시작/종료 모두 해당 '시'를 포함시키므로 이 구현은 직관적입니다.
    return hh;
  };

  const startHour = useMemo(() => parseHourInclusive(startTime), [startTime]);
  const endHour = useMemo(() => parseHourInclusive(endTime), [endTime]);

  // 필터링된 차트용 데이터로 변환
  const salesData = useMemo(() => {
    // API가 일부 시간만 반환할 수 있으므로 0~23시 스파스 데이터 보정 여부 결정 가능
    // 여기서는 반환된 데이터만 사용 (없는 시간대는 라벨에서 제외)
    const filtered = rawSalesData.filter(item => {
      const h = Number(item.hour);
      // 범위 유효성: startHour <= endHour 일 때 일반 비교
      if (startHour <= endHour) {
        return h >= startHour && h <= endHour;
      }
      // 만약 사용자가 종료가 시작보다 이전(야간跨일)을 선택했다면: 예) 20:00 ~ 06:00
      // 밤~자정(>=startHour) 또는 새벽(<=endHour) 시간 포함
      return h >= startHour || h <= endHour;
    });

    // 차트 포맷으로 매핑
    return filtered
      .sort((a, b) => a.hour - b.hour)
      .map(item => ({
        time: `${String(item.hour).padStart(2, '0')}:00`,
        sales: item.totalSales
      }));
  }, [rawSalesData, startHour, endHour]);

  const drawChart = () => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 초기화
    ctx.clearRect(0, 0, width, height);

    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const itemCount = salesData.length;
    const maxValue = itemCount > 0 ? Math.max(...salesData.map(d => d.sales)) : 0;

    if (itemCount === 0 || maxValue === 0) {
      ctx.fillStyle = '#64748B';
      ctx.font = '14px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('선택한 시간대에 데이터가 없습니다', width / 2, height / 2);
      return;
    }

    // Y축 격자
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // 꺾은선
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < itemCount; i++) {
      const x = padding + (chartWidth / (Math.max(itemCount - 1, 1))) * i;
      const y = padding + chartHeight - (salesData[i].sales / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 포인트
    ctx.fillStyle = '#3B82F6';
    for (let i = 0; i < itemCount; i++) {
      const x = padding + (chartWidth / (Math.max(itemCount - 1, 1))) * i;
      const y = padding + chartHeight - (salesData[i].sales / maxValue) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // X 라벨
    ctx.fillStyle = '#64748B';
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < itemCount; i++) {
      const x = padding + (chartWidth / (Math.max(itemCount - 1, 1))) * i;
      ctx.fillText(salesData[i].time, x, height - padding + 15);
    }

    // 값 라벨
    ctx.fillStyle = '#3B82F6';
    ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
    for (let i = 0; i < itemCount; i++) {
      const x = padding + (chartWidth / (Math.max(itemCount - 1, 1))) * i;
      const y = padding + chartHeight - (salesData[i].sales / maxValue) * chartHeight;
      const valueText = (salesData[i].sales / 1000).toFixed(0) + 'K';
      ctx.fillText(valueText, x, y - 10);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    if (!loading && chartRef.current) {
      drawChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesData, loading]);

  // 요약 통계 (필터 반영)
  const totalSales = useMemo(
    () => salesData.reduce((sum, item) => sum + item.sales, 0),
    [salesData]
  );
  const averageSales = useMemo(
    () => (salesData.length ? Math.round(totalSales / salesData.length) : 0),
    [salesData, totalSales]
  );
  const maxSales = useMemo(
    () => (salesData.length ? Math.max(...salesData.map(d => d.sales)) : 0),
    [salesData]
  );

  // 시간 선택 핸들러: 유효성(시작<=종료 또는 야간跨일 허용) 안내 정도만
  const handleStartTimeChange = (e) => setStartTime(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>시간대별 매출 현황</p>

        {/* 우측 상단 시간 필터 */}
        <div className={styles.timeFilter}>
          <div className={styles.timeField}>
            <label className={styles.timeLabel}>시작</label>
            <input
              type="time"
              className={styles.timeInput}
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </div>
          <div className={styles.timeField}>
            <label className={styles.timeLabel}>마감</label>
            <input
              type="time"
              className={styles.timeInput}
              value={endTime}
              onChange={handleEndTimeChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.chartMainContainer}>
        <div className={styles.chartWrapper}>
          {loading ? (
            <div className={styles.loadingMessage}>매출 데이터를 불러오는 중...</div>
          ) : error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : (
            <canvas
              ref={chartRef}
              width={760}
              height={200}
              className={styles.chart}
            />
          )}
        </div>

        <div className={styles.chartInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>총 매출</span>
            <span className={styles.infoValue}>{totalSales.toLocaleString()}원</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>평균</span>
            <span className={styles.infoValue}>{averageSales.toLocaleString()}원</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>최고</span>
            <span className={styles.infoValue}>{maxSales.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChart;
