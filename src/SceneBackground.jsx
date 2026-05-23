import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';

// A dynamic central 3D element that changes scale/speed based on game state
function Centerpiece({ isCorrect, quizState }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Constant rotation
    meshRef.current.rotation.x = time * 0.4;
    meshRef.current.rotation.y = time * 0.3;
    
    // Reactively morph based on game event states
    if (quizState === 'answered-wrong') {
      meshRef.current.scale.setScalar(1.2 + Math.sin(time * 20) * 0.1); // Frantic shaking
    } else if (isCorrect && quizState === 'answered') {
      meshRef.current.scale.setScalar(1.5 + Math.abs(Math.sin(time * 5)) * 0.2); // Pulsing victory scale
    } else {
      meshRef.current.scale.setScalar(1.2); // Normal resting state
    }
  });

  return (
    <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        {/* Icosahedron provides a complex, beautiful low-poly look */}
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          wireframe
          color={
            quizState === 'answered-wrong' 
              ? '#ef4444' 
              : isCorrect && quizState === 'answered' 
              ? '#22c55e' 
              : '#a855f7'
          }
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

export default function SceneBackground({ isCorrect, quizState }) {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#c084fc" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#38bdf8" />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1.5} />
        <Centerpiece isCorrect={isCorrect} quizState={quizState} />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}