import React, { useEffect, useState } from "react";
import styles from "../css/MainPopularMenu.module.css";
import { getTopMenus } from "../api/StoreApi";

function MainPopularMenu() {
  const [popularMenus, setPopularMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getTopMenus({ period: "DAILY", limit: 3 });
        console.log("API 응답:", res);

        const mapped = (res || []).map((it, idx) => ({
          id: `${it.menuName}-${idx}`,
          name: it.menuName,
          subtitle: it.categoryName || "",      
          sales: it.salesCount ?? 0,            
        }));

        setPopularMenus(mapped);
      } catch (e) {
        console.error("인기 메뉴(API) 실패:", e);
        setErr("인기 메뉴를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <p className={styles.loading}>로딩중...</p>;
  if (err) return <p className={styles.error}>{err}</p>;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>🔥 오늘 인기 메뉴</h2>

      <ul className={styles.list}>
        {popularMenus.length === 0 ? (
          <li className={styles.empty}>오늘은 인기 데이터가 없어요.</li>
        ) : (
          popularMenus.map((menu, index) => (
            <li key={menu.id} className={styles.card}>
              <div
                className={`${styles.rankBadge} ${
                  index === 1 ? styles.rankSilver : index === 2 ? styles.rankBronze : ""
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

export default MainPopularMenu;
