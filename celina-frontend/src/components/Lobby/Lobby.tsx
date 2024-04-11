import { useState, useEffect } from 'react';
import './index_lobby.scss'
function Lobby() {
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
    const [playerDirection, setPlayerDirection] = useState('right');
    const [isMoving, setIsMoving] = useState(false);
    useEffect(() => {
        const handleKeyPress = (event: { key: any; }) => {
            const speed = 12;
            let newX = playerPosition.x;
            let newY = playerPosition.y;
            if (!isMoving) {
                switch (event.key) {
                    case 'w':
                        newY -= speed;
                        setIsMoving(true);
                        break;
                    case 'a':
                        newX -= speed;
                        setPlayerDirection('left');
                        setIsMoving(true);
                        break;
                    case 's':
                        newY += speed;
                        setIsMoving(true);
                        break;
                    case 'd':
                        newX += speed;
                        setPlayerDirection('right');
                        setIsMoving(true);
                        break;
                    default:
                        break;
                }

                if (newX >= -16 && newX <= (211 - 30) && newY >= 0 && newY <= (143 - 10)) {
                    setPlayerPosition({ x: newX, y: newY });
                }
            }
        };
        const handleKeyRelease = () => {
            setIsMoving(false);
        };
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyRelease);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyRelease);
        };
    }, [playerPosition, isMoving]);
    return (
        <div className="lobby">
            <img src="celina-room-outside.png" alt="outside" className="cel-outside" />
            <div className="floor">
                <img
                    src="lobby-floor.png"
                    alt="lobby-floor"
                    className="floor-image"
                    style={{ position: 'relative', top: 0, left: 0 }}
                />
                <div
                    className={`player ${playerDirection === 'left' ? 'player-flipped' : ''}`}
                    style={{ position: 'absolute', top: playerPosition.y, left: playerPosition.x }}
                >
                    <img src="panda.png" alt="player" />
                </div>
            </div>
        </div>

    )
}

export default Lobby
