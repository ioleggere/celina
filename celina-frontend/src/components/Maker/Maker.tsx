import { useNavigate } from 'react-router-dom';
import './index_maker.scss'
import Matriz from '../Matrix/Matrix';
import ImageRow from '../ImageRow/ImageRow';
import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';
function Maker() {
    const navigate = useNavigate();
    const [scale, setScale] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [matrixData, setMatrixData] = useState<number[][]>(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 0)));

    useEffect(() => {
        updateMatrixSize();
        console.log("vitor")
    }, [matrixData]);

    const updateMatrixSize = () => {
        const newNumRows = matrixData.length;
        const newNumColumns = matrixData[0].length;

        // Verifica se a primeira e última linha contêm algum valor maior que zero
        const firstRowHasValue = matrixData[0].some(val => val > 0);
        const lastRowHasValue = matrixData[newNumRows - 1].some(val => val > 0);

        // Verifica se a primeira e última coluna contêm algum valor maior que zero
        const firstColumnHasValue = matrixData.some(row => row[0] > 0);
        const lastColumnHasValue = matrixData.some(row => row[newNumColumns - 1] > 0);

        // Adiciona uma linha com valores zero acima, se necessário
        if (firstRowHasValue) {
            setMatrixData(prevMatrixData => {
                const newRows = Array.from({ length: 1 }, () => Array.from({ length: newNumColumns }, () => 0));
                return [...newRows, ...prevMatrixData];
            });
        }

        // Adiciona uma linha com valores zero abaixo, se necessário
        if (lastRowHasValue) {
            setMatrixData(prevMatrixData => {
                const newRows = Array.from({ length: 1 }, () => Array.from({ length: newNumColumns }, () => 0));
                return [...prevMatrixData, ...newRows];
            });
        }

        // Adiciona uma coluna com valores zero à esquerda, se necessário
        if (firstColumnHasValue) {
            setMatrixData(prevMatrixData => {
                const newColumns = Array.from({ length: prevMatrixData.length }, () => 0);
                return prevMatrixData.map((row, index) => [0, ...row]);
            });
        }

        // Adiciona uma coluna com valores zero à direita, se necessário
        if (lastColumnHasValue) {
            setMatrixData(prevMatrixData => {
                const newColumns = Array.from({ length: prevMatrixData.length }, () => 0);
                return prevMatrixData.map(row => [...row, 0]);
            });
        }
    };


    const setNumRows = (newNumRows: number) => {
        setMatrixData(prevMatrixData => {
            const diff = newNumRows - prevMatrixData.length;
            if (diff > 0) {
                const newRows = Array.from({ length: diff }, () => Array.from({ length: prevMatrixData[0].length }, () => 0));
                return [...prevMatrixData, ...newRows];
            }
            return prevMatrixData;
        });
    };

    const setNumColumns = (newNumColumns: number) => {
        setMatrixData(prevMatrixData => {
            const diff = newNumColumns - prevMatrixData[0].length;
            if (diff > 0) {
                const newColumns = Array.from({ length: prevMatrixData.length }, () => 0);
                return prevMatrixData.map(row => [...row, ...newColumns]);
            }
            return prevMatrixData;
        });
    };

    const handleGoCelinaRoom = () => {
        navigate('/CelinaRoom');
    };

    const handleZoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.1, 1));
    };

    const handleZoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.1, 0.1));
    };

    const handleImageSelect = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleCellClick = (rowIndex: number, cellIndex: number) => {
        if (selectedImage !== null) {
            const newMatrixData = [...matrixData];
            newMatrixData[rowIndex][cellIndex] = parseInt(selectedImage.replace('.png', ''), 10);
            setMatrixData(newMatrixData);
            console.log(newMatrixData);
        }
    };

    const matrixWidth = matrixData[0].length * 30; // Calcula a largura da matriz
    const matrixHeight = matrixData.length * 30; // Calcula a altura da matriz

    return (
        <div className="lobby">
            <div className='matrix-container'>
                <div className='matrix' style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: matrixWidth, height: matrixHeight }}>
                    <Matriz matriz={matrixData} onCellClick={handleCellClick} />
                </div>
            </div>
            <div className='image-editor'>
                <div className="actual-image">{selectedImage && <img src={selectedImage} alt="Selected Image" style={{ width: '15px', height: '15px' }} />}</div>
                <ImageRow onImageSelect={handleImageSelect} />
            </div>
            <Slider
                value={scale * 10}
                className='sliderzoom'
                onChange={(event, newValue) => {
                    if (typeof newValue === 'number') {
                        setScale(newValue / 10); 
                    }
                }}
                aria-labelledby="continuous-slider"
                step={0.1}
                min={1} 
                max={10} 
                valueLabelDisplay="auto"
            />
            <button className='leave-btn' onClick={handleGoCelinaRoom}>Voltar</button>
        </div>

    );
}

export default Maker;
