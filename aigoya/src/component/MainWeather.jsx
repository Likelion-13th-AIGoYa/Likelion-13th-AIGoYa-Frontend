import React, { useEffect, useState } from "react";
import styles from "../css/MainWeather.module.css";
import { getWeatherSalesTrend } from "../api/StoreApi";

function MainWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await getWeatherSalesTrend();
        // console.log("날씨/트렌드 응답:", res);

        const mapped = {
          temperature: res.temperature,
          summary: res.weatherSummary,
          aiMenuSuggestion: res.salesTrendInsight,
        };

        setWeather(mapped);
      } catch (e) {
        // console.error("날씨 트렌드 API 실패:", e);
        setErr("날씨 데이터를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <p className={styles.loading}>로딩중...</p>;
  if (err) return <p className={styles.error}>{err}</p>;

  return (
    <div className={styles.card}>
      <div className={styles.weatherInfo}>
        <h2 className={styles.temp}>{weather.temperature}°C</h2>
        <p className={styles.summary}>{weather.summary}</p>
      </div>
      <div className={styles.recommendation}>
        <p>{weather.aiMenuSuggestion}</p>
      </div>
    </div>
  );
}

export default MainWeather;
