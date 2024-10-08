import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { useContext, useEffect } from 'react';
import { AuthContext } from './contexts/Auth/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import LobbyRoom from './pages/Lobby';
import CelRoom from './pages/SalaCelina';
import MakerRoom from './pages/Maker';
import SubmitLevelRoom from './pages/SubmitLevel';
import LevelsRoom from './pages/Levels';
import PlayRoom from './pages/Play';
import Tutorial from './pages/Tutorial';

function App() {
  const { user, validateToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await validateToken();
    };
    fetchData();
  }, []);
  //
  useEffect(() => {
    if (user !== null) {
      if (user) {
        navigate('/Lobby', { replace: true });
      } else {
        navigate('/Login', { replace: true });
      }
    }
  }, [user]);
  return (
    <>
      <Routes>
        <Route path='/' element={user ? <Navigate to="/Lobby" replace /> : <Navigate to="/Login" replace />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/Lobby' element={<RequireAuth><LobbyRoom /></RequireAuth>} />
        <Route path='/CelinaRoom' element={<RequireAuth><CelRoom /></RequireAuth>} />
        <Route path='/Maker' element={<RequireAuth><MakerRoom /></RequireAuth>} />
        <Route path='/SubmitLevel' element={<RequireAuth><SubmitLevelRoom /></RequireAuth>} />
        <Route path='/Levels' element={<RequireAuth><LevelsRoom /></RequireAuth>} />
        <Route path='/PlayLevel' element={<RequireAuth><PlayRoom /></RequireAuth>} />
        <Route path='/Tutorial' element={<RequireAuth><Tutorial /></RequireAuth>} />
      </Routes>
    </>
  )
}

export default App
