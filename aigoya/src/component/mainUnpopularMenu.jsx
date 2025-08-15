import React from "react";
import styles from "../css/mainUnpopularMenu.module.css";

const unpopularMenus = [
    { id: 1, name: "오징어볶음", subtitle: "경쟁사와 가격을 비교해보세요.", sales: 1 },
    { id: 2, name: "생선구이", subtitle: "리뷰 데이터를 분석해보세요.", sales: 3 },
    { id: 3, name: "두부김치", subtitle: "재료 상태를 확인해보셨나요?", sales: 4 },
];

function MainPopularMenu() {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>😢 주간 비인기 메뉴</h2>

            <ul className={styles.list}>
                {unpopularMenus.map((menu, index) => (
                    <li key={menu.id} className={styles.card}>
                        <div
                            className={`${styles.rankBadge} ${index === 1 ? styles.rankSilver : index === 2 ? styles.rankBronze : ""}`}
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