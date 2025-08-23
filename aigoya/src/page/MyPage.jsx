import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyStore, deleteMyStore } from "../api/storeApi";
import styles from "../css/MyPage.module.css";
import Header from "../component/header";
import MyPageEdit from "../component/MyPageEdit";
import MyPageProfileView from "../component/MyPageProfileView"; // ⬅️ 추가

const firstChar = (t, fb = "상") => {
  const s = (t ?? "").trim();
  if (!s) return fb;
  const f = Array.from(s)[0];
  return /^[a-z]$/.test(f) ? f.toUpperCase() : f;
};

export default function MyPage() {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [mode, setMode] = useState("profile"); // 'profile' | 'edit'

  useEffect(() => {
    (async () => {
      try {
        const me = await getMyStore();
        setStore(me);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDelete = async () => {
    if (deleting) return;
    if (!window.confirm("정말 탈퇴하시겠어요? 되돌릴 수 없어요.")) return;
    try {
      setDeleting(true);
      await deleteMyStore();
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      navigate("/", { replace: true, state: { toast: "탈퇴가 완료되었습니다." } });
    } catch (e) {
      const msg = e?.response?.data?.message;
      alert(msg || "탈퇴에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className={styles.loading}>로딩중...</p>;
  if (!store) return <p className={styles.loading}>데이터가 없어요.</p>;

  const name = store?.name ?? "";
  const email = store?.email ?? "";
  const avatar = firstChar(name, "상");

  return (
    <div className={styles.page}>
      <div className={styles.header}><Header /></div>

      <div className={styles.shell}>
        {/* ===== 왼쪽 사이드 ===== */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>

            <div className={styles.profileHeader}>
              <div className={styles.avatar}>{avatar}</div>
              <div className={styles.profileMeta}>
                <div className={styles.ownerName}>{name || "상호명 미설정"}</div>
                <div className={styles.ownerEmail}>{email || "이메일 미등록"}</div>
              </div>
            </div>

            <hr className={styles.sideDivider} />

            <div className={styles.navList}>
              <button
                className={`${styles.navItem} ${mode === "profile" ? styles.active : ""}`}
                onClick={() => setMode("profile")}
              >
                기본 정보
              </button>
              <button
                className={`${styles.navItem} ${mode === "edit" ? styles.active : ""}`}
                onClick={() => setMode("edit")}
              >
                가게 정보 수정
              </button>
              <button
                className={styles.navItem}
                onClick={() => alert("비밀번호 변경 페이지 연결 예정")}
              >
                비밀번호 변경
              </button>

              <hr className={styles.sideDivider} />

              <button
                className={`${styles.navItem} ${styles.danger}`}
                onClick={onDelete}
                disabled={deleting}
              >
                {deleting ? "탈퇴 처리 중..." : "회원탈퇴"}
              </button>
            </div>
          </div>
        </aside>

        <section className={styles.content}>
          <div className={styles.contentHead}>
            <h1 className={styles.title}>
              {mode === "profile" ? "기본 정보" : "가게 정보 수정"}
            </h1>
            <p className={styles.sub}>
              {mode === "profile"
                ? "등록된 가게 정보를 확인할 수 있어요."
                : "가게 정보를 안전하게 수정하세요."}
            </p>
          </div>

          {mode === "profile" ? (
            <MyPageProfileView store={store} />
          ) : (
            <MyPageEdit
              initialStore={store}
              onCancel={() => setMode("profile")}
              onSaved={(updated) => {
                setStore((prev) => ({ ...prev, ...updated }));
                setMode("profile");
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}
