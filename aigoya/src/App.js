import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from './page/mainPage';
import ChatBotPage from './page/chatBotPage';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;