
import './index_lobby.scss'
import Panda from '../Player/Panda';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface LobbyProps {
    isFocused: boolean
}
const Lobby: React.FC<LobbyProps> = ({ isFocused }) => {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleGoCelinaRoom = () => {
        navigate('/CelinaRoom')
    }
    return (
        <div className="lobby">
            <img src="celina-room-outside.png" alt="outside" className="cel-outside" onClick={handleGoCelinaRoom} />

            <div className="floor">
                <img
                    src="lobby-floor.png"
                    alt="lobby-floor"
                    className="floor-image"
                    style={{ position: 'relative', top: 0, left: 0 }}
                />
                <Panda xsize={198} ysize={113} canMove={isFocused} />
            </div>
            <img src="goleta.png" alt="goleta" className="goleta" id="goleta-img" onClick={togglePopup} />
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p className="popup-text">
                            Este é o lendario "Goleta de Manel", fez história enquanto esteve em suas mãos!
                        </p>
                        <button className="popup-btn" onClick={togglePopup}>Fechar</button>
                    </div>
                </div>
            )}
        </div>

    )
}

export default Lobby
