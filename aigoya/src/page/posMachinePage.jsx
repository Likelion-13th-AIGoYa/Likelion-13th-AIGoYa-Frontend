import React, { useState } from 'react';
import styles from '../css/posMachinePage.module.css';

const PosMachinePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('밥류');
  const [orderItems, setOrderItems] = useState([]); // 기본값 비움

  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 폼 데이터
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    category: '밥류'
  });

  // 카테고리 목록
  const categories = ['밥류', '국물요리', '음료', '주류', '디저트'];

  // 메뉴 아이템
  const [menuItems, setMenuItems] = useState({
    '밥류': [
      { id: 1, name: '짜장면', price: 6000 },
      { id: 2, name: '짬뽕', price: 7000 },
      { id: 3, name: '우동', price: 5500 },
      { id: 4, name: '냉면', price: 8000 },
      { id: 5, name: '비빔면', price: 6500 },
      { id: 6, name: '해물스파', price: 8500 },
      { id: 7, name: '전치국수', price: 8000 },
      { id: 8, name: '탕국수', price: 9000 },
      { id: 9, name: '스파게티', price: 12000 },
      { id: 10, name: '돈연', price: 8500 },
      { id: 11, name: '불닭', price: 2000 },
      { id: 12, name: '', price: null }
    ],
    '국물요리': [],
    '음료': [],
    '주류': [],
    '디저트': []
  });

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

  // 메뉴 추가
  const handleAddMenu = () => {
    if (newMenuItem.name && newMenuItem.price) {
      const newId = Date.now();
      const updatedMenuItems = { ...menuItems };
      updatedMenuItems[newMenuItem.category] = [
        ...updatedMenuItems[newMenuItem.category],
        {
          id: newId,
          name: newMenuItem.name,
          price: parseInt(newMenuItem.price)
        }
      ];
      setMenuItems(updatedMenuItems);
      setNewMenuItem({ name: '', price: '', category: '밥류' });
      setShowAddModal(false);
    }
  };

  // 메뉴 삭제
  const handleDeleteMenu = (itemId, category) => {
    const updatedMenuItems = { ...menuItems };
    updatedMenuItems[category] = updatedMenuItems[category].filter(item => item.id !== itemId);
    setMenuItems(updatedMenuItems);
  };

  // 가격 조정 (100원 단위)
  const adjustPrice = (value) => {
    const currentPrice = parseInt(newMenuItem.price) || 0;
    const newPrice = Math.max(0, currentPrice + value);
    setNewMenuItem({ ...newMenuItem, price: newPrice.toString() });
  };

  return (
    <div className={styles.posContainer}>
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
          {menuItems[selectedCategory].map((item) => (
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
                    {item.price?.toLocaleString()}
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
        
        {/* 하단 버튼들 */}
        <div className={styles.bottomButtonsWrapper}>
          <div className={styles.bottomButtons}>
            <button className={styles.bottomButton} onClick={() => setShowAddModal(true)}>
              메뉴 추가
            </button>
            <button className={styles.bottomButton} onClick={() => setShowEditModal(true)}>
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
                      <span className={styles.itemPrice}>{item.price.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className={styles.quantity}>
                    <button className={styles.qtyButton} onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button className={styles.qtyButton} onClick={() => increaseQuantity(item.id)}>+</button>
                  </td>
                  <td className={styles.itemTotal}>
                    {item.total.toLocaleString()}
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
            {calculateTotal().toLocaleString()}
          </span>
        </div>

        <button className={styles.payButton}>결제하기</button>
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
              <div className={styles.formGroup}>
                <label>카테고리</label>
                <select
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                  className={styles.select}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
            <h2 className={styles.modalTitle}>메뉴 가격 수정</h2>
            <div className={styles.modalContent}>
              <div className={styles.menuList}>
                {menuItems[selectedCategory].map(item => 
                  item.name && (
                    <div key={item.id} className={styles.menuEditItem}>
                      <span>{item.name}</span>
                      <div className={styles.priceAdjustContainer}>
                        <button
                          className={styles.priceAdjustButton}
                          onClick={() => {
                            const updatedMenuItems = { ...menuItems };
                            updatedMenuItems[selectedCategory] = updatedMenuItems[selectedCategory].map(menu =>
                              menu.id === item.id ? { ...menu, price: Math.max(0, menu.price - 100) } : menu
                            );
                            setMenuItems(updatedMenuItems);
                          }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const updatedMenuItems = { ...menuItems };
                            updatedMenuItems[selectedCategory] = updatedMenuItems[selectedCategory].map(menu =>
                              menu.id === item.id ? { ...menu, price: parseInt(e.target.value) || 0 } : menu
                            );
                            setMenuItems(updatedMenuItems);
                          }}
                          className={styles.priceInput}
                        />
                        <button
                          className={styles.priceAdjustButton}
                          onClick={() => {
                            const updatedMenuItems = { ...menuItems };
                            updatedMenuItems[selectedCategory] = updatedMenuItems[selectedCategory].map(menu =>
                              menu.id === item.id ? { ...menu, price: menu.price + 100 } : menu
                            );
                            setMenuItems(updatedMenuItems);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={() => setShowEditModal(false)}>
                완료
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
                {menuItems[selectedCategory].map(item => 
                  item.name && (
                    <div key={item.id} className={styles.menuDeleteItem}>
                      <span>{item.name} - {item.price?.toLocaleString()}원</span>
                      <button
                        className={styles.deleteItemButton}
                        onClick={() => handleDeleteMenu(item.id, selectedCategory)}
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