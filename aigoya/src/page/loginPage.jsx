import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../css/loginPage.module.css";

const dummyUser = {
  email: "test@store.com",
  password: "1234",
};

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data) => {
    if (data.email !== dummyUser.email) {
      setError("email", { type: "manual", message: "이메일이 존재하지 않습니다." });
    } else if (data.password !== dummyUser.password) {
      setError("password", { type: "manual", message: "비밀번호가 틀렸습니다." });
    } else {
      alert("로그인 성공!");
      navigate("/main");
    }
  };

  return (
    <main className={styles.app}>
      {/* 좌측 소개 */}
      <section className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.logoWrap}>
            <div className={styles.logo}>로고<br />변경</div>
          </div>

          <h1 className={styles.title}>
            스마트 매장 <br /> 매니저
          </h1>

          <ul className={styles.list}>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.checkIcon} />
              <span>실시간 매출 분석 및 통계</span>
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.checkIcon} />
              <span>트렌드 기반 메뉴/상품 추천</span>
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.checkIcon} />
              <span>고객 관리 및 마케팅 지원</span>
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.checkIcon} />
              <span>AI 기반 운영 인사이트</span>
            </li>
          </ul>

          <p className={styles.sub}>AI 기술로 매장 운영을 더 쉽고 효율적으로 관리하세요!</p>
        </div>
      </section>

      {/* 우측 로그인 */}
      <section className={styles.right}>
        <div className={styles.formWrap}>
          <h2 className={styles.formTitle}>AIGoYa</h2>
          <p className={styles.formDesc}>계정에 로그인하여 매장 관리를 시작하세요</p>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {/* 이메일 */}
            <label className={styles.label} htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@store.com"
              className={styles.input}
              {...register("email", { required: "이메일을 입력하세요." })}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}

            {/* 비밀번호 */}
            <label className={styles.label} htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className={styles.input}
              {...register("password", { required: "비밀번호를 입력하세요." })}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password.message}</span>
            )}

            <div className={styles.row}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>로그인 상태 유지</span>
              </label>
              <a className={styles.link} href="#">
                비밀번호 찾기
              </a>
            </div>

            <button className={styles.button} type="submit">
              로그인
            </button>

            <p className={styles.helper}>
              아직 계정이 없으신가요?{" "}
              <a className={styles.link} href="#">
                회원가입
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;