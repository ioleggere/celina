import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import Lobby from "../../components/Lobby/Lobby";
import './index.scss'
import Chat from "../../components/Chat/Chat";
function LobbyRoom() {
    const [sceneOutFocus, setsceneOutFocus] = useState(false)
    const auth = useContext(AuthContext);
    const handleLogout = async () => {
        await auth.signout();
        window.location.href = window.location.href;
    }
    const handleFocus = () => {
        setsceneOutFocus(true);
    };
    const handledesFocus = () => {
        setsceneOutFocus(false);
    };

    return (
        <div className="lobby-page">
            <div className="btn_logout">
                <button onClick={handleLogout} >Logout</button>
            </div>
            <div className="lobby-game">
                <Lobby isFocused={!sceneOutFocus}  />
            </div>
            <div className="chat" onFocus={handleFocus} onBlur={handledesFocus}>
                <Chat />
            </div>

        </div>

    )
}

export default LobbyRoom