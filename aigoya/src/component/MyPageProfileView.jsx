import React from "react";
import styles from "../css/MyPageProfileView.module.css";

function MyPageProfileView({ store }) {
  const name = store?.name ?? "";
  const phone = store?.phone ?? "";
  const email = store?.email ?? "";
  const address = store?.address ?? "";

  return (
    <div className={styles.profileContainer}>
      <div className={styles.formGroup}>
        <label>상호명</label>
        <div className={styles.input}>{name || "미등록"}</div>
      </div>

      <div className={styles.formGroup}>
        <label>전화번호</label>
        <div className={styles.input}>{phone || "미등록"}</div>
      </div>

      <div className={styles.formGroup}>
        <label>이메일</label>
        <div className={styles.input}>{email || "미등록"}</div>
      </div>

      <div className={`${styles.formGroup} ${styles.colSpan2}`}>
        <label>주소</label>
        <div className={styles.input}>{address || "미등록"}</div>
      </div>
    </div>
  );
}
export default MyPageProfileView;