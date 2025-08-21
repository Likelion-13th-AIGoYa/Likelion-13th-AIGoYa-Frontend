// src/api/storeApi.js
import axios from 'axios';

const API_BASE_URL = 'https://aigoya.elroy.kr/v1';

// axios 인스턴스 생성 (옵션)
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10초 타임아웃
});

// 가게 생성(회원가입) API
export const createStore = async (storeData) => {
    try {
        const response = await api.post('/stores/create', storeData);
        return response.data;
    } catch (error) {
        console.error('가게 생성 API 호출 오류:', error);
        throw error;
    }
};