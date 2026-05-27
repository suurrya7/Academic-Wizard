import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Cone, Box, Torus, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function FloatingObject({ position, color, type = 'box' }) {
    const mesh = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.x = Math.cos(t / 4) / 2;
            mesh.current.rotation.y = Math.sin(t / 4) / 2;
            mesh.current.rotation.z = Math.sin(t / 4) / 2;
            mesh.current.position.y = position[1] + Math.sin(t / 2) * 0.2;
        }
    });

    return (
        <mesh ref={mesh} position={position}>
            {type === 'box' && <boxGeometry args={[1, 1, 1]} />}
            {type === 'cone' && <coneGeometry args={[0.5, 1, 32]} />}
            {type === 'torus' && <torusGeometry args={[0.5, 0.2, 16, 100]} />}
            <MeshDistortMaterial
                color={color}
                speed={1}
                distort={0.3}
                radius={1}
                metalness={0.8}
                roughness={0.2}
            />
        </mesh>
    );
}

// Representing "Academic Icons" with stylized 3D shapes
const Academic3DScene = () => {
    return (
        <div className="w-full h-full relative cursor-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor(new THREE.Color('#0F0F0F'), 0);
                }}
            >
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#D4AF37" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <Box position={[-1.5, 0.5, 0]} args={[1, 1.4, 0.2]}>
                        <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.2} />
                    </Box>
                </Float>

                <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
                    <Torus position={[1.5, -0.5, 0]} args={[0.4, 0.1, 16, 100]}>
                        <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
                    </Torus>
                </Float>

                <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5}>
                    <Cone position={[0, -2, -1]} args={[0.5, 1, 32]}>
                        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
                    </Cone>
                </Float>
            </Canvas>
        </div>
    );
};

export default Academic3DScene;
