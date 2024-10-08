import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import Maker from "../../components/Maker/Maker";
import './index.scss'
import Chat from "../../components/Chat/Chat";
function MakerRoom() {
    const auth = useContext(AuthContext);
    const handleLogout = async () => {
        await auth.signout();
        window.location.href = window.location.href;
    }

    return (
        <div className="maker-page">

            <div className="maker-game">
                <Maker />
            </div>
            {/* <div className="chat">
                <Chat />
            </div> */}
            <button className="btn_logout" onClick={handleLogout} >Logout</button>
        </div>

    )
}

export default MakerRoom