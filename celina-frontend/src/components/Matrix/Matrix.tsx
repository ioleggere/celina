import React from 'react';
import './index.scss'
import { Grid } from '@mui/material';

interface Props {
    matriz: number[][];
    onCellClick: (rowIndex: number, cellIndex: number) => void; 
}

const Matriz: React.FC<Props> = ({ matriz, onCellClick }) => {
    const largura = matriz.length > 0 ? matriz[0].length : 0;
    return (
        <Grid container spacing={{ xs: 0, md: 0, sm: 0 }} columns={{ xs: largura, sm: largura, md: largura }}>
            {matriz.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <Grid item p={0} xs={1} sm={1} md={1} key={`${rowIndex}-${cellIndex}`} spacing={0} className='grid' onClick={() => onCellClick(rowIndex, cellIndex)}>
                            <img src={`${cell}.png`} alt={`Imagem ${cell}`} className='celula' style={{ margin: 0, padding: 0 }}/>
                        </Grid>
                    ))}
                </React.Fragment>
            ))}
        </Grid>
    );
};

export default Matriz;
