import { useEffect, useState } from "react";
import './index.scss'

interface OtherPandaProps {
    username: string
    position: {x: number, y: number}
    direction: string
}

const OtherPanda: React.FC<OtherPandaProps> = ({ username, position, direction}) => {
    const [playerPosition, setPlayerPosition] = useState(position);
    useEffect(() => {
        setPlayerPosition(position)
    }, [position]);
    return (
        <div>
            <div    
                style={{ zIndex: 1, display: 'flex', flexDirection: 'column', position: 'absolute', top: playerPosition.y, left: playerPosition.x }}
            >
                <span className="player-username">{username}</span>
                <span className={`player ${direction === 'left' ? 'player-flipped' : ''}`}>
                    <img src="panda.png" className='player-container' alt="player" />
                </span>            
            </div>
        </div>

    )
}

export default OtherPanda;