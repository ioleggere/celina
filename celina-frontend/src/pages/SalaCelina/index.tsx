import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import SalaCelina from "../../components/SalaCelina/SalaCelina";
import './index.scss'
import Chat from "../../components/Chat/Chat";
function CelRoom() {
    const [sceneOutFocus, setsceneOutFocus] = useState(false)
    const auth = useContext(AuthContext);
    const handleLogout = async () => {
        await auth.signout('celroom');
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
                <SalaCelina isFocused={!sceneOutFocus}  />
            </div>
            <div className="chat" onFocus={handleFocus} onBlur={handledesFocus}>
                <Chat/>
            </div>
            <div className="btn_logout">
                <button onClick={handleLogout} >Logout</button>
            </div>
        </div>

    )
}

export default CelRoom