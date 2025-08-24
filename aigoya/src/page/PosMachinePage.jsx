import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import styles from '../css/PosMachinePage.module.css';
import {
  getMenus, addMenu, deleteMenu, updateMenu,
  createOrder, getOrders, updateOrder, cancelOrder,
  getCategories, createCategory, updateCategory, deleteCategory
} from "../api/StoreApi";



const PosMachinePage = ({ storeId = 1 }) => {

  const navigate = useNavigate();

  const handlePosExit = () => {
    navigate('/main');
  };

  // 기본 상태
  const [selectedCategory, setSelectedCategory] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(false);

  // 모달 상태
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showOrderCompleteModal, setShowOrderCompleteModal] = useState(false);

  // 데이터 상태
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategories, setEditingCategories] = useState({});
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', categoryId: '' });
  const [editingMenus, setEditingMenus] = useState({});
  const [orders, setOrders] = useState([]);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  // 초기 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, menusData] = await Promise.all([getCategories(), getMenus()]);
        setCategories(categoriesData);
        setMenuItems(menusData);
        if (categoriesData.length > 0) setSelectedCategory(categoriesData[0].name);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 카테고리 관리
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return alert("카테고리 이름을 입력해주세요.");
    try {
      setLoading(true);
      await createCategory({ name: newCategoryName });
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      setNewCategoryName('');
      setShowCategoryModal(false);
      alert("카테고리가 추가되었습니다!");
    } catch (error) {
      console.error("카테고리 추가 실패:", error);
      alert("카테고리 추가에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategories = async () => {
    try {
      setLoading(true);
      await Promise.all(
        Object.entries(editingCategories).map(([id, data]) => updateCategory(id, data))
      );
      const [updatedCategories, updatedMenus] = await Promise.all([getCategories(), getMenus()]);
      setCategories(updatedCategories);
      setMenuItems(updatedMenus);
      setShowEditCategoryModal(false);
      alert("카테고리가 수정되었습니다!");
    } catch (error) {
      console.error("카테고리 수정 실패:", error);
      alert("카테고리 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`"${categoryName}" 카테고리를 삭제하시겠습니까?`)) return;
    try {
      setLoading(true);
      await deleteCategory(categoryId);
      const [updatedCategories, updatedMenus] = await Promise.all([getCategories(), getMenus()]);
      setCategories(updatedCategories);
      setMenuItems(updatedMenus);
      if (selectedCategory === categoryName && updatedCategories.length > 0) {
        setSelectedCategory(updatedCategories[0].name);
      }
      alert("카테고리가 삭제되었습니다!");
    } catch (error) {
      console.error("카테고리 삭제 실패:", error);
      alert("카테고리 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 관리
  const handleAddMenu = async () => {
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.categoryId) {
      return alert("모든 필드를 입력해주세요.");
    }
    try {
      setLoading(true);
      await addMenu({
        name: newMenuItem.name,
        price: parseInt(newMenuItem.price),
        categoryId: parseInt(newMenuItem.categoryId)
      });
      const updatedMenus = await getMenus();
      setMenuItems(updatedMenus);
      setNewMenuItem({ name: '', price: '', categoryId: '' });
      setShowAddModal(false);
      alert("메뉴가 추가되었습니다!");
    } catch (error) {
      console.error("메뉴 추가 실패:", error);
      alert("메뉴 추가에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMenus = async () => {
    try {
      setLoading(true);
      await Promise.all(
        Object.entries(editingMenus).map(([id, data]) => updateMenu(id, data))
      );
      const updatedMenus = await getMenus();
      setMenuItems(updatedMenus);
      setShowEditModal(false);
      alert("메뉴가 수정되었습니다!");
    } catch (error) {
      console.error("메뉴 수정 실패:", error);
      alert("메뉴 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (itemId) => {
    if (!window.confirm("이 메뉴를 삭제하시겠습니까?")) return;
    try {
      setLoading(true);
      await deleteMenu(itemId);
      const updatedMenus = await getMenus();
      setMenuItems(updatedMenus);
      alert("메뉴가 삭제되었습니다!");
    } catch (error) {
      console.error("메뉴 삭제 실패:", error);
      alert("메뉴 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 주문 관리
  const handleMenuClick = (item) => {
    const existingItem = orderItems.find(order => order.name === item.name);
    if (existingItem) {
      setOrderItems(orderItems.map(order =>
        order.name === item.name
          ? { ...order, quantity: order.quantity + 1, total: (order.quantity + 1) * order.price }
          : order
      ));
    } else {
      setOrderItems([...orderItems, {
        id: item.id, name: item.name, price: item.price, quantity: 1, total: item.price
      }]);
    }
  };

  const increaseQuantity = (id) => {
    setOrderItems(orderItems.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
        : item
    ));
  };

  const decreaseQuantity = (id) => {
    setOrderItems(orderItems.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity - 1, total: (item.quantity - 1) * item.price }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeOrderItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => orderItems.reduce((sum, item) => sum + item.total, 0);

  const handlePayment = async () => {
    if (orderItems.length === 0) return alert("주문할 상품을 선택해주세요.");
    try {
      setLoading(true);
      const orderResult = await createOrder(orderItems);
      setCompletedOrder(orderResult);
      setOrderItems([]);
      setShowOrderCompleteModal(true);
      alert("주문이 완료되었습니다!");
    } catch (error) {
      console.error("결제 실패:", error);
      alert("결제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("주문 목록 불러오기 실패:", error);
      alert("주문 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const openOrdersModal = async () => {
    await fetchOrders();
    setShowOrdersModal(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("이 주문을 취소하시겠습니까?")) return;
    try {
      setLoading(true);
      await cancelOrder(orderId);
      await fetchOrders();
      alert("주문이 취소되었습니다.");
    } catch (error) {
      console.error("주문 취소 실패:", error);
      alert("주문 취소에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 주문 수정 관련 함수들 (API 권한 문제로 현재 403 에러)
  const startEditOrder = (order) => {
    setEditingOrder({
      ...order,
      orderProducts: order.orderProducts.map(item => ({ ...item }))
    });
  };

  const cancelEditOrder = () => {
    setEditingOrder(null);
  };

  const updateOrderProductQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setEditingOrder(prev => ({
        ...prev,
        orderProducts: prev.orderProducts.filter(item => item.product.productId !== productId)
      }));
    } else {
      setEditingOrder(prev => ({
        ...prev,
        orderProducts: prev.orderProducts.map(item =>
          item.product.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }));
    }
  };

  const saveOrderEdit = async () => {
    try {
      setLoading(true);
      const updateData = {
        orderProducts: editingOrder.orderProducts.map(item => ({
          productId: item.product.productId,
          quantity: item.quantity
        }))
      };
      await updateOrder(editingOrder.orderId, updateData);
      await fetchOrders();
      setEditingOrder(null);
      alert("주문이 수정되었습니다.");
    } catch (error) {
      console.error("주문 수정 실패:", error);
      alert("주문 수정에 실패했습니다. (API 권한 문제)");
    } finally {
      setLoading(false);
    }
  };

  // 유틸리티
  const formatOrderTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const adjustPrice = (value) => {
    const newPrice = Math.max(0, (parseInt(newMenuItem.price) || 0) + value);
    setNewMenuItem({ ...newMenuItem, price: newPrice.toString() });
  };

  const adjustEditPrice = (itemId, value) => {
    setEditingMenus(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        price: Math.max(0, (prev[itemId]?.price || 0) + value)
      }
    }));
  };

  const initializeEditCategories = () => {
    const editData = {};
    categories.forEach(category => {
      editData[category.id] = { name: category.name };
    });
    setEditingCategories(editData);
  };

  const initializeEditMenus = () => {
    const currentMenus = {};
    const categoryMenus = menuItems[selectedCategory] || [];
    categoryMenus.forEach(item => {
      if (item.name) {
        currentMenus[item.id] = {
          name: item.name,
          price: item.price,
          categoryId: item.categoryId || categories.find(cat => cat.name === selectedCategory)?.id
        };
      }
    });
    setEditingMenus(currentMenus);
  };

  return (
    <div className={styles.posContainer}>
      {loading && <div className={styles.loadingOverlay}>처리 중...</div>}

      {/* 왼쪽 카테고리 패널 */}
      <div className={styles.leftPanel}>
        <div className={styles.posExitSection}>
          <button className={styles.posExitButton} onClick={handlePosExit}>
            <Monitor size={20} className={styles.posExitIcon} />
            <span>pos 종료</span>
          </button>
        </div>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${selectedCategory === category.name ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </button>
        ))}

        <div className={styles.orderViewSection}>
          <button className={styles.orderViewButton} onClick={openOrdersModal}>
            주문 조회
          </button>
        </div>

        <div className={styles.categoryManagement}>
          <button className={styles.categoryManageButton} onClick={() => setShowCategoryModal(true)}>
            카테고리 추가
          </button>
          <button className={styles.categoryManageButton} onClick={() => {
            initializeEditCategories();
            setShowEditCategoryModal(true);
          }}>
            카테고리 수정
          </button>
          <button className={styles.categoryManageButton} onClick={() => setShowDeleteCategoryModal(true)}>
            카테고리 삭제
          </button>
        </div>
      </div>

      {/* 중앙 메뉴 패널 */}
      <div className={styles.centerPanel}>
        <div className={styles.menuGrid}>
          {(menuItems[selectedCategory] || []).map((item) => (
            <button key={item.id} className={styles.menuCard} onClick={() => handleMenuClick(item)}>
              <div className={styles.menuName}>{item.name}</div>
              <div className={styles.menuPrice}>{item.price?.toLocaleString()}원</div>
            </button>
          ))}
        </div>

        <div className={styles.bottomButtonsWrapper}>
          <div className={styles.bottomButtons}>
            <button className={styles.bottomButton} onClick={() => setShowAddModal(true)}>
              메뉴 추가
            </button>
            <button className={styles.bottomButton} onClick={() => {
              initializeEditMenus();
              setShowEditModal(true);
            }}>
              메뉴 수정
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
              <tr><th>주문 내역</th><th>수량</th><th>금액</th></tr>
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
                    <button className={styles.deleteButton} onClick={() => removeOrderItem(item.id)}>X</button>
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
          <span className={styles.totalAmount}>{calculateTotal().toLocaleString()}원</span>
        </div>

        <button className={styles.payButton} onClick={handlePayment}>결제하기</button>
      </div>

      {/* 카테고리 추가 모달 */}
      {showCategoryModal && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowCategoryModal(false)} />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>카테고리 추가</h2>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>카테고리 이름</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowCategoryModal(false)}>취소</button>
              <button className={styles.confirmButton} onClick={handleAddCategory}>추가</button>
            </div>
          </div>
        </>
      )}

      {/* 카테고리 수정 모달 */}
      {showEditCategoryModal && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowEditCategoryModal(false)} />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>카테고리 수정</h2>
            <div className={styles.modalContent}>
              <div className={styles.menuList}>
                {categories.map(category => (
                  <div key={category.id} className={styles.menuEditItem}>
                    <input
                      type="text"
                      value={editingCategories[category.id]?.name || ''}
                      onChange={(e) => setEditingCategories(prev => ({
                        ...prev,
                        [category.id]: { name: e.target.value }
                      }))}
                      className={styles.input}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowEditCategoryModal(false)}>취소</button>
              <button className={styles.confirmButton} onClick={handleUpdateCategories}>수정 완료</button>
            </div>
          </div>
        </>
      )}

      {/* 카테고리 삭제 모달 */}
      {showDeleteCategoryModal && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowDeleteCategoryModal(false)} />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>카테고리 삭제</h2>
            <div className={styles.modalContent}>
              <div className={styles.menuList}>
                {categories.map(category => (
                  <div key={category.id} className={styles.menuDeleteItem}>
                    <span>{category.name}</span>
                    <button
                      className={styles.deleteItemButton}
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={() => setShowDeleteCategoryModal(false)}>완료</button>
            </div>
          </div>
        </>
      )}

      {/* 메뉴 추가 모달 */}
      {showAddModal && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)} />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>메뉴 추가</h2>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>카테고리</label>
                <select
                  value={newMenuItem.categoryId}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, categoryId: e.target.value })}
                  className={styles.select}
                >
                  <option value="">카테고리 선택</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>메뉴 이름</label>
                <input
                  type="text"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>가격</label>
                <div className={styles.priceAdjustContainer}>
                  <button className={styles.priceAdjustButton} onClick={() => adjustPrice(-100)}>-</button>
                  <input
                    type="number"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                    className={styles.priceInput}
                  />
                  <button className={styles.priceAdjustButton} onClick={() => adjustPrice(100)}>+</button>
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowAddModal(false)}>취소</button>
              <button className={styles.confirmButton} onClick={handleAddMenu}>추가</button>
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
                {Object.entries(editingMenus).map(([itemId, menuData]) => (
                  <div key={itemId} className={styles.menuEditItem}>
                    <div className={styles.menuEditFields}>
                      <input
                        type="text"
                        value={menuData.name || ''}
                        onChange={(e) => setEditingMenus(prev => ({
                          ...prev,
                          [itemId]: { ...prev[itemId], name: e.target.value }
                        }))}
                        className={styles.input}
                      />
                      <select
                        value={menuData.categoryId || ''}
                        onChange={(e) => setEditingMenus(prev => ({
                          ...prev,
                          [itemId]: { ...prev[itemId], categoryId: parseInt(e.target.value) }
                        }))}
                        className={styles.select}
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                      <div className={styles.priceAdjustContainer}>
                        <button
                          className={styles.priceAdjustButton}
                          onClick={() => adjustEditPrice(itemId, -100)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={menuData.price || 0}
                          onChange={(e) => setEditingMenus(prev => ({
                            ...prev,
                            [itemId]: { ...prev[itemId], price: parseInt(e.target.value) || 0 }
                          }))}
                          className={styles.priceInput}
                        />
                        <button
                          className={styles.priceAdjustButton}
                          onClick={() => adjustEditPrice(itemId, 100)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowEditModal(false)}>취소</button>
              <button className={styles.confirmButton} onClick={handleUpdateMenus}>수정 완료</button>
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
                {(menuItems[selectedCategory] || []).map(item =>
                  item.name && (
                    <div key={item.id} className={styles.menuDeleteItem}>
                      <span>{item.name} - {item.price?.toLocaleString()}원</span>
                      <button className={styles.deleteItemButton} onClick={() => handleDeleteMenu(item.id)}>
                        삭제
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={() => setShowDeleteModal(false)}>완료</button>
            </div>
          </div>
        </>
      )}

      {/* 주문 완료 모달 */}
      {showOrderCompleteModal && completedOrder && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowOrderCompleteModal(false)} />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>주문 완료</h2>
            <div className={styles.modalContent}>
              <div className={styles.orderCompleteInfo}>
                <p><strong>주문 번호:</strong> #{completedOrder.orderId}</p>
                <p><strong>총 금액:</strong> {completedOrder.totalPrice?.toLocaleString()}원</p>
                <div className={styles.orderProductsList}>
                  <h4>주문 상품:</h4>
                  {completedOrder.orderProducts?.map((item, index) => (
                    <div key={index} className={styles.orderProductItem}>
                      <span>{item.product.productName}</span>
                      <span>x{item.quantity}</span>
                      <span>{(item.product.price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={() => setShowOrderCompleteModal(false)}>확인</button>
            </div>
          </div>
        </>
      )}

      {/* 주문 조회 모달 */}
      {showOrdersModal && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowOrdersModal(false)} />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>주문 조회</h2>
            <div className={styles.modalContent}>
              <div className={styles.ordersList}>
                {orders.length === 0 ? (
                  <p className={styles.noOrders}>주문 내역이 없습니다.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.orderId} className={styles.orderItem}>
                      {editingOrder?.orderId === order.orderId ? (
                        // 수정 모드
                        <div>
                          <div className={styles.orderHeader}>
                            <span className={styles.orderId}>주문 #{order.orderId} (수정중)</span>
                            <div>
                              <button
                                className={styles.confirmButton}
                                onClick={saveOrderEdit}
                                style={{ marginRight: '8px', padding: '4px 8px', fontSize: '12px' }}
                              >
                                저장
                              </button>
                              <button
                                className={styles.cancelButton}
                                onClick={cancelEditOrder}
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                              >
                                취소
                              </button>
                            </div>
                          </div>
                          <div className={styles.orderProducts}>
                            {editingOrder.orderProducts.map((item, index) => (
                              <div key={index} className={styles.orderProductDetail}>
                                <span>{item.product.productName}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <button
                                    className={styles.qtyButton}
                                    onClick={() => updateOrderProductQuantity(item.product.productId, item.quantity - 1)}
                                  >
                                    -
                                  </button>
                                  <span>{item.quantity}</span>
                                  <button
                                    className={styles.qtyButton}
                                    onClick={() => updateOrderProductQuantity(item.product.productId, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // 일반 모드
                        <div>
                          <div className={styles.orderHeader}>
                            <div>
                              <span className={styles.orderId}>주문 #{order.orderId}</span>
                              <span style={{ marginLeft: '10px', fontSize: '14px', color: '#999' }}>
                                {formatOrderTime(order.orderedAt)}
                              </span>
                            </div>
                            <div>
                              <span className={styles.orderTotal}>{order.totalPrice?.toLocaleString()}원</span>
                              <button
                                className={styles.confirmButton}
                                onClick={() => startEditOrder(order)}
                                style={{ marginLeft: '8px', padding: '4px 8px', fontSize: '12px' }}
                              >
                                수정
                              </button>
                              <button
                                className={styles.cancelOrderButton}
                                onClick={() => handleCancelOrder(order.orderId)}
                                style={{ marginLeft: '4px' }}
                              >
                                취소
                              </button>
                            </div>
                          </div>
                          <div className={styles.orderProducts}>
                            {order.orderProducts?.map((item, index) => (
                              <div key={index} className={styles.orderProductDetail}>
                                <span>{item.product.productName}</span>
                                <span>x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={() => setShowOrdersModal(false)}>닫기</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PosMachinePage;