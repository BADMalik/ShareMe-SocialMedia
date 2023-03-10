import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login'
import Home from './containers/Home';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={<Home />} />

    </Routes>
  );
}

export default App;
