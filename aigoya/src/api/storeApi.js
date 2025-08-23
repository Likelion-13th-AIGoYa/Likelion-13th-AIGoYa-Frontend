// src/api/storeApi.js
import axios from 'axios';

const API_BASE_URL = 'https://aigoya-api.elroy.kr/v1';

// axios 인스턴스 생성 (옵션)
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10초 타임아웃
});


api.interceptors.request.use((config) => {
    const token =
        sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 확인 로그
    console.log("요청 보낼 헤더:", config.headers);

    return config;
}, (error) => {
    return Promise.reject(error);
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


// 가게 로그인 API
export const loginStore = async (loginData) => {
    try {
        const response = await api.post('/stores/login', loginData);
        return response.data;
    } catch (error) {
        console.error('로그인 API 호출 오류:', error);
        throw error;
    }
};

// 가게 정보 조회 API
export const getMyStore = async () => {
    try {
        const response = await api.get('/stores/me');
        return response.data;
    } catch (error) {
        console.error('내 가게 정보 조회 API 호출 오류:', error);
        throw error;
    }
};