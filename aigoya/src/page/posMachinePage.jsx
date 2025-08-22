import React, { useState, useEffect } from 'react';

const PosMachinePage = ({ storeId = 1 }) => {
  const [selectedCategory, setSelectedCategory] = useState('밥류');
  const [orderItems, setOrderItems] = useState([]);

  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  
  // 카테고리 매핑 (메모리에서만 관리)
  const [categoryMapping, setCategoryMapping] = useState({});
  
  // 폼 데이터
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    category: '밥류'
  });

  // 수정할 메뉴 임시 저장
  const [editingMenus, setEditingMenus] = useState({});

  // 카테고리 목록
  const categories = ['밥류', '국물요리', '음료', '주류', '디저트'];

  // 메뉴 아이템
  const [menuItems, setMenuItems] = useState({
    '밥류': [],
    '국물요리': [],
    '음료': [],
    '주류': [],
    '디저트': []
  });

  // 현재 API 호출 시뮬레이션 (실제로는 import해서 사용)
  const mockApiCall = (url, method = 'GET', data = null) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (method === 'GET' && url === '/stores/me/products') {
          // 샘플 데이터 (카테고리 없음)
          resolve({
            data: [
              { productId: 1, productName: '김치찌개', price: 8000 },
              { productId: 2, productName: '된장찌개', price: 7000 },
              { productId: 3, productName: '비빔밥', price: 9000 },
              { productId: 4, productName: '콜라', price: 2000 },
              { productId: 5, productName: '맥주', price: 4000 }
            ]
          });
        } else if (method === 'POST') {
          resolve({
            data: {
              productId: Date.now(),
              productName: data.name,
              price: data.price
            }
          });
        } else if (method === 'DELETE') {
          resolve({ data: { success: true } });
        } else if (method === 'PUT') {
          resolve({
            data: {
              productId: url.split('/').pop(),
              productName: data.name,
              price: data.price
            }
          });
        }
      }, 500);
    });
  };

  // ===== 서버에서 메뉴 불러오기 =====
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출 시뮬레이션
        const response = await mockApiCall('/stores/me/products');
        const menuData = response.data;
        
        // 기본 카테고리 매핑 설정 (처음 로드 시)
        const defaultMapping = {
          1: '국물요리', // 김치찌개
          2: '국물요리', // 된장찌개  
          3: '밥류',     // 비빔밥
          4: '음료',     // 콜라
          5: '주류'      // 맥주
        };
        
        setCategoryMapping(prev => ({ ...defaultMapping, ...prev }));
        
        // 카테고리별로 정리된 객체 생성
        const categorizedMenus = {
          '밥류': [],
          '국물요리': [],
          '음료': [],
          '주류': [],
          '디저트': []
        };

        // 서버 데이터를 카테고리별로 분류
        menuData.forEach(item => {
          const category = defaultMapping[item.productId] || '밥류';
          if (categorizedMenus[category]) {
            categorizedMenus[category].push({
              id: item.productId,
              name: item.productName,
              price: item.price,
              category: category
            });
          }
        });

        setMenuItems(categorizedMenus);
      } catch (error) {
        console.error("메뉴 불러오기 실패:", error);
        alert("메뉴를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  // 합계 계산
  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  // 메뉴 클릭 핸들러
  const handleMenuClick = (item) => {
    if (!item.name) return;
    const existingItem = orderItems.find(order => order.name === item.name);

    if (existingItem) {
      setOrderItems(orderItems.map(order =>
        order.name === item.name
          ? { ...order, quantity: order.quantity + 1, total: (order.quantity + 1) * order.price }
          : order
      ));
    } else {
      setOrderItems([...orderItems, {
        id: Date.now(),
        name: item.name,
        price: item.price,
        quantity: 1,
        total: item.price
      }]);
    }
  };

  // 수량 증가
  const increaseQuantity = (id) => {
    setOrderItems(orderItems.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
        : item
    ));
  };

  // 수량 감소
  const decreaseQuantity = (id) => {
    setOrderItems(orderItems.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity - 1, total: (item.quantity - 1) * item.price }
        : item
    ).filter(item => item.quantity > 0));
  };

  // 주문 삭제
  const removeOrderItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // 메뉴 추가 함수 
  const handleAddMenu = async () => {
    if (newMenuItem.name && newMenuItem.price) {
      try {
        setLoading(true);
        console.log("추가 요청:", newMenuItem);

        // 서버에 메뉴 등록 요청 (카테고리 없이)
        const addedMenu = await mockApiCall('/stores/me/products', 'POST', {
          name: newMenuItem.name,
          price: parseInt(newMenuItem.price)
        });

        console.log("서버 응답:", addedMenu);

        // 카테고리 매핑 업데이트
        setCategoryMapping(prev => ({
          ...prev,
          [addedMenu.data.productId]: newMenuItem.category
        }));

        // 현재 메뉴 목록 업데이트
        const updatedMenuItems = { ...menuItems };
        const category = newMenuItem.category;

        // 새로운 메뉴를 해당 카테고리에 추가
        updatedMenuItems[category] = [
          ...(updatedMenuItems[category] || []),
          {
            id: addedMenu.data.productId,
            name: addedMenu.data.productName,
            price: addedMenu.data.price,
            category: newMenuItem.category
          }
        ];

        setMenuItems(updatedMenuItems);

        // 입력창 초기화
        setNewMenuItem({ name: '', price: '', category: '밥류' });
        setShowAddModal(false);
        
        alert("메뉴가 성공적으로 추가되었습니다!");
      } catch (error) {
        console.error("메뉴 추가 실패:", error);
        alert("메뉴 추가에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  // 메뉴 삭제 
  const handleDeleteMenu = async (itemId, category) => {
    if (!window.confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);
      
      // 서버에서 메뉴 삭제
      await mockApiCall(`/stores/me/products/${itemId}`, 'DELETE');
      
      // 카테고리 매핑에서 제거
      setCategoryMapping(prev => {
        const newMapping = { ...prev };
        delete newMapping[itemId];
        return newMapping;
      });
      
      // 로컬 상태에서도 제거
      const updatedMenuItems = { ...menuItems };
      updatedMenuItems[category] = updatedMenuItems[category].filter(item => item.id !== itemId);
      setMenuItems(updatedMenuItems);
      
      alert("메뉴가 성공적으로 삭제되었습니다!");
    } catch (error) {
      console.error("메뉴 삭제 실패:", error);
      alert("메뉴 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 수정 초기화
  const initializeEditMenus = () => {
    const currentMenus = {};
    menuItems[selectedCategory]?.forEach(item => {
      if (item.name) {
        currentMenus[item.id] = {
          name: item.name,
          price: item.price,
          category: selectedCategory
        };
      }
    });
    setEditingMenus(currentMenus);
  };

  // 메뉴 수정 적용
  const handleUpdateMenus = async () => {
    try {
      setLoading(true);
      
      // 모든 수정된 메뉴들을 서버에 업데이트
      for (const [itemId, menuData] of Object.entries(editingMenus)) {
        await mockApiCall(`/stores/me/products/${itemId}`, 'PUT', menuData);
        
        // 카테고리 매핑 업데이트
        setCategoryMapping(prev => ({
          ...prev,
          [itemId]: menuData.category
        }));
      }
      
      // 메뉴 목록 다시 불러오기
      const response = await mockApiCall('/stores/me/products');
      const menuData = response.data;
      
      const categorizedMenus = {
        '밥류': [],
        '국물요리': [],
        '음료': [],
        '주류': [],
        '디저트': []
      };

      menuData.forEach(item => {
        const category = categoryMapping[item.productId] || '밥류';
        if (categorizedMenus[category]) {
          categorizedMenus[category].push({
            id: item.productId,
            name: item.productName,
            price: item.price,
            category: category
          });
        }
      });

      setMenuItems(categorizedMenus);
      setShowEditModal(false);
      alert("메뉴가 성공적으로 수정되었습니다!");
    } catch (error) {
      console.error("메뉴 수정 실패:", error);
      alert("메뉴 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 수정 모달 열기
  const openEditModal = () => {
    initializeEditMenus();
    setShowEditModal(true);
  };

  // 가격 조정 (100원 단위)
  const adjustPrice = (value) => {
    const currentPrice = parseInt(newMenuItem.price) || 0;
    const newPrice = Math.max(0, currentPrice + value);
    setNewMenuItem({ ...newMenuItem, price: newPrice.toString() });
  };

  // 수정 중인 메뉴의 가격 조정
  const adjustEditPrice = (itemId, value) => {
    setEditingMenus(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        price: Math.max(0, (prev[itemId]?.price || 0) + value)
      }
    }));
  };

  const styles = {
    posContainer: {
      display: 'flex',
      height: '100vh',
      background: '#f5f6fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    leftPanel: {
      width: '10%',
      background: 'white',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      boxShadow: '2px 0 4px rgba(0, 0, 0, 0.05)'
    },
    categoryButton: {
      width: '100%',
      height: '12%',
      background: 'white',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      color: '#666',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderBottom: '1px solid #e8e8e8'
    },
    categoryButtonActive: {
      background: '#4A90E2',
      color: 'white',
      fontWeight: '600'
    },
    centerPanel: {
      flex: 1,
      padding: '0 15px',
      background: '#f5f6fa',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    menuGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      justifyContent: 'center',
      alignContent: 'start',
      padding: '10px 0',
      overflowY: 'auto',
      flex: 1
    },
    menuCard: {
      width: '100%',
      height: '20vh',
      background: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.2s ease'
    },
    menuName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#333',
      textAlign: 'center'
    },
    menuPrice: {
      fontSize: '16px',
      color: '#4A90E2',
      fontWeight: '500'
    },
    bottomButtonsWrapper: {
      display: 'flex',
      justifyContent: 'center',
      padding: '20px 0',
      marginTop: 'auto',
      borderTop: '1px solid #e0e0e0'
    },
    bottomButtons: {
      display: 'flex',
      gap: '15px',
      width: '100%'
    },
    bottomButton: {
      flex: 1,
      minWidth: '160px',
      padding: '20px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      color: '#666',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    rightPanel: {
      width: '380px',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.05)'
    },
    orderTableContainer: {
      flex: 1,
      overflowY: 'auto',
      borderBottom: '1px solid #e8e8e8'
    },
    orderTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      background: '#f8f9fa',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    th: {
      padding: '15px',
      textAlign: 'left',
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      borderBottom: '2px solid #e8e8e8'
    },
    td: {
      padding: '12px 15px',
      fontSize: '16px',
      borderBottom: '1px solid #f0f0f0'
    },
    itemInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      fontSize: '16px'
    },
    itemName: {
      fontWeight: '500',
      color: '#333'
    },
    itemPrice: {
      fontSize: '14px',
      color: '#888'
    },
    quantity: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    qtyButton: {
      background: '#f0f0f0',
      border: '1px solid #ddd',
      borderRadius: '4px',
      width: '30px',
      height: '30px',
      fontSize: '16px',
      cursor: 'pointer',
      margin: '0 4px'
    },
    qtyValue: {
      display: 'inline-block',
      minWidth: '30px',
      textAlign: 'center',
      fontWeight: '600'
    },
    itemTotal: {
      textAlign: 'right',
      fontWeight: '500',
      color: '#333'
    },
    deleteButton: {
      background: 'transparent',
      border: 'none',
      color: '#ff4444',
      fontSize: '20px',
      marginLeft: '10px',
      cursor: 'pointer',
      verticalAlign: 'middle'
    },
    summaryBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      background: '#f8f9fa',
      fontSize: '16px',
      color: '#666',
      borderBottom: '1px solid #e8e8e8'
    },
    summaryValue: {
      fontWeight: '600',
      color: '#333',
      fontSize: '16px'
    },
    totalBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      background: 'white',
      borderBottom: '2px solid #e8e8e8'
    },
    totalAmount: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#4A90E2'
    },
    payButton: {
      margin: '20px',
      padding: '20px',
      background: '#4A90E2',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    },
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      zIndex: 1001,
      minWidth: '400px',
      maxWidth: '500px'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      padding: '20px',
      borderBottom: '1px solid #e0e0e0',
      margin: 0
    },
    modalContent: {
      padding: '20px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#666'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      background: 'white'
    },
    priceAdjustContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    priceAdjustButton: {
      background: '#f0f0f0',
      border: '1px solid #ddd',
      borderRadius: '4px',
      width: '32px',
      height: '32px',
      fontSize: '18px',
      cursor: 'pointer'
    },
    priceInput: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      textAlign: 'center',
      fontSize: '14px'
    },
    modalActions: {
      display: 'flex',
      gap: '10px',
      padding: '20px',
      borderTop: '1px solid #e0e0e0',
      justifyContent: 'flex-end'
    },
    cancelButton: {
      padding: '10px 24px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    confirmButton: {
      padding: '10px 24px',
      background: '#4A90E2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    menuList: {
      maxHeight: '400px',
      overflowY: 'auto'
    },
    menuEditItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderBottom: '1px solid #f0f0f0'
    },
    menuDeleteItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderBottom: '1px solid #f0f0f0'
    },
    deleteItemButton: {
      padding: '6px 12px',
      background: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.posContainer}>
      {/* 로딩 오버레이 */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          color: 'white',
          fontSize: '18px'
        }}>
          처리 중...
        </div>
      )}

      {/* 왼쪽 카테고리 */}
      <div style={styles.leftPanel}>
        {categories.map((category) => (
          <button
            key={category}
            style={{
              ...styles.categoryButton,
              ...(selectedCategory === category ? styles.categoryButtonActive : {})
            }}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 중앙 메뉴 */}
      <div style={styles.centerPanel}>
        <div style={styles.menuGrid}>
          {menuItems[selectedCategory]?.map((item) => (
            <button
              key={item.id}
              style={styles.menuCard}
              onClick={() => handleMenuClick(item)}
              disabled={!item.name}
            >
              {item.name && (
                <>
                  <div style={styles.menuName}>{item.name}</div>
                  <div style={styles.menuPrice}>
                    {item.price?.toLocaleString()}원
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
        
        {/* 하단 버튼들 */}
        <div style={styles.bottomButtonsWrapper}>
          <div style={styles.bottomButtons}>
            <button style={styles.bottomButton} onClick={() => setShowAddModal(true)}>
              메뉴 추가
            </button>
            <button style={styles.bottomButton} onClick={openEditModal}>
              메뉴 가격 수정
            </button>
            <button style={styles.bottomButton} onClick={() => setShowDeleteModal(true)}>
              메뉴 삭제
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽 주문 패널 */}
      <div style={styles.rightPanel}>
        <div style={styles.orderTableContainer}>
          <table style={styles.orderTable}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.th}>주문 내역</th>
                <th style={styles.th}>수량</th>
                <th style={styles.th}>금액</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>
                    <div style={styles.itemInfo}>
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.itemPrice}>{item.price.toLocaleString()}원</span>
                    </div>
                  </td>
                  <td style={{...styles.td, ...styles.quantity}}>
                    <button style={styles.qtyButton} onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span style={styles.qtyValue}>{item.quantity}</span>
                    <button style={styles.qtyButton} onClick={() => increaseQuantity(item.id)}>+</button>
                  </td>
                  <td style={{...styles.td, ...styles.itemTotal}}>
                    {item.total.toLocaleString()}원
                    <button
                      style={styles.deleteButton}
                      onClick={() => removeOrderItem(item.id)}
                      aria-label="주문삭제"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.summaryBox}>
          <span>총 수량</span>
          <span style={styles.summaryValue}>
            {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </div>

        <div style={styles.totalBox}>
          <span style={{fontSize: '18px', fontWeight: '600', color: '#333'}}>총 합계</span>
          <span style={styles.totalAmount}>
            {calculateTotal().toLocaleString()}원
          </span>
        </div>

        <button style={styles.payButton}>결제하기</button>
      </div>

      {/* 메뉴 추가 모달 */}
      {showAddModal && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)} />
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>메뉴 추가</h2>
            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>메뉴 이름</label>
                <input
                  type="text"
                  placeholder="예: 김치찌개"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>가격</label>
                <div style={styles.priceAdjustContainer}>
                  <button
                    type="button"
                    style={styles.priceAdjustButton}
                    onClick={() => adjustPrice(-100)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    placeholder="숫자만 입력하세요"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                    style={styles.priceInput}
                  />
                  <button
                    type="button"
                    style={styles.priceAdjustButton}
                    onClick={() => adjustPrice(100)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>카테고리</label>
                <select
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                  style={styles.select}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={styles.modalActions}>
              <button style={styles.cancelButton} onClick={() => setShowAddModal(false)}>
                취소
              </button>
              <button style={styles.confirmButton} onClick={handleAddMenu}>
                추가
              </button>
            </div>
          </div>
        </>
      )}

      {/* 메뉴 수정 모달 */}
      {showEditModal && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)} />
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>메뉴 수정 - {selectedCategory}</h2>
            <div style={styles.modalContent}>
              <div style={styles.menuList}>
                {menuItems[selectedCategory]?.map(item => 
                  item.name && editingMenus[item.id] && (
                    <div key={item.id} style={styles.menuEditItem}>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '8px', flex: 1}}>
                        <input
                          type="text"
                          value={editingMenus[item.id]?.name || ''}
                          onChange={(e) => setEditingMenus(prev => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], name: e.target.value }
                          }))}
                          style={{...styles.input, fontSize: '14px'}}
                        />
                        <div style={styles.priceAdjustContainer}>
                          <button
                            style={styles.priceAdjustButton}
                            onClick={() => adjustEditPrice(item.id, -100)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={editingMenus[item.id]?.price || 0}
                            onChange={(e) => setEditingMenus(prev => ({
                              ...prev,
                              [item.id]: { ...prev[item.id], price: parseInt(e.target.value) || 0 }
                            }))}
                            style={styles.priceInput}
                          />
                          <button
                            style={styles.priceAdjustButton}
                            onClick={() => adjustEditPrice(item.id, 100)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div style={styles.modalActions}>
              <button style={styles.cancelButton} onClick={() => setShowEditModal(false)}>
                취소
              </button>
              <button style={styles.confirmButton} onClick={handleUpdateMenus}>
                수정 완료
              </button>
            </div>
          </div>
        </>
      )}

      {/* 메뉴 삭제 모달 */}
      {showDeleteModal && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)} />
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>메뉴 삭제 - {selectedCategory}</h2>
            <div style={styles.modalContent}>
              <div style={styles.menuList}>
                {menuItems[selectedCategory]?.map(item => 
                  item.name && (
                    <div key={item.id} style={styles.menuDeleteItem}>
                      <span>{item.name} - {item.price?.toLocaleString()}원</span>
                      <button
                        style={styles.deleteItemButton}
                        onClick={() => handleDeleteMenu(item.id, selectedCategory)}
                      >
                        삭제
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
            <div style={styles.modalActions}>
              <button style={styles.confirmButton} onClick={() => setShowDeleteModal(false)}>
                완료
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PosMachinePage;