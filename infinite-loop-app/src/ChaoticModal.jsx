import React from 'react';

const ChaoticModal = ({ id, text, top, left, onClose }) => {
  const modalStyle = {
    position: 'fixed',
    top: `${top}%`,
    left: `${left}%`,
    transform: 'translate(-50%, -50%)', // Centraliza o modal na posição top/left
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Levemente transparente
    border: '2px solid red', // Borda chamativa
    padding: '15px',
    zIndex: 10000,
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    minWidth: '100px',
    maxWidth: '250px',
    textAlign: 'center',
    borderRadius: '5px',
    fontSize: '0.9em'
  };

  // Efeito para auto-fechar o modal depois de um tempo, se onClose for fornecido
  // Isso pode ser controlado pelo App.jsx também
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onClose(id);
  //   }, 5000); // Auto-fecha depois de 5 segundos, por exemplo
  //   return () => clearTimeout(timer);
  // }, [id, onClose]);

  return (
    <div style={modalStyle}>
      <p>{text}</p>
      <button
        onClick={() => onClose(id)}
        style={{padding: '5px 10px', marginTop: '10px', cursor: 'pointer'}}
      >
        Fechar ({id})
      </button>
    </div>
  );
};

export default ChaoticModal;
