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

  // UTC 시간을 KST로 변환하는 함수 추가
  const convertUTCtoKST = (utcHour) => {
    // UTC + 9시간 = KST
    return (utcHour + 9) % 24;
  };

  const salesData = useMemo(() => {
    // console.log('rawSalesData 처리 시작:', rawSalesData);

    const filtered = rawSalesData.filter(item => {
      let h;

      if (item.orderedAt) {
        // orderedAt이 있는 경우 Date 객체로 변환 후 KST 시간 추출
        const date = new Date(item.orderedAt);
        h = date.getHours(); // 브라우저 로컬 시간 (KST)
        // console.log(`orderedAt 변환: ${item.orderedAt} → ${h}시`);
      } else if (item.hour !== undefined) {
        // hour만 있는 경우, 서버가 UTC로 주는지 확인
        const originalHour = Number(item.hour);
        h = convertUTCtoKST(originalHour); // UTC → KST 변환
        // console.log(`hour 변환: ${originalHour}(UTC) → ${h}시(KST)`);
      } else {
        console.warn('시간 정보가 없는 아이템:', item);
        return false;
      }

      // 필터링 로직
      if (startHour <= endHour) {
        return h >= startHour && h <= endHour;
      }
      return h >= startHour || h <= endHour;
    });

    return filtered
      .sort((a, b) => {
        let aHour, bHour;

        if (a.orderedAt) {
          aHour = new Date(a.orderedAt).getHours();
        } else {
          aHour = convertUTCtoKST(Number(a.hour));
        }

        if (b.orderedAt) {
          bHour = new Date(b.orderedAt).getHours();
        } else {
          bHour = convertUTCtoKST(Number(b.hour));
        }

        return aHour - bHour;
      })
      .map(item => {
        let hourText;
        let displayHour;

        if (item.orderedAt) {
          displayHour = new Date(item.orderedAt).getHours();
          hourText = `${String(displayHour).padStart(2, '0')}:00`;
        } else {
          displayHour = convertUTCtoKST(Number(item.hour));
          hourText = `${String(displayHour).padStart(2, '0')}:00`;
        }

        // console.log(`최종 표시: ${item.hour || item.orderedAt} → ${hourText}`);

        return {
          time: hourText,
          sales: item.totalSales,
          originalHour: item.hour // 디버깅용
        };
      });
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
