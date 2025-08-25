import React, { useState, useEffect } from 'react';
import styles from '../css/EmployeePage.module.css';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../api/StoreApi';
import Header from '../component/Header';

const DAYS_OF_WEEK = [
  { key: 'MONDAY', label: '월', dayNum: 1 },
  { key: 'TUESDAY', label: '화', dayNum: 2 },
  { key: 'WEDNESDAY', label: '수', dayNum: 3 },
  { key: 'THURSDAY', label: '목', dayNum: 4 },
  { key: 'FRIDAY', label: '금', dayNum: 5 },
  { key: 'SATURDAY', label: '토', dayNum: 6 },
  { key: 'SUNDAY', label: '일', dayNum: 7 }
];

// 시간/분 선택기
const TimeSelector = ({ value, onChange, placeholder = "시간 선택" }) => {
  const [hour, minute] = (value || '').split(':');
  const [showHourDropdown, setShowHourDropdown] = useState(false);
  const [showMinuteDropdown, setShowMinuteDropdown] = useState(false);
  const [hourFocused, setHourFocused] = useState(false);
  const [minuteFocused, setMinuteFocused] = useState(false);

  const hours = Array.from({length: 24}, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({length: 12}, (_, i) => String(i * 5).padStart(2, '0')); // 5분 간격

  // 시간 입력 처리 (최대 2자리, 0-23 범위)
const handleHourInput = (e) => {
  let input = e.target.value.replace(/\D/g, ''); // 숫자만 허용
  
  // 2자리까지만 허용
  if (input.length > 2) {
    input = input.slice(0, 2);
  }
  
  // 23보다 크면 23으로 제한
  if (parseInt(input) > 23) {
    input = '23';
  }
  
  const currentMinute = minute || '';  // '00' 대신 ''로 변경
  onChange(`${input}:${currentMinute}`);  // padStart 제거
};

  // 분 입력 처리 (최대 2자리, 0-59 범위)
const handleMinuteInput = (e) => {
  let input = e.target.value.replace(/\D/g, ''); // 숫자만 허용
  
  // 2자리까지만 허용
  if (input.length > 2) {
    input = input.slice(0, 2);
  }
  
  // 59보다 크면 59로 제한
  if (parseInt(input) > 59) {
    input = '59';
  }
  
  const currentHour = hour || '';  // '00' 대신 ''로 변경
  onChange(`${currentHour}:${input}`);  // padStart 제거
};

  // 드롭다운에서 선택
  const selectHour = (selectedHour) => {
    const currentMinute = minute || '';
    onChange(`${selectedHour}:${currentMinute}`);
    setShowHourDropdown(false);
  };

  const selectMinute = (selectedMinute) => {
    const currentHour = hour || '';
    onChange(`${currentHour}:${selectedMinute}`);
    setShowMinuteDropdown(false);
  };

  // 포커스 아웃 시 2자리로 패딩
  const handleHourBlur = (e) => {
    setHourFocused(false);
    if (e.target.value) {
      const paddedValue = e.target.value.padStart(2, '0');
      const currentMinute = minute || '';
      onChange(`${paddedValue}:${currentMinute}`);
    }
  };

  const handleMinuteBlur = (e) => {
    setMinuteFocused(false);
    if (e.target.value) {
      const paddedValue = e.target.value.padStart(2, '0');
      const currentHour = hour || '';
      onChange(`${currentHour}:${paddedValue}`);
    }
  };

  // 포커스 시 상태 변경
  const handleHourFocus = () => {
    setHourFocused(true);
  };

  const handleMinuteFocus = () => {
    setMinuteFocused(true);
  };

  return (
    <div className={styles.timeSelectorGroup}>
      {/* 시간 입력 */}
      <div className={styles.timeInputWrapper}>
        <input
          type="text"
          value={hourFocused && !hour ? '' : (hour || '')}
          onChange={handleHourInput}
          onBlur={handleHourBlur}
          onFocus={handleHourFocus}
          placeholder={hourFocused ? '__' : '00'}
          className={styles.timeInput}
          maxLength="2"
        />
        <button
          type="button"
          className={styles.dropdownToggle}
          onClick={() => setShowHourDropdown(!showHourDropdown)}
        >
          ▼
        </button>
        {showHourDropdown && (
          <div className={styles.dropdownMenu}>
            {hours.map(h => (
              <div
                key={h}
                className={styles.dropdownItem}
                onClick={() => selectHour(h)}
              >
                {h}
              </div>
            ))}
          </div>
        )}
      </div>

      <span className={styles.timeSeparator}>:</span>

      {/* 분 입력 */}
      <div className={styles.timeInputWrapper}>
        <input
          type="text"
          value={minuteFocused && !minute ? '' : (minute || '')}
          onChange={handleMinuteInput}
          onBlur={handleMinuteBlur}
          onFocus={handleMinuteFocus}
          placeholder={minuteFocused ? '__' : '00'}
          className={styles.timeInput}
          maxLength="2"
        />
        <button
          type="button"
          className={styles.dropdownToggle}
          onClick={() => setShowMinuteDropdown(!showMinuteDropdown)}
        >
          ▼
        </button>
        {showMinuteDropdown && (
          <div className={styles.dropdownMenu}>
            {minutes.map(m => (
              <div
                key={m}
                className={styles.dropdownItem}
                onClick={() => selectMinute(m)}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    hourlyWage: '',
    workStartTime: '',
    workEndTime: '',
    workDays: []
  });

  // 직원 목록 조회
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      // console.error('직원 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 통계 계산
  const totalEmployees = employees.length;
  const currentWorkers = getCurrentWorkers();
  const monthlyLaborCost = calculateMonthlyLaborCost();

  // 현재 근무중인 직원 수 계산
  function getCurrentWorkers() {
    const today = new Date().getDay();
    const todayNum = today === 0 ? 7 : today; // 일요일을 7로 변경
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    return employees.filter(employee => {
      const todayWorking = employee.workDays.some(day => DAYS_OF_WEEK.find(d => d.key === day)?.dayNum === todayNum);
      if (!todayWorking) return false;
      return currentTimeString >= employee.workStartTime && currentTimeString <= employee.workEndTime;
    }).length;
  }

  // 이번 달 인건비 계산
  function calculateMonthlyLaborCost() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return employees.reduce((total, employee) => {
      const workDaysCount = employee.workDays.length;
      const dailyHours = calculateDailyHours(employee.workStartTime, employee.workEndTime);
      const weeksInMonth = Math.ceil(daysInMonth / 7);
      const monthlyHours = (workDaysCount * weeksInMonth * dailyHours);
      
      return total + (monthlyHours * employee.hourlyWage);
    }, 0);
  }

  // 일일 근무 시간 계산
  function calculateDailyHours(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    return (endTotalMinutes - startTotalMinutes) / 60;
  }

  // 오늘 근무자 목록
  const getTodayWorkers = () => {
    const today = new Date().getDay();
    const todayNum = today === 0 ? 7 : today; // 일요일을 7로 변경
    return employees.filter(employee => 
      employee.workDays.some(day => DAYS_OF_WEEK.find(d => d.key === day)?.dayNum === todayNum)
    );
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      hourlyWage: '',
      workStartTime: '',
      workEndTime: '',
      workDays: []
    });
    setEditingEmployee(null);
  };

  // 모달 열기
  const openModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        role: employee.role,
        hourlyWage: employee.hourlyWage,
        workStartTime: employee.workStartTime,
        workEndTime: employee.workEndTime,
        workDays: employee.workDays
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const employeeData = {
        ...formData,
        hourlyWage: parseInt(formData.hourlyWage)
      };

      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, employeeData);
      } else {
        await addEmployee(employeeData);
      }
      
      await fetchEmployees();
      closeModal();
    } catch (error) {
      // console.error('직원 저장 실패:', error);
      alert('직원 정보 저장에 실패했습니다.');
    }
  };

  // 직원 삭제
  const handleDelete = async (employeeId) => {
    if (!window.confirm('정말로 이 직원을 삭제하시겠습니까?')) return;
    
    try {
      await deleteEmployee(employeeId);
      await fetchEmployees();
    } catch (error) {
      // console.error('직원 삭제 실패:', error);
      alert('직원 삭제에 실패했습니다.');
    }
  };

  // 근무 요일 선택 처리
  const handleWorkDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day]
    }));
  };

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      <Header />
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>직원 관리</h1>
        <button className={styles.addButton} onClick={() => openModal()}>
          + 직원 추가
        </button>
      </div>

      {/* 통계 카드 */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>총 직원 수</div>
          <div className={styles.statValue}>{totalEmployees}명</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>현재 근무자</div>
          <div className={styles.statValue}>{currentWorkers}명</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>이번 달 인건비</div>
          <div className={styles.statValue}>₩{monthlyLaborCost.toLocaleString()}</div>
        </div>
      </div>

      {/* 직원 목록 테이블 */}
      <div className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>직원 목록</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>이름</th>
                <th>역할</th>
                <th>시급</th>
                <th>근무시간</th>
                <th>근무요일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.role}</td>
                  <td>₩{employee.hourlyWage.toLocaleString()}</td>
                  <td>{employee.workStartTime} - {employee.workEndTime}</td>
                  <td>
                    {employee.workDays
                      .sort((a, b) => DAYS_OF_WEEK.find(d => d.key === a).dayNum - DAYS_OF_WEEK.find(d => d.key === b).dayNum)
                      .map(day => DAYS_OF_WEEK.find(d => d.key === day)?.label)
                      .join(', ')
                    }
                  </td>
                  <td>
                    <button 
                      className={styles.editButton}
                      onClick={() => openModal(employee)}
                    >
                      수정
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(employee.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.emptyMessage}>
                    등록된 직원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 오늘 근무자 섹션 */}
      <div className={styles.todaySection}>
        <h2 className={styles.sectionTitle}>오늘 근무자</h2>
        <div className={styles.todayWorkers}>
          {getTodayWorkers().map(employee => (
            <div key={employee.id} className={styles.workerCard}>
              <div className={styles.workerName}>{employee.name}</div>
              <div className={styles.workerInfo}>
                {employee.role} • {employee.workStartTime} - {employee.workEndTime}
              </div>
            </div>
          ))}
          {getTodayWorkers().length === 0 && (
            <div className={styles.emptyMessage}>오늘 근무자가 없습니다.</div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingEmployee ? '직원 정보 수정' : '직원 추가'}</h3>
              <button className={styles.closeButton} onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>이름</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>역할</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  placeholder="예: 파트타이머, 매니저"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>시급 (원)</label>
                <input
                  type="number"
                  value={formData.hourlyWage}
                  onChange={e => setFormData({...formData, hourlyWage: e.target.value})}
                  min="0"
                  required
                />
              </div>

              <div className={styles.timeGroup}>
                <div className={styles.formGroup}>
                  <label>근무 시작 시간</label>
                  <TimeSelector
                    value={formData.workStartTime}
                    onChange={value => setFormData({...formData, workStartTime: value})}
                    placeholder="09:00"
                  />
                </div>
                
                <div className={styles.timeGroupSeparator}>~</div>
                
                <div className={styles.formGroup}>
                  <label>근무 종료 시간</label>
                  <TimeSelector
                    value={formData.workEndTime}
                    onChange={value => setFormData({...formData, workEndTime: value})}
                    placeholder="18:00"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>근무 요일</label>
                <div className={styles.daySelector}>
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day.key}
                      type="button"
                      className={`${styles.dayButton} ${
                        formData.workDays.includes(day.key) ? styles.selected : ''
                      }`}
                      onClick={() => handleWorkDayChange(day.key)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                  취소
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingEmployee ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;