import { useContext, useEffect, useState } from "react";
import './index.scss'
import { AuthContext } from "../../contexts/Auth/AuthContext";

interface PandaProps {
    xsize: number;
    ysize: number;
    canMove: boolean;
}

const Panda: React.FC<PandaProps> = ({ xsize, ysize, canMove }) => {
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
    const [playerDirection, setPlayerDirection] = useState('right');
    const [isMoving, setIsMoving] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const auth = useContext(AuthContext);
    useEffect(() => {
        const handleKeyPress = (event: { key: any; }) => {
            const speed = 12;
            let newX = playerPosition.x;
            let newY = playerPosition.y;
            if (!isMoving && canMove) {
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

                if (newX >= -6 && newX <= (xsize) && newY >= -27 && newY <= (ysize)) {
                    setPlayerPosition({ x: newX, y: newY });
                }
            } else {
                console.log(canMove)
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
    }, [playerPosition, isMoving, canMove]);
    const handleDoubleClick = () => {
        setClickCount(clickCount + 1);
        if (clickCount === 1) {
            console.log("Clique duplo detectado!");
        }
        setTimeout(() => {
            setClickCount(0);
        }, 300);
    };
    return (
        <div>
            <div    
                style={{ zIndex: 1, display: 'flex', flexDirection: 'column', position: 'absolute', top: playerPosition.y, left: playerPosition.x }}
            >
                <span className="player-username">{auth.user?.username}</span>
                <span className={`player ${playerDirection === 'left' ? 'player-flipped' : ''}`} onClick={handleDoubleClick}>
                    <img src="panda.png" className='player-container' alt="player" />
                </span>            
            </div>
        </div>

    )
}

export default Panda;