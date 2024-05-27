import { useContext, useEffect, useState } from "react";
import './index.scss'
import { AuthContext } from "../../contexts/Auth/AuthContext";
import io from 'socket.io-client';
interface PandaProps {
    xsize: number;
    ysize: number;
    canMove: boolean;
    position: { x: number, y: number }
    disconect: boolean;
    room: string;
}

const Panda: React.FC<PandaProps> = ({ xsize, ysize, canMove, position, disconect, room }) => {
    const [playerPosition, setPlayerPosition] = useState({ x: position.x, y: position.y });
    const [playerDirection, setPlayerDirection] = useState('right');
    const [isMoving, setIsMoving] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const auth = useContext(AuthContext);
    const socket = io(import.meta.env.VITE_CELINA_API + '/' + room);
    useEffect(() => {
        socket.emit('player_position', {
            userId: auth.user?.id,
            username: auth.user?.username,
            newX: playerPosition.x,
            newY: playerPosition.y,
            direction: playerDirection
        });
        if (disconect) {
            socket.emit('disconnect', {
                userId: auth.user?.id,
                username: auth.user?.username,
            });
        }
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
                    socket.emit('player_position', {
                        userId: auth.user?.id,
                        username: auth.user?.username,
                        newX: newX,
                        newY: newY,
                        direction: playerDirection
                    });
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
    }, [playerPosition, isMoving, canMove, disconect]);
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