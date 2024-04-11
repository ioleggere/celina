import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import Lobby from "../../components/Lobby/Lobby";
import './index.scss'
import Chat from "../../components/Chat/Chat";
function LobbyRoom() {
    const auth = useContext(AuthContext);
    const handleLogout = async () => {
        await auth.signout();
        window.location.href = window.location.href;
    }
    return (
        <div className="lobby-page">
            <div className="btn_logout">
                <button onClick={handleLogout} >Logout</button>
            </div>
            <div className="lobby-game">
                <Lobby />
            </div>
            <div className="chat">
                <Chat/>
            </div>

        </div>

    )
}

export default LobbyRoom