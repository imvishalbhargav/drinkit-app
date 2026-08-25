import { Float } from '@react-three/drei';

interface Props {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}

/** A stylized glowing bottle built from primitives (no external assets to load). */
export default function FloatingBottle({ position, color, scale = 1, speed = 1.4 }: Props) {
  return (
    <Float speed={speed} rotationIntensity={0.7} floatIntensity={1.3}>
      <group position={position} scale={scale}>
        {/* body */}
        <mesh>
          <cylinderGeometry args={[0.45, 0.52, 1.7, 40]} />
          <meshStandardMaterial
            color={color}
            roughness={0.12}
            metalness={0.35}
            emissive={color}
            emissiveIntensity={0.32}
          />
        </mesh>
        {/* shoulder → neck */}
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.15, 0.26, 0.7, 28]} />
          <meshStandardMaterial
            color={color}
            roughness={0.15}
            metalness={0.35}
            emissive={color}
            emissiveIntensity={0.26}
          />
        </mesh>
        {/* cap */}
        <mesh position={[0, 1.56, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.22, 28]} />
          <meshStandardMaterial color="#08080C" roughness={0.6} metalness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}
