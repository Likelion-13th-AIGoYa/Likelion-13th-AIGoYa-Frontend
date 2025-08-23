import React, { useEffect, useState } from "react";
import { getMyStore } from "../api/storeApi";

export default function MyPage() {
  const [store, setStore] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyStore();
        setStore(data);
      } catch (e) {
        console.error("가게 정보 불러오기 실패:", e);
      }
    })();
  }, []);

  if (!store) return <p>로딩중...</p>;

  return (
    <div>
      <h1>마이페이지</h1>
      <p>상호명: {store.name}</p>
      <p>주소: {store.address}</p>
      <p>전화번호: {store.phone}</p>
      <p>이메일: {store.email}</p>
    </div>
  );
}
