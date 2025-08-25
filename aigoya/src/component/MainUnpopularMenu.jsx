import React, { useEffect, useState } from "react";
import styles from "../css/MainUnpopularMenu.module.css";
import { getBottomMenus } from "../api/StoreApi";

function MainUnpopularMenu() {
  const [unpopularMenus, setUnpopularMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchWeeklyBottom = async () => {
      try {
        const res = await getBottomMenus({ period: "WEEKLY", limit: 3 });
        // console.log("BOTTOM(WEEKLY) 응답:", res);

        const mapped = (res || []).map((it, idx) => ({
          id: `${it.menuName}-${idx}`,         
          name: it.menuName,
          subtitle: it.categoryName || "메뉴",
          sales: it.salesCount ?? 0,
        }));

        setUnpopularMenus(mapped);
      } catch (e) {
        console.error("비인기 메뉴 API 실패:", e);
        setErr("비인기 메뉴를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyBottom();
  }, []);

  if (loading) return <p className={styles.loading}>로딩중...</p>;
  if (err) return <p className={styles.error}>{err}</p>;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>😢 주간 비인기 메뉴</h2>

      <ul className={styles.list}>
        {unpopularMenus.length === 0 ? (
          <li className={styles.empty}>이번 주 비인기 데이터가 없어요.</li>
        ) : (
          unpopularMenus.map((menu, index) => (
            <li key={menu.id} className={styles.card}>
              <div
                className={`${styles.rankBadge} ${
                  index === 0
                    ? styles.rankBronze
                    : index === 1
                    ? styles.rankSilver
                    : styles.rankGold 
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
          ))
        )}
      </ul>
    </section>
  );
}

export default MainUnpopularMenu;
