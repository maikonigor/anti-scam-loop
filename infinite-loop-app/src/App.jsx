import React, { useState, useEffect } from 'react';
import FullscreenImage from './FullscreenImage';
import alertaSound from './assets/biohazard.mp3';
// URL de uma imagem de placeholder
const PLACEHOLDER_IMAGE_URL = 'https://pombaloka.com/wp-content/uploads/2021/02/negao-da-rola-gigante-comendo-gostosa-08.gif';

function App() {
  const [isLoopActive, setIsLoopActive] = useState(false);

  const startLoop = () => {
    // A API de Fullscreen geralmente requer um gesto do usuário.
    // O clique no botão "Iniciar Ações" serve como esse gesto.
    setIsLoopActive(true);
    console.log("Loop started");
  };

  const stopLoop = () => {
    setIsLoopActive(false);
    console.log("Loop stopped");
  };

  // Efeito para lidar com a tecla ESC para sair do modo tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        if (isLoopActive) {
          console.log("Fullscreen exited by user (e.g. ESC key). Stopping loop.");
          setIsLoopActive(false);
        }
      }
      while(true){
      alert("perdeu otario")
    };
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isLoopActive]);

  // Efeito para controlar a vibração
  useEffect(() => {
    // ... (código da vibração permanece o mesmo) ...
    if (isLoopActive) {
      if (navigator.vibrate) {
        const pattern = [];
        for (let i = 0; i < 10; i=0) {
          pattern.push(1000);
          pattern.push(1000);
        }
        navigator.vibrate(pattern);
        console.log("Vibration started with pattern.");
      } else {
        console.log("Vibration API not supported.");
      }
    } else {
      if (navigator.vibrate) {
        navigator.vibrate(0);
        console.log("Vibration stopped.");
      }
    }
    return () => {
      if (navigator.vibrate) {
        navigator.vibrate(0);
      }
    };
  }, [isLoopActive]);

  // Ref para o elemento de áudio e Efeito para controlar o áudio
  const audioRef = React.useRef(null);
  // URL de um áudio de placeholder (ex: um tom simples ou ruído branco)
  const PLACEHOLDER_AUDIO_URL = '/sounds/biohazard.mp3'; // Exemplo de URL de áudio

  useEffect(() => {
    if (!audioRef.current) {
      // Cria o elemento de áudio se não existir
      audioRef.current = new Audio(alertaSound);
      audioRef.current.loop = true; // Configura para tocar em loop
    }

    const playAudio = async () => {
      try {
        audioRef.current.volume = 1.0; // Tenta definir o volume para o máximo
        await audioRef.current.play();
        console.log("Audio playing.");
      } catch (err) {
        console.error("Error playing audio:", err.message);
        // Navegadores podem bloquear autoplay se não houver interação do usuário
        // ou se a aba não estiver em foco.
        // O clique no botão "Iniciar Ações" deve ajudar com isso.
      }
    };

    if (isLoopActive) {
      playAudio();
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        // audioRef.current.currentTime = 0; // Opcional: reseta o áudio para o início
        console.log("Audio paused.");
      }
    }

    // Cleanup: para o áudio se o componente for desmontado
    return () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        // audioRef.current.currentTime = 0;
      }
    };
  }, [isLoopActive]);

  return (
    <div>
      {!isLoopActive && (
        <>
          <h1>Infinite Loop App (Educational)</h1>
          <p>Status: {isLoopActive ? "Ações Ativas" : "Inativo"}</p>
          <button onClick={startLoop} disabled={isLoopActive}>
            Iniciar Ações
          </button>
          <button onClick={stopLoop} disabled={!isLoopActive} style={{ marginLeft: '10px' }}>
            Parar Ações
          </button>
          <p style={{marginTop: '20px', fontSize: '0.9em', color: 'gray'}}>
            Nota: A ativação da tela cheia, áudio e vibração geralmente requer uma interação inicial do usuário (clique no botão "Iniciar Ações").
            Pressione ESC para sair da tela cheia a qualquer momento (isso também irá parar as ações).
          </p>
        </>
      )}
      <FullscreenImage isActive={isLoopActive} imageUrl={PLACEHOLDER_IMAGE_URL} />
      {/* Lógica de áudio/vibração será integrada aqui e controlada por isLoopActive */}
    </div>
  );
}

export default App;
