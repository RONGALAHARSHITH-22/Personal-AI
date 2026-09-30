import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Camera, Sparkles as SparklesIcon, Eye, User, Layers, Box } from 'lucide-react';
import { audioSynth } from '../services/AudioSynth';

// -------------------------------------------------------------
// 1. PROCEDURAL 3D ANIME HOLOGRAPHIC COMPANION (AURA ANIME WAIFU)
// -------------------------------------------------------------
export function AnimeHologramAvatarMesh({
  colorHex = '#00f0ff',
  accentHex = '#0077ff',
  avatarState = 'idle', // idle | listening | thinking | talking | celebrating | dancing
  danceStyle = 'hip_hop', // hip_hop | freestyle | cinematic
  audioLevel = 0,
  musicAudio = { level: 0, bass: 0, mid: 0, treble: 0 },
  isWireframe = false
}) {
  const rootRef = useRef();
  const headGroupRef = useRef();
  const leftHairRef = useRef();
  const rightHairRef = useRef();
  const ahogeRef = useRef();
  const mouthRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const blushLeftRef = useRef();
  const blushRightRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const skirtRef = useRef();
  const haloRef = useRef();

  // Autonomous Eye Blinking
  const [blinkScaleY, setBlinkScaleY] = useState(1);
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkScaleY(0.08);
      setTimeout(() => setBlinkScaleY(1), 150);
    }, 3200 + Math.random() * 2500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Hologram Glass & Anime Shading Materials
  const hairMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f1f5f9'),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.4,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.95
    });
  }, [colorHex, isWireframe]);

  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffe5d9'),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.2,
      roughness: 0.45,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.95
    });
  }, [colorHex, isWireframe]);

  const eyeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      wireframe: isWireframe
    });
  }, [colorHex, isWireframe]);

  const dressMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e1b4b'),
      emissive: new THREE.Color(accentHex),
      emissiveIntensity: 0.4,
      roughness: 0.35,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.94
    });
  }, [accentHex, isWireframe]);

  const skirtMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7c3aed'),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.3,
      roughness: 0.35,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.94
    });
  }, [colorHex, isWireframe]);

  const ribbonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.7,
      roughframe: isWireframe
    });
  }, [colorHex, isWireframe]);

  // Main Anime Kinematics Animation Loop
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const bass = musicAudio.bass || 0;

    // --- IDLE STATE ---
    if (avatarState === 'idle') {
      if (rootRef.current) {
        rootRef.current.position.y = -0.45 + Math.sin(t * 1.6) * 0.03;
        rootRef.current.rotation.y = Math.sin(t * 0.6) * 0.05;
      }
      if (headGroupRef.current) {
        headGroupRef.current.rotation.z = Math.sin(t * 1.2) * 0.02;
        headGroupRef.current.rotation.x = Math.sin(t * 1.4) * 0.015;
      }
      if (leftHairRef.current && rightHairRef.current) {
        leftHairRef.current.rotation.z = 0.12 + Math.sin(t * 2.0) * 0.04;
        rightHairRef.current.rotation.z = -0.12 - Math.sin(t * 2.0) * 0.04;
      }
      if (ahogeRef.current) {
        ahogeRef.current.rotation.z = 0.2 + Math.sin(t * 3.5) * 0.1;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = 0.18 + Math.sin(t * 1.6) * 0.03;
        rightArmRef.current.rotation.z = -0.18 - Math.sin(t * 1.6) * 0.03;
      }
    }

    // --- LISTENING STATE ---
    else if (avatarState === 'listening') {
      if (rootRef.current) {
        rootRef.current.position.y = -0.43 + Math.sin(t * 2.8) * 0.02;
      }
      if (headGroupRef.current) {
        headGroupRef.current.rotation.z = 0.14 + Math.sin(t * 2.0) * 0.03; // cute attentive head tilt
        headGroupRef.current.rotation.x = -0.06;
      }
      if (haloRef.current) {
        haloRef.current.rotation.z += delta * 3.0;
        haloRef.current.scale.setScalar(1 + Math.sin(t * 7.0) * 0.1);
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = 0.35;
        rightArmRef.current.rotation.z = -0.35;
      }
    }

    // --- THINKING STATE ---
    else if (avatarState === 'thinking') {
      if (rootRef.current) {
        rootRef.current.position.y = -0.45;
      }
      if (headGroupRef.current) {
        headGroupRef.current.rotation.x = -0.16 + Math.sin(t * 1.2) * 0.03;
        headGroupRef.current.rotation.y = 0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.2;
        rightArmRef.current.rotation.z = -0.4;
      }
    }

    // --- TALKING STATE ---
    else if (avatarState === 'talking') {
      if (rootRef.current) {
        rootRef.current.position.y = -0.45 + Math.sin(t * 3.2) * 0.025;
        rootRef.current.rotation.y = Math.sin(t * 1.8) * 0.06;
      }
      if (headGroupRef.current) {
        headGroupRef.current.rotation.x = Math.sin(t * 4.0) * 0.05;
        headGroupRef.current.rotation.y = Math.sin(t * 2.2) * 0.06;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -0.3 + Math.sin(t * 3.5) * 0.2;
        leftArmRef.current.rotation.z = 0.35 + Math.cos(t * 2.8) * 0.1;
        rightArmRef.current.rotation.x = -0.35 - Math.sin(t * 3.2) * 0.2;
        rightArmRef.current.rotation.z = -0.35 - Math.cos(t * 3.0) * 0.1;
      }
      if (mouthRef.current) {
        const mouthOpen = 0.1 + audioLevel * 1.6 + Math.sin(t * 18.0) * (audioLevel * 0.6);
        mouthRef.current.scale.y = Math.max(0.08, mouthOpen);
      }
    }

    // --- CELEBRATING STATE ---
    else if (avatarState === 'celebrating') {
      const jump = Math.abs(Math.sin(t * 5.5)) * 0.22;
      if (rootRef.current) {
        rootRef.current.position.y = -0.45 + jump;
        rootRef.current.rotation.y = Math.sin(t * 3.0) * 0.25;
      }
      if (headGroupRef.current) {
        headGroupRef.current.rotation.x = -0.22;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = 1.25 + Math.sin(t * 8.0) * 0.25;
        rightArmRef.current.rotation.z = -1.25 - Math.sin(t * 8.0) * 0.25;
      }
    }

    // --- DANCING STATE ---
    else if (avatarState === 'dancing') {
      if (danceStyle === 'hip_hop') {
        const bounce = Math.abs(Math.sin(t * 6.5)) * 0.18 + bass * 0.15;
        if (rootRef.current) {
          rootRef.current.position.y = -0.5 + bounce;
          rootRef.current.rotation.y = Math.sin(t * 3.25) * 0.3;
        }
        if (headGroupRef.current) {
          headGroupRef.current.rotation.x = Math.sin(t * 13.0) * 0.18; // head nodding to beat
        }
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.z = 0.7 + Math.sin(t * 6.5) * 0.4;
          leftArmRef.current.rotation.x = -0.5 + Math.cos(t * 6.5) * 0.3;
          rightArmRef.current.rotation.z = -0.7 - Math.sin(t * 6.5) * 0.4;
          rightArmRef.current.rotation.x = -0.5 - Math.cos(t * 6.5) * 0.3;
        }
        if (skirtRef.current) {
          skirtRef.current.rotation.y = Math.sin(t * 6.5) * 0.15;
        }
      } else if (danceStyle === 'freestyle') {
        if (rootRef.current) {
          rootRef.current.position.y = -0.42 + Math.sin(t * 5.0) * 0.1;
          rootRef.current.rotation.y = t * 1.8; // full 360-degree spin
        }
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.z = 1.1 + Math.sin(t * 4.0) * 0.4;
          rightArmRef.current.rotation.z = -1.1 - Math.cos(t * 4.0) * 0.4;
        }
      } else {
        // Cinematic / Balletic
        if (rootRef.current) {
          rootRef.current.position.y = -0.4 + Math.sin(t * 2.5) * 0.12;
          rootRef.current.rotation.y = Math.sin(t * 1.2) * 0.4;
        }
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.z = 1.35 + Math.sin(t * 2.5) * 0.15;
          rightArmRef.current.rotation.z = -1.35 - Math.sin(t * 2.5) * 0.15;
        }
      }

      if (mouthRef.current) {
        mouthRef.current.scale.y = 0.15 + (musicAudio.level || 0) * 1.8;
      }
    }

    // Blinking
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blinkScaleY;
      rightEyeRef.current.scale.y = blinkScaleY;
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.45, 0]} scale={[1, 1, 1]}>
      {/* ----------------- HEAD & EXPRESSIVE FACE ----------------- */}
      <group ref={headGroupRef} position={[0, 1.35, 0]}>
        {/* Anime Face Contour */}
        <mesh material={skinMaterial}>
          <sphereGeometry args={[0.32, 32, 32]} />
        </mesh>
        <mesh position={[0, -0.2, 0.08]} rotation={[0.35, 0, 0]} material={skinMaterial}>
          <coneGeometry args={[0.2, 0.26, 16]} />
        </mesh>

        {/* Blush Cheeks */}
        <mesh ref={blushLeftRef} position={[-0.17, -0.05, 0.27]} material={ribbonMaterial}>
          <sphereGeometry args={[0.04, 16, 16]} />
        </mesh>
        <mesh ref={blushRightRef} position={[0.17, -0.05, 0.27]} material={ribbonMaterial}>
          <sphereGeometry args={[0.04, 16, 16]} />
        </mesh>

        {/* Large Anime Eyes (Left & Right) */}
        <group ref={leftEyeRef} position={[-0.11, 0.03, 0.27]}>
          <mesh>
            <sphereGeometry args={[0.068, 16, 16]} />
            <meshBasicMaterial color="#ffffff" wireframe={isWireframe} />
          </mesh>
          <mesh position={[0, 0, 0.03]} material={eyeMaterial}>
            <cylinderGeometry args={[0.042, 0.042, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
          <mesh position={[0.016, 0.02, 0.048]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        <group ref={rightEyeRef} position={[0.11, 0.03, 0.27]}>
          <mesh>
            <sphereGeometry args={[0.068, 16, 16]} />
            <meshBasicMaterial color="#ffffff" wireframe={isWireframe} />
          </mesh>
          <mesh position={[0, 0, 0.03]} material={eyeMaterial}>
            <cylinderGeometry args={[0.042, 0.042, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
          <mesh position={[-0.016, 0.02, 0.048]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Delicate Nose */}
        <mesh position={[0, -0.06, 0.32]} material={skinMaterial}>
          <coneGeometry args={[0.014, 0.03, 8]} />
        </mesh>

        {/* Expressive Mouth */}
        <mesh ref={mouthRef} position={[0, -0.14, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.03, 0.01, 8, 16, Math.PI]} />
          <meshBasicMaterial color={colorHex} wireframe={isWireframe} />
        </mesh>

        {/* Ahoge Antenna Strand */}
        <group ref={ahogeRef} position={[0, 0.38, 0.05]}>
          <mesh position={[0, 0.12, 0]} rotation={[0.4, 0, 0.25]} material={hairMaterial}>
            <coneGeometry args={[0.025, 0.32, 8]} />
          </mesh>
        </group>

        {/* Front Anime Hair Bangs */}
        <group position={[0, 0.16, 0.15]}>
          <mesh position={[-0.12, -0.04, 0.13]} rotation={[0.2, 0.1, -0.2]} material={hairMaterial}>
            <coneGeometry args={[0.07, 0.32, 12]} />
          </mesh>
          <mesh position={[0, -0.07, 0.17]} rotation={[0.22, 0, 0]} material={hairMaterial}>
            <coneGeometry args={[0.08, 0.36, 12]} />
          </mesh>
          <mesh position={[0.12, -0.04, 0.13]} rotation={[0.2, -0.1, 0.2]} material={hairMaterial}>
            <coneGeometry args={[0.07, 0.32, 12]} />
          </mesh>
        </group>

        {/* Glowing Lavender Hair Ribbon */}
        <group position={[0.24, 0.12, 0.05]}>
          <mesh material={ribbonMaterial}>
            <torusGeometry args={[0.045, 0.016, 8, 16]} />
          </mesh>
          <mesh position={[0.02, -0.05, 0]} rotation={[0, 0, -0.3]} material={ribbonMaterial}>
            <coneGeometry args={[0.03, 0.12, 6]} />
          </mesh>
        </group>

        {/* Flowing Hair Dome & Back Hair Strands */}
        <mesh position={[0, 0.07, -0.04]} material={hairMaterial}>
          <sphereGeometry args={[0.37, 24, 24]} />
        </mesh>
        <group ref={leftHairRef} position={[-0.2, -0.14, -0.1]}>
          <mesh rotation={[0, 0, -0.1]} material={hairMaterial}>
            <coneGeometry args={[0.13, 0.75, 12]} />
          </mesh>
        </group>
        <group ref={rightHairRef} position={[0.2, -0.14, -0.1]}>
          <mesh rotation={[0, 0, 0.1]} material={hairMaterial}>
            <coneGeometry args={[0.13, 0.75, 12]} />
          </mesh>
        </group>

        {/* Floating Hologram Cyber Halo Ring */}
        <group ref={haloRef} position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.26, 0.012, 16, 32]} />
            <meshBasicMaterial color={colorHex} wireframe />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[0.22, 0.28, 4]} />
            <meshBasicMaterial color={accentHex} wireframe transparent opacity={0.6} />
          </mesh>
        </group>
      </group>

      {/* ----------------- TORSO & ANIME OUTFIT ----------------- */}
      <group position={[0, 0.52, 0]}>
        {/* Slender Neck */}
        <mesh position={[0, 0.46, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.07, 0.085, 0.16, 16]} />
        </mesh>

        {/* Off-the-Shoulder Frilled Top */}
        <mesh position={[0, 0.34, 0]} material={dressMaterial}>
          <torusGeometry args={[0.22, 0.04, 12, 24]} />
        </mesh>
        <mesh position={[0, 0.18, 0]} material={dressMaterial}>
          <cylinderGeometry args={[0.21, 0.16, 0.34, 24]} />
        </mesh>

        {/* Left Arm Rig */}
        <group ref={leftArmRef} position={[-0.26, 0.26, 0]}>
          <mesh position={[0, -0.2, 0]} material={dressMaterial}>
            <cylinderGeometry args={[0.055, 0.05, 0.36, 16]} />
          </mesh>
          <mesh position={[0, -0.4, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.045, 12, 12]} />
          </mesh>
        </group>

        {/* Right Arm Rig */}
        <group ref={rightArmRef} position={[0.26, 0.26, 0]}>
          <mesh position={[0, -0.2, 0]} material={dressMaterial}>
            <cylinderGeometry args={[0.055, 0.05, 0.36, 16]} />
          </mesh>
          <mesh position={[0, -0.4, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.045, 12, 12]} />
          </mesh>
        </group>

        {/* High Waist Belt Accent */}
        <mesh position={[0, -0.01, 0]}>
          <torusGeometry args={[0.175, 0.02, 8, 24]} />
          <meshBasicMaterial color={colorHex} />
        </mesh>

        {/* Pleated Tartan Skirt */}
        <group ref={skirtRef} position={[0, -0.16, 0]}>
          <mesh material={skirtMaterial}>
            <cylinderGeometry args={[0.17, 0.32, 0.3, 24]} />
          </mesh>
        </group>

        {/* Slender Anime Legs */}
        <mesh position={[-0.08, -0.44, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 16]} />
        </mesh>
        <mesh position={[0.08, -0.44, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 16]} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 2. TRIPO 3D VIDEO TURNTABLE HOLOGRAM
// -------------------------------------------------------------
function TripoVideoHologram({
  colorHex = '#00f0ff',
  audioLevel = 0,
  isWireframe = false,
  videoUrl = '/ai-showcase.mp4'
}) {
  const meshRef = useRef();
  const materialRef = useRef();
  const [videoEl, setVideoEl] = useState(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.play().catch(() => {});
    setVideoEl(video);

    return () => {
      video.pause();
      video.src = '';
      video.load();
    };
  }, [videoUrl]);

  const videoTexture = useMemo(() => {
    if (!videoEl) return null;
    const tex = new THREE.VideoTexture(videoEl);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.format = THREE.RGBAFormat;
    return tex;
  }, [videoEl]);

  const shaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: videoTexture },
        uColor: { value: new THREE.Color(colorHex) },
        uAudioLevel: { value: 0 },
        uLumaCutoff: { value: 0.07 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uAudioLevel;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(uTime * 6.0 + pos.y * 3.0) * (uAudioLevel * 0.05);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform sampler2D uTexture;
        uniform vec3 uColor;
        uniform float uAudioLevel;
        uniform float uLumaCutoff;
        varying vec2 vUv;

        void main() {
          vec4 texColor = texture2D(uTexture, vUv);
          float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          float alpha = smoothstep(uLumaCutoff, uLumaCutoff + 0.12, luma);
          if (vUv.x > 0.72 && vUv.y > 0.76) alpha = 0.0;
          if (vUv.y > 0.93) alpha = 0.0;

          float scanline = sin(vUv.y * 180.0 - uTime * 10.0) * 0.5 + 0.5;
          vec3 finalColor = mix(texColor.rgb, uColor, 0.18 + sin(uTime * 2.0) * 0.04);
          finalColor += uColor * (uAudioLevel * 0.35);
          alpha *= (0.88 + scanline * 0.12);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      wireframe: isWireframe,
      side: THREE.DoubleSide
    });
  }, [videoTexture, colorHex, isWireframe]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      materialRef.current.uniforms.uColor.value.set(colorHex);
      materialRef.current.uniforms.uAudioLevel.value = audioLevel;
      if (videoTexture) materialRef.current.uniforms.uTexture.value = videoTexture;
    }
    if (meshRef.current) {
      meshRef.current.position.y = 0.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0.2, 0]}>
        <planeGeometry args={[2.2, 2.5, 32, 32]} />
        <primitive object={shaderMat} ref={materialRef} attach="material" />
      </mesh>
      <mesh position={[0, 0.2, -0.02]}>
        <planeGeometry args={[2.28, 2.58]} />
        <meshBasicMaterial color={colorHex} wireframe transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 3. FLOATING ANIME CYBER MASCOT PET
// -------------------------------------------------------------
function FloatingAnimeMascot({ colorHex }) {
  const orbRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orbRef.current) {
      orbRef.current.position.x = 1.15 + Math.sin(t * 1.8) * 0.12;
      orbRef.current.position.y = 1.05 + Math.cos(t * 2.2) * 0.15;
      orbRef.current.position.z = 0.2 + Math.sin(t * 1.5) * 0.1;
      orbRef.current.rotation.y = t * 1.2;
    }
  });

  return (
    <group ref={orbRef}>
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color={colorHex} emissive={colorHex} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.04, 0.02, 0.1]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.04, 0.02, 0.1]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.18, 0.01, 12, 32]} />
        <meshBasicMaterial color={colorHex} wireframe />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 4. CONCENTRIC 3D MAGIC RUNIC HOLOGRAPHIC PLATFORM
// -------------------------------------------------------------
export function AuraHologramPlatform({ colorHex = '#00f0ff', accentHex = '#0077ff', musicAudio }) {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const emitterConeRef = useRef();

  useFrame((state, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.7;
    if (ring3Ref.current) ring3Ref.current.rotation.z += delta * 0.3;

    if (emitterConeRef.current) {
      emitterConeRef.current.material.opacity = 0.12 + (musicAudio?.bass || 0) * 0.35;
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
        z: Math.sin(angle) * radius
      };
    });
  }, []);

  return (
    <group position={[0, -1.35, 0]}>
      {/* Outer Telemetry Glyphs Ring */}
      <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.25, 1.45, 48]} />
        <meshBasicMaterial color={colorHex} wireframe transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Middle Concentric Runic Ring */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.75, 1.05, 32]} />
        <meshBasicMaterial color={accentHex} wireframe transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner Core Platform */}
      <mesh ref={ring3Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.3, 0.55, 24]} />
        <meshBasicMaterial color={colorHex} wireframe transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Dark Glass Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial color="#050811" transparent opacity={0.88} side={THREE.DoubleSide} />
      </mesh>

      {/* Vertical Holographic Projector Beam */}
      <mesh ref={emitterConeRef} position={[0, 1.4, 0]}>
        <cylinderGeometry args={[1.35, 0.65, 2.8, 32, 1, true]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.14} side={THREE.DoubleSide} depthWrite={false} />
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

// -------------------------------------------------------------
// 5. VERTICAL SCANNING LASER EFFECT
// -------------------------------------------------------------
export function AuraScanningLaser({ colorHex }) {
  const scanRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (scanRef.current) {
      scanRef.current.position.y = 0.15 + Math.sin(t * 1.8) * 1.15;
    }
  });

  return (
    <group ref={scanRef} position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 0.81, 36]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.75, 36]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 6. CAMERA POSITION & FOCUS INTERPOLATOR RIG
// -------------------------------------------------------------
function CameraViewRig({ targetPosition, targetLookAt }) {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls);

  useFrame(() => {
    if (targetPosition) {
      camera.position.lerp(new THREE.Vector3(...targetPosition), 0.08);
    }
    if (controls && targetLookAt) {
      controls.target.lerp(new THREE.Vector3(...targetLookAt), 0.08);
      controls.update();
    }
  });
  return null;
}

// -------------------------------------------------------------
// 7. MAIN AURA 3D HOLOGRAPHIC STAGE EXPORT
// -------------------------------------------------------------
export default function AuraFullBodyAvatar({
  colorHex = '#00f0ff',
  accentHex = '#0077ff',
  avatarState = 'idle',
  danceStyle = 'hip_hop',
  audioLevel = 0,
  musicAudio = { level: 0, bass: 0, mid: 0, treble: 0 },
  isWireframe = false,
  modelPreset = 'anime_3d', // 'anime_3d' | 'turntable_3d' | 'custom_glb'
  onSelectModelPreset = null,
  customGlbUrl = null
}) {
  const [cameraPosition, setCameraPosition] = useState([0, 0.25, 3.8]);
  const [cameraLookAt, setCameraLookAt] = useState([0, 0.4, 0]);
  const [activeCameraMode, setActiveCameraMode] = useState('full'); // 'full' | 'bust' | 'cinematic'

  const handleSetCamera = (mode, pos, lookAt) => {
    audioSynth.playClickSound();
    setActiveCameraMode(mode);
    setCameraPosition(pos);
    setCameraLookAt(lookAt);
  };

  const handleSelectModel = (preset) => {
    audioSynth.playClickSound();
    if (onSelectModelPreset) {
      onSelectModelPreset(preset);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* UNIFIED TOP HUD BAR: MODEL SELECTOR (LEFT) + STATUS MATRIX (RIGHT) */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        {/* Model Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(5, 8, 17, 0.88)',
          backdropFilter: 'blur(10px)',
          padding: '4px 8px',
          borderRadius: '8px',
          border: `1px solid ${colorHex}33`,
          pointerEvents: 'auto'
        }}>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-orbitron)', color: colorHex, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginRight: '3px' }}>
            <SparklesIcon size={12} /> MODEL:
          </span>
          <button
            onClick={() => handleSelectModel('anime_3d')}
            style={{
              background: modelPreset === 'anime_3d' ? `${colorHex}25` : 'transparent',
              border: modelPreset === 'anime_3d' ? `1px solid ${colorHex}` : '1px solid transparent',
              color: modelPreset === 'anime_3d' ? colorHex : 'var(--text-dim)',
              borderRadius: '5px',
              padding: '4px 8px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-orbitron)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: modelPreset === 'anime_3d' ? `0 0 10px ${colorHex}33` : 'none'
            }}
            title="Switch to 3D Anime Holographic Companion"
          >
            ✨ ANIME 3D WAIFU
          </button>
          <button
            onClick={() => handleSelectModel('turntable_3d')}
            style={{
              background: modelPreset === 'turntable_3d' ? `${colorHex}25` : 'transparent',
              border: modelPreset === 'turntable_3d' ? `1px solid ${colorHex}` : '1px solid transparent',
              color: modelPreset === 'turntable_3d' ? colorHex : 'var(--text-dim)',
              borderRadius: '5px',
              padding: '4px 8px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-orbitron)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: modelPreset === 'turntable_3d' ? `0 0 10px ${colorHex}33` : 'none'
            }}
            title="Switch to 360° Holographic Turntable Showcase"
          >
            💫 360° TURNTABLE
          </button>
        </div>

        {/* Real-time Rigging Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(5, 8, 17, 0.88)',
          backdropFilter: 'blur(10px)',
          padding: '4px 10px',
          borderRadius: '8px',
          border: `1px solid ${colorHex}33`,
          pointerEvents: 'auto'
        }}>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-orbitron)', color: colorHex, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
            <span className="pulse-dot" style={{ backgroundColor: colorHex }} />
            {avatarState.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            360° SKELETAL RIG
          </span>
        </div>
      </div>

      {/* BOTTOM-LEFT: INTERACTION TIP */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '14px',
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(5, 8, 17, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: '3px 8px',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.64rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-dim)',
        pointerEvents: 'none'
      }}>
        <span>🖱️ DRAG 360° | SCROLL ZOOM</span>
      </div>

      {/* BOTTOM-RIGHT: CAMERA PERSPECTIVE BUTTONS */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(5, 8, 17, 0.88)',
        backdropFilter: 'blur(10px)',
        padding: '4px 6px',
        borderRadius: '8px',
        border: `1px solid ${colorHex}33`
      }}>
        <Camera size={13} color={colorHex} style={{ marginLeft: '2px', marginRight: '2px' }} />
        {[
          { id: 'full', label: 'FULL BODY', pos: [0, 0.25, 3.8], lookAt: [0, 0.4, 0], title: 'Full-Body View' },
          { id: 'bust', label: 'BUST / FACE', pos: [0, 0.95, 1.75], lookAt: [0, 0.95, 0], title: 'Close-up Face & Bust' },
          { id: 'cinematic', label: 'CINEMATIC', pos: [2.2, 0.8, 3.2], lookAt: [0, 0.35, 0], title: 'Cinematic Perspective' }
        ].map((cam) => {
          const isActive = activeCameraMode === cam.id;
          return (
            <button
              key={cam.id}
              onClick={() => handleSetCamera(cam.id, cam.pos, cam.lookAt)}
              style={{
                background: isActive ? `${colorHex}25` : 'transparent',
                border: isActive ? `1px solid ${colorHex}` : '1px solid transparent',
                color: isActive ? colorHex : 'var(--text-dim)',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-orbitron)',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '5px',
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 0 10px ${colorHex}33` : 'none'
              }}
              title={cam.title}
            >
              {cam.label}
            </button>
          );
        })}
      </div>

      {/* 3D CANVAS */}
      <Canvas
        camera={{ position: [0, 0.25, 3.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[3, 5, 4]} intensity={1.8} color={colorHex} />
        <pointLight position={[-3, -1, -2]} color={accentHex} intensity={2.5} />

        <CameraViewRig targetPosition={cameraPosition} targetLookAt={cameraLookAt} />

        <Float speed={1.8} rotationIntensity={0.06} floatIntensity={0.16}>
          {modelPreset === 'turntable_3d' ? (
            <TripoVideoHologram
              colorHex={colorHex}
              audioLevel={audioLevel}
              isWireframe={isWireframe}
            />
          ) : (
            <AnimeHologramAvatarMesh
              colorHex={colorHex}
              accentHex={accentHex}
              avatarState={avatarState}
              danceStyle={danceStyle}
              audioLevel={audioLevel}
              musicAudio={musicAudio}
              isWireframe={isWireframe}
            />
          )}

          <FloatingAnimeMascot colorHex={colorHex} />
        </Float>

        {/* Laser scanline sweep */}
        <AuraScanningLaser colorHex={colorHex} />

        {/* Magic Concentric Platform */}
        <AuraHologramPlatform
          colorHex={colorHex}
          accentHex={accentHex}
          musicAudio={musicAudio}
        />

        {/* Ambient Holographic Floating Sparkles */}
        <Sparkles count={150} scale={4.5} size={3.8} speed={0.8} color={colorHex} />

        {/* Interactive Orbit Controls */}
        <OrbitControls
          makeDefault
          enableZoom={true}
          minDistance={1.4}
          maxDistance={5.8}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.12}
          rotateSpeed={0.65}
        />
      </Canvas>
    </div>
  );
}

