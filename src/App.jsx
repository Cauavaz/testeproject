import React from 'react';
import LanyardWithPhysics from './LanyardWithPhysics';

export default function App() {
  const handleRedirect = () => {
    window.location.href = 'https://desafiofrontresponsive.netlify.app/';
  };

  return (
    <main className="page">
      <button 
        onClick={handleRedirect}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: '#154a80',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#ec6521';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#154a80';
          e.target.style.transform = 'scale(1)';
        }}
      >
        ← Voltar para Home
      </button>
      <h1>Lanyard Physics Demo</h1>
      <p>✨ Clique e arraste o card | Física completa com rope joints</p>
      <LanyardWithPhysics position={[0, 0, 20]} gravity={[0, -40, 0]} />
    </main>
  );
}
