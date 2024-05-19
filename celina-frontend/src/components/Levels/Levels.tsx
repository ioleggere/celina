import './index_levels.scss'
import { useApi } from '../../hooks/useApi';
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
interface Level {
    id: number;
    name: string;
    matrix: number[][];
}
function LevelsRoom() {
    const api = useApi();
    const [levels, setLevels] = useState<Level[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const response = await api.getLevels();

                setLevels(response);
            } catch (error) {
                console.error('Error fetching levels:', error);
            }
        };

        fetchLevels();
    }, []);
    const handleLevelClick = (matrix: number[][]) => {
        console.log(matrix)
        const encodedMatrix = encodeURIComponent(JSON.stringify(matrix));
        navigate(`/PlayLevel?matrix=${encodedMatrix}`);
    };
    return (
        <div className="levels">
            <h2>Levels List</h2>
            <List>
                {levels.map(level => (
                    <ListItem key={level.id} button onClick={() => handleLevelClick(level.matrix)} className='list-item'>
                        <ListItemText primary={<Typography variant="h5" style={{ color: 'lightblue' }}>{level.name}</Typography>} ></ListItemText>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}
export default LevelsRoom