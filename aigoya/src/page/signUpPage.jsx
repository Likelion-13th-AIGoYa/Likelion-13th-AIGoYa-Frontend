import React, { useMemo } from "react";
import styles from "../css/signUpPage.module.css";
import { useForm } from "react-hook-form";

// 전화번호 포맷팅
function formatPhone(v) {
    let digits = v.replace(/[^\d]/g, "");
    if (digits.length >= 11) return digits.replace(/(\d{3})(\d{4})(\d{4}).*/, "$1-$2-$3");
    if (digits.length >= 7) return digits.replace(/(\d{3})(\d{4})(\d+).*/, "$1-$2-$3");
    if (digits.length >= 3) return digits.replace(/(\d{3})(\d+).*/, "$1-$2");
    return digits;
}

export default function SignUpPage({ onDone }) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({ mode: "onBlur" });

    const password = watch("password", "");
    const phone = watch("phone", "");

    // 비밀번호 강도 계산
    const pwStrength = useMemo(() => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-zA-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        return score;
    }, [password]);

    const onSubmit = (data) => {
        alert("회원가입 성공! 이제 로그인해 보세요.");
        onDone?.(); // 로그인 화면으로 복귀
    };

    const onPhoneChange = (e) => {
        setValue("phone", formatPhone(e.target.value), { shouldDirty: true });
    };

    // 비밀번호 강도 체크
    const strengthClass =
        pwStrength === 0 ? styles.strengthNone :
            pwStrength === 1 ? styles.strengthWeak :
                pwStrength === 2 ? styles.strengthFair :
                    pwStrength === 3 ? styles.strengthGood :
                        styles.strengthStrong;

    return (
        <form className={styles.app} onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* 이메일 */}
            <label className={styles.label} htmlFor="email">이메일</label>
            <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="example@store.com"
                {...register("email", {
                    required: "이메일을 입력하세요.",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "올바른 이메일 형식이 아닙니다." }
                })}
            />
            {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}

            {/* 전화번호 */}
            <label className={styles.label} htmlFor="phone">전화번호</label>
            <input
                id="phone"
                type="tel"
                className={styles.input}
                placeholder="010-1234-5678"

                // 상단의 watch로 현재 입력값을 가져와서 포맷팅
                value={phone}
                
                onChange={onPhoneChange}
                {...register("phone", {
                    required: "전화번호를 입력하세요.",
                    validate: v => v.replace(/[^\d]/g, "").length >= 10 || "전화번호를 정확히 입력하세요."
                })}
            />
            {errors.phone && <span className={styles.errorText}>{errors.phone.message}</span>}

            {/* 비밀번호 */}
            <label className={styles.label} htmlFor="password">비밀번호</label>
            <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="8자 이상 (영문/숫자/특수문자)"
                {...register("password", {
                    required: "비밀번호를 입력하세요.",
                    validate: v => v.length >= 8 || "8자 이상 입력하세요."
                })}
            />
            <div className={styles.passwordRequirements}>8자 이상, 영문/숫자/특수문자 포함</div>
            <div className={styles.strengthIndicator}>
                <div className={`${styles.strengthBar} ${strengthClass}`} />
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}

            {/* 비밀번호 확인 */}
            <label className={styles.label} htmlFor="confirmPassword">비밀번호 확인</label>
            <input
                id="confirmPassword"
                type="password"
                className={styles.input}
                placeholder="비밀번호를 다시 입력하세요"
                {...register("confirmPassword", {
                    required: "비밀번호 확인을 입력하세요.",
                    validate: v => v === password || "비밀번호가 일치하지 않습니다."
                })}
            />
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword.message}</span>}


            {/* 약관 동의 */}
            <div className={styles.termsCheckbox}>
                <input
                    id="terms"
                    type="checkbox"
                    className={styles.checkboxInput}
                    {...register("terms", { required: "약관에 동의해 주세요." })}
                />
                <label htmlFor="terms" className={styles.checkboxLabel}>
                    <button type="button" className={styles.inlineLink} onClick={() => alert("서비스 이용약관")}>
                        서비스 이용약관
                    </button>{" "}
                    및{" "}
                    <button type="button" className={styles.inlineLink} onClick={() => alert("개인정보처리방침")}>
                        개인정보처리방침
                    </button>
                    에 동의합니다
                </label>
            </div>
            {errors.terms && <span className={styles.errorText}>{errors.terms.message}</span>}

            {/* 제출 */}
            <button className={styles.button} type="submit">회원가입</button>

            {/* 로그인 이동 */}
            <p className={styles.helper}>
                이미 계정이 있나요?{" "}
                <button type="button" className={styles.linkBtn} onClick={onDone}>로그인</button>
            </p>
        </form>
    );
}
