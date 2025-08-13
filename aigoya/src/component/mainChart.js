import React, { useRef, useEffect, useState } from "react";
import styles from '../css/mainChart.module.css';

const MainChart = () => {
    const chartRef = useRef(null);
    const [selectedPeriod, setSelectedPeriod] = useState('전체');

    // 임의의 시간대별 매출 데이터
    const salesData = [
        { time: '09:00', sales: 150000 },
        { time: '10:00', sales: 280000 },
        { time: '11:00', sales: 420000 },
        { time: '12:00', sales: 680000 },
        { time: '13:00', sales: 720000 },
        { time: '14:00', sales: 580000 },
        { time: '15:00', sales: 450000 },
        { time: '16:00', sales: 520000 },
        { time: '17:00', sales: 640000 },
        { time: '18:00', sales: 780000 },
        { time: '19:00', sales: 850000 },
        { time: '20:00', sales: 620000 },
        { time: '21:00', sales: 380000 }
    ];

    const drawChart = () => {
        const canvas = chartRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // 캔버스 초기화
        ctx.clearRect(0, 0, width, height);

        // 차트 영역 설정
        const padding = 50;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const maxValue = Math.max(...salesData.map(d => d.sales));
        const barWidth = chartWidth / salesData.length * 0.6;

        // Y축 격자선 그리기
        ctx.strokeStyle = '#F1F5F9';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // 막대 그리기
        salesData.forEach((item, index) => {
            const x = padding + (chartWidth / salesData.length) * index + (chartWidth / salesData.length - barWidth) / 2;
            const barHeight = (item.sales / maxValue) * chartHeight;
            const y = padding + chartHeight - barHeight;

            // 그라데이션 생성
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#3B82F6');
            gradient.addColorStop(1, '#60A5FA');

            // 막대 그리기
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // X축 라벨 (시간)
            ctx.fillStyle = '#64748B';
            ctx.font = '11px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.time, x + barWidth / 2, height - padding + 15);

            // 값 표시 (막대 위)
            if (barHeight > 20) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
                const valueText = (item.sales / 1000).toFixed(0) + 'K';
                ctx.fillText(valueText, x + barWidth / 2, y - 5);
            }
        });
    };

    useEffect(() => {
        if (chartRef.current) {
            drawChart();
        }
    }, []);

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.header}>
                <p className={styles.headerTitle}>시간대별 매출 현황</p>
                <div className={styles.headerButtonContainer}>
                    {['전체', '오늘', '이번 주', '이번 달'].map(period => (
                        <button 
                            key={period}
                            className={`${styles.headerButton} ${selectedPeriod === period ? styles.activeButton : ''}`}
                            onClick={() => handlePeriodChange(period)}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.chartMainContainer}>
                <div className={styles.chartWrapper}>
                    <canvas 
                        ref={chartRef}
                        width={760}
                        height={200}
                        className={styles.chart}
                    />
                </div>
                <div className={styles.chartInfo}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>총 매출</span>
                        <span className={styles.infoValue}>
                            {salesData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}원
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>평균</span>
                        <span className={styles.infoValue}>
                            {Math.round(salesData.reduce((sum, item) => sum + item.sales, 0) / salesData.length).toLocaleString()}원
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>최고</span>
                        <span className={styles.infoValue}>
                            {Math.max(...salesData.map(d => d.sales)).toLocaleString()}원
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainChart;
