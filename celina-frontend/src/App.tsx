import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './contexts/Auth/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import LobbyRoom from './pages/Lobby';
import CelRoom from './pages/SalaCelina';
function App() {
  const { user, validateToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await validateToken();
      } catch (error) {
        console.error('Error validating token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Routes>
        <Route path='/' element={
          isLoading ? (
            <div>Loading...</div>
          ) : (
            user ? (
              <Navigate to="/Lobby" replace />
            ) : (
              <Navigate to="/Login" replace />
            )
          )
        }
        />
        <Route path='/Login' element={
          isLoading ? (
            <div>Loading...</div>
          ) : (
            user ? (
              <Navigate to="/Lobby" replace />
            ) : (
              <Navigate to="/Login" replace />
            )
          )
        }
        />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Lobby" element={<RequireAuth><LobbyRoom /></RequireAuth>} />
        <Route path="/CelinaRoom" element={<RequireAuth><CelRoom /></RequireAuth>} />
      </Routes>
    </>
  )
}

export default App
