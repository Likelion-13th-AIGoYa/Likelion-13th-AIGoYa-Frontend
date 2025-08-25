// src/components/OrderList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, RefreshCw, Calendar, TrendingUp, TrendingDown, Minus, DollarSign, ShoppingCart, Receipt } from 'lucide-react';
import styles from '../css/OrderList.module.css';
import { getOrders, cancelOrder, updateOrder } from "../api/StoreApi";
import Header from "../component/Header";

const OrderList = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'orderedAt', direction: 'desc' });
  const [timeFilter, setTimeFilter] = useState('전체');

  // 개별 주문 행의 상세(상품 목록) 펼침 상태 관리
  const [expandedOrderIds, setExpandedOrderIds] = useState(new Set());

  // 행 토글 핸들러
  const toggleRowExpand = (orderId) => {
    setExpandedOrderIds(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  // 이번 달/지난 달 시작·끝 날짜 계산 (로컬 타임존 기준)
  const getMonthRanges = () => {
    const now = new Date();

    // 이번 달
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // 말일 23:59:59.999

    // 지난 달
    const lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const lastEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999); // 지난달 말일 23:59:59.999

    return { currentStart, currentEnd, lastStart, lastEnd };
  };

  // 특정 기간에 포함되는 주문만 필터
  const filterOrdersByRange = (list, start, end) => {
    const startMs = start.getTime();
    const endMs = end.getTime();
    return (list || []).filter(o => {
      const t = new Date(o.orderedAt).getTime();
      return t >= startMs && t <= endMs;
    });
  };

  // 로컬 기준 YYYY-MM-DD 포맷터
const formatYMDLocal = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

  // 합계/건수/평균 계산 헬퍼
  const summarizeOrders = (list) => {
    const totalRevenue = list.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalOrders = list.length;
    const totalItems = list.reduce((sum, o) =>
      sum + (o.orderProducts?.reduce((s, it) => s + it.quantity, 0) || 0), 0
    );
    const averageOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    return { totalRevenue, totalOrders, totalItems, averageOrder };
  };

  // 주문별 총 수량/총액 계산
  const getOrderTotals = (order) => {
    const totalQty = order.orderProducts?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalPrice = (order.totalPrice ?? (
      (order.orderProducts && order.orderProducts.reduce((sum, item) => {
        const price = (item.product && typeof item.product.price === 'number')
          ? item.product.price
          : 0;
        return sum + price * (item.quantity || 0);
      }, 0)) || 0
    ));

    return { totalQty, totalPrice };
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchOrders();
  }, []);

  // 주문 목록 가져오기
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      // console.error("주문 목록 불러오기 실패:", error);
      alert("주문 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 주문 취소
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("이 주문을 취소하시겠습니까?")) return;
    try {
      setLoading(true);
      await cancelOrder(orderId);
      await fetchOrders();
      alert("주문이 취소되었습니다.");
    } catch (error) {
      // console.error("주문 취소 실패:", error);
      alert("주문 취소에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 주문 수정 시작
  const startEditOrder = (order) => {
    setEditingOrder({
      ...order,
      orderProducts: order.orderProducts.map(item => ({ ...item }))
    });
    // 수정 버튼 클릭 시 해당 주문 행을 자동으로 펼침
    setExpandedOrderIds(prev => {
      const next = new Set(prev);
      next.add(order.orderId);
      return next;
    });
  };

  // 주문 수정 취소
  const cancelEditOrder = () => {
    setExpandedOrderIds(prev => {
      const next = new Set(prev);
      if (editingOrder) next.delete(editingOrder.orderId);
      return next;
    });
    setEditingOrder(null);
  };

  // 주문 상품 수량 변경
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

  // 주문 수정 저장
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
      // console.error("주문 수정 실패:", error);
      alert("주문 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 날짜/시간 포맷팅
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  // 정렬 기능
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 필터링 및 정렬된 주문 목록
  const filteredAndSortedOrders = React.useMemo(() => {
    let filtered = orders;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toString().includes(searchTerm) ||
        order.orderProducts?.some(item =>
          item.product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // 날짜 필터링
    if (selectedDate) {
      filtered = filtered.filter(order => {
        const orderDate = formatYMDLocal(new Date(order.orderedAt));
        return orderDate === selectedDate;
      });
    }

    // 시간대 필터링
    if (timeFilter !== '전체') {
      filtered = filtered.filter(order => {
        const orderTime = new Date(order.orderedAt);

        switch (timeFilter) {
          case '오늘':
            return orderTime.toDateString() === new Date().toDateString();
          case '이번 주':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderTime >= weekAgo;
          case '이번 달':
            return orderTime.getMonth() === new Date().getMonth();
          default:
            return true;
        }
      });
    }

    // 정렬
    filtered.sort((a, b) => {
      if (sortConfig.key === 'orderedAt') {
        const aValue = new Date(a[sortConfig.key]);
        const bValue = new Date(b[sortConfig.key]);
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, selectedDate, timeFilter, sortConfig]);

  // 통계 계산: 실제 이번 달 vs 지난 달 기준
  const statistics = React.useMemo(() => {
    const { currentStart, currentEnd, lastStart, lastEnd } = getMonthRanges();

    // 원본 orders를 기준으로 월별 요약을 계산
    const currentMonthOrders = filterOrdersByRange(orders, currentStart, currentEnd);
    const lastMonthOrders = filterOrdersByRange(orders, lastStart, lastEnd);

    const currentSummary = summarizeOrders(currentMonthOrders);
    const lastSummary = summarizeOrders(lastMonthOrders);

    // 변화율 계산 (지난 달 0 방지)
    const calcChange = (cur, prev) => {
      if (prev === 0) return cur > 0 ? 100 : 0;
      return ((cur - prev) / prev) * 100;
    };

    const revenueChange = calcChange(currentSummary.totalRevenue, lastSummary.totalRevenue);
    const orderCountChange = calcChange(currentSummary.totalOrders, lastSummary.totalOrders);
    const avgOrderChange = calcChange(currentSummary.averageOrder, lastSummary.averageOrder);

    // 화면 표시는 기존처럼 현재 필터링 결과를 그대로 유지합니다.
    const filteredTotalOrders = filteredAndSortedOrders.length;
    const filteredTotalRevenue = filteredAndSortedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const filteredAverageOrder = filteredTotalOrders > 0 ? Math.round(filteredTotalRevenue / filteredTotalOrders) : 0;
    const filteredTotalItems = filteredAndSortedOrders.reduce((sum, o) =>
      sum + (o.orderProducts?.reduce((s, it) => s + it.quantity, 0) || 0), 0
    );

    return {
      // 카드1: 이번 달 총 매출(실데이터) + 지난 달 대비 변화율
      monthRevenue: currentSummary.totalRevenue,
      monthRevenueChange: revenueChange.toFixed(1),

      // 카드2: 거래 건수(이번 달 기준) + 지난 달 대비 변화율
      monthOrderCount: currentSummary.totalOrders,
      monthOrderCountChange: orderCountChange.toFixed(1),

      // 카드3: 평균 단가(이번 달 기준) + 지난 달 대비 변화율
      monthAverageOrder: currentSummary.averageOrder,
      monthAverageOrderChange: avgOrderChange.toFixed(1),

      // 표/요약(필터 결과 유지가 필요한 경우를 대비해 기존 합계도 보관)
      totalOrders: filteredTotalOrders,
      totalRevenue: filteredTotalRevenue,
      totalItems: filteredTotalItems,
      averageOrder: filteredAverageOrder
    };
  }, [orders, filteredAndSortedOrders]);

  return (
    <div className={styles.orderListContainer}>
      <Header />
      {loading && <div className={styles.loadingOverlay}>처리 중...</div>}

      {/* 실제 데이터 기반 상단 통계 카드들 */}
      <div className={styles.statsContainer}>
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <DollarSign className={styles.icon} size={20} />
            </div>
            <span className={styles.label}>이번 달 총 매출</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.mainValue}>
              ₩{statistics.monthRevenue.toLocaleString()}
            </div>
            <div className={`${styles.changeRate} ${Number(statistics.monthRevenueChange) >= 0 ? styles.up : styles.down}`}>
              {Number(statistics.monthRevenueChange) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>
                {Number(statistics.monthRevenueChange) >= 0 ? '+' : ''}{statistics.monthRevenueChange}%
                <span className={styles.changeLabel}> (지난 달 대비)</span>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <ShoppingCart className={styles.icon} size={20} />
            </div>
            <span className={styles.label}>거래 건수</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.mainValue}>
              {statistics.monthOrderCount}건
            </div>
            <div className={`${styles.changeRate} ${Number(statistics.monthOrderCountChange) >= 0 ? styles.up : styles.down}`}>
              {Number(statistics.monthOrderCountChange) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>
                {Number(statistics.monthOrderCountChange) >= 0 ? '+' : ''}{statistics.monthOrderCountChange}%
                <span className={styles.changeLabel}> (지난 달 대비)</span>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <Receipt className={styles.icon} size={20} />
            </div>
            <span className={styles.label}>평균 단가</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.mainValue}>
              ₩{statistics.monthAverageOrder.toLocaleString()}
            </div>
            <div className={`${styles.changeRate} ${Number(statistics.monthAverageOrderChange) >= 0 ? styles.up : styles.down}`}>
              {Number(statistics.monthAverageOrderChange) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>
                {Number(statistics.monthAverageOrderChange) >= 0 ? '+' : ''}{statistics.monthAverageOrderChange}%
                <span className={styles.changeLabel}> (지난 달 대비)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 섹션 */}
      <div className={styles.controlSection}>
        <div className={styles.filterButtons}>
          {['전체', '오늘', '이번 주', '이번 달'].map(filter => (
            <button
              key={filter}
              className={`${styles.filterButton} ${timeFilter === filter ? styles.active : ''}`}
              onClick={() => setTimeFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className={styles.searchAndActions}>
          <div className={styles.searchContainer}>
            <h2 className={styles.searchTitle}>검색</h2>
            <input
              type="text"
              placeholder="주문번호 또는 상품명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.dateContainer}>
            <h2 className={styles.searchTitle}>날짜</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <button className={styles.resetButton} onClick={() => {
            setSearchTerm('');
            setSelectedDate('');
            setTimeFilter('전체');
            fetchOrders();
          }}>
            초기화
          </button>

          <button className={styles.refreshButton} onClick={fetchOrders}>
            <RefreshCw size={16} />
            새로고침
          </button>
        </div>
      </div>

      {/* 주문 테이블 */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2>주문 내역</h2>
          <span className={styles.orderCount}>{filteredAndSortedOrders.length}건</span>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort('orderId')} className={styles.sortableHeader}>
                  주문번호
                  {sortConfig.key === 'orderId' && (
                    <span className={styles.sortIcon}>
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('orderedAt')} className={styles.sortableHeader}>
                  주문시간
                  {sortConfig.key === 'orderedAt' && (
                    <span className={styles.sortIcon}>
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th>주문상품</th>
                <th>수량</th>
                <th onClick={() => handleSort('totalPrice')} className={styles.sortableHeader}>
                  총액
                  {sortConfig.key === 'totalPrice' && (
                    <span className={styles.sortIcon}>
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    {loading ? "데이터를 불러오는 중..." : "주문 데이터가 없습니다."}
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrders.map((order) => {
                  const { totalQty, totalPrice } = getOrderTotals(order);
                  const isExpanded = expandedOrderIds.has(order.orderId);
                  return (
                    <React.Fragment key={order.orderId}>
                      {/* 요약 행 */}
                      <tr className={`${styles.orderRow} ${styles.summaryRow}`}>
                        <td className={styles.orderId}>
                          <button
                            className={styles.expandButton}
                            onClick={() => toggleRowExpand(order.orderId)}
                            aria-expanded={isExpanded}
                            aria-controls={`order-details-${order.orderId}`}
                            title={isExpanded ? '접기' : '펼치기'}
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                          <span className={styles.orderIdText}>#{order.orderId}</span>
                        </td>
                        <td className={styles.orderTime}>
                          {formatDateTime(order.orderedAt)}
                        </td>
                        {/* 주문상품 열: 요약 배지 형태로 대표 상품 + 개수 표시 */}
                        <td className={styles.orderProducts}>
                          <div className={styles.productSummaryBadges}>
                            {order.orderProducts?.slice(0, 2).map((item, idx) => (
                              <span key={idx} className={styles.productBadge}>
                                {item.product.productName}
                              </span>
                            ))}
                            {order.orderProducts && order.orderProducts.length > 2 && (
                              <span className={styles.moreBadge}>+{order.orderProducts.length - 2}</span>
                            )}
                          </div>
                        </td>
                        {/* 총 수량(주문 전체) */}
                        <td className={styles.totalQuantity}>
                          {totalQty}
                        </td>
                        {/* 총액(주문 전체) */}
                        <td className={styles.totalPrice}>
                          ₩{totalPrice.toLocaleString()}
                        </td>
                        {/* 관리 */}
                        <td className={styles.actions}>
                          {editingOrder?.orderId === order.orderId ? (
                            <div className={styles.editActions}>
                              <button className={styles.saveButton} onClick={saveOrderEdit}>저장</button>
                              <button className={styles.cancelEditButton} onClick={cancelEditOrder}>취소</button>
                            </div>
                          ) : (
                            <div className={styles.normalActions}>
                              <button className={styles.editButton} onClick={() => startEditOrder(order)}>수정</button>
                              <button className={styles.deleteButton} onClick={() => handleCancelOrder(order.orderId)}>삭제</button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* 상세(드롭다운) 행 - 상품별 수량과 금액을 명확히 표시 */}
                      {isExpanded && (
                        <tr id={`order-details-${order.orderId}`} className={styles.detailsRow}>
                          <td colSpan={6}>
                            {/* 수정 모드와 일반 모드 모두 동일한 레이아웃에서 동작 */}
                            {editingOrder?.orderId === order.orderId ? (
                              <div className={styles.detailProductsGrid}>
                                {editingOrder.orderProducts.map((item, idx) => (
                                  <div key={idx} className={styles.detailCard}>
                                    <div className={styles.detailHeader}>
                                      <span className={styles.detailName}>{item.product.productName}</span>
                                      <span className={styles.detailUnitPrice}>₩{(item.product.price ?? 0).toLocaleString()}</span>
                                    </div>
                                    <div className={styles.detailControls}>
                                      <button
                                        className={styles.qtyButton}
                                        onClick={() => updateOrderProductQuantity(item.product.productId, item.quantity - 1)}
                                      >-</button>
                                      <span className={styles.qtyValue}>{item.quantity}</span>
                                      <button
                                        className={styles.qtyButton}
                                        onClick={() => updateOrderProductQuantity(item.product.productId, item.quantity + 1)}
                                      >+</button>
                                    </div>
                                    <div className={styles.detailSubtotal}>
                                      소계: ₩{((item.product.price ?? 0) * item.quantity).toLocaleString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className={styles.detailProductsGrid}>
                                {order.orderProducts?.map((item, idx) => (
                                  <div key={idx} className={styles.detailCard}>
                                    <div className={styles.detailHeader}>
                                      <span className={styles.detailName}>{item.product.productName}</span>
                                      <span className={styles.detailUnitPrice}>₩{(item.product.price ?? 0).toLocaleString()}</span>
                                    </div>
                                    <div className={styles.detailMeta}>
                                      <span className={styles.detailQty}>수량: {item.quantity}</span>
                                      <span className={styles.detailSubtotal}>
                                        소계: ₩{((item.product.price ?? 0) * item.quantity).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
