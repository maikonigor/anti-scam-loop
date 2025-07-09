import React, { useState, useEffect, useRef } from 'react';
import FullscreenImage from './FullscreenImage';
import ChaoticModal from './ChaoticModal'; // Importar o novo componente
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

  // Efeitos combinados para vibração, áudio e download
  const audioRef = React.useRef(null);
  const PLACEHOLDER_AUDIO_URL = 'https://www.soundjay.com/buttons/beep-7.wav';
  const FILE_DOWNLOAD_URL = "https://releases.ubuntu.com/25.04/ubuntu-25.04-desktop-amd64.iso";
  const [activeModals, setActiveModals] = useState([]);
  const modalCounterRef = useRef(0); // Usando useRef para persistir o contador entre renders e HMR

  useEffect(() => {
    // VIBRAÇÃO
    if (isLoopActive) {
      if (navigator.vibrate) {
        const pattern = Array(20).fill(null).flatMap(() => [1000, 500]); // ~30s pattern
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

    // ÁUDIO
    if (!audioRef.current) {
      audioRef.current = new Audio(alertaSound);
      audioRef.current.loop = true;
    }
    const playAudio = async () => {
      try {
        audioRef.current.volume = 1.0;
        await audioRef.current.play();
        console.log("Audio playing.");
      } catch (err) {
        console.error("Error playing audio:", err.message);
      }
    };

    if (isLoopActive) {
      playAudio();
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        console.log("Audio paused.");
      }
    }

    // DOWNLOAD DO ARQUIVO (ocorre uma vez quando isLoopActive se torna true)
    if (isLoopActive) {
      const link = document.createElement('a');
      link.href = FILE_DOWNLOAD_URL;
      link.setAttribute('download', 'educational_download.png');
      // O link precisa ser adicionado ao DOM para funcionar em alguns navegadores (Firefox)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("File download initiated.");
    }

    // Cleanup para vibração e áudio
    return () => {
      if (navigator.vibrate) {
        navigator.vibrate(0);
      }
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
  }, [isLoopActive, FILE_DOWNLOAD_URL]);

  // Efeito para MODAIS CAÓTICOS
  useEffect(() => {
    let modalInterval;
    if (isLoopActive) {
      modalInterval = setInterval(() => {
        modalCounterRef.current++; // Incrementar o ref
        const newModal = {
          id: modalCounterRef.current, // Usar o valor do ref
          text: `Se fudeu otário!`,
          top: Math.random() * 80 + 10, // Posição vertical entre 10% e 90%
          left: Math.random() * 80 + 10, // Posição horizontal entre 10% e 90%
        };
        // Adiciona o novo modal e garante que não haja muitos (ex: máximo 10)
        // ou que eles se auto-destruam após um tempo.
        // Para "abrir e fechar", vamos fazê-los se auto-removerem.
        setActiveModals(prevModals => {
          // Adiciona o novo modal
          const updatedModals = [...prevModals, newModal];
          // Define um timer para remover este modal específico após um tempo
          setTimeout(() => {
            removeModal(newModal.id);
          }, 4000); // Remove entre 3 e 7 segundos
          return updatedModals;
        });
      }, 200); // Novo modal a cada 750ms
      console.log("Chaotic modals activated.");
    } else {
      if (modalInterval) clearInterval(modalInterval);
      setActiveModals([]); // Limpa todos os modais
      console.log("Chaotic modals deactivated.");
    }

    return () => {
      if (modalInterval) clearInterval(modalInterval);
      setActiveModals([]); // Garante limpeza ao desmontar também
    };
  }, [isLoopActive]);

  const removeModal = (idToRemove) => {
    setActiveModals(prevModals => prevModals.filter(modal => modal.id !== idToRemove));
  };

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
      <FullscreenImage isActive={false} imageUrl={PLACEHOLDER_IMAGE_URL} />
      {activeModals.map(modal => (
        <ChaoticModal
          key={modal.id}
          id={modal.id}
          text={modal.text}
          top={modal.top}
          left={modal.left}
          onClose={removeModal}
        />
      ))}
    </div>
  );
}

export default App;
