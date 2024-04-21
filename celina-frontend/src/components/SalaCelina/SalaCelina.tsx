
import './index_celroom.scss'
import Panda from '../Player/Panda';
import { useState } from 'react';
interface LobbyProps {
    isFocused: boolean
}
const SalaCelina: React.FC<LobbyProps> = ({ isFocused }) => {
    const [showMenenobox, setShowMenenobox] = useState(false);
    
    const handleMouseEnter = () => {
        setShowMenenobox(true); 
    };

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
        </div>

    )
}

export default SalaCelina
