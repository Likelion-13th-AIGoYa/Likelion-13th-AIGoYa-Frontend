import React, { useMemo, useState } from "react";
import styles from "../css/SignUpPage.module.css";
import { useForm } from "react-hook-form";
import { createStore } from "../api/StoreApi";

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

    const [isLoading, setIsLoading] = useState(false);

    const password = watch("password", "");
    const phone = watch("phone", "");

    const pwStrength = useMemo(() => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-zA-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const storeData = {
                email: data.email,
                phone: data.phone,
                password: data.password
            };

            const response = await createStore(storeData);
            alert(`회원가입 성공! 가게가 생성되었습니다.`);
            onDone?.(data.email);
        } catch (error) {
            if (error.response) {
                alert(`회원가입 실패: ${error.response.status} - ${error.response.data?.message || '서버 오류'}`);
            } else if (error.request) {
                alert("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
            } else {
                alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onPhoneChange = (e) => {
        setValue("phone", formatPhone(e.target.value), { shouldDirty: true });
    };

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
                placeholder="비밀번호를 입력하세요"
                {...register("password", {
                    required: "비밀번호를 입력하세요."
                })}
            />
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

            {/* 비밀번호 강도 표시 */}
            <div className={styles.passwordRequirements}>8자 이상, 영문/숫자/특수문자 포함</div>
            <div className={styles.strengthIndicator}>
                <div className={`${styles.strengthBar} ${strengthClass}`} />
            </div>

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
            <button className={styles.button} type="submit" disabled={isLoading}>
                {isLoading ? "회원가입 중..." : "회원가입"}
            </button>

            {/* 로그인 이동 */}
            <p className={styles.helper}>
                이미 계정이 있나요?{" "}
                <button type="button" className={styles.linkBtn} onClick={() => onDone?.()}>로그인</button>
            </p>
        </form>
    );
}
