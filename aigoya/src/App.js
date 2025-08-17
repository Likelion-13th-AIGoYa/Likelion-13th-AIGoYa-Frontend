import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from './page/mainPage';
import LoginPage from './page/loginPage'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;