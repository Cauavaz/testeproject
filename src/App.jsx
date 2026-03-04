import React from 'react';
import LanyardWithPhysics from './LanyardWithPhysics';

export default function App() {
  return (
    <main className="page">
      <header className="hero-panel">
        <span className="hero-tag">Cartão Interativo</span>
        <h1>Seu crachá 3D está pronto para explorar</h1>
        <p className="hero-subtitle">
          Clique e arraste para movimentar. <strong>Dê 2 cliques no cartão</strong> para ir ao local necessário.
        </p>
      </header>
      <LanyardWithPhysics position={[0, 0, 20]} gravity={[0, -40, 0]} />
    </main>
  );
}
