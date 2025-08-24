import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from './page/MainPage';
import ChatBotPage from './page/ChatBotPage';
import LoginPage from './page/LoginPage';
import PosMachinePage from './page/PosMachinePage';
import MyPage from './page/MyPage';
import MyPageEdit from './component/MyPageEdit';
import OrderList from './page/OrderList';


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
          <Route path="/posMachine" element={<PosMachinePage />} />
          <Route path="/main/mypage" element={<MyPage />} />
          <Route path="/main/orders" element={<OrderList />} />          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;