import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import SalaCelina from "../../components/SalaCelina/SalaCelina";
import './index.scss'
import io from 'socket.io-client';
import Chat from "../../components/Chat/Chat";
function CelRoom() {
    const [sceneOutFocus, setsceneOutFocus] = useState(false)
    const socket = io(import.meta.env.VITE_CELINA_API + '/celroom');
    const auth = useContext(AuthContext);
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
        <div className="celroom-page">

            <div className="celroom-game">
                <SalaCelina isFocused={!sceneOutFocus} socket={socket} />
            </div>
            <div className="chat" onFocus={handleFocus} onBlur={handledesFocus}>
                <Chat socket={socket} />
            </div>
            <button className="btn_logout" onClick={handleLogout} >Logout</button>
        </div>

    )
}

export default CelRoom