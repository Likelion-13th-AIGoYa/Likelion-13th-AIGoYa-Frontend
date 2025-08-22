import React, { useState, useEffect } from 'react';
import styles from '../css/posMachinePage.module.css';
import { getMenus, addMenu, deleteMenu, updateMenu } from "../api/productManagementApi";

const PosMachinePage = ({ storeId = 1 }) => {
  const [selectedCategory, setSelectedCategory] = useState('밥류');
  const [orderItems, setOrderItems] = useState([]);

  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  
  // 폼 데이터
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: ''
  });

  // 수정할 메뉴 임시 저장
  const [editingMenus, setEditingMenus] = useState({});

  // 카테고리 목록 (화면 표시용)
  const categories = ['밥류', '국물요리', '음료', '주류', '디저트'];

  // 메뉴 아이템 (실제로는 모든 메뉴가 밥류에만 들어감)
  const [menuItems, setMenuItems] = useState({
    '밥류': [],
    '국물요리': [],
    '음료': [],
    '주류': [],
    '디저트': []
  });

  // ===== 서버에서 메뉴 불러오기 =====
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const data = await getMenus(); // 모든 메뉴가 밥류로 들어옴
        setMenuItems(data);
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
        id: item.id,
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

  // 메뉴 추가 함수 (모든 메뉴를 밥류에 추가)
  const handleAddMenu = async () => {
    if (newMenuItem.name && newMenuItem.price) {
      try {
        setLoading(true);
        console.log("추가 요청:", newMenuItem);

        const addedMenu = await addMenu({
          name: newMenuItem.name,
          price: parseInt(newMenuItem.price)
        });

        console.log("서버 응답:", addedMenu);

        // 모든 새 메뉴를 밥류에 추가
        const updatedMenuItems = { ...menuItems };
        updatedMenuItems['밥류'] = [
          ...(updatedMenuItems['밥류'] || []),
          {
            id: addedMenu.productId,
            name: addedMenu.productName,
            price: addedMenu.price
          }
        ];

        setMenuItems(updatedMenuItems);
        setNewMenuItem({ name: '', price: '' });
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

  // 메뉴 삭제 (밥류에서만 삭제)
  const handleDeleteMenu = async (itemId) => {
    if (!window.confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteMenu(itemId);
      
      // 밥류에서 해당 메뉴 제거
      const updatedMenuItems = { ...menuItems };
      updatedMenuItems['밥류'] = updatedMenuItems['밥류'].filter(item => item.id !== itemId);
      setMenuItems(updatedMenuItems);
      
      alert("메뉴가 성공적으로 삭제되었습니다!");
    } catch (error) {
      console.error("메뉴 삭제 실패:", error);
      alert("메뉴 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 수정 초기화 (밥류 메뉴만)
  const initializeEditMenus = () => {
    const currentMenus = {};
    menuItems['밥류']?.forEach(item => {
      if (item.name) {
        currentMenus[item.id] = {
          name: item.name,
          price: item.price
        };
      }
    });
    setEditingMenus(currentMenus);
  };

  // 메뉴 수정 적용
  const handleUpdateMenus = async () => {
    try {
      setLoading(true);
      
      const updatePromises = Object.entries(editingMenus).map(([itemId, menuData]) =>
        updateMenu(itemId, menuData)
      );
      
      await Promise.all(updatePromises);
      
      // 메뉴 목록 다시 불러오기
      const updatedData = await getMenus();
      setMenuItems(updatedData);
      
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

  return (
    <div className={styles.posContainer}>
      {/* 로딩 오버레이 */}
      {loading && (
        <div className={styles.loadingOverlay}>
          처리 중...
        </div>
      )}

      {/* 왼쪽 카테고리 */}
      <div className={styles.leftPanel}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 중앙 메뉴 */}
      <div className={styles.centerPanel}>
        <div className={styles.menuGrid}>
          {menuItems[selectedCategory]?.map((item) => (
            <button
              key={item.id}
              className={`${styles.menuCard} ${!item.name ? styles.empty : ''}`}
              onClick={() => handleMenuClick(item)}
              disabled={!item.name}
            >
              {item.name && (
                <>
                  <div className={styles.menuName}>{item.name}</div>
                  <div className={styles.menuPrice}>
                    {item.price?.toLocaleString()}원
                  </div>
                </>
              )}
            </button>
          ))}
          {/* 빈 카드들 (디자인용) */}
          {Array.from({ length: Math.max(0, 12 - (menuItems[selectedCategory]?.length || 0)) }).map((_, index) => (
            <div key={`empty-${index}`} className={`${styles.menuCard} ${styles.empty}`}></div>
          ))}
        </div>
        
        {/* 하단 버튼들 */}
        <div className={styles.bottomButtonsWrapper}>
          <div className={styles.bottomButtons}>
            <button className={styles.bottomButton} onClick={() => setShowAddModal(true)}>
              메뉴 추가
            </button>
            <button className={styles.bottomButton} onClick={openEditModal}>
              메뉴 가격 수정
            </button>
            <button className={styles.bottomButton} onClick={() => setShowDeleteModal(true)}>
              메뉴 삭제
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽 주문 패널 */}
      <div className={styles.rightPanel}>
        <div className={styles.orderTableContainer}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>주문 내역</th>
                <th>수량</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemPrice}>{item.price.toLocaleString()}원</span>
                    </div>
                  </td>
                  <td className={styles.quantity}>
                    <button className={styles.qtyButton} onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button className={styles.qtyButton} onClick={() => increaseQuantity(item.id)}>+</button>
                  </td>
                  <td className={styles.itemTotal}>
                    {item.total.toLocaleString()}원
                    <button
                      className={styles.deleteButton}
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

        <div className={styles.summaryBox}>
          <span>총 수량</span>
          <span className={styles.summaryValue}>
            {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </div>

        <div className={styles.totalBox}>
          <span>총 합계</span>
          <span className={styles.totalAmount}>
            {calculateTotal().toLocaleString()}원
          </span>
        </div>

        <button className={styles.payButton} onClick={() => alert("주문 기능은 준비 중입니다!")}>
          결제하기 (준비중)
        </button>
      </div>

      {/* 메뉴 추가 모달 */}
      {showAddModal && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)} />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>메뉴 추가</h2>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>메뉴 이름</label>
                <input
                  type="text"
                  placeholder="예: 김치찌개"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>가격</label>
                <div className={styles.priceAdjustContainer}>
                  <button
                    type="button"
                    className={styles.priceAdjustButton}
                    onClick={() => adjustPrice(-100)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    placeholder="숫자만 입력하세요"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                    className={styles.priceInput}
                  />
                  <button
                    type="button"
                    className={styles.priceAdjustButton}
                    onClick={() => adjustPrice(100)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowAddModal(false)}>
                취소
              </button>
              <button className={styles.confirmButton} onClick={handleAddMenu}>
                추가
              </button>
            </div>
          </div>
        </>
      )}

      {/* 메뉴 수정 모달 */}
      {showEditModal && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)} />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>메뉴 수정</h2>
            <div className={styles.modalContent}>
              <div className={styles.menuList}>
                {menuItems['밥류']?.map(item => 
                  item.name && editingMenus[item.id] && (
                    <div key={item.id} className={styles.menuEditItem}>
                      <div className={styles.menuEditFields}>
                        <input
                          type="text"
                          value={editingMenus[item.id]?.name || ''}
                          onChange={(e) => setEditingMenus(prev => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], name: e.target.value }
                          }))}
                          className={styles.input}
                        />
                        <div className={styles.priceAdjustContainer}>
                          <button
                            className={styles.priceAdjustButton}
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
                            className={styles.priceInput}
                          />
                          <button
                            className={styles.priceAdjustButton}
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
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowEditModal(false)}>
                취소
              </button>
              <button className={styles.confirmButton} onClick={handleUpdateMenus}>
                수정 완료
              </button>
            </div>
          </div>
        </>
      )}

      {/* 메뉴 삭제 모달 */}
      {showDeleteModal && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)} />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>메뉴 삭제</h2>
            <div className={styles.modalContent}>
              <div className={styles.menuList}>
                {menuItems['밥류']?.map(item => 
                  item.name && (
                    <div key={item.id} className={styles.menuDeleteItem}>
                      <span>{item.name} - {item.price?.toLocaleString()}원</span>
                      <button
                        className={styles.deleteItemButton}
                        onClick={() => handleDeleteMenu(item.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={() => setShowDeleteModal(false)}>
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