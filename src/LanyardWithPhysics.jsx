/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';
import BadgeDesign from './BadgeDesign';

extend({ MeshLineGeometry, MeshLineMaterial });

function CardWithTextures({ isMobile }) {
  const qrTexture = useLoader(THREE.TextureLoader, '/qrcodeindex.svg');

  return (
    <>
      {/* Front - Professional Badge Design */}
      <BadgeDesign isMobile={isMobile} />
      <group position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <planeGeometry args={[0.8, 1.2]} />
          <meshPhysicalMaterial
            color="#f8fbff"
            clearcoat={isMobile ? 0 : 0.95}
            clearcoatRoughness={0.14}
            roughness={0.12}
            metalness={0.08}
          />
        </mesh>

        <mesh position={[0, 0.44, 0.002]}>
          <planeGeometry args={[0.8, 0.24]} />
          <meshStandardMaterial color="#1d3e72" />
        </mesh>

        <mesh position={[0, 0.44, 0.003]}>
          <planeGeometry args={[0.62, 0.04]} />
          <meshStandardMaterial color="#7cd8ff" />
        </mesh>

        <mesh position={[0, 0.1, 0.002]}>
          <planeGeometry args={[0.62, 0.62]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.08} metalness={0.04} />
        </mesh>

        <mesh position={[0, 0.1, 0.003]}>
          <planeGeometry args={[0.54, 0.54]} />
          <meshStandardMaterial map={qrTexture} transparent />
        </mesh>

        <mesh position={[-0.31, 0.41, 0.003]}>
          <planeGeometry args={[0.06, 0.06]} />
          <meshStandardMaterial color="#7cd8ff" />
        </mesh>

        <mesh position={[0.31, 0.41, 0.003]}>
          <planeGeometry args={[0.06, 0.06]} />
          <meshStandardMaterial color="#7cd8ff" />
        </mesh>

        <mesh position={[0, -0.34, 0.002]}>
          <planeGeometry args={[0.68, 0.22]} />
          <meshStandardMaterial color="#132b53" />
        </mesh>

        <mesh position={[0, -0.34, 0.003]}>
          <planeGeometry args={[0.52, 0.03]} />
          <meshStandardMaterial color="#f2994a" />
        </mesh>

        <mesh position={[0, -0.46, 0.002]}>
          <planeGeometry args={[0.8, 0.12]} />
          <meshStandardMaterial color="#0f2345" />
        </mesh>
      </group>
      <mesh>
        <boxGeometry args={[1.6, 2.25, 0.02]} />
        <meshPhysicalMaterial
          color="#9c83c5"
          transparent
          opacity={0}
        />
      </mesh>
    </>
  );
}

export default function LanyardWithPhysics({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true
}) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
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

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
  const band = useRef(null);
  const fixed = useRef(null);
  const j1 = useRef(null);
  const j2 = useRef(null);
  const j3 = useRef(null);
  const card = useRef(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ])
  );

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 0.3, 0]]);

  useEffect(() => {
    if (!hovered) return undefined;
    document.body.style.cursor = dragged ? 'grabbing' : 'grab';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });

    }

    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }

        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );

        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[1.2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              setDragStartY(card.current.translation().y);
            }}
            onDoubleClick={() => {
              window.location.href = 'https://desafiofrontresponsive.netlify.app/';
            }}
          >
            <CardWithTextures isMobile={isMobile} />
            
            {/* Metal clip at top */}
            <mesh position={[0, 0.6, 0.025]}>
              <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.95} roughness={0.15} />
            </mesh>
            
            {/* Clamp base */}
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.04]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </mesh>
            
            {/* Clamp screws/rivets */}
            <mesh position={[-0.1, 0.6, 0.021]}>
              <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#3a3a3a" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0.1, 0.6, 0.021]}>
              <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#3a3a3a" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#1a1a1a"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          lineWidth={isMobile ? 0.15 : 0.2}
        />
      </mesh>
    </>
  );
}
