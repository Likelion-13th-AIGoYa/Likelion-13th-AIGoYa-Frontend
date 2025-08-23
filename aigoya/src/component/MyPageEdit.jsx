import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyStore, updateMyStore } from "../api/StoreApi";
import styles from "../css/MyPageEdit.module.css";

function MyPageEdit({ initialStore, onSaved }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
  const isPhoneValid =
    form.phone.trim() === "" || phoneRegex.test(form.phone.trim());

  useEffect(() => {
    if (initialStore) {
      setForm({
        name: initialStore?.name ?? "",
        phone: initialStore?.phone ?? "",
        address: initialStore?.address ?? "",
      });
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const me = await getMyStore();
        setForm({
          name: me?.name ?? "",
          phone: me?.phone ?? "",
          address: me?.address ?? "",
        });
      } catch (e) {
        setError(e?.response?.data?.message || "정보 불러오기에 실패했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [initialStore]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("상호명은 필수입니다.");
    if (!form.address.trim()) return setError("주소는 필수입니다.");
    if (form.phone.trim() && !phoneRegex.test(form.phone.trim())) {
      setPhoneTouched(true);
      return setError("전화번호 형식이 올바르지 않습니다. 예) 010-1234-5678");
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    try {
      setSaving(true);
      const updated = await updateMyStore(payload);
      if (onSaved) return onSaved(updated ?? payload);
      navigate("/main/mypage", { replace: true });
    } catch (e2) {
      setError(e2?.response?.data?.message || "수정 중 오류가 발생했어요.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.loading}>불러오는 중...</p>;

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={onSubmit}>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label className={styles.label}>상호명 *</label>
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="상호명을 입력하세요"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>주소 *</label>
          <input
            className={styles.input}
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="주소를 입력하세요"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>전화번호</label>
          <input
            className={`${styles.input} ${phoneTouched && !isPhoneValid ? styles.inputError : ""}`}
            name="phone"
            value={form.phone}
            onChange={onChange}
            onBlur={() => setPhoneTouched(true)}
            placeholder="010-0000-0000"
            inputMode="tel"
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyPageEdit;