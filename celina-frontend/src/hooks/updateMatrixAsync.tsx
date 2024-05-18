import Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const updateMatrixAsync = async (workspace: Blockly.Workspace, matrix: number[][], setMatrix: React.Dispatch<React.SetStateAction<number[][]>>, key: boolean, setKey:React.Dispatch<React.SetStateAction<boolean>>, complete: boolean, setComplete: React.Dispatch<React.SetStateAction<boolean>>, position: {x: number, y:number}, setPosition: React.Dispatch<React.SetStateAction<{x: number, y:number}>>) => {
    const code = javascriptGenerator.workspaceToCode(workspace);
    
    const findPlayer = (matrix: number[][]): [number, number] | null => {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === 5) { 
                    return [i, j];
                }
            }
        }
        return null;
    };

    const runCode = async (code: string) => {
        const playerPosition = findPlayer(matrix);
        if (!playerPosition) {
            throw new Error("Player not found in the matrix.");
        }

        const [x, y] = playerPosition;
        
        await eval(`(async () => { ${code} })()`);
        
    };

    try {
        await runCode(code);
    } catch (error) {
        console.error("Error executing Blockly code:", error);
    }
};

export default updateMatrixAsync;