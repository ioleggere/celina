

import Panda from '../Player/Panda';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './index_celroom.scss'
import OtherPanda from '../OtherPlayer/OtherPanda';
import { AuthContext } from '../../contexts/Auth/AuthContext';
interface LobbyProps {
    isFocused: boolean
    socket: any
}

interface Player {
    username: string;
    id: number;
    x: number;
    y: number;
    direction: string;
}
const SalaCelina: React.FC<LobbyProps> = ({ isFocused, socket }) => {
    const [showMenenobox, setShowMenenobox] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayer, setnewPlayer] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const handleMouseEnter = () => {
        setShowMenenobox(true);
    };
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    const goMaker = () => {
        socket.emit('custom_disconnect', {
            userId: auth.user?.id,
            username: auth.user?.username,
        });
        socket.disconnect(); // Certifique-se de desconectar o socket
        setTimeout(() => {
            navigate('/Maker')
        }, 500);
        
    }
    const goTutorial = () => {
        socket.emit('custom_disconnect', {
            userId: auth.user?.id,
            username: auth.user?.username,
        });
        socket.disconnect(); // Certifique-se de desconectar o socket
        setTimeout(() => {
            navigate('/Tutorial')
        }, 500);
        
    }
    const goPlay = () =>{
        socket.emit('custom_disconnect', {
            userId: auth.user?.id,
            username: auth.user?.username,
        });
        socket.disconnect(); // Certifique-se de desconectar o socket
        setTimeout(() => {
            navigate('/Levels')
        }, 500);

        
    }
    const goLobby = () => {
        socket.emit('custom_disconnect', {
            userId: auth.user?.id,
            username: auth.user?.username,
        });
        socket.disconnect(); // Certifique-se de desconectar o socket
        setTimeout(() => {
            navigate('/Lobby')
        }, 500);
        
    }
    const handleMouseLeave = () => {
        setShowMenenobox(false);
    };
    useEffect(() => {
        
        socket.on('custom_disconnect', (data: any) => {
            console.log('Disconnected from room:', data);
            // Remove o jogador desconectado da lista de jogadores
            setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== data.userId));
        });

        socket.on('update_player_position', (data: any) => {
            console.log('Received position from other client:', data);
            console.log(players)
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
                    setnewPlayer(true);
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
    useEffect(() => {
        if (newPlayer) {
            console.log("vito", newPlayer);
            setTimeout(() => setnewPlayer(false), 100);
            console.log("vito", newPlayer);
        }
    }, [newPlayer]);
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
                title='Clique para navegar entre as possibilidades!'
            />
            <div className="floor">

                <img
                    src="celroom.png"
                    alt="celroom-inside"
                    className="cel-inside"
                    style={{ position: 'relative', top: 0, left: 0 }}
                />
                <div className='boudingboxplayers'>
                    <Panda xsize={170} ysize={59} canMove={isFocused} position={{x: 0, y: 0}} socket={socket} newPlayer={newPlayer}/>
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
                        <button className="popup-btn" onClick={goTutorial}>Tutorial</button>
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
