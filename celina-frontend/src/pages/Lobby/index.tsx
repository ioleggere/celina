import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import Lobby from "../../components/Lobby/Lobby";
import './index.scss'
import Chat from "../../components/Chat/Chat";
import io from 'socket.io-client';
function LobbyRoom() {
    const [sceneOutFocus, setsceneOutFocus] = useState(false)
    const auth = useContext(AuthContext);
    const socket = io(import.meta.env.VITE_CELINA_API + '/lobby');
    const handleLogout = async () => {
        socket.emit('custom_disconnect', {
            userId: auth.user?.id,
            username: auth.user?.username,
        });
        socket.disconnect();
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

            <div className="lobby-game">
                <Lobby isFocused={!sceneOutFocus} socket={socket} />
            </div>
            <div className="chat" onFocus={handleFocus} onBlur={handledesFocus}>
                <Chat socket={socket} />
            </div>
            <button className="btn_logout" onClick={handleLogout} >Logout</button>
        </div>

    )
}

export default LobbyRoom