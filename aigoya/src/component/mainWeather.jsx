import React from "react";
import styles from "../css/MainWeather.module.css";

const dummyData = {
  temperature: 18,
  summary: "흐린 후 비",
  aiMenuSuggestion: "따뜻한 국물 요리 주문량 증가 예상",
};

function mainWeather() {
  const { temperature, summary, aiMenuSuggestion } = dummyData;

  return (
    <div className={styles.card}>
      <div className={styles.weatherInfo}>
        <h2 className={styles.temp}>{temperature}°C</h2>
        <p className={styles.summary}>{summary}</p>
      </div>
      <div className={styles.recommendation}>
        <p>{aiMenuSuggestion}</p>
      </div>
    </div>
  );
}

export default mainWeather