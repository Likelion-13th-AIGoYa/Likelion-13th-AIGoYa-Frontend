import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from './page/mainPage';
import ChatBotPage from './page/chatBotPage';
import LoginPage from './page/loginPage';
import PosMachinePage from './page/posMachinePage';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
          <Route path="/posMachine" element={<PosMachinePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;