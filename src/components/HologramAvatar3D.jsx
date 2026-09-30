import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// -------------------------------------------------------------
// ANIME FEMALE CHARACTER PRESETS (FEATURING TRIPO 3D WAIFU)
// -------------------------------------------------------------
export const ANIME_AVATAR_PRESETS = [
  { 
    id: 'tripo_waifu', 
    name: 'Ruby (Tripo-3D Turntable Hologram)', 
    type: 'video', 
    videoUrl: '/ai-showcase.mp4',
    hairColor: '#f1f5f9', 
    eyeColor: '#00f0ff', 
    suitColor: '#24252e', 
    description: '360° Turntable 3D Showcase with Holographic Luma-Key and Audio Reactivity'
  },
  { 
    id: 'tripo_procedural', 
    name: 'Ruby (Tripo-3D Procedural Waifu)', 
    type: 'procedural', 
    hairColor: '#f8fafc', 
    eyeColor: '#00f0ff', 
    suitColor: '#20222e', 
    earColor: '#c084fc',
    description: 'Full 3D Procedural Polygon Mesh Calibrated to Tripo Design'
  },
  { 
    id: 'tripo_glb', 
    name: 'Ruby (Tripo-3D GLB Model Loader)', 
    type: 'glb', 
    hairColor: '#f1f5f9', 
    eyeColor: '#00f0ff',
    description: 'Direct GLB/GLTF 3D Mesh Loader for Tripo Studio Model Files'
  },
  { 
    id: 'alya_custom', 
    name: 'Alya Silver Waifu (Custom Image)', 
    type: 'image',
    hairColor: '#e2e8f0', 
    eyeColor: '#00f0ff', 
    suitColor: '#181824', 
    earColor: '#a855f7', 
    photoUrl: '/alya_anime_waifu.png' 
  },
  { 
    id: 'aura_chan', 
    name: 'Aura-chan (Cyber Neko)', 
    type: 'procedural',
    hairColor: '#00f0ff', 
    eyeColor: '#ff007f', 
    suitColor: '#0c162d', 
    earColor: '#00f0ff' 
  },
  { 
    id: 'natasha_chan', 
    name: 'Natasha-chan (Crimson Ninja)', 
    type: 'procedural',
    hairColor: '#ff2a55', 
    eyeColor: '#ffaa00', 
    suitColor: '#1a0510', 
    earColor: '#ff003c' 
  },
  { 
    id: 'joi_chan', 
    name: 'Joi-chan (Neon Waifu)', 
    type: 'procedural',
    hairColor: '#ff77bc', 
    eyeColor: '#00f0ff', 
    suitColor: '#2b092a', 
    earColor: '#ff77bc' 
  },
  { 
    id: 'violet_chan', 
    name: 'Keqing (Void Empress)', 
    type: 'procedural',
    hairColor: '#b55fe6', 
    eyeColor: '#00ff88', 
    suitColor: '#190a2b', 
    earColor: '#a855f7' 
  }
];

// -------------------------------------------------------------
// 1. TRIPO 3D HOLOGRAM VIDEO TURNTABLE PROJECTION
// -------------------------------------------------------------
function TripoVideoHologram({ 
  colorHex, 
  glitchIntensity, 
  audioLevel, 
  isWireframe, 
  videoUrl = '/ai-showcase.mp4',
  lumaCutoff = 0.07,
  playbackSpeed = 1.0
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
    video.playbackRate = playbackSpeed;
    video.play().catch((e) => console.log('Video autoplay note:', e.message));
    setVideoEl(video);

    return () => {
      video.pause();
      video.src = '';
      video.load();
    };
  }, [videoUrl, playbackSpeed]);

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
        uGlitch: { value: glitchIntensity },
        uAudioLevel: { value: 0 },
        uLumaCutoff: { value: lumaCutoff }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uGlitch;
        uniform float uAudioLevel;
        varying vec2 vUv;
        varying vec3 vPosition;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          vUv = uv;
          vPosition = position;
          vec3 pos = position;

          // Hologram scanline displacement glitch
          float glitchTrigger = step(0.96, random(vec2(floor(uTime * 15.0), pos.y * 2.0)));
          pos.x += glitchTrigger * (random(vec2(uTime, pos.y)) - 0.5) * uGlitch * 0.45;

          // Audio reactive breathing/speaking expansion
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
        varying vec3 vPosition;

        void main() {
          // If no texture loaded yet, fallback to subtle glow
          vec4 texColor = texture2D(uTexture, vUv);

          // Calculate luminance to cleanly remove dark studio background
          float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          float alpha = smoothstep(uLumaCutoff, uLumaCutoff + 0.12, luma);

          // Neatly crop out watermark & QR code in top right and top edge
          if (vUv.x > 0.72 && vUv.y > 0.76) {
            alpha = 0.0;
          }
          if (vUv.y > 0.93) {
            alpha = 0.0;
          }

          // Cyber Scanlines
          float scanline = sin(vUv.y * 180.0 - uTime * 10.0) * 0.5 + 0.5;
          scanline = pow(scanline, 1.7);

          // Holographic color infusion & theme tint
          vec3 finalColor = mix(texColor.rgb, uColor, 0.16 + sin(uTime * 2.0) * 0.04);

          // Audio speaking reactive pulse glow
          finalColor += uColor * (uAudioLevel * 0.4);

          // Soft rim glow around hologram silhouette
          float edgeDist = length(vUv - vec2(0.5, 0.45));
          finalColor += uColor * pow(edgeDist, 2.2) * 0.28;

          // Hologram scanline alpha modulation
          alpha *= (0.88 + scanline * 0.12);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      wireframe: isWireframe,
      side: THREE.DoubleSide
    });
  }, [videoTexture, colorHex, glitchIntensity, isWireframe, lumaCutoff]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      materialRef.current.uniforms.uColor.value.set(colorHex);
      materialRef.current.uniforms.uGlitch.value = glitchIntensity;
      materialRef.current.uniforms.uAudioLevel.value = audioLevel;
      materialRef.current.uniforms.uLumaCutoff.value = lumaCutoff;
      if (videoTexture) {
        materialRef.current.uniforms.uTexture.value = videoTexture;
      }
    }

    if (meshRef.current) {
      // Gentle floating physics
      meshRef.current.position.y = 0.18 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    }
  });

  return (
    <group>
      {/* Curved Holographic Projector Plane */}
      <mesh ref={meshRef} position={[0, 0.18, 0]}>
        <planeGeometry args={[2.2, 2.5, 32, 32]} />
        <primitive object={shaderMat} ref={materialRef} attach="material" />
      </mesh>

      {/* Futuristic Floating Glass Bezel Accents */}
      <mesh position={[0, 0.18, -0.02]}>
        <planeGeometry args={[2.28, 2.58]} />
        <meshBasicMaterial color={colorHex} wireframe transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 2. TRIPO 3D GLB/GLTF MODEL LOADER
// -------------------------------------------------------------
function TripoGLBModel({ 
  glbUrl, 
  colorHex, 
  audioLevel, 
  isWireframe 
}) {
  const [modelScene, setModelScene] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const groupRef = useRef();

  useEffect(() => {
    if (!glbUrl) return;
    const loader = new GLTFLoader();
    loader.load(
      glbUrl,
      (gltf) => {
        const scene = gltf.scene;

        // Auto center and normalize scale
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / (maxDim || 1);

        scene.position.sub(center.multiplyScalar(scale));
        scene.scale.set(scale, scale, scale);

        // Apply holographic styling to materials
        scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (isWireframe) {
              child.material.wireframe = true;
            }
          }
        });

        setModelScene(scene);
        setErrorMsg(null);
      },
      undefined,
      (err) => {
        console.error('Failed to load GLB model:', err);
        setErrorMsg('GLB file could not be loaded. Please check path or drop a valid .glb file.');
      }
    );
  }, [glbUrl, isWireframe]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = 0.05 + Math.sin(t * 1.6) * 0.04;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  if (errorMsg) {
    return (
      <group position={[0, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.8, 0.1]} />
          <meshBasicMaterial color="#ff0055" wireframe />
        </mesh>
      </group>
    );
  }

  if (!modelScene) {
    return (
      <group position={[0, 0.3, 0]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color={colorHex} wireframe />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive object={modelScene} />
    </group>
  );
}

// -------------------------------------------------------------
// 3. 3D HOLOGRAM IMAGE PROJECTION CARD (FOR CUSTOM USER PHOTOS)
// -------------------------------------------------------------
function AnimeHologramProjectionCard({ colorHex, glitchIntensity, audioLevel, photoUrl, isWireframe }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(photoUrl || '/alya_anime_waifu.png');
  }, [photoUrl]);

  const shaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uColor: { value: new THREE.Color(colorHex) },
        uGlitch: { value: glitchIntensity },
        uAudioLevel: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uGlitch;
        uniform float uAudioLevel;
        varying vec2 vUv;
        varying vec3 vPosition;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          vUv = uv;
          vPosition = position;
          vec3 pos = position;

          // Holographic glitch jitter along Y axis
          float glitchTrigger = step(0.95, random(vec2(floor(uTime * 20.0), pos.y)));
          pos.x += glitchTrigger * (random(vec2(uTime, pos.y)) - 0.5) * uGlitch * 0.5;

          // Audio speaking ripple wave
          pos.z += sin(uTime * 5.0 + pos.y * 4.0) * (uAudioLevel * 0.04);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform sampler2D uTexture;
        uniform vec3 uColor;
        uniform float uAudioLevel;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vec4 texColor = texture2D(uTexture, vUv);

          // Cyber Scanlines
          float scanline = sin(vUv.y * 140.0 - uTime * 9.0) * 0.5 + 0.5;
          scanline = pow(scanline, 1.6);

          // Color blend & audio pulse glow
          vec3 colorBlend = mix(texColor.rgb, uColor, 0.18 + sin(uTime * 2.5) * 0.05);

          if (vUv.y > 0.4 && vUv.y < 0.7) {
            colorBlend += uColor * (uAudioLevel * 0.3);
          }

          // Edge cyan/pink holographic aura rim
          float edgeDist = length(vUv - vec2(0.5));
          float rimGlow = pow(edgeDist, 2.0) * 0.35;
          colorBlend += uColor * rimGlow;

          float alpha = texColor.a * (0.88 + scanline * 0.12);
          gl_FragColor = vec4(colorBlend, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      wireframe: isWireframe,
      side: THREE.DoubleSide
    });
  }, [colorHex, glitchIntensity, texture, isWireframe]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      materialRef.current.uniforms.uColor.value.set(colorHex);
      materialRef.current.uniforms.uGlitch.value = glitchIntensity;
      materialRef.current.uniforms.uAudioLevel.value = audioLevel;
    }

    if (meshRef.current) {
      meshRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 1.6) * 0.05;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0.15, 0]}>
        <planeGeometry args={[1.9, 2.8]} />
        <primitive object={shaderMat} ref={materialRef} attach="material" />
      </mesh>

      <mesh position={[0, 0.15, -0.01]}>
        <planeGeometry args={[1.96, 2.86]} />
        <meshBasicMaterial color={colorHex} wireframe transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 4. PROCEDURAL 3D ANIME FEMALE CHARACTER MESH (TRIPO WAIFU SPEC)
// -------------------------------------------------------------
function AnimeFemaleMesh({ colorHex, audioLevel, isWireframe, preset = ANIME_AVATAR_PRESETS[1] }) {
  const groupRef = useRef();
  const headGroupRef = useRef();
  const leftHairRef = useRef();
  const rightHairRef = useRef();
  const mouthRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const ahogeRef = useRef();

  const [blinkState, setBlinkState] = useState(1);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(0.08);
      setTimeout(() => setBlinkState(1), 160);
    }, 3800 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const holoMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });
  }, [colorHex, isWireframe]);

  const hairMaterial = useMemo(() => {
    const color = preset.hairColor || '#f8fafc';
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.4,
      roughness: 0.25,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.96
    });
  }, [preset.hairColor, isWireframe]);

  const ribbonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(preset.earColor || '#c084fc'),
      emissive: new THREE.Color(preset.earColor || '#c084fc'),
      emissiveIntensity: 0.35,
      wireframe: isWireframe
    });
  }, [preset.earColor, isWireframe]);

  const eyeMaterial = useMemo(() => {
    const color = preset.eyeColor || '#00f0ff';
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe: isWireframe
    });
  }, [preset.eyeColor, isWireframe]);

  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffe5d9'),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.12,
      roughness: 0.5,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.95
    });
  }, [colorHex, isWireframe]);

  // Tripo waifu's dark off-shoulder knit top
  const topMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#22232d'),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.2,
      roughness: 0.4,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.95
    });
  }, [colorHex, isWireframe]);

  // Sheer sleeve material
  const sheerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2d2f3d'),
      roughness: 0.3,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.75
    });
  }, [isWireframe]);

  // Lilac pleated skirt material
  const skirtMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#9061f9'),
      emissive: new THREE.Color('#c084fc'),
      emissiveIntensity: 0.25,
      roughness: 0.3,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.95
    });
  }, [isWireframe]);

  // Canvas tote bag material
  const toteMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d4b996'),
      roughness: 0.6,
      wireframe: isWireframe
    });
  }, [isWireframe]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.y = -0.35 + Math.sin(t * 1.8) * 0.04;
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.06;
    }

    if (headGroupRef.current) {
      headGroupRef.current.rotation.z = Math.sin(t * 1.2) * 0.025;
      headGroupRef.current.rotation.x = Math.sin(t * 1.5) * 0.02;
    }

    if (ahogeRef.current) {
      ahogeRef.current.rotation.z = 0.2 + Math.sin(t * 3.5) * 0.12;
    }

    if (leftHairRef.current && rightHairRef.current) {
      leftHairRef.current.rotation.z = 0.15 + Math.sin(t * 2.2) * 0.05 + audioLevel * 0.08;
      rightHairRef.current.rotation.z = -0.15 - Math.sin(t * 2.2) * 0.05 - audioLevel * 0.08;
    }

    if (mouthRef.current) {
      const openAmount = 0.12 + audioLevel * 1.4 + Math.sin(t * 16.0) * audioLevel * 0.5;
      mouthRef.current.scale.y = Math.max(0.08, openAmount);
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blinkState;
      rightEyeRef.current.scale.y = blinkState;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={[0.96, 0.96, 0.96]}>
      {/* HEAD & FACE GROUP */}
      <group ref={headGroupRef} position={[0, 1.28, 0]}>
        {/* Face Sphere */}
        <mesh position={[0, 0, 0]} material={skinMaterial}>
          <sphereGeometry args={[0.34, 32, 32]} />
        </mesh>

        {/* Delicate Chin */}
        <mesh position={[0, -0.22, 0.08]} rotation={[0.35, 0, 0]} material={skinMaterial}>
          <coneGeometry args={[0.22, 0.28, 16]} />
        </mesh>

        {/* Blush Cheeks */}
        <mesh position={[-0.18, -0.06, 0.28]} material={ribbonMaterial}>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>
        <mesh position={[0.18, -0.06, 0.28]} material={ribbonMaterial}>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>

        {/* Eyes Left & Right (Tripo luminous gradient style) */}
        <group ref={leftEyeRef} position={[-0.12, 0.02, 0.28]}>
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#ffffff" wireframe={isWireframe} />
          </mesh>
          <mesh position={[0, 0, 0.03]} material={eyeMaterial}>
            <cylinderGeometry args={[0.046, 0.046, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
          <mesh position={[0.018, 0.02, 0.05]}>
            <sphereGeometry args={[0.016, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        <group ref={rightEyeRef} position={[0.12, 0.02, 0.28]}>
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#ffffff" wireframe={isWireframe} />
          </mesh>
          <mesh position={[0, 0, 0.03]} material={eyeMaterial}>
            <cylinderGeometry args={[0.046, 0.046, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
          <mesh position={[-0.018, 0.02, 0.05]}>
            <sphereGeometry args={[0.016, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Nose */}
        <mesh position={[0, -0.07, 0.33]} material={skinMaterial}>
          <coneGeometry args={[0.016, 0.035, 8]} />
        </mesh>

        {/* Animated Mouth */}
        <mesh ref={mouthRef} position={[0, -0.15, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.032, 0.012, 8, 16, Math.PI]} />
          <meshBasicMaterial color={colorHex} wireframe={isWireframe} />
        </mesh>

        {/* Front Hair Bangs & Ahoge Antenna Strand (Tripo Reference) */}
        <group position={[0, 0.18, 0.16]}>
          {/* Distinctive Tripo Ahoge Antenna */}
          <group ref={ahogeRef} position={[0, 0.26, -0.05]}>
            <mesh position={[0, 0.12, 0]} rotation={[0.4, 0, 0.3]} material={hairMaterial}>
              <coneGeometry args={[0.028, 0.34, 8]} />
            </mesh>
          </group>

          {/* Bangs */}
          <mesh position={[-0.12, -0.05, 0.14]} rotation={[0.2, 0.1, -0.22]} material={hairMaterial}>
            <coneGeometry args={[0.075, 0.34, 12]} />
          </mesh>
          <mesh position={[0, -0.08, 0.18]} rotation={[0.24, 0, 0]} material={hairMaterial}>
            <coneGeometry args={[0.085, 0.38, 12]} />
          </mesh>
          <mesh position={[0.12, -0.05, 0.14]} rotation={[0.2, -0.1, 0.22]} material={hairMaterial}>
            <coneGeometry args={[0.075, 0.34, 12]} />
          </mesh>
        </group>

        {/* Lavender Hair Ribbon (Right side as in video) */}
        <group position={[0.26, 0.12, 0.05]}>
          <mesh material={ribbonMaterial}>
            <torusGeometry args={[0.05, 0.018, 8, 16]} />
          </mesh>
          <mesh position={[0.03, -0.06, 0]} rotation={[0, 0, -0.3]} material={ribbonMaterial}>
            <coneGeometry args={[0.035, 0.14, 6]} />
          </mesh>
        </group>

        {/* Main Hair Volume */}
        <mesh position={[0, 0.08, -0.04]} material={hairMaterial}>
          <sphereGeometry args={[0.39, 24, 24]} />
        </mesh>

        {/* Flowing Back Hair Layers */}
        <group ref={leftHairRef} position={[-0.22, -0.15, -0.12]}>
          <mesh rotation={[0, 0, -0.1]} material={hairMaterial}>
            <coneGeometry args={[0.14, 0.8, 12]} />
          </mesh>
        </group>
        <group ref={rightHairRef} position={[0.22, -0.15, -0.12]}>
          <mesh rotation={[0, 0, 0.1]} material={hairMaterial}>
            <coneGeometry args={[0.14, 0.8, 12]} />
          </mesh>
        </group>
      </group>

      {/* TORSO & OUTFIT (TRIPO OFF-SHOULDER & PLEATED SKIRT) */}
      <group position={[0, 0.45, 0]}>
        {/* Slender Neck */}
        <mesh position={[0, 0.48, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.075, 0.09, 0.18, 16]} />
        </mesh>

        {/* Bare Shoulders / Collarbone Accent */}
        <mesh position={[0, 0.38, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
        </mesh>

        {/* Off-the-shoulder Frilled Top (Charcoal) */}
        <mesh position={[0, 0.34, 0]} material={topMaterial}>
          <torusGeometry args={[0.23, 0.045, 12, 24]} />
        </mesh>
        <mesh position={[0, 0.18, 0]} material={topMaterial}>
          <cylinderGeometry args={[0.22, 0.17, 0.36, 24]} />
        </mesh>

        {/* Sheer Puff Sleeves Left & Right */}
        <mesh position={[-0.28, 0.24, 0]} material={sheerMaterial}>
          <sphereGeometry args={[0.11, 16, 16]} />
        </mesh>
        <mesh position={[-0.32, 0.05, 0]} rotation={[0, 0, -0.2]} material={sheerMaterial}>
          <cylinderGeometry args={[0.065, 0.08, 0.28, 12]} />
        </mesh>

        <mesh position={[0.28, 0.24, 0]} material={sheerMaterial}>
          <sphereGeometry args={[0.11, 16, 16]} />
        </mesh>
        <mesh position={[0.32, 0.05, 0]} rotation={[0, 0, 0.2]} material={sheerMaterial}>
          <cylinderGeometry args={[0.065, 0.08, 0.28, 12]} />
        </mesh>

        {/* High Waist White Belt & Mini Pouch (Tripo Reference) */}
        <mesh position={[0, -0.02, 0]}>
          <torusGeometry args={[0.185, 0.02, 8, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.16, -0.06, 0.12]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.09, 0.11, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        {/* Pleated Lilac Tartan Skirt */}
        <mesh position={[0, -0.18, 0]} material={skirtMaterial}>
          <cylinderGeometry args={[0.18, 0.34, 0.32, 24]} />
        </mesh>

        {/* Canvas Grocery Tote Bag on Arm (Tripo Reference) */}
        <group position={[-0.38, -0.05, 0.12]}>
          {/* Tote Bag Body */}
          <mesh position={[0, -0.15, 0]} material={toteMaterial}>
            <boxGeometry args={[0.16, 0.28, 0.22]} />
          </mesh>
          {/* Bag Strap */}
          <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.12, 0.015, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#b39775" />
          </mesh>
          {/* Groceries sticking out (Baguette & Greens) */}
          <mesh position={[0.02, 0.05, -0.04]} rotation={[0.2, 0, 0.2]}>
            <cylinderGeometry args={[0.025, 0.03, 0.24, 8]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
          <mesh position={[-0.03, 0.03, 0.04]} rotation={[-0.2, 0, -0.1]}>
            <coneGeometry args={[0.04, 0.16, 6]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
          <mesh position={[0.01, 0.01, 0.04]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>

        {/* Upper Thighs / Base */}
        <mesh position={[-0.09, -0.42, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.08, 0.075, 0.24, 16]} />
        </mesh>
        <mesh position={[0.09, -0.42, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.08, 0.075, 0.24, 16]} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 5. FLOATING ANIME PET MASCOT
// -------------------------------------------------------------
function FloatingAnimeMascot({ colorHex }) {
  const orbRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orbRef.current) {
      orbRef.current.position.x = 1.25 + Math.sin(t * 1.8) * 0.15;
      orbRef.current.position.y = 1.15 + Math.cos(t * 2.2) * 0.18;
      orbRef.current.position.z = 0.25 + Math.sin(t * 1.5) * 0.1;
      orbRef.current.rotation.y = t * 1.2;
    }
  });

  return (
    <group ref={orbRef}>
      <mesh>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color={colorHex} emissive={colorHex} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.04, 0.02, 0.11]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.04, 0.02, 0.11]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.2, 0.012, 12, 32]} />
        <meshBasicMaterial color={colorHex} wireframe />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 6. ANIME HOLOGRAM MAGIC CIRCLE PEDESTAL
// -------------------------------------------------------------
function AnimeMagicCirclePedestal({ colorHex, audioLevel }) {
  const innerRingRef = useRef();
  const outerRingRef = useRef();
  const raysRef = useRef();

  useFrame((state, delta) => {
    if (innerRingRef.current) innerRingRef.current.rotation.z += delta * 0.6;
    if (outerRingRef.current) outerRingRef.current.rotation.z -= delta * 0.4;
    if (raysRef.current) {
      raysRef.current.material.opacity = 0.18 + audioLevel * 0.3;
    }
  });

  return (
    <group position={[0, -1.35, 0]}>
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.4, 48]} />
        <meshBasicMaterial color={colorHex} wireframe transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.5, 0.85, 32]} />
        <meshBasicMaterial color={colorHex} wireframe transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={raysRef} position={[0, 1.4, 0]}>
        <cylinderGeometry args={[1.25, 0.7, 2.8, 32, 1, true]} />
        <meshBasicMaterial color={colorHex} transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 7. MAIN 3D HOLOGRAM AVATAR CANVAS CONTAINER
// -------------------------------------------------------------
export default function HologramAvatar3D({ 
  colorHex = '#00f0ff', 
  glitchIntensity = 0.08, 
  audioLevel = 0, 
  isWireframe = false, 
  presetId = 'tripo_waifu',
  photoUrl = null,
  glbUrl = null,
  videoUrl = '/ai-showcase.mp4',
  lumaCutoff = 0.07,
  playbackSpeed = 1.0
}) {
  const activePreset = useMemo(() => {
    return ANIME_AVATAR_PRESETS.find(p => p.id === presetId) || ANIME_AVATAR_PRESETS[0];
  }, [presetId]);

  // Determine avatar render mode
  const avatarMode = useMemo(() => {
    if (glbUrl || activePreset.type === 'glb') return 'glb';
    if (photoUrl) return 'image';
    if (activePreset.type === 'video') return 'video';
    if (activePreset.type === 'image') return 'image';
    return 'procedural';
  }, [glbUrl, photoUrl, activePreset]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.35, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} color={colorHex} />
        <pointLight position={[-3, -1, -2]} color={activePreset.eyeColor || '#00f0ff'} intensity={2.2} />

        <Float speed={2.0} rotationIntensity={0.08} floatIntensity={0.22}>
          {avatarMode === 'video' && (
            <TripoVideoHologram 
              colorHex={colorHex}
              glitchIntensity={glitchIntensity}
              audioLevel={audioLevel}
              isWireframe={isWireframe}
              videoUrl={videoUrl}
              lumaCutoff={lumaCutoff}
              playbackSpeed={playbackSpeed}
            />
          )}

          {avatarMode === 'glb' && (
            <TripoGLBModel 
              glbUrl={glbUrl}
              colorHex={colorHex}
              audioLevel={audioLevel}
              isWireframe={isWireframe}
            />
          )}

          {avatarMode === 'image' && (
            <AnimeHologramProjectionCard 
              colorHex={colorHex}
              glitchIntensity={glitchIntensity}
              audioLevel={audioLevel}
              photoUrl={photoUrl || activePreset.photoUrl}
              isWireframe={isWireframe}
            />
          )}

          {avatarMode === 'procedural' && (
            <AnimeFemaleMesh 
              colorHex={colorHex}
              audioLevel={audioLevel}
              isWireframe={isWireframe}
              preset={activePreset}
            />
          )}

          <FloatingAnimeMascot colorHex={colorHex} />
        </Float>

        <AnimeMagicCirclePedestal colorHex={colorHex} audioLevel={audioLevel} />
        <Sparkles count={130} scale={4.2} size={3.5} speed={0.8} color={colorHex} />

        <OrbitControls 
          enableZoom={true} 
          minDistance={1.8} 
          maxDistance={5.2} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 + 0.1}
          rotateSpeed={0.65}
        />
      </Canvas>
    </div>
  );
}
