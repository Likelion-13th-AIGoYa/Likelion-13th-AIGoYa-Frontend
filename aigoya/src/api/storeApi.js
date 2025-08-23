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

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 토큰이 헤더에 추가되었습니다:', token.substring(0, 20) + '...');
        } else {
            console.warn('⚠️ 토큰이 없습니다. 로그인이 필요할 수 있습니다.');
        }
        
        return config;
    },
    (error) => {
        console.error('❌ 요청 인터셉터 에러:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 토큰 만료 등 에러 처리
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  }
);

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

// 가게 정보 수정 API 
export const updateMyStore = async (payload) => {
  try {
    const { data } = await api.put('/stores/me', payload);
    return data;
  } catch (error) {
    console.error('내 가게 정보 수정 API 호출 오류:', error);
    throw error;
  }
};

// 가게 탈퇴
export const deleteMyStore = async () => {
  try {
    const res = await api.delete('/stores/me');
    return res.data; // 서버가 바디 안 줄 수도 있음
  } catch (error) {
    console.error('회원탈퇴 API 호출 오류:', error);
    throw error;
  }
};


// 메뉴 목록 불러오기 (내 가게 상품 전체 가져오기)
export const getMenus = async () => {
  try {
    console.log('🔄 메뉴 불러오기 요청 시작...');
    console.log('📡 요청 URL:', `/stores/me/products`);
    
    const response = await api.get('/stores/me/products');
    console.log('✅ API 응답 성공:', response);
    console.log('📄 응답 데이터:', response.data);
    
    // 서버에서 받은 데이터 (카테고리 없음)
    const menuData = response.data;
    
    // 데이터가 배열인지 확인
    if (!Array.isArray(menuData)) {
      console.warn('⚠️ 응답 데이터가 배열이 아닙니다:', typeof menuData, menuData);
      throw new Error('서버 응답 형식이 올바르지 않습니다.');
    }
    
    // 카테고리별로 나누기 현재는 밥류로 모두 넣음
    const categorizedMenus = {
      '밥류': [],
      '국물요리': [],
      '음료': [],
      '주류': [],
      '디저트': []
    };

    // 서버 데이터를 모두 밥류에 넣기
    menuData.forEach((item, index) => {
      console.log(`📦 메뉴 항목 ${index + 1}:`, item);
      
      categorizedMenus['밥류'].push({
        id: item.productId,
        name: item.productName,
        price: item.price
      });
    });
    
    console.log('🎯 최종 변환된 메뉴:', categorizedMenus);
    return categorizedMenus;
  } catch (error) {
    console.error('❌ 메뉴 목록 API 오류:', error);
    console.error('🔍 에러 상세:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
};

// 메뉴 추가하기
export const addMenu = async (menuData) => {
  try {
    console.log('🔄 메뉴 추가 요청:', menuData);
    
    const response = await api.post('/stores/me/products', {
      name: menuData.name,
      price: menuData.price
    });
    
    console.log('✅ 메뉴 추가 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 메뉴 추가 API 오류:', error);
    throw error;
  }
};

// 메뉴 수정하기
export const updateMenu = async (productId, menuData) => {
  try {
    console.log('🔄 메뉴 수정 요청:', productId, menuData);
    
    const response = await api.put(`/stores/me/products/${productId}`, {
      name: menuData.name,
      price: menuData.price
    });
    
    console.log('✅ 메뉴 수정 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 메뉴 수정 API 오류:', error);
    throw error;
  }
};

// 메뉴 삭제하기
export const deleteMenu = async (productId) => {
  try {
    console.log('🔄 메뉴 삭제 요청:', productId);
    
    const response = await api.delete(`/stores/me/products/${productId}`);
    
    console.log('✅ 메뉴 삭제 완료');
    return response.data;
  } catch (error) {
    console.error('❌ 메뉴 삭제 API 오류:', error);
    throw error;
  }
};

// 특정 메뉴 조회
export const getMenuById = async (productId) => {
  try {
    console.log('🔄 메뉴 조회 요청:', productId);
    
    const response = await api.get(`/stores/me/products/${productId}`);
    
    console.log('✅ 메뉴 조회 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 메뉴 조회 API 오류:', error);
    throw error;
  }
};