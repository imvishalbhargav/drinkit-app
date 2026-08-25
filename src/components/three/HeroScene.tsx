import { Sparkles } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Component, Suspense, type ReactNode } from 'react';
import FloatingBottle from './FloatingBottle';

/** If WebGL is unavailable or the scene throws, render nothing (gradient shows through). */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroScene() {
  return (
    <SceneBoundary>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-4, 2, 2]} color="#8B5CF6" intensity={18} />
          <pointLight position={[4, -2, 3]} color="#25E8C4" intensity={14} />
          <FloatingBottle position={[-2.2, 0.1, 0]} color="#B6FF3C" scale={1.05} speed={1.3} />
          <FloatingBottle position={[0, -0.35, 0.6]} color="#F23CC0" scale={1.3} speed={1.7} />
          <FloatingBottle position={[2.2, 0.35, -0.4]} color="#8B5CF6" scale={1.0} speed={1.1} />
          <Sparkles count={70} scale={[11, 6, 4]} size={2.4} speed={0.4} color="#B6FF3C" opacity={0.7} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
