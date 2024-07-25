import React, { useState } from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
interface TutorialStep {
  gif: string;
  description: string;
}

const tutorialSteps: TutorialStep[] = [
  { gif: 'slider.gif', description: 'Este é o slider, com ele você pode aumentar e diminuir o tamanho do grid onde será construído/jogado o nível.' },
  { gif: 'blocos.gif', description: 'Estes são os blocos, você pode clicar neles e cada um exerce um comportamento diferente durante o jogo (durante a construção do nível, você pode ver mais detalhes ao passar o mouse sobre eles).' },
  { gif: 'tela-de-jogar.gif', description: 'Esta é a tela de jogar, onde você deve utilizar blocos de programação para mover o player no mapa, ele tem funcionalidades de zoom com o slider.' },
  { gif: 'exemplo.gif', description: 'Basta selecionar os blocos e colocar para rodar o programa criado, e uma mensagem de sucesso será mostrada caso conclua o nível com sucesso.' },
];

const Tutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const goCelinaRoom = () => {
    setTimeout(() => {
        navigate('/CelinaRoom');
    }, 500);
}
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="tutorial">
      <div className="tutorial-content">
        <img src={`/${tutorialSteps[currentStep].gif}`} alt="Tutorial step" />
        <p>{tutorialSteps[currentStep].description}</p>
      </div>
      <div className="tutorial-buttons">
        <button onClick={prevStep} disabled={currentStep === 0}>Voltar</button>
        <button onClick={nextStep} disabled={currentStep === tutorialSteps.length - 1}>Avançar</button>
        <button onClick={goCelinaRoom}>Sair</button>
      </div>
    </div>
  );
};

export default Tutorial;
