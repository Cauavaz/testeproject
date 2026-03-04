/* eslint-disable react/no-unknown-property */
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import './Lanyard.css';

export default function LanyardSimple({
  position = [0, 0, 20],
  fov = 20,
  transparent = true
}) {
  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <FloatingCard />
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function FloatingCard() {
  const cardRef = useRef();

  useFrame((state) => {
    if (!cardRef.current) return;
    const t = state.clock.getElapsedTime();
    cardRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    cardRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
    cardRef.current.rotation.x = Math.cos(t * 0.4) * 0.1;
  });

  return (
    <group ref={cardRef} position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[1.6, 2.25, 0.05]} />
        <meshPhysicalMaterial
          color="#9c83c5"
          clearcoat={1}
          clearcoatRoughness={0.15}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[0, 1.3, 0.03]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
        <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
