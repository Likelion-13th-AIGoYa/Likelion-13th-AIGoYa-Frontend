import React from "react";
import styles from "../css/mainPopularMenu.module.css";

const popularMenus = [
  { id: 1, name: "김치찌개", subtitle: "우리 집 시그니처 메뉴!", sales: 23 },
  { id: 2, name: "제육볶음", subtitle: "점심 특선 메뉴", sales: 18 },
  { id: 3, name: "된장찌개", subtitle: "고깃집 스타일의 칼칼한 찌개", sales: 15 },
];

function MainPopularMenu() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}> 🔥 오늘 인기 메뉴</h2>

      <ul className={styles.list}>
        {popularMenus.map((menu, index) => (
          <li key={menu.id} className={styles.card}>
            <div
              className={`${styles.rankBadge} ${index === 1 ? styles.rankSilver : index === 2 ? styles.rankBronze : ""
                }`}
            >
              <span className={styles.BadgeIndex}>{index + 1}</span>
            </div>

            <div className={styles.info}>
              <div className={styles.name}>{menu.name}</div>
              <div className={styles.subtitle}>{menu.subtitle}</div>
            </div>

            <div className={styles.sales}>
              <strong>{menu.sales}</strong>그릇
            </div>
          </li>
        ))}
      </ul>

    </section>
  );
}

export default MainPopularMenu