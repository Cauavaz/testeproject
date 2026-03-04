/* eslint-disable react/no-unknown-property */
import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';

export default function BadgeDesign({ isMobile, photoUrl = '/cauavaz2.jpeg' }) {
  const photoTexture = photoUrl ? useLoader(THREE.TextureLoader, photoUrl) : null;

  return (
    <group>
      {/* White background - top section */}
      <mesh position={[0, 0.25, 0.012]}>
        <planeGeometry args={[0.75, 0.7]} />
        <meshPhysicalMaterial
          color="#ffffff"
          clearcoat={isMobile ? 0 : 0.8}
          clearcoatRoughness={0.2}
          roughness={0.1}
          metalness={0.05}
        />
      </mesh>

      {/* Orange wave decoration - top */}
      <mesh position={[0.17, 0.15, 0.013]}>
        <planeGeometry args={[0.4, 0.15]} />
        <meshStandardMaterial color="#ff8c42" />
      </mesh>

      {/* Dark blue background - bottom section */}
      <mesh position={[0, -0.35, 0.012]}>
        <planeGeometry args={[0.75, 0.5]} />
        <meshStandardMaterial color="#2c3e5a" />
      </mesh>

      {/* Orange wave decoration - bottom transition */}
      <mesh position={[-0.12, -0.10, 0.013]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshStandardMaterial color="#ff8c42" />
      </mesh>

      {/* Large photo circle in center - with user photo */}
      <mesh position={[0, 0.05, 0.015]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial 
          color={photoTexture ? "#ffffff" : "#f0f0f0"}
          map={photoTexture}
        />
      </mesh>
      
      {/* Photo circle border - orange */}
      <mesh position={[0, 0.05, 0.016]}>
        <ringGeometry args={[0.18, 0.195, 32]} />
        <meshStandardMaterial color="#ff8c42" />
      </mesh>

      {/* Company Logo/Name - top center with colors */}
      <group position={[0, 0.48, 0.02]}>
        <Text
          position={[-0.15, 0, 0]}
          fontSize={0.08}
          color="#ec6521"
          anchorX="center"
          anchorY="middle"
        >
          !
        </Text>
        <Text
          position={[-0.05, 0, 0]}
          fontSize={0.08}
          color="#154a80"
          anchorX="center"
          anchorY="middle"
        >
          ndex
        </Text>
        <Text
          position={[0.1, 0, 0]}
          fontSize={0.08}
          color="#ec6521"
          anchorX="center"
          anchorY="middle"
        >
           net
        </Text>
      </group>

      {/* Name text - white on dark blue */}
      <Text
        position={[0, -0.32, 0.02]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Cauã Vaz 
      </Text>

      {/* Title/Position text */}
      <Text
        position={[0, -0.42, 0.02]}
        fontSize={0.05}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        opacity={0.9}
      >
        Desenvolvedor Front-end
      </Text>
    </group>
  );
}
