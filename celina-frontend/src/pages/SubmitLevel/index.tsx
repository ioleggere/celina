import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";

import './index.scss'
import Chat from "../../components/Chat/Chat";
import SubmitLevel from "../../components/SubmitLevel/SubmitLevel";
import { useLocation } from "react-router-dom";
function SubmitLevelRoom() {
    const location = useLocation();
    const { matrixData } = location.state;
    const auth = useContext(AuthContext);
    const handleLogout = async () => {
        await auth.signout();
        window.location.href = window.location.href;
    }

    return (
        <div className="submit-page">
            
            <div className="submit-component">
                <SubmitLevel matrixData={matrixData}/>
            </div>

            <div className="btn_logout">
                <button onClick={handleLogout} >Logout</button>
            </div>
        </div>

    )
}

export default SubmitLevelRoom