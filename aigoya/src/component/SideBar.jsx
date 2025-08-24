import React from 'react';
import { X, Home, Bot, BarChart3, Menu as  Users, LogOut, Monitor, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/SideBar.module.css';
import logo from "../image/mainLogoRemoveWhite.png";

const SideBar = ({ isMenuOpen, setIsMenuOpen, handleLogout }) => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: Home, text: '대시보드', path: '/main' },
        { icon: Bot, text: '챗봇', path: '/main' },
        { icon: BarChart3, text: '매출 관리', path: '/main' },
        { icon: Users, text: '직원 관리', path: '/main' },
    ];

    const handleMenuClick = (item) => {
        if (item.path) {
            navigate(item.path);
            setIsMenuOpen(false); // 메뉴 클릭 시 사이드바 닫기
        }
    };

    const handlePosStart = () => {
        navigate('/posMachine')
        setIsMenuOpen(false);
    };

    const handleMyPage = () => {
        navigate('/main/mypage')
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* 사이드 메뉴 */}
            <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}>
                <div className={styles.menuHeader}>
                    <img src={logo} alt='logo' className={styles.hederLogo} />
                    <button
                        className={styles.closeButton}
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="메뉴 닫기"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.menuBody}>
                    {/* POS 시작 버튼 */}
                    <div className={styles.posSection}>
                        <button className={styles.posButton} onClick={handlePosStart}>
                            <Monitor size={20} className={styles.posIcon} />
                            <span>POS 시작하기</span>
                        </button>
                    </div>

                    <nav className={styles.menuContent}>
                        {menuItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={index}
                                    className={styles.menuItem}
                                    onClick={() => handleMenuClick(item)}
                                >
                                    <IconComponent size={18} className={styles.menuIcon} />
                                    <span>{item.text}</span>
                                </div>
                            );
                        })}
                    </nav>

                    {/* 로그아웃 버튼을 가장 아래에 고정 */}
                    <div className={styles.bottomSection}>
                        <div className={styles.menuItem} onClick={handleMyPage}>
                            <User size={18} className={styles.menuIcon} />
                            <span>마이페이지</span>
                        </div>
                        <div className={styles.logoutItem} onClick={handleLogout}>
                            <LogOut size={18} className={styles.menuIcon} />
                            <span>로그아웃</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 메뉴 열렸을 때 배경 오버레이 */}
            {isMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    );
};

export default SideBar;
