

import Panda from '../Player/Panda';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface LobbyProps {
    isFocused: boolean
}
import './index_celroom.scss'
const SalaCelina: React.FC<LobbyProps> = ({ isFocused }) => {
    const [showMenenobox, setShowMenenobox] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const handleMouseEnter = () => {
        setShowMenenobox(true);
    };
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    const goMaker = () => {
        navigate('/Maker')
    }
    const handleMouseLeave = () => {
        setShowMenenobox(false);
    };
    return (
        <div className="celroom">
            {showMenenobox && <img src="menenobox.png" alt="meneno" className="menenobox" />}
            <img
                src="celina_sentada.png"
                alt="celina-png"
                className="celina-png"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={togglePopup}
            />
            <div className="floor">

                <img
                    src="celroom.png"
                    alt="celroom-inside"
                    className="cel-inside"
                    style={{ position: 'relative', top: 0, left: 0 }}
                />
                <div className='boudingboxplayers'>
                    <Panda xsize={170} ysize={59} canMove={isFocused} />
                </div>

            </div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p className="popup-text">
                            O que deseja?

                        </p>
                        <button className="popup-btn" onClick={goMaker}>Criar Nivel</button>
                        <button className="popup-btn" onClick={togglePopup}>Jogar</button>
                        <button className="popup-btn" onClick={togglePopup}>Fechar</button>
                    </div>
                </div>
            )}
        </div>

    )
}

export default SalaCelina
