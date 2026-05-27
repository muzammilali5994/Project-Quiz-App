import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

// Yeh component hamare 3D shapes ko control karega
function AnimatedShape({ type, answerStatus, question }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (answerStatus === 'correct') {
      // Sahi jawab par: Tezi se rotation (Spin)
      meshRef.current.rotation.x = time * 5;
      meshRef.current.rotation.y = time * 5;
      meshRef.current.scale.setScalar(1.4);
    } else if (answerStatus === 'wrong') {
      // Galat jawab par: Jhatke khana (Shaking effect using Math.sin)
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.position.y = Math.sin(time * 30) * 0.15; 
      meshRef.current.scale.setScalar(1.1);
    } else {
      // Normal state: Aaram se ghumna
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.position.y = 0;
      meshRef.current.scale.setScalar(1.2);
    }
  });

  // Color selection logic based on answer status
  let shapeColor = "#a855f7"; // Default Purple Neon
  if (answerStatus === 'correct') shapeColor = "#22c55e"; // Green
  if (answerStatus === 'wrong') shapeColor = "#ef4444"; // Red

  return (
    <mesh ref={meshRef}>
      {type === 'cube' ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : (
        <sphereGeometry args={[0.7, 32, 32]} />
      )}
      <meshStandardMaterial 
        color={shapeColor} 
        wireframe={answerStatus !== 'correct'} // Sahi jawab par solid ho jaye, baqi waqt wireframe look
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function ThreeScene({ type, answerStatus, question }) {
  return (
    <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] hidden sm:block">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#c084fc" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#38bdf8" />
        
        <Float speed={2} floatIntensity={1}>
          <AnimatedShape type={type} answerStatus={answerStatus} question={question} />
        </Float>
      </Canvas>
    </div>
  );
}