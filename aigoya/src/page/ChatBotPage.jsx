// pages/chatBotPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from '../css/ChatBotPage.module.css';
import { getChatRooms, getChatHistory, sendChatMessage } from '../api/StoreApi';

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
    const [chatRooms, setChatRooms] = useState([]);
    const [currentChatRoomId, setCurrentChatRoomId] = useState(null);
    const messageEndRef = useRef(null);

    // 컴포넌트 마운트 시 채팅방 목록 로드
    useEffect(() => {
        loadChatRooms();

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

    // 채팅방 목록 로드
    const loadChatRooms = async () => {
        try {
            const rooms = await getChatRooms();
            setChatRooms(rooms);

            // 첫 번째 채팅방이 있으면 자동 선택, 없으면 새 채팅 시작
            if (rooms.length > 0) {
                switchToChatRoom(rooms[0].chatRoomId);
            } else {
                startNewChat();
            }
        } catch (error) {
            console.error('채팅방 목록 로드 실패:', error);
            startNewChat(); // 실패 시 새 채팅 시작
        }
    };

    // 새 채팅 시작
    const startNewChat = () => {
        setCurrentChatRoomId(null);
        setMessages([{ type: "bot", text: "안녕하세요! 매출 분석 어시스턴트입니다. 궁금한 점을 물어보세요." }]);
    };

    // 특정 채팅방으로 전환
    const switchToChatRoom = async (chatRoomId) => {
        try {
            setCurrentChatRoomId(chatRoomId);
            const history = await getChatHistory(chatRoomId);

            // API 응답을 채팅 UI 형식으로 변환
            const convertedMessages = [
                { type: "bot", text: "안녕하세요! 매출 분석 어시스턴트입니다. 궁금한 점을 물어보세요." }
            ];

            history.forEach(item => {
                convertedMessages.push({
                    type: item.role === "USER" ? "user" : "bot",
                    text: item.content,
                    createdAt: item.createdAt
                });
            });

            setMessages(convertedMessages);
        } catch (error) {
            console.error('채팅 히스토리 로드 실패:', error);
            setMessages([{ type: "bot", text: "채팅 기록을 불러올 수 없습니다." }]);
        }
    };

    const sendToAPI = async (msg, currentMessages, retryCount = 0) => {
        const maxRetries = 1; // 최대 1번 재시도

        try {
            const response = await sendChatMessage(currentChatRoomId, msg);

            // 새 채팅방이 생성된 경우 chatRoomId 업데이트 및 목록 갱신
            if (currentChatRoomId === null && response.chatRoomId) {
                setCurrentChatRoomId(response.chatRoomId);
                loadChatRooms(); // 채팅방 목록 다시 로드
            }

            const newMessages = [...currentMessages, { type: "bot", text: response.report }];
            setMessages(newMessages);
            setIsTyping(false); // 성공 시 로딩 해제
        } catch (error) {
            console.error(`API 호출 오류 (시도 ${retryCount + 1}/${maxRetries + 1}):`, error);

            // 재시도 가능한 경우 재시도
            if (retryCount < maxRetries) {
                console.log('재시도 중...');
                // 잠시 대기 후 재시도 (1초)
                setTimeout(() => {
                    sendToAPI(msg, currentMessages, retryCount + 1);
                }, 1000);
                return;
            }

            // 재시도 횟수 초과 시 오류 메시지 표시
            const errorMessages = [...currentMessages, { type: "bot", text: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요." }];
            setMessages(errorMessages);
            setIsTyping(false); // 오류 시에도 로딩 해제
        }
    };

    const handleSendMessage = (message = input) => {
        const trimmed = message.trim();
        if (!trimmed) return;

        const newMessages = [...messages, { type: "user", text: trimmed }];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true); // 로딩 시작
        sendToAPI(trimmed, newMessages); // 현재 메시지 상태 전달
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
                        onClick={startNewChat}
                    >
                        + 새 채팅
                    </button>
                </div>
                <div className={styles.chatList}>
                    {chatRooms
                        .slice()  // 원본 배열 보호
                        .reverse()  // 최근 채팅방부터 나오게
                        .map(room => (
                            <div
                                key={room.chatRoomId}
                                className={`${styles.chatItem} ${currentChatRoomId === room.chatRoomId ? styles.active : ''}`}
                                onClick={() => switchToChatRoom(room.chatRoomId)}
                            >
                                <div className={styles.chatTitle}>{room.title}</div>
                            </div>
                        ))}
                </div>
                <div className={styles.homeButton}>
                    <button
                        className={styles.backToHomeBtn}
                        onClick={() => navigate("/")}
                    >
                        ← 홈으로 돌아가기
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
