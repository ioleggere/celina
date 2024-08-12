import React, { useEffect, useState } from 'react';
import './index_submiter.scss';
import Matriz from '../Matrix/Matrix';
import { useNavigate } from 'react-router-dom';
import { Slider, TextField } from '@mui/material';
import { BlocklyWorkspace } from 'react-blockly';
import Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';
import updateMatrixAsync from '../../hooks/updateMatrixAsync';
import { javascriptGenerator } from 'blockly/javascript';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useApi } from '../../hooks/useApi';
interface SubmitProps {
  matrixData: number[][];
}

const TOOL_BOX_CATEGORIES = `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <category name="Logic" colour="#5C81A6">
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
    <block type="logic_null"></block>
    <block type="logic_ternary"></block>
  </category>
  <category name="Loops" colour="#5CA65C">
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <block type="math_number">
          <field name="NUM">10</field>
        </block>
      </value>
    </block>
    <block type="controls_whileUntil"></block>
    <block type="controls_for">
      <field name="VAR">i</field>
      <value name="FROM">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
      <value name="TO">
        <block type="math_number">
          <field name="NUM">10</field>
        </block>
      </value>
      <value name="BY">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
    </block>
    <block type="controls_forEach"></block>
    <block type="controls_flow_statements"></block>
  </category>
  <category name="Math" colour="#5C68A6">
    <block type="math_number"></block>
    <block type="math_arithmetic"></block>
    <block type="math_single"></block>
    <block type="math_trig"></block>
    <block type="math_constant"></block>
    <block type="math_number_property"></block>
    <block type="math_round"></block>
    <block type="math_on_list"></block>
    <block type="math_modulo"></block>
    <block type="math_constrain"></block>
    <block type="math_random_int"></block>
    <block type="math_random_float"></block>
  </category>
  <category name="Text" colour="#5CA68D">
    <block type="text"></block>
    <block type="text_join"></block>
    <block type="text_append">
      <field name="VAR">item</field>
    </block>
    <block type="text_length"></block>
    <block type="text_isEmpty"></block>
    <block type="text_indexOf">
      <field name="END">FIRST</field>
    </block>
    <block type="text_charAt">
      <field name="WHERE">FROM_START</field>
    </block>
    <block type="text_getSubstring">
      <field name="WHERE1">FROM_START</field>
      <field name="WHERE2">FROM_END</field>
    </block>
    <block type="text_changeCase"></block>
    <block type="text_trim"></block>
    <block type="text_print"></block>
    <block type="text_prompt_ext">
      <field name="TYPE">TEXT</field>
    </block>
  </category>
  <category name="Lists" colour="#745CA6">
    <block type="lists_create_empty"></block>
    <block type="lists_create_with"></block>
    <block type="lists_repeat"></block>
    <block type="lists_length"></block>
    <block type="lists_isEmpty"></block>
    <block type="lists_indexOf">
      <field name="END">FIRST</field>
    </block>
    <block type="lists_getIndex">
      <field name="MODE">GET</field>
      <field name="WHERE">FROM_START</field>
    </block>
    <block type="lists_setIndex">
      <field name="MODE">SET</field>
      <field name="WHERE">FROM_START</field>
    </block>
    <block type="lists_getSublist">
      <field name="WHERE1">FROM_START</field>
      <field name="WHERE2">FROM_END</field>
    </block>
    <block type="lists_split">
      <field name="MODE">SPLIT</field>
    </block>
    <block type="lists_sort"></block>
  </category>
  <category name="Colour" colour="#A6745C">
    <block type="colour_picker"></block>
    <block type="colour_random"></block>
    <block type="colour_rgb"></block>
    <block type="colour_blend"></block>
  </category>
  <category name="Variables" colour="#A65C81" custom="VARIABLE"></category>
  <category name="Functions" colour="#9A5CA6" custom="PROCEDURE"></category>
  <category name="Custom Blocks" colour="#FF6680">
    <block type="andar"></block>
  </category>
</xml>
`;




const SubmitLevel: React.FC<SubmitProps> = ({ matrixData }) => {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [xml, setXml] = useState<string>('<xml xmlns="http://www.w3.org/1999/xhtml"></xml>');
  const [isAnimating, setIsAnimating] = useState(false);
  const [matrix, setMatrix] = useState(matrixData);
  const api = useApi();
  function deepCopyMatrix(matrix: any[][]): any[][] {
    return matrix.map(row => [...row]);
  }
  const [levelMatrix, setLevelMatrix] = useState(deepCopyMatrix(matrix));
  const [key, setKey] = useState(false);
  const [complete, setComplete] = useState(false);
  const [levelName, setLevelName] = useState('');
  const findStartPosition = (matrixData: number[][]) => {
    for (let i = 0; i < matrixData.length; i++) {
      for (let j = 0; j < matrixData[i].length; j++) {
        if (matrixData[i][j] === 5) {
          return { x: j, y: i };
        }
      }
    }

    return { x: -1, y: -1 };
  }
  const initialPosition = findStartPosition(matrixData);
  const [position, setPosition] = useState(initialPosition);
  const handleGoCelinaRoom = () => {
    navigate('/CelinaRoom');
  };

  Blockly.Blocks['andar'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Andar")
        .appendField(new Blockly.FieldDropdown([["esquerda", "left"], ["direita", "right"], ["cima", "up"], ["baixo", "down"]]), "direction");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("");
      this.setHelpUrl("");
    }
  };

  javascriptGenerator.forBlock['andar'] = function (block: Blockly.Block, generator: Blockly.Generator) {
    var direction = block.getFieldValue('direction');
    const code = `
        // Andar ${direction}
            switch ('${direction}') {
                
                case 'left':
                    if (position.x > 0 && matrix[position.y][position.x - 1] === 1) {
                        matrix[position.y][position.x - 1] = 5;
                        matrix[position.y][position.x] = 1;
                        position = { x: position.x - 1, y: position.y }
                        setPosition(position);
                    } else if (position.x > 0 && matrix[position.y][position.x - 1] === 3) {
                        setKey(true)
                        matrix[position.y][position.x - 1] = 5;
                        matrix[position.y][position.x] = 1;
                        position = { x: position.x - 1, y: position.y }
                        setPosition(position);
                    } else if (position.x > 0 && matrix[position.y][position.x - 1] === 4) {
                        if (key) {
                            setComplete(true);
                            matrix[position.y][position.x - 1] = 5;
                            matrix[position.y][position.x] = 1;
                            position = { x: position.x - 1, y: position.y }
                            setPosition(position);
                        }
                    }
                    break;
                case 'right':
                    if (position.x < matrix[0].length - 1 && matrix[position.y][position.x + 1] === 1) {
                        matrix[position.y][position.x + 1] = 5;
                        matrix[position.y][position.x] = 1;
                        position = { x: position.x + 1, y: position.y }
                        setPosition(position);
                    } else if (position.x < matrix[0].length - 1 && matrix[position.y][position.x + 1] === 3) {
                        key = true;
                        setKey(key)
                        matrix[position.y][position.x + 1] = 5;
                        matrix[position.y][position.x] = 1;
                        position = { x: position.x + 1, y: position.y }
                        setPosition(position);
                    } else if (position.x < matrix[0].length - 1 && matrix[position.y][position.x + 1] === 4) {
                        if (key) {
                            complete = true;
                            setComplete(complete);
                            matrix[position.y][position.x + 1] = 5;
                            matrix[position.y][position.x] = 1;
                            position = { x: position.x + 1, y: position.y }
                            setPosition(position);
                        }
                    }
                    break;
                case 'up':
                    if (position.y > 0 && matrix[position.y - 1][position.x] === 1) {
                        matrix[position.y - 1][position.x] = 5;
                        matrix[position.y][position.x] = 1;
                        position = { x: position.x, y: position.y - 1 }
                        setPosition(position);
                    } else if (position.y > 0 && matrix[position.y - 1][position.x] === 3) {
                        setKey(true)
                        matrix[position.y - 1][position.x] = 5;
                        matrix[position.y][position.x] = 1;
                        position = { x: position.x, y: position.y - 1 }
                        setPosition(position);
                    } else if (position.y > 0 && matrix[position.y - 1][position.x] === 4) {
                        if (key) {
                            setComplete(true);
                            matrix[position.y - 1][position.x] = 5;
                            matrix[position.y][position.x] = 1;
                            position = { x: position.x, y: position.y - 1 }
                            setPosition(position);
                        }
                    }
                    break;
                case 'down':
                    if (position.y < matrix.length - 1 && matrix[position.y + 1][position.x] === 1) {
                        matrix[position.y + 1][position.x] = 5;
                        matrix[position.y][position.x] = 1;
                        position = { x: position.x, y: position.y + 1 }
                        setPosition(position);
                    } else if (position.y < matrix.length - 1 && matrix[position.y + 1][position.x] === 3) {
                        setKey(true)
                        matrix[position.y + 1][position.x] = 5;
                        matrix[position.y][position.x] = 1;
                        position = { x: position.x, y: position.y + 1 }
                        setPosition(position);
                    } else if (position.y < matrix.length - 1 && matrix[position.y + 1][position.x] === 4) {
                        if (key) {
                            setComplete(true);
                            matrix[position.y + 1][position.x] = 5;
                            matrix[position.y][position.x] = 1;
                            position = { x: position.x, y: position.y + 1 }
                            setPosition(position);
                        }
                    }
                    break;
                default:
                    break;
            }
            setMatrix([...matrix]);
            await sleep(500);  // Delay for animation
            if(complete){
              completedLevel();
            }
    `;
    return code;
  };
  // Blockly.JavaScript['andar'] = function (block: Blockly.Block) {
  //     const direction = block.getFieldValue('direction');

  // };
  const handleRunCode = async () => {
    setIsAnimating(true);
    const workspace = Blockly.getMainWorkspace();
    await updateMatrixAsync(workspace, matrix, setMatrix, key, setKey, complete, setComplete, position, setPosition, completedLevel);
    setIsAnimating(false);
  };
  useEffect(() => {
    if (key) {
      console.log('Key updated:', key);

    }
  }, [key]);

  useEffect(() => {
    if (complete) {
      console.log('Complete updated:', complete);
    }
  }, [complete]);
  const handleCellClick = () => {

  }
  const [openPopup, setOpenPopup] = useState(false);
  const completedLevel = () => {
    setOpenPopup(true);
  }
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const handleUploadLevel = async () => {
    if (levelName.trim() !== '') {
      await uploadLevel(levelName, levelMatrix);
      handleGoCelinaRoom();
    } else {
      console.log('Please enter a level name.');
    }
  }
  const uploadLevel = async (name: string, matrix: number[][]) => {
    try {
      const data = await api.addLevel(name, matrix)
      if (data) {
        console.log(data)
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error when upload level:', error);
      return false;
    }
  }
  return (
    <div className="submiter">
      <div className='box-matrix'>
        <div className='matrix-container-submiter'>
          <div className='matrix-submiter' style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: matrix[0].length * 30, height: matrix.length * 30 }}>
            <Matriz matriz={matrix} onCellClick={handleCellClick} />
          </div>
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
      </div>

      <div className='blockly-container'>
        <BlocklyWorkspace
          toolboxConfiguration={TOOL_BOX_CATEGORIES}
          className="blockly-workspace"
          initialXml={xml}
          workspaceConfiguration={{
            grid: {
              spacing: 20,
              length: 3,
              colour: "#ccc",
              snap: true,
            },
            readOnly: false,
            zoom: {
              controls: true,
              wheel: true,
              startScale: 0.5,
              maxScale: 3,
              minScale: 0.3,
              scaleSpeed: 1.2
            },
          }}
          onXmlChange={newXml => setXml(newXml)}
        />
      </div>
      <div className='btns'>
        <button className='run-btn' onClick={handleRunCode} disabled={isAnimating}>Run</button>
        <button className='leave-btn' onClick={handleGoCelinaRoom}>Voltar</button>
      </div>
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        aria-labelledby="Level Completo"
        aria-describedby="Deseja upar o nivel?"
      >
        <DialogTitle id="complete-popup">{"Level Completo"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="complete-description">
            Deseja upar o nivel?.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="levelName"
            label="Nome do nível"
            type="text"
            fullWidth
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUploadLevel} color="primary" autoFocus>
            Upar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SubmitLevel;

