import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";

function Lobby() {
    const auth = useContext(AuthContext);
    const handleLogout = async () => {
        await auth.signout();
        window.location.href = window.location.href;
    }
    return (
        <div>
            <h1>Welcome {auth.user?.username}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>

    )
}

export default Lobby