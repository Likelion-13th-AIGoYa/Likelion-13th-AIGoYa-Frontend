// components/mainChatBot.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../css/mainChatBot.module.css';

const MainChatBot = () => {
    const [inputValue, setInputValue] = useState("");
    const navigate = useNavigate();

    const quickQuestions = [
        "인기 메뉴 분석",
        "매출 트렌드",
        "오늘의 피드백",
        "개선 제안"
    ];

    const handleQuickQuestion = (question) => {
        navigate('/chatbot', {
            state: {
                initialMessage: question,
                isFromMainPage: true
            }
        });
    };

    const handleInputSubmit = () => {
        if (inputValue.trim() === "") return;
        navigate('/chatbot', {
            state: {
                initialMessage: inputValue,
                isFromMainPage: true
            }
        });
        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleInputSubmit();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.aiIcon}>AI</div>
                <div className={styles.headerContent}>
                    <h3 className={styles.title}>매출 분석 어시스턴트</h3>
                    <p className={styles.subtitle}>실시간 분석 중</p>
                </div>
            </div>

            <div className={styles.description}>
                오늘 매출 분석을 완료했습니다. 점심 시간대 매출이 가장 높았고, 인기 메뉴는 불고기 정식과 김치찌개입니다. <br/>추가적인 질문이나 피드백이 있으시면 언제든지 말씀해 주세요.
            </div>

            <div className={styles.quickButtons}>
                {quickQuestions.map((question, index) => (
                    <button
                        key={index}
                        className={styles.quickButton}
                        onClick={() => handleQuickQuestion(question)}
                    >
                        {question}
                    </button>
                ))}
            </div>

            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="매출 및 운영에 대해 궁금한 점을 물어보세요..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                />
                <button
                    className={styles.sendButton}
                    onClick={handleInputSubmit}
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default MainChatBot;
