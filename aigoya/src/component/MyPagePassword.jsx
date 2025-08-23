import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../css/MyPagePassword.module.css";
import { changeMyPassword } from "../api/storeApi";

export default function MyPagePassword({ storeId, onCancel, onDone }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { currentPassword: "", newPassword: "", confirm: "" } });

  const [serverError, setServerError] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = async (v) => {
    setServerError("");
    setOk(false);
    try {
      await changeMyPassword({
        storeId,
        currentPassword: v.currentPassword,
        newPassword: v.newPassword,
      });
      setOk(true);
      reset({ currentPassword: "", newPassword: "", confirm: "" });
      onDone?.();
    } catch (e) {
      setServerError(e.userMessage || "비밀번호 변경에 실패했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && <div className={styles.error}>{serverError}</div>}
      {ok && <div className={styles.success}>비밀번호가 변경되었습니다.</div>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="currentPassword">현재 비밀번호</label>
        <input
          id="currentPassword"
          type="password"
          className={styles.input}
          autoComplete="current-password"
          {...register("currentPassword", { required: "현재 비밀번호를 입력하세요." })}
        />
        {errors.currentPassword && <small style={{ color: "#b91c1c" }}>{errors.currentPassword.message}</small>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="newPassword">새 비밀번호</label>
        <input
          id="newPassword"
          type="password"
          className={styles.input}
          autoComplete="new-password"
          {...register("newPassword", {

            required: "새 비밀번호를 입력하세요.",
            minLength: { value: 8, message: "8자 이상 입력하세요." },
          })}
        />
        {errors.newPassword && <small style={{ color: "#b91c1c" }}>{errors.newPassword.message}</small>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="confirm">새 비밀번호 확인</label>
        <input
          id="confirm"
          type="password"
          className={styles.input}
          autoComplete="new-password"
          {...register("confirm", {
            validate: (v) => v === watch("newPassword") || "비밀번호가 일치하지 않습니다.",
          })}
        />
        {errors.confirm && <small style={{ color: "#b91c1c" }}>{errors.confirm.message}</small>}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
          {isSubmitting ? "변경 중..." : "비밀번호 변경"}
        </button>
      </div>
    </form>
  );
}
