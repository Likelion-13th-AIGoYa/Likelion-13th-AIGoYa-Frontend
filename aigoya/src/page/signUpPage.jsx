// src/pages/SignupForm.jsx (경로는 네 구조에 맞게)
import React from "react";
import styles from "../css/loginPage.module.css";
import { useForm } from "react-hook-form";

function SignUpPage({ onDone }) {
    const { register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm();

    const onSubmit = () => {
        alert("회원가입 성공! 이제 로그인해 보세요.");
        onDone?.(); // 로그인 화면으로 복귀
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <label className={styles.label} htmlFor="email">이메일</label>
            <input id="email" type="email" className={styles.input}
                placeholder="example@store.com"
                {...register("email", { required: "이메일을 입력하세요." })} />
            {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}

            <label className={styles.label} htmlFor="password">비밀번호</label>
            <input id="password" type="password" className={styles.input}
                placeholder="8자 이상"
                {...register("password", { required: "비밀번호를 입력하세요." })} />
            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}

            <label className={styles.label} htmlFor="store">상호명</label>
            <input id="store" type="text" className={styles.input}
                placeholder="가게 이름"
                {...register("store", { required: "상호명을 입력하세요." })} />
            {errors.store && <span className={styles.errorText}>{errors.store.message}</span>}

            <button className={styles.button} type="submit">회원가입</button>

            <p className={styles.helper}>
                이미 계정이 있나요?{" "}
                <button type="button" className={styles.linkBtn} onClick={onDone}>로그인</button>
            </p>
        </form>
    );
}

export default SignUpPage;