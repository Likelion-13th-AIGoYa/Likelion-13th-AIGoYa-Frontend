import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3 } from 'lucide-react';
import styles from '../css/Header.module.css';
import { useNavigate } from "react-router-dom";
import SideBar from './SideBar';
import logo from "../image/mainLogoRemove.png";


const MOTD_BOSS = [
  "오늘도 불 앞에서는 집중을, 손님 앞에서는 미소를, 계산대 앞에서는 정직을 지킵니다. 작은 준비 한 가지가 내일의 재방문을 만들고, 꾸준한 일관성이 우리 가게의 평판을 단단하게 세웁니다.",
  "매출표의 숫자가 마음을 흔들어도 기준은 흔들지 않습니다. 신선한 재료와 정돈된 동선, 약속된 레시피와 부드러운 응대가 쌓이면, 조용한 하루가 다음 주의 바쁜 하루로 바뀝니다.",
  "비 오는 날엔 더 따뜻하게, 맑은 날엔 더 산뜻하게, 어떤 날에도 기본은 같게 합니다. 한 접시의 온도 1도와 간 1그램을 지켜내는 집이 결국 단골의 일정을 바꾸는 집이 됩니다.",
  "광고보다 신뢰가 오래가고, 이벤트보다 일관성이 강합니다. 오늘의 청결과 칼같은 원가 관리, 친절한 한마디와 정확한 계산이 내일의 리뷰와 추천을 키웁니다.",
  "손님이 많아도 서두르지 않고, 손님이 적어도 풀 죽지 않습니다. 준비된 재고와 정리된 주방, 맞춘 타이밍과 침착한 응대가 피크타임을 기회로 바꿉니다.",
  "잠깐의 실수는 메모로 남기고, 같은 실수는 시스템으로 막습니다. 체크리스트 한 장과 사전 준비 10분이 불량을 줄이고, 퇴근 후 피곤함 대신 뿌듯함을 남깁니다.",
  "한 분의 불만은 배움의 선물이고, 한 줄의 칭찬은 에너지의 연료입니다. 귀를 열고 레시피와 동선을 다듬다 보면, 오늘의 약점이 내일의 강점으로 바뀝니다.",
  "우리는 속도가 아니라 품질로 기억됩니다. 식재의 선도, 조리의 온도, 제공의 속도, 응대의 온도가 모두 맞아떨어질 때, 가격 이상의 가치가 완성됩니다.",
  "바쁜 순간일수록 기본을 더 단단히 붙잡습니다. 손 씻기와 도마 교차 사용 금지, 주기적인 맛 보기와 타이머 점검이 한 끼의 신뢰를 보증합니다.",
  "가게의 표준은 어제의 우리보다 조금 더 나아지는 것입니다. 메뉴 사진을 실제와 가깝게, 간판 불을 시간에 맞게, 안내 문구를 보기 쉽게 고치면, 작은 변화가 큰 결과를 만듭니다.",
  "첫 방문은 호기심이 만들고, 두 번째 방문은 만족이 만들며, 세 번째 방문은 신뢰가 만듭니다. 우리는 오늘 그 신뢰의 첫 단추를 정확히 끼웁니다.",
  "매출이 아닌 관계를 쌓습니다. 이름을 기억하고 알레르기를 묻고 취향을 메모하면, 주문이 편해지고 대화가 편해지고 하루가 편해집니다.",
  "힘이 빠지는 저녁에도 초심을 떠올립니다. 문을 연 용기, 불을 지킨 인내, 설거지까지 끝내는 성실이 모이면, 결국 우리의 날과 우리의 고객이 더 선명해집니다."
];




const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [motd, setMotd] = useState("");
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("storeId");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("storeId");

    navigate("/", { replace: true });
  };


  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    setMotd(MOTD_BOSS[(Math.random() * MOTD_BOSS.length) | 0]);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\. /g, '.').replace('. ', ' ');
  };

  return (
    <>
      {/* 헤더 컨테이너 - 두 줄 포함 */}
      <div className={styles.headerWrapper}>

        {/* 첫 번째 줄 - 흰색 배경 */}
        <header className={styles.headerTop}>
          <div className={styles.headerTopContainer}>
            {/* 왼쪽: 메뉴 버튼과 로고 */}
            <div className={styles.leftSection}>
              <button
                className={styles.menuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="메뉴"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className={styles.logo}>
                <img src={logo} alt='logo' className={styles.hederLogo} />
              </div>
            </div>

            {/* 오른쪽: 매장명과 시간 */}
            <div className={styles.rightSection}>
              <div className={styles.storeInfo}>
                <span className={styles.storeName}>맛있는집</span>
              </div>
              <span className={styles.divider}>|</span>
              <div className={styles.timeContainer}>
                <span className={styles.time}>{formatTime(currentTime)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 두 번째 줄 - 파란색 배경 (리뷰 알림) */}
        <div className={styles.headerBottom}>
          <div className={styles.notificationContainer}>
              <span className={styles.notificationText}>{motd}</span>
          </div>
        </div>
      </div>

      {/* 사이드바 컴포넌트 */}
      <SideBar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        handleLogout={handleLogout}
      />
    </>
  )
};

export default Header;
