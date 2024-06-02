

import Panda from '../Player/Panda';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './index_celroom.scss'
import OtherPanda from '../OtherPlayer/OtherPanda';
interface LobbyProps {
    isFocused: boolean
}

interface Player {
    username: string;
    id: number;
    x: number;
    y: number;
    direction: string;
}
const SalaCelina: React.FC<LobbyProps> = ({ isFocused }) => {
    const [showMenenobox, setShowMenenobox] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const socket = io(import.meta.env.VITE_CELINA_API + '/celroom');
    const [disconect, setDisconect] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const handleMouseEnter = () => {
        setShowMenenobox(true);
    };
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    const goMaker = () => {
        setDisconect(true)
        navigate('/Maker')
    }
    const goPlay = () =>{
        setDisconect(true)
        navigate('/Levels')
    }
    const goLobby = () => {
        setDisconect(true)
        navigate('/Lobby')
    }
    const handleMouseLeave = () => {
        setShowMenenobox(false);
    };
    useEffect(() => {

        socket.on('curstom_disconnect', (data: any) => {
            console.log('Disconnected from room:', data);
            // Remove o jogador desconectado da lista de jogadores
            setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== data.userId));
        });

        socket.on('update_player_position', (data: any) => {
            console.log('Received position from other client:', data);
            // Verifique se o jogador já está na lista
            const playerIndex = players.findIndex(player => player.id === data.userId);
            if (playerIndex !== -1) {
                // Atualize a posição do jogador na lista de jogadores
                setPlayers((prevPlayers: Player[]) =>
                    prevPlayers.map((player, index) =>
                        index === playerIndex ? { ...player, newX: data.newX, newY: data.newY, direction: data.direction } : player
                    )
                );
            } else {
                // Se o jogador não estiver na lista, adicione-o
                setPlayers((prevPlayers: Player[]) => [
                    ...prevPlayers,
                    { id: data.userId, direction: data.direction, username: '', x: data.newX, y: data.newY }
                ]);
            }
        });
        return () => {
            socket.off('curstom_disconnect');
            socket.off('update_player_position');
        };
    }, []);
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
                    <Panda xsize={170} ysize={59} canMove={isFocused} disconect={disconect} position={{x: 0, y: 0}} room='celroom'/>
                    {players.map(player => (
                    <OtherPanda
                        key={player.id}
                        username={player.username}
                        position={{ x: player.x, y: player.y }}
                        direction={player.direction}
                    />
                ))}
                </div>

            </div>
            {showPopup && (
                <div className="popup-celroom">
                    <div className="popup-content-celroom">
                        <p className="popup-text-celroom">
                            O que deseja?

                        </p>
                        <button className="popup-btn" onClick={goMaker}>Criar Nivel</button>
                        <button className="popup-btn" onClick={goPlay}>Jogar</button>
                        <button className="popup-btn" onClick={goLobby}>Lobby</button>
                        <button className="popup-btn" onClick={togglePopup}>Fechar</button>
                    </div>
                </div>
            )}
        </div>

    )
}

export default SalaCelina
