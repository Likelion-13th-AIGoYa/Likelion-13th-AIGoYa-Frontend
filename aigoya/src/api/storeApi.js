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

// 요청 인터셉터 - 모든 요청에 토큰 자동 추가
api.interceptors.request.use(
    (config) => {
        // Local Storage에서 토큰 가져오기
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        
        if (token) {
            // Authorization 헤더에 토큰 추가
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
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.warn('🚫 인증 실패 - 토큰이 만료되었거나 유효하지 않습니다.');
             window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 메뉴 목록 불러오기 (카테고리별 분류)
export const getMenus = async () => {
  try {
    console.log('🔄 메뉴 불러오기 요청 시작...');
    
    const response = await api.get('/stores/me/products');
    console.log('✅ API 응답 성공:', response.data);
    
    const menuData = response.data;
    
    if (!Array.isArray(menuData)) {
      console.warn('⚠️ 응답 데이터가 배열이 아닙니다:', typeof menuData, menuData);
      throw new Error('서버 응답 형식이 올바르지 않습니다.');
    }
    
    // 카테고리별로 메뉴 분류
    const categorizedMenus = {};
    
    menuData.forEach((item, index) => {
      console.log(`📦 메뉴 항목 ${index + 1}:`, item);
      
      const categoryName = item.category?.name || '기타';
      
      if (!categorizedMenus[categoryName]) {
        categorizedMenus[categoryName] = [];
      }
      
      categorizedMenus[categoryName].push({
        id: item.productId,
        name: item.productName,
        price: item.price,
        categoryId: item.category?.id
      });
    });
    
    console.log('🎯 최종 변환된 메뉴:', categorizedMenus);
    return categorizedMenus;
  } catch (error) {
    console.error('❌ 메뉴 목록 API 오류:', error);
    throw error;
  }
};

// 메뉴 추가하기 (카테고리 지원)
export const addMenu = async (menuData) => {
  try {
    console.log('🔄 메뉴 추가 요청:', menuData);
    
    const response = await api.post('/stores/me/products', {
      name: menuData.name,
      price: menuData.price,
      categoryId: menuData.categoryId
    });
    
    console.log('✅ 메뉴 추가 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 메뉴 추가 API 오류:', error);
    throw error;
  }
};

// 메뉴 수정하기 (카테고리 지원)
export const updateMenu = async (productId, menuData) => {
  try {
    console.log('🔄 메뉴 수정 요청:', productId, menuData);
    
    const response = await api.put(`/stores/me/products/${productId}`, {
      name: menuData.name,
      price: menuData.price,
      categoryId: menuData.categoryId
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
export const getMenuDetails = async (productId) => {
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

// ===== 주문 관리 API =====

// 주문 생성 (결제하기)
export const createOrder = async (orderItems) => {
  try {
    console.log('🔄 주문 생성 요청:', orderItems);
    
    const orderProducts = orderItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    const requestData = {
      orderProducts: orderProducts,
      orderedAt: new Date().toISOString()
    };

    const response = await api.post('/stores/me/orders', requestData);
    console.log('✅ 주문 생성 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 주문 생성 API 오류:', error);
    throw error;
  }
};

// 주문 목록 조회
export const getOrders = async () => {
  try {
    console.log('🔄 주문 목록 조회 요청');
    
    const response = await api.get('/stores/me/orders');
    console.log('✅ 주문 목록 조회 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 주문 목록 조회 API 오류:', error);
    throw error;
  }
};

// 특정 주문 조회
export const getOrderById = async (orderId) => {
  try {
    console.log('🔄 특정 주문 조회 요청:', orderId);
    
    const response = await api.get(`/stores/me/orders/${orderId}`);
    console.log('✅ 특정 주문 조회 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 특정 주문 조회 API 오류:', error);
    throw error;
  }
};

// 주문 수정
export const updateOrder = async (orderId, orderData) => {
  try {
    console.log('🔄 주문 수정 요청:', orderId, orderData);
    
    const response = await api.put(`/stores/me/orders/${orderId}`, orderData);
    console.log('✅ 주문 수정 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 주문 수정 API 오류:', error);
    throw error;
  }
};

// 주문 삭제 (취소)
export const cancelOrder = async (orderId) => {
  try {
    console.log('🔄 주문 취소 요청:', orderId);
    
    const response = await api.delete(`/stores/me/orders/${orderId}`);
    console.log('✅ 주문 취소 완료');
    return response.data;
  } catch (error) {
    console.error('❌ 주문 취소 API 오류:', error);
    throw error;
  }
};

// ===== 카테고리 관리 API =====

// 카테고리 목록 조회
export const getCategories = async () => {
  try {
    console.log('🔄 카테고리 목록 조회 요청');
    
    const response = await api.get('/stores/me/categories');
    console.log('✅ 카테고리 목록 조회 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 카테고리 목록 조회 API 오류:', error);
    throw error;
  }
};

// 카테고리 생성
export const createCategory = async (categoryData) => {
  try {
    console.log('🔄 카테고리 생성 요청:', categoryData);
    
    const response = await api.post('/stores/me/categories', {
      name: categoryData.name
    });
    
    console.log('✅ 카테고리 생성 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 카테고리 생성 API 오류:', error);
    throw error;
  }
};

// 카테고리 수정
export const updateCategory = async (categoryId, categoryData) => {
  try {
    console.log('🔄 카테고리 수정 요청:', categoryId, categoryData);
    
    const response = await api.put(`/stores/me/categories/${categoryId}`, {
      name: categoryData.name
    });
    
    console.log('✅ 카테고리 수정 완료');
    return response.data;
  } catch (error) {
    console.error('❌ 카테고리 수정 API 오류:', error);
    throw error;
  }
};

// 카테고리 삭제
export const deleteCategory = async (categoryId) => {
  try {
    console.log('🔄 카테고리 삭제 요청:', categoryId);
    
    const response = await api.delete(`/stores/me/categories/${categoryId}`);
    
    console.log('✅ 카테고리 삭제 완료');
    return response.data;
  } catch (error) {
    console.error('❌ 카테고리 삭제 API 오류:', error);
    throw error;
  }
};
