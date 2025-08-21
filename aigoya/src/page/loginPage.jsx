import React, { useState, useRef, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../css/loginPage.module.css";
import { AnimatePresence, motion } from "framer-motion";
import SignUpPage from "../page/signUpPage"; 

const dummyUser = { email: "test@store.com", password: "1234" };

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 로그인 또는 회원가입 상태 관리
  const [signedUpEmail, setSignedUpEmail] = useState(""); // 회원가입한 이메일 저장

  // 방향감 계산
  const prev = useRef(mode);
  const dir =
    prev.current === "login" && mode === "signup" ? "forward" :
    prev.current === "signup" && mode === "login" ? "backward" : "forward";
  useEffect(() => { prev.current = mode; }, [mode]);

  // 애니메이션
  const variants = {
    enter: (d) => ({ x: d === "forward" ? 40 : -40, opacity: 0, filter: "blur(2px)" }),
    center: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.28 } },
    exit: (d) => ({ x: d === "forward" ? -40 : 40, opacity: 0, filter: "blur(2px)", transition: { duration: 0.22 } }),
  };

  const {
    register, handleSubmit, setValue,
    formState: { errors }, setError
  } = useForm();

  // 회원가입 완료 후 로그인 화면으로 복귀하면서 이메일 자동 입력
  const handleSignUpComplete = (email) => {
    setSignedUpEmail(email);
    setMode("login");
    // 약간의 지연 후 이메일 값 설정 (애니메이션 완료 후)
    setTimeout(() => {
      setValue("email", email);
    }, 300);
  };

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
            <li className={styles.listItem}><FiCheckCircle className={styles.checkIcon} /><span>실시간 매출 분석 및 통계</span></li>
            <li className={styles.listItem}><FiCheckCircle className={styles.checkIcon} /><span>트렌드 기반 메뉴/상품 추천</span></li>
            <li className={styles.listItem}><FiCheckCircle className={styles.checkIcon} /><span>고객 관리 및 마케팅 지원</span></li>
            <li className={styles.listItem}><FiCheckCircle className={styles.checkIcon} /><span>AI 기반 운영 인사이트</span></li>
          </ul>

          <p className={styles.sub}>AI 기술로 매장 운영을 더 쉽고 효율적으로 관리하세요!</p>
        </div>
      </section>

      {/* 우측 카드 */}
      <section className={styles.right}>
        <div className={styles.formWrap}>
          <h2 className={styles.formTitle}>AIGoYa</h2>
          <p className={styles.formDesc}>
            {mode === "login" ? "계정에 로그인하여 매장 관리를 시작하세요" : "새 계정을 만들고 바로 시작하세요"}
          </p>

          {/* 여기만 애니메이션 교체 */}
          <div className={styles.viewSlot}>
            <AnimatePresence mode="wait" custom={dir}>
              {mode === "login" ? (
                <motion.div
                  key="login"
                  className={styles.view}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <label className={styles.label} htmlFor="email">이메일</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="example@store.com"
                      className={styles.input}
                      defaultValue={signedUpEmail} // 회원가입한 이메일을 기본값으로 설정
                      {...register("email", { required: "이메일을 입력하세요." })}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}

                    <label className={styles.label} htmlFor="password">비밀번호</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      className={styles.input}
                      {...register("password", { required: "비밀번호를 입력하세요." })}
                    />
                    {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}

                    <div className={styles.row}>
                      <label className={styles.checkbox}>
                        <input type="checkbox" />
                        <span>로그인 상태 유지</span>
                      </label>
                      <a className={styles.link} href="#">비밀번호 찾기</a>
                    </div>

                    <button className={styles.button} type="submit">로그인</button>

                    <p className={styles.helper}>
                      아직 계정이 없으신가요?{" "}
                      {/* a 태그 대신 버튼으로 모드 전환 */}
                      <button type="button" className={styles.linkBtn} onClick={() => setMode("signup")}>
                        회원가입
                      </button>
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  className={styles.view}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {/* 회원가입 폼: 완료 시 로그인 화면으로 복귀 */}
                  <SignUpPage onDone={handleSignUpComplete} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
