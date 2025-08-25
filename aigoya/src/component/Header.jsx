import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3 } from 'lucide-react';
import styles from '../css/Header.module.css';
import { useNavigate } from "react-router-dom";
import SideBar from './SideBar';
import logo from "../image/mainLogoRemove.png";


const MOTD_BOSS = [
  "속도보다 꾸준함으로 가게를 지킵니다. 오늘 1%의 개선이 모여 내일의 매출과 평판을 만듭니다—급하지 않되 멈추지 않습니다.",
  "손님 한 분의 방문에 희망 한 스푼을 더합니다. 한 숟가락의 정성과 한 마디의 친절이 다시 찾아오는 발걸음을 준비합니다.",
  "어제의 땀방울은 오늘의 매출표로 돌아옵니다. 보이지 않는 노력과 반복된 연습이 결국 가게의 실력을 증명합니다.",
  "묵묵함이 우리 무기입니다. 보이지 않는 청결, 흔들리지 않는 레시피, 변함없는 인사가 신뢰를 쌓고 단골을 만듭니다.",
  "작은 칭찬 한 줄이 큰 에너지가 됩니다. 감사의 마음을 담아 오늘도 첫 손님처럼, 마지막 손님까지 같은 품질로 응대합니다.",
  "위기는 디테일로 이깁니다. 불의 세기 1칸, 간 1g, 응대 1초의 차이가 재방문과 추천을 만드는 결정적 차이가 됩니다.",
  "번아웃이 밀려와도 성실로 균형을 잡습니다. 잠깐 숨 고르고 다시 페이스를 회복하면, 어제의 나보다 단단한 오늘이 됩니다.",
  "발걸음이 적은 날에도 진심은 가득 담습니다. 한 분의 만족이 내일의 흐름을 바꾸고 조용한 입소문이 큰 파도를 만듭니다.",
  "재료는 신선하게, 마음은 따뜻하게 유지합니다. 허기를 채우는 한 끼를 넘어 위로가 되는 시간을 그릇에 담아 내어드립니다.",
  "단골은 이벤트가 아닌 일관성의 결과물입니다. 늘 같은 맛, 같은 친절, 같은 가격으로 신뢰를 쌓아 관계를 키워갑니다.",
  "오늘도 나의 최고 기록을 갱신합니다. 더 빨라지기보다 더 정확하게, 더 크게 보이기보다 더 진심으로 한 접시에 집중합니다.",
  "흔들릴 수는 있어도 포기하지 않습니다. 중심을 지키며 한 걸음씩 전진하면, 결국 우리의 날과 우리의 고객이 분명해집니다."
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
