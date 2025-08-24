// pages/chatBotPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from '../css/ChatBotPage.module.css';
import { getMyStore } from '../api/StoreApi';

const defaultSuggestions = [
    "오늘 매출 요약 보여줘",
    "최근 인기 메뉴 알려줘",
    "경쟁점과 비교 결과",
    "다음 달 매출 전망",
    "피크 시간대 분석",
    "주요 개선 포인트"
];

const ChatBotPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [chatSessions, setChatSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [storeInfo, setStoreInfo] = useState(null);
    const messageEndRef = useRef(null);

    useEffect(() => {
        // 가게 정보 가져오기
        const fetchStoreInfo = async () => {
            try {
                const data = await getMyStore();
                setStoreInfo(data);
            } catch (error) {
                console.error('가게 정보 조회 실패:', error);
            }
        };
        fetchStoreInfo();

        // 새로운 채팅 세션 시작
        startNewSession();

        // 초기 메시지 설정
        const initialMessage = location.state?.initialMessage;
        if (initialMessage) {
            setTimeout(() => {
                handleSendMessage(initialMessage);
            }, 100);
        }
    }, [location.state]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const startNewSession = () => {
        const newSessionId = Date.now();
        const newSession = {
            id: newSessionId,
            title: "새로운 채팅",
            messages: [{ type: "bot", text: "안녕하세요! 매출 분석 어시스턴트입니다. 궁금한 점을 물어보세요." }],
            timestamp: new Date()
        };
        
        setChatSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSessionId);
        setMessages(newSession.messages);
    };

    const switchToSession = (sessionId) => {
        const session = chatSessions.find(s => s.id === sessionId);
        if (session) {
            setCurrentSessionId(sessionId);
            setMessages(session.messages);
        }
    };

    const updateCurrentSession = (newMessages) => {
        setChatSessions(prev => prev.map(session => {
            if (session.id === currentSessionId) {
                return {
                    ...session,
                    messages: newMessages,
                    title: newMessages[1]?.text?.substring(0, 30) + "..." || "새로운 채팅"
                };
            }
            return session;
        }));
    };

    const sendToAPI = async (msg) => {
        if (!storeInfo?.storeId) {
            setMessages(prev => [...prev, { type: "bot", text: "가게 정보를 불러올 수 없습니다. 다시 로그인해주세요." }]);
            return;
        }

        setIsTyping(true);
        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    message: msg
                }),
                params: {
                    storeId: storeInfo.storeId
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const newMessages = [...messages, { type: "bot", text: data.result }];
            setMessages(newMessages);
            updateCurrentSession(newMessages);
        } catch (error) {
            console.error('API 호출 오류:', error);
            const errorMessages = [...messages, { type: "bot", text: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요." }];
            setMessages(errorMessages);
            updateCurrentSession(errorMessages);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = (message = input) => {
        const trimmed = message.trim();
        if (!trimmed) return;
        
        const newMessages = [...messages, { type: "user", text: trimmed }];
        setMessages(newMessages);
        updateCurrentSession(newMessages);
        setInput("");
        sendToAPI(trimmed);
    };

    const handleSend = () => {
        handleSendMessage();
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
        <div className={styles.container}>
            {/* 좌측 사이드바 - 채팅 기록 */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3>채팅 기록</h3>
                    <button 
                        className={styles.newChatBtn}
                        onClick={startNewSession}
                    >
                        + 새 채팅
                    </button>
                </div>
                <div className={styles.chatList}>
                    {chatSessions.map(session => (
                        <div
                            key={session.id}
                            className={`${styles.chatItem} ${currentSessionId === session.id ? styles.active : ''}`}
                            onClick={() => switchToSession(session.id)}
                        >
                            <div className={styles.chatTitle}>{session.title}</div>
                            <div className={styles.chatTime}>
                                {session.timestamp.toLocaleTimeString('ko-KR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.homeButton}>
                    <button 
                        className={styles.backToHomeBtn}
                        onClick={() => navigate("/")}
                    >
                        ← 매출 분석 홈으로
                    </button>
                </div>
            </div>

            {/* 우측 메인 채팅 영역 */}
            <div className={styles.mainChat}>
                <div className={styles.chatHeader}>
                    <div className={styles.aiIcon}>AI</div>
                    <div>
                        <span className={styles.title}>매출 분석 어시스턴트</span>
                        <span className={styles.subtitle}>실시간 분석</span>
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

                {/* 입력 영역 */}
                <div className={styles.inputArea}>
                    <div className={styles.dropdownWrapper}>
                        <button
                            className={styles.dropdownBtn}
                            onClick={() => setDropdownOpen(v => !v)}
                        >
                            💡 추천질문
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
                    <div className={styles.inputWrapper}>
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
                            disabled={!input.trim() || isTyping}
                        >
                            전송
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBotPage;
