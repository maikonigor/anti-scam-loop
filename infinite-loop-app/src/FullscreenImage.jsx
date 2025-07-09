import React, { useEffect, useRef } from 'react';

const FullscreenImage = ({ isActive, imageUrl }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    const elem = imageRef.current;

    const requestFullscreen = async () => {
      if (elem && isActive) {
        try {
          if (elem.requestFullscreen) {
            await elem.requestFullscreen();
          } else if (elem.mozRequestFullScreen) { /* Firefox */
            await elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            await elem.webkitRequestFullscreen();
          } else if (elem.msRequestFullscreen) { /* IE/Edge */
            await elem.msRequestFullscreen();
          }
        } catch (err) {
          console.error("Erro ao tentar ativar tela cheia:", err.message);
        }
      }
    };

    const exitFullscreen = async () => {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        try {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (document.mozCancelFullScreen) { /* Firefox */
            await document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            await document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { /* IE/Edge */
            await document.msExitFullscreen();
          }
        } catch (err) {
          console.error("Erro ao tentar sair da tela cheia:", err.message);
        }
      }
    };

    if (isActive) {
      requestFullscreen();
      ;
    } else {
      // Somente sai da tela cheia se este componente estava ativo
      // e agora não está mais.
      // Isso evita sair da tela cheia se outro elemento a ativou.
      if (document.fullscreenElement === elem ||
          document.webkitFullscreenElement === elem ||
          document.mozFullScreenElement === elem ||
          document.msFullscreenElement === elem) {
          exitFullscreen();
      }
    }

    // Cleanup: sair da tela cheia se o componente for desmontado enquanto ativo
    return () => {
      // Verificamos se o elemento que está em tela cheia é o nosso
      if (isActive && (document.fullscreenElement === elem ||
                       document.webkitFullscreenElement === elem ||
                       document.mozFullScreenElement === elem ||
                       document.msFullscreenElement === elem)) {
        exitFullscreen();
      }
    };
  }, [isActive, imageUrl]); // Adicionado imageUrl como dependência

  if (!isActive) {
    return null; // Não renderiza nada se não estiver ativo
  }

  return (
    <div ref={imageRef} style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
      <img
        src={imageUrl}
        alt="Fullscreen"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default FullscreenImage;
