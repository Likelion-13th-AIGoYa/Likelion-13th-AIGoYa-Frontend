// pages/chatBotPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from '../css/ChatBotPage.module.css';

const defaultSuggestions = [
    "오늘 매출 요약 보여줘",
    "최근 인기 메뉴 알려줘",
    "경쟁점과 비교 결과",
    "다음 달 매출 전망",
    "피크 시간대 분석",
    "주요 개선 포인트"
];

const menuButtons = [
    { label: "매출 분석 홈", link: "/" },
    { label: "트렌드 리포트", link: "#" },
    { label: "피드백 내역", link: "#" }
];

const ChatBotPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const messageEndRef = useRef(null);

    useEffect(() => {
        const initialMsgs = [
            { type: "bot", text: "안녕하세요! 매출 분석 어시스턴트입니다. 궁금한 점을 물어보세요." }
        ];
        if (location.state?.initialMessage) {
            initialMsgs.push({ type: "user", text: location.state.initialMessage });
        }
        setMessages(initialMsgs);

        if (location.state?.initialMessage) {
            sendToAPI(location.state.initialMessage);
        }
        // eslint-disable-next-line
    }, [location.state]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // 실제 API와 연동하기 위한 준비 함수
    const sendToAPI = async (msg) => {
        setIsTyping(true);
        // API 예시 (실제 API 주소로 대체 필요)
        try {
            // const res = await fetch('/api/chat', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ message: msg })
            // });
            // const data = await res.json();
            // setMessages(prev => [...prev, {type: "bot", text: data.answer}]);

            // 아래는 PRESENTATION용 더미 처리 (API 연결 전)
            setTimeout(() => {
                setMessages(prev => [...prev, { type: "bot", text: `[API 응답] ${msg}에 대한 분석 결과입니다.` }]);
                setIsTyping(false);
            }, 1300);
        } catch (e) {
            setMessages(prev => [...prev, { type: "bot", text: "응답 중 오류가 발생했습니다." }]);
            setIsTyping(false);
        }
    };

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        setMessages(prev => [...prev, { type: "user", text: trimmed }]);
        setInput("");
        sendToAPI(trimmed);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleDropdownSuggestion = (suggestion) => {
        setInput(suggestion);
        setDropdownOpen(false);
    };

    return (
        <div className={styles.outer}>
            {/* 메뉴바 */}
            <nav className={styles.menuBar}>
                <div className={styles.menuTitle}>AI 매출 분석 · 어시스턴트</div>
                <div className={styles.menuBtns}>
                    {menuButtons.map(btn => (
                        <button
                            key={btn.label}
                            className={styles.menuBtn}
                            onClick={() => btn.link === "/" ? navigate("/") : alert("아직 준비중 입니다.")}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* 챗봇 영역 */}
            <div className={styles.container}>
                <div className={styles.chatHeader}>
                    <div className={styles.aiIcon}>AI</div>
                    <div>
                        <span className={styles.title}>매출 분석 어시스턴트</span>
                        <span className={styles.subtitle}>· 실시간 분석</span>
                    </div>
                </div>
                <div className={styles.messageArea}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={msg.type === "user" ? styles.userMessage : styles.botMessage}
                        >
                            <div className={styles.msgInner}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className={styles.botMessage}>
                            <div className={styles.msgInner}>
                                <span className={styles.typingDot}></span>
                                <span className={styles.typingDot}></span>
                                <span className={styles.typingDot}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messageEndRef} />
                </div>
                {/* 추천 질문 드롭다운 */}
                <div className={styles.inputArea}>
                    <div className={styles.dropdownWrapper}>
                        <button
                            className={styles.dropdownBtn}
                            onClick={() => setDropdownOpen(v => !v)}
                        >
                            ▲ 추천질문
                        </button>
                        {dropdownOpen && (
                            <div className={styles.dropdown}>
                                {defaultSuggestions.map(sg => (
                                    <div
                                        key={sg}
                                        className={styles.dropdownItem}
                                        onClick={() => handleDropdownSuggestion(sg)}
                                    >
                                        {sg}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="질문을 입력해 주세요..."
                        className={styles.input}
                        rows={1}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={handleSend}
                        disabled={!input.trim()}
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBotPage;
