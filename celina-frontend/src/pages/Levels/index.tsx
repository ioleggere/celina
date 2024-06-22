import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import './index.scss'
import Chat from "../../components/Chat/Chat";
import Levels from "../../components/Levels/Levels";
function LevelsRoom() {
    const auth = useContext(AuthContext);
    const handleLogout = async () => {
        await auth.signout();
        window.location.href = window.location.href;
    }

    return (
        <div className="levels-page">
            <button onClick={handleLogout} className="btn_logout-levels">Logout</button>
            <div className="levels-component">
                <Levels />
            </div>
            {/* <div className="chat">
                <Chat />
            </div> */}

        </div>

    )
}

export default LevelsRoom