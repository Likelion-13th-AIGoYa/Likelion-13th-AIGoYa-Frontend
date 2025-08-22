// src/api/productManagementApi.js
import axios from 'axios';

const API_BASE_URL = 'https://aigoya.elroy.kr/v1';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10초 제한
});

// 메뉴 목록 불러오기 (내 가게 상품 전체 가져오기)
export const getMenus = async () => {
  try {
    const response = await api.get('/stores/me/products');
    
    // 서버에서 받은 데이터 (카테고리 없음)
    const menuData = response.data;
    
    // 로컬스토리지에서 카테고리 매핑 정보 가져오기
    const categoryMapping = JSON.parse(localStorage.getItem('menuCategoryMapping') || '{}');
    
    // 카테고리별로 정리된 객체 생성
    const categorizedMenus = {
      '밥류': [],
      '국물요리': [],
      '음료': [],
      '주류': [],
      '디저트': []
    };

    // 서버 데이터를 카테고리별로 분류 (로컬 매핑 사용)
    menuData.forEach(item => {
      const category = categoryMapping[item.productId] || '밥류'; // 기본값 설정
      if (categorizedMenus[category]) {
        categorizedMenus[category].push({
          id: item.productId,
          name: item.productName,
          price: item.price,
          category: category // 프론트엔드에서 관리하는 카테고리
        });
      }
    });

    return categorizedMenus;
  } catch (error) {
    console.error('메뉴 목록 API 오류:', error);
    throw error;
  }
};

// 메뉴 추가하기 (카테고리는 로컬에서만 관리)
export const addMenu = async (menuData) => {
  try {
    const response = await api.post('/stores/me/products', {
      name: menuData.name,
      price: menuData.price
      // category는 서버에 보내지 않음
    });
    
    // 카테고리 매핑을 로컬스토리지에 저장
    const categoryMapping = JSON.parse(localStorage.getItem('menuCategoryMapping') || '{}');
    categoryMapping[response.data.productId] = menuData.category;
    localStorage.setItem('menuCategoryMapping', JSON.stringify(categoryMapping));
    
    return {
      ...response.data,
      category: menuData.category // 응답에 카테고리 추가
    };
  } catch (error) {
    console.error('메뉴 추가 API 오류:', error);
    throw error;
  }
};

// 메뉴 수정하기 (카테고리는 로컬에서만 관리)
export const updateMenu = async (productId, menuData) => {
  try {
    const response = await api.put(`/stores/me/products/${productId}`, {
      name: menuData.name,
      price: menuData.price
      // category는 서버에 보내지 않음
    });
    
    // 카테고리 매핑 업데이트
    if (menuData.category) {
      const categoryMapping = JSON.parse(localStorage.getItem('menuCategoryMapping') || '{}');
      categoryMapping[productId] = menuData.category;
      localStorage.setItem('menuCategoryMapping', JSON.stringify(categoryMapping));
    }
    
    return response.data;
  } catch (error) {
    console.error('메뉴 수정 API 오류:', error);
    throw error;
  }
};

// 메뉴 삭제하기
export const deleteMenu = async (productId) => {
  try {
    const response = await api.delete(`/stores/me/products/${productId}`);
    
    // 로컬 카테고리 매핑에서도 제거
    const categoryMapping = JSON.parse(localStorage.getItem('menuCategoryMapping') || '{}');
    delete categoryMapping[productId];
    localStorage.setItem('menuCategoryMapping', JSON.stringify(categoryMapping));
    
    return response.data;
  } catch (error) {
    console.error('메뉴 삭제 API 오류:', error);
    throw error;
  }
};

// 특정 메뉴 조회
export const getMenuById = async (productId) => {
  try {
    const response = await api.get(`/stores/me/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('메뉴 조회 API 오류:', error);
    throw error;
  }
};