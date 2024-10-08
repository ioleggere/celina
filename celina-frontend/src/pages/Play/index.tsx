import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";

import './index.scss'
import Chat from "../../components/Chat/Chat";
import { useLocation } from "react-router-dom";
import PlayLevel from "../../components/PlayLevel/PlayLevel";

function PlayRoom() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const matrixParam = searchParams.get('matrix');
    const matrixData = matrixParam ? JSON.parse(decodeURIComponent(matrixParam)) : null;
    const auth = useContext(AuthContext);
    const handleLogout = async () => {
        await auth.signout();
        window.location.href = window.location.href;
    }

    return (
        <div className="play-page">

            <div className="play-component">
                <PlayLevel matrixData={matrixData} />
            </div>
            {/* <div className="chat-play">
                <Chat/>
            </div> */}
            <button className="btn_logout" onClick={handleLogout} >Logout</button>
        </div>

    )
}

export default PlayRoom