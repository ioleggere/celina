
import './index_lobby.scss'
import Panda from '../Player/Panda';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import OtherPanda from '../OtherPlayer/OtherPanda';
import { AuthContext } from "../../contexts/Auth/AuthContext";
interface Player {
    username: string;
    id: number;
    x: number;
    y: number;
    direction: string;
}
interface LobbyProps {
    isFocused: boolean
}
const Lobby: React.FC<LobbyProps> = ({ isFocused }) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const socket = io(import.meta.env.VITE_CELINA_API + '/lobby');
    const [showPopup, setShowPopup] = useState(false);
    const [disconect, setDisconect] = useState(false);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    useEffect(() => {
        
        socket.on('custom_disconnect', (data: any) => {
            console.log('Disconnected from room:', data);
            // Remove o jogador desconectado da lista de jogadores
            setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== data.userId));
        });

        socket.on('update_player_position', (data: any) => {
            //console.log('Received position from other client:', data);
            //console.log(players.findIndex(player => player.id === 35))
            if (data.userId !== auth.user?.id) {
                // Verifique se o jogador já está na lista
                const playerIndex = players.findIndex(player => player.id === data.userId);

                if (playerIndex !== -1) {
                    // Atualize a posição do jogador na lista de jogadores
                    setPlayers((prevPlayers: Player[]) =>
                        prevPlayers.map((player, index) =>
                            index === playerIndex ? { ...player, x: data.newX, y: data.newY, direction: data.direction, username: data.username, id: data.userId } : player
                        )
                    );
                } else {
                    // Se o jogador não estiver na lista, adicione-o
                    setPlayers((prevPlayers: Player[]) => [
                        ...prevPlayers,
                        { id: data.userId, direction: data.direction, username: data.username, x: data.newX, y: data.newY }
                    ]);
                }
            }

        });
        return () => {
            socket.off('custom_disconnect');
            socket.off('update_player_position');
        };
    }, [players, socket, auth]);
    const handleGoCelinaRoom = () => {
        socket.emit('custom_disconnect', {
            userId: auth.user?.id,
            username: auth.user?.username,
        });
        socket.disconnect(); // Certifique-se de desconectar o socket
        setTimeout(() => {
            navigate('/CelinaRoom');
        }, 500);
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
                <Panda xsize={188} ysize={90} canMove={isFocused} position={{ x: 0, y: 0 }} disconect={disconect} room='lobby' />
                {players.map((player, index) => (
                    <OtherPanda
                        key={index} // Use the index from the map function
                        username={player.username}
                        position={{ x: player.x, y: player.y }}
                        direction={player.direction}
                    />
                ))}
                {showPopup && (
                    <div className="popup-manel">
                        <div className="popup-content-manel">
                            <p className="popup-text-manel">
                                Este é o lendario "Goleta de Manel", fez história enquanto esteve em suas mãos!

                            </p>
                            <button className="popup-btn" onClick={togglePopup}>Fechar</button>
                        </div>

                    </div>
                )}
            </div>
            <img src="goleta.png" alt="goleta" className="goleta" id="goleta-img" onClick={togglePopup} />

        </div>

    )
}

export default Lobby
