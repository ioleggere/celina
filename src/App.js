import { BrowserRouter, Routes, Route } from "react-router-dom";
import LobbyScene from './lobbyScene';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element= {<LobbyScene/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
