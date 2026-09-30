import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Camera, Eye, User, Sparkle } from 'lucide-react';

// ---------------------------------------------------------------------------
// 1. FULL-BODY HUMANOID HOLOGRAPHIC SKELETAL RIG & SHADER
// ---------------------------------------------------------------------------
export function AuraHumanoidMesh({
  colorHex = '#00f0ff',
  accentHex = '#0077ff',
  avatarState = 'idle', // idle | listening | thinking | talking | celebrating | dancing
  danceStyle = 'hip_hop', // hip_hop | freestyle | cinematic
  audioLevel = 0,
  musicAudio = { level: 0, bass: 0, mid: 0, treble: 0 },
  isWireframe = false
}) {
  const rootRef = useRef();
  const spineRef = useRef();
  const chestRef = useRef();
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const mouthRef = useRef();
  const leftUpperArmRef = useRef();
  const leftForearmRef = useRef();
  const rightUpperArmRef = useRef();
  const rightForearmRef = useRef();
  const leftThighRef = useRef();
  const leftShinRef = useRef();
  const rightThighRef = useRef();
  const rightShinRef = useRef();
  const haloRef = useRef();
  const arcReactorRef = useRef();

  // Autonomous Blinking
  const [blinkScaleY, setBlinkScaleY] = useState(1);
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkScaleY(0.08);
      setTimeout(() => setBlinkScaleY(1), 150);
    }, 3200 + Math.random() * 2500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Hologram Glass/Fresnel Materials
  const holoMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      emissive: new THREE.Color(accentHex),
      emissiveIntensity: 0.65,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });
  }, [colorHex, accentHex, isWireframe]);

  const jointMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.9,
      roughness: 0.2,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.95
    });
  }, [colorHex, isWireframe]);

  const coreGlowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      wireframe: isWireframe
    });
  }, [colorHex, isWireframe]);

  // Main Skeletal Animation Kinematics Loop
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // --- IDLE STATE ---
    if (avatarState === 'idle') {
      if (rootRef.current) {
        rootRef.current.position.y = -0.7 + Math.sin(t * 1.5) * 0.03;
        rootRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
      }
      if (chestRef.current) {
        // Natural chest breathing
        chestRef.current.scale.set(
          1 + Math.sin(t * 2.0) * 0.02,
          1 + Math.sin(t * 2.0) * 0.03,
          1 + Math.sin(t * 2.0) * 0.04
        );
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.06;
        headRef.current.rotation.x = Math.sin(t * 1.2) * 0.02;
        headRef.current.rotation.z = Math.sin(t * 0.9) * 0.015;
      }
      if (leftUpperArmRef.current && rightUpperArmRef.current) {
        leftUpperArmRef.current.rotation.z = 0.25 + Math.sin(t * 1.5) * 0.03;
        leftUpperArmRef.current.rotation.x = Math.sin(t * 1.2) * 0.04;
        rightUpperArmRef.current.rotation.z = -0.25 - Math.sin(t * 1.5) * 0.03;
        rightUpperArmRef.current.rotation.x = Math.sin(t * 1.2) * 0.04;
      }
      if (leftForearmRef.current && rightForearmRef.current) {
        leftForearmRef.current.rotation.x = 0.35 + Math.sin(t * 1.4) * 0.04;
        rightForearmRef.current.rotation.x = 0.35 + Math.sin(t * 1.4) * 0.04;
      }
      if (leftThighRef.current && rightThighRef.current) {
        leftThighRef.current.rotation.x = 0.05;
        rightThighRef.current.rotation.x = 0.05;
      }
    }

    // --- LISTENING STATE ---
    else if (avatarState === 'listening') {
      if (rootRef.current) {
        rootRef.current.position.y = -0.68 + Math.sin(t * 2.5) * 0.02;
      }
      if (headRef.current) {
        // Attentive head tilt towards user
        headRef.current.rotation.z = 0.12 + Math.sin(t * 1.8) * 0.03;
        headRef.current.rotation.x = -0.05;
        headRef.current.rotation.y = 0.08;
      }
      if (haloRef.current) {
        haloRef.current.rotation.z += delta * 2.5;
        haloRef.current.scale.setScalar(1 + Math.sin(t * 6.0) * 0.08);
      }
      if (leftUpperArmRef.current && rightUpperArmRef.current) {
        leftUpperArmRef.current.rotation.z = 0.3;
        rightUpperArmRef.current.rotation.z = -0.3;
        leftForearmRef.current.rotation.x = 0.6;
        rightForearmRef.current.rotation.x = 0.6;
      }
    }

    // --- THINKING STATE ---
    else if (avatarState === 'thinking') {
      if (rootRef.current) {
        rootRef.current.position.y = -0.7;
      }
      if (headRef.current) {
        // Head tilted upward in contemplation
        headRef.current.rotation.x = -0.15 + Math.sin(t * 1.2) * 0.03;
        headRef.current.rotation.y = 0.15;
      }
      // Right hand touches chin
      if (rightUpperArmRef.current && rightForearmRef.current) {
        rightUpperArmRef.current.rotation.z = -0.5;
        rightUpperArmRef.current.rotation.x = -1.1;
        rightForearmRef.current.rotation.x = -1.3;
      }
      // Left arm crossed across torso
      if (leftUpperArmRef.current && leftForearmRef.current) {
        leftUpperArmRef.current.rotation.z = 0.6;
        leftUpperArmRef.current.rotation.x = -0.3;
        leftForearmRef.current.rotation.x = -1.2;
        leftForearmRef.current.rotation.y = 0.7;
      }
    }

    // --- TALKING STATE ---
    else if (avatarState === 'talking') {
      if (rootRef.current) {
        rootRef.current.position.y = -0.7 + Math.sin(t * 3.0) * 0.02;
        rootRef.current.rotation.y = Math.sin(t * 1.5) * 0.05;
      }
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(t * 4.0) * 0.06;
        headRef.current.rotation.y = Math.sin(t * 2.0) * 0.08;
      }
      // Conversational gesturing with hands
      if (leftUpperArmRef.current && rightUpperArmRef.current) {
        leftUpperArmRef.current.rotation.x = -0.3 + Math.sin(t * 3.5) * 0.15;
        leftUpperArmRef.current.rotation.z = 0.4 + Math.cos(t * 2.8) * 0.1;
        rightUpperArmRef.current.rotation.x = -0.4 - Math.sin(t * 3.0) * 0.18;
        rightUpperArmRef.current.rotation.z = -0.45 - Math.cos(t * 3.2) * 0.1;
      }
      if (leftForearmRef.current && rightForearmRef.current) {
        leftForearmRef.current.rotation.x = -0.7 + Math.sin(t * 4.0) * 0.2;
        rightForearmRef.current.rotation.x = -0.8 + Math.cos(t * 3.8) * 0.25;
      }
      // Lip-sync scaled to speech audio
      if (mouthRef.current) {
        const mouthOpen = 0.1 + audioLevel * 1.5 + Math.sin(t * 18.0) * (audioLevel * 0.6);
        mouthRef.current.scale.y = Math.max(0.08, mouthOpen);
      }
    }

    // --- CELEBRATING STATE ---
    else if (avatarState === 'celebrating') {
      const jump = Math.abs(Math.sin(t * 5.0)) * 0.25;
      if (rootRef.current) {
        rootRef.current.position.y = -0.7 + jump;
        rootRef.current.rotation.y = Math.sin(t * 3.0) * 0.2;
      }
      // Victory Fist Pump
      if (rightUpperArmRef.current && leftUpperArmRef.current) {
        rightUpperArmRef.current.rotation.z = -1.2 + Math.sin(t * 8.0) * 0.3;
        rightUpperArmRef.current.rotation.x = -1.6;
        leftUpperArmRef.current.rotation.z = 1.2 - Math.sin(t * 8.0) * 0.3;
        leftUpperArmRef.current.rotation.x = -1.6;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.25;
      }
    }

    // --- DANCING STATE ---
    else if (avatarState === 'dancing') {
      // 1. HIP-HOP DANCE ROUTINE
      if (danceStyle === 'hip_hop') {
        const bounce = Math.abs(Math.sin(t * 6.5)) * 0.18;
        if (rootRef.current) {
          rootRef.current.position.y = -0.75 + bounce;
          rootRef.current.rotation.y = Math.sin(t * 3.25) * 0.3;
        }
        if (spineRef.current) {
          spineRef.current.rotation.x = 0.15 + Math.sin(t * 6.5) * 0.1;
        }
        if (headRef.current) {
          headRef.current.rotation.x = Math.sin(t * 13.0) * 0.15; // aggressive head nod
        }
        // Arm wave popping
        if (leftUpperArmRef.current && rightUpperArmRef.current) {
          leftUpperArmRef.current.rotation.z = 0.8 + Math.sin(t * 6.5) * 0.4;
          leftUpperArmRef.current.rotation.x = -0.6 + Math.cos(t * 6.5) * 0.3;
          rightUpperArmRef.current.rotation.z = -0.8 - Math.sin(t * 6.5 + Math.PI) * 0.4;
          rightUpperArmRef.current.rotation.x = -0.6 - Math.cos(t * 6.5 + Math.PI) * 0.3;
        }
        if (leftForearmRef.current && rightForearmRef.current) {
          leftForearmRef.current.rotation.x = -0.9 + Math.sin(t * 13.0) * 0.3;
          rightForearmRef.current.rotation.x = -0.9 + Math.cos(t * 13.0) * 0.3;
        }
        if (leftThighRef.current && rightThighRef.current) {
          leftThighRef.current.rotation.x = 0.2 + bounce * 1.5;
          rightThighRef.current.rotation.x = 0.2 + bounce * 1.5;
        }
      }

      // 2. FREESTYLE DANCE ROUTINE
      else if (danceStyle === 'freestyle') {
        if (rootRef.current) {
          rootRef.current.position.y = -0.68 + Math.sin(t * 5.0) * 0.1;
          rootRef.current.rotation.y = t * 1.8; // full 360-degree rotation spin
        }
        if (leftUpperArmRef.current && rightUpperArmRef.current) {
          leftUpperArmRef.current.rotation.z = 1.1 + Math.sin(t * 4.0) * 0.5;
          rightUpperArmRef.current.rotation.z = -1.1 - Math.cos(t * 4.0) * 0.5;
          leftUpperArmRef.current.rotation.x = Math.sin(t * 3.0) * 0.4;
          rightUpperArmRef.current.rotation.x = Math.cos(t * 3.0) * 0.4;
        }
        if (leftForearmRef.current && rightForearmRef.current) {
          leftForearmRef.current.rotation.y = Math.sin(t * 5.0) * 0.5;
          rightForearmRef.current.rotation.y = Math.cos(t * 5.0) * 0.5;
        }
      }

      // 3. CINEMATIC / BALLETIC DANCE ROUTINE
      else {
        if (rootRef.current) {
          rootRef.current.position.y = -0.62 + Math.sin(t * 2.5) * 0.12;
          rootRef.current.rotation.y = Math.sin(t * 1.2) * 0.5;
        }
        if (spineRef.current) {
          spineRef.current.rotation.z = Math.sin(t * 2.5) * 0.1;
          spineRef.current.rotation.x = -0.08 + Math.sin(t * 2.0) * 0.05;
        }
        if (leftUpperArmRef.current && rightUpperArmRef.current) {
          // Graceful extended wings pose
          leftUpperArmRef.current.rotation.z = 1.35 + Math.sin(t * 2.5) * 0.15;
          leftUpperArmRef.current.rotation.x = -0.2;
          rightUpperArmRef.current.rotation.z = -1.35 - Math.sin(t * 2.5) * 0.15;
          rightUpperArmRef.current.rotation.x = -0.2;
        }
        if (leftForearmRef.current && rightForearmRef.current) {
          leftForearmRef.current.rotation.z = 0.3;
          rightForearmRef.current.rotation.z = -0.3;
        }
        if (leftThighRef.current) {
          leftThighRef.current.rotation.x = -0.2 + Math.sin(t * 2.5) * 0.1;
        }
      }

      // In dancing mode, mouth also sings to the music beats
      if (mouthRef.current) {
        mouthRef.current.scale.y = 0.15 + (musicAudio.level || 0) * 1.8;
      }
    }

    // Eye blinking
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blinkScaleY;
      rightEyeRef.current.scale.y = blinkScaleY;
    }

    // Arc Reactor / Core Pulse
    if (arcReactorRef.current) {
      arcReactorRef.current.rotation.z += delta * 1.5;
      const pulse = 1.0 + (audioLevel * 0.4) + ((musicAudio.bass || 0) * 0.5);
      arcReactorRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.7, 0]} scale={[1, 1, 1]}>
      {/* ----------------- PELVIS / HIPS ----------------- */}
      <group position={[0, 1.0, 0]}>
        <mesh material={holoMaterial}>
          <boxGeometry args={[0.34, 0.16, 0.22]} />
        </mesh>
        <mesh position={[0, 0, 0.12]} material={jointMaterial}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>

        {/* ----------------- SPINE & TORSO ----------------- */}
        <group ref={spineRef} position={[0, 0.12, 0]}>
          <mesh position={[0, 0.1, 0]} material={jointMaterial}>
            <cylinderGeometry args={[0.08, 0.1, 0.14, 16]} />
          </mesh>

          {/* ----------------- CHEST / UPPER TORSO ----------------- */}
          <group ref={chestRef} position={[0, 0.26, 0]}>
            <mesh material={holoMaterial}>
              <boxGeometry args={[0.42, 0.32, 0.26]} />
            </mesh>

            {/* Glowing ARC-Reactor Core */}
            <group ref={arcReactorRef} position={[0, 0.05, 0.14]}>
              <mesh material={coreGlowMaterial}>
                <torusGeometry args={[0.055, 0.015, 12, 24]} />
              </mesh>
              <mesh position={[0, 0, -0.01]}>
                <circleGeometry args={[0.045, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>

            {/* Collarbone / Shoulders Bar */}
            <mesh position={[0, 0.18, 0]} material={jointMaterial}>
              <cylinderGeometry args={[0.06, 0.06, 0.52, 16]} rotation={[0, 0, Math.PI / 2]} />
            </mesh>

            {/* ----------------- NECK & HEAD ----------------- */}
            <group position={[0, 0.25, 0]}>
              <mesh position={[0, 0.06, 0]} material={jointMaterial}>
                <cylinderGeometry args={[0.065, 0.075, 0.12, 16]} />
              </mesh>

              {/* Head Rig */}
              <group ref={headRef} position={[0, 0.24, 0]}>
                <mesh material={holoMaterial}>
                  <sphereGeometry args={[0.22, 24, 24]} />
                </mesh>
                <mesh position={[0, -0.08, 0.06]} rotation={[0.3, 0, 0]} material={holoMaterial}>
                  <coneGeometry args={[0.16, 0.18, 16]} />
                </mesh>

                {/* JARVIS Visor Array */}
                <mesh position={[0, 0.02, 0.18]} material={jointMaterial}>
                  <boxGeometry args={[0.28, 0.07, 0.08]} />
                </mesh>

                {/* Left Eye */}
                <group ref={leftEyeRef} position={[-0.075, 0.02, 0.23]}>
                  <mesh>
                    <sphereGeometry args={[0.032, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                  <mesh position={[0, 0, 0.01]} material={coreGlowMaterial}>
                    <ringGeometry args={[0.015, 0.03, 16]} />
                  </mesh>
                </group>

                {/* Right Eye */}
                <group ref={rightEyeRef} position={[0.075, 0.02, 0.23]}>
                  <mesh>
                    <sphereGeometry args={[0.032, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                  <mesh position={[0, 0, 0.01]} material={coreGlowMaterial}>
                    <ringGeometry args={[0.015, 0.03, 16]} />
                  </mesh>
                </group>

                {/* Procedural Lip-sync Mouth */}
                <mesh ref={mouthRef} position={[0, -0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.03, 0.008, 8, 16, Math.PI]} />
                  <meshBasicMaterial color={colorHex} />
                </mesh>

                {/* Ear Communications Antennas */}
                <mesh position={[-0.22, 0.04, 0]} rotation={[0, 0, 0.35]} material={jointMaterial}>
                  <cylinderGeometry args={[0.015, 0.02, 0.18, 8]} />
                </mesh>
                <mesh position={[0.22, 0.04, 0]} rotation={[0, 0, -0.35]} material={jointMaterial}>
                  <cylinderGeometry args={[0.015, 0.02, 0.18, 8]} />
                </mesh>

                {/* Floating JARVIS Hologram Halo Ring */}
                <group ref={haloRef} position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <mesh>
                    <torusGeometry args={[0.25, 0.01, 16, 32]} />
                    <meshBasicMaterial color={colorHex} wireframe />
                  </mesh>
                  <mesh rotation={[0, 0, Math.PI / 4]}>
                    <ringGeometry args={[0.22, 0.28, 4]} />
                    <meshBasicMaterial color={accentHex} wireframe transparent opacity={0.6} />
                  </mesh>
                </group>
              </group>
            </group>

            {/* ----------------- LEFT ARM ----------------- */}
            <group position={[-0.28, 0.16, 0]}>
              <mesh material={jointMaterial}>
                <sphereGeometry args={[0.075, 16, 16]} />
              </mesh>
              <group ref={leftUpperArmRef}>
                <mesh position={[0, -0.2, 0]} material={holoMaterial}>
                  <cylinderGeometry args={[0.05, 0.045, 0.34, 16]} />
                </mesh>
                <group position={[0, -0.38, 0]}>
                  <mesh material={jointMaterial}>
                    <sphereGeometry args={[0.055, 16, 16]} />
                  </mesh>
                  <group ref={leftForearmRef}>
                    <mesh position={[0, -0.18, 0]} material={holoMaterial}>
                      <cylinderGeometry args={[0.045, 0.038, 0.32, 16]} />
                    </mesh>
                    <mesh position={[0, -0.36, 0]} material={jointMaterial}>
                      <boxGeometry args={[0.06, 0.09, 0.03]} />
                    </mesh>
                  </group>
                </group>
              </group>
            </group>

            {/* ----------------- RIGHT ARM ----------------- */}
            <group position={[0.28, 0.16, 0]}>
              <mesh material={jointMaterial}>
                <sphereGeometry args={[0.075, 16, 16]} />
              </mesh>
              <group ref={rightUpperArmRef}>
                <mesh position={[0, -0.2, 0]} material={holoMaterial}>
                  <cylinderGeometry args={[0.05, 0.045, 0.34, 16]} />
                </mesh>
                <group position={[0, -0.38, 0]}>
                  <mesh material={jointMaterial}>
                    <sphereGeometry args={[0.055, 16, 16]} />
                  </mesh>
                  <group ref={rightForearmRef}>
                    <mesh position={[0, -0.18, 0]} material={holoMaterial}>
                      <cylinderGeometry args={[0.045, 0.038, 0.32, 16]} />
                    </mesh>
                    <mesh position={[0, -0.36, 0]} material={jointMaterial}>
                      <boxGeometry args={[0.06, 0.09, 0.03]} />
                    </mesh>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* ----------------- LEFT LEG ----------------- */}
        <group position={[-0.12, -0.08, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>
          <group ref={leftThighRef}>
            <mesh position={[0, -0.24, 0]} material={holoMaterial}>
              <cylinderGeometry args={[0.07, 0.055, 0.44, 16]} />
            </mesh>
            <group position={[0, -0.48, 0]}>
              <mesh material={jointMaterial}>
                <sphereGeometry args={[0.055, 16, 16]} />
              </mesh>
              <group ref={leftShinRef}>
                <mesh position={[0, -0.22, 0]} material={holoMaterial}>
                  <cylinderGeometry args={[0.055, 0.045, 0.42, 16]} />
                </mesh>
                <mesh position={[0, -0.44, 0.05]} material={jointMaterial}>
                  <boxGeometry args={[0.08, 0.06, 0.2]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* ----------------- RIGHT LEG ----------------- */}
        <group position={[0.12, -0.08, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>
          <group ref={rightThighRef}>
            <mesh position={[0, -0.24, 0]} material={holoMaterial}>
              <cylinderGeometry args={[0.07, 0.055, 0.44, 16]} />
            </mesh>
            <group position={[0, -0.48, 0]}>
              <mesh material={jointMaterial}>
                <sphereGeometry args={[0.055, 16, 16]} />
              </mesh>
              <group ref={rightShinRef}>
                <mesh position={[0, -0.22, 0]} material={holoMaterial}>
                  <cylinderGeometry args={[0.055, 0.045, 0.42, 16]} />
                </mesh>
                <mesh position={[0, -0.44, 0.05]} material={jointMaterial}>
                  <boxGeometry args={[0.08, 0.06, 0.2]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. CONCENTRIC 3D HOLOGRAPHIC RUNIC PLATFORM & SPECTRUM VISUALIZER
// ---------------------------------------------------------------------------
export function AuraHologramPlatform({ colorHex = '#00f0ff', accentHex = '#0077ff', musicAudio }) {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const emitterConeRef = useRef();

  useFrame((state, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.6;
    if (ring3Ref.current) ring3Ref.current.rotation.z += delta * 0.25;

    if (emitterConeRef.current) {
      emitterConeRef.current.material.opacity = 0.15 + (musicAudio?.bass || 0) * 0.35;
    }
  });

  const barCount = 32;
  const bars = useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 1.35;
      return {
        id: i,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        angle
      };
    });
  }, []);

  return (
    <group position={[0, -1.5, 0]}>
      {/* Outer Telemetry Ring */}
      <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.45, 48]} />
        <meshBasicMaterial color={colorHex} wireframe transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Middle Glyphs Ring */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.8, 1.05, 32]} />
        <meshBasicMaterial color={accentHex} wireframe transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner Platform Core */}
      <mesh ref={ring3Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.3, 0.55, 24]} />
        <meshBasicMaterial color={colorHex} wireframe transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Dark Translucent Glass Base Disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial color="#050811" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Vertical Holographic Projector Beam Cone */}
      <mesh ref={emitterConeRef} position={[0, 1.4, 0]}>
        <cylinderGeometry args={[1.35, 0.65, 2.8, 32, 1, true]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Audio Reactive Spectrum Towers */}
      {bars.map((b, i) => {
        const freqVal = musicAudio?.frequencies ? musicAudio.frequencies[i % 32] / 255 : 0.2;
        const barHeight = Math.max(0.04, freqVal * 0.45);
        return (
          <mesh key={b.id} position={[b.x, barHeight / 2, b.z]}>
            <boxGeometry args={[0.04, barHeight, 0.04]} />
            <meshBasicMaterial color={colorHex} />
          </mesh>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. VERTICAL HOLOGRAPHIC SCANNING LASER EFFECT
// ---------------------------------------------------------------------------
export function AuraScanningLaser({ colorHex }) {
  const scanRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (scanRef.current) {
      // Moves up and down smoothly through the avatar's full body
      scanRef.current.position.y = 0.15 + Math.sin(t * 1.8) * 1.15;
    }
  });

  return (
    <group ref={scanRef} position={[0, 0, 0]}>
      {/* Outer scanning emitter ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.78, 36]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner scanning laser plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.72, 36]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. CUSTOM GLB/GLTF MODEL LOADER COMPONENT (IF USER PROVIDES MODEL)
// ---------------------------------------------------------------------------
function CustomGlbAvatarMesh({ url, colorHex, isWireframe }) {
  const [modelScene, setModelScene] = useState(null);

  useEffect(() => {
    if (!url) return;
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(colorHex),
              emissive: new THREE.Color(colorHex),
              emissiveIntensity: 0.6,
              wireframe: isWireframe,
              transparent: true,
              opacity: 0.88,
              roughness: 0.2
            });
          }
        });
        setModelScene(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn('Custom GLB model loading fallback:', err);
        setModelScene(null);
      }
    );
  }, [url, colorHex, isWireframe]);

  if (!modelScene) return null;
  return <primitive object={modelScene} scale={[1, 1, 1]} position={[0, -1.2, 0]} />;
}

// ---------------------------------------------------------------------------
// 5. CAMERA CONTROLLER HELPER
// ---------------------------------------------------------------------------
function CameraViewRig({ targetPosition }) {
  const { camera } = useThree();
  useFrame(() => {
    if (targetPosition) {
      camera.position.lerp(new THREE.Vector3(...targetPosition), 0.08);
    }
  });
  return null;
}

// ---------------------------------------------------------------------------
// 6. MAIN AURA 3D STAGE EXPORT WITH INTERACTIVE CAMERA TOOLBAR
// ---------------------------------------------------------------------------
export default function AuraFullBodyAvatar({
  colorHex = '#00f0ff',
  accentHex = '#0077ff',
  avatarState = 'idle',
  danceStyle = 'hip_hop',
  audioLevel = 0,
  musicAudio = { level: 0, bass: 0, mid: 0, treble: 0 },
  isWireframe = false,
  customGlbUrl = null
}) {
  const [cameraPreset, setCameraPreset] = useState([0, 0.2, 4.2]); // default full body

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 3D Viewport Camera Controls Toolbar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 15,
        display: 'flex',
        gap: '6px',
        background: 'rgba(5, 8, 17, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '4px 6px',
        borderRadius: '6px',
        border: `1px solid ${colorHex}33`
      }}>
        <button
          onClick={() => setCameraPreset([0, 0.2, 4.2])}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-orbitron)',
            cursor: 'pointer',
            padding: '3px 6px',
            borderRadius: '4px'
          }}
          title="Full-Body 360 View"
        >
          FULL BODY
        </button>
        <button
          onClick={() => setCameraPreset([0, 0.85, 2.0])}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-orbitron)',
            cursor: 'pointer',
            padding: '3px 6px',
            borderRadius: '4px'
          }}
          title="Face & Chest Close-up"
        >
          FACE / CHEST
        </button>
        <button
          onClick={() => setCameraPreset([2.2, 0.9, 3.4])}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-orbitron)',
            cursor: 'pointer',
            padding: '3px 6px',
            borderRadius: '4px'
          }}
          title="Cinematic Stage Perspective"
        >
          CINEMATIC
        </button>
      </div>

      <Canvas
        camera={{ position: [0, 0.2, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 4]} intensity={1.8} color={colorHex} />
        <pointLight position={[-3, -1, -2]} color={accentHex} intensity={2.5} />

        <CameraViewRig targetPosition={cameraPreset} />

        <Float speed={1.8} rotationIntensity={0.05} floatIntensity={0.15}>
          {customGlbUrl ? (
            <CustomGlbAvatarMesh url={customGlbUrl} colorHex={colorHex} isWireframe={isWireframe} />
          ) : (
            <AuraHumanoidMesh
              colorHex={colorHex}
              accentHex={accentHex}
              avatarState={avatarState}
              danceStyle={danceStyle}
              audioLevel={audioLevel}
              musicAudio={musicAudio}
              isWireframe={isWireframe}
            />
          )}
        </Float>

        {/* Vertical Holographic Scanning Beam */}
        <AuraScanningLaser colorHex={colorHex} />

        {/* Holographic Circular Runic Platform */}
        <AuraHologramPlatform
          colorHex={colorHex}
          accentHex={accentHex}
          musicAudio={musicAudio}
        />

        {/* Ambient Holographic Floating Particles */}
        <Sparkles count={160} scale={4.5} size={3.8} speed={0.8} color={colorHex} />

        {/* Smooth 360° Camera Orbit & Zoom Controls */}
        <OrbitControls
          enableZoom={true}
          minDistance={1.6}
          maxDistance={6.0}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.12}
          rotateSpeed={0.65}
        />
      </Canvas>
    </div>
  );
}
