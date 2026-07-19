import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Particles() {
    const ref = useRef();
    const stride = 3;

    const count = 1500;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * stride);
        let seed = 42;
        const seededRandom = () => {
            seed = (seed * 1664525 + 1013904223) % 4294967296;
            return seed / 4294967296;
        };
        for (let i = 0; i < count; i++) {
            pos[i * stride] = (seededRandom() - 0.5) * 10;
            pos[i * stride + 1] = (seededRandom() - 0.5) * 10;
            pos[i * stride + 2] = (seededRandom() - 0.5) * 10;
        }
        return pos;
    }, [count]);

    const mouse = useRef({ x: 0, y: 0 });

    useFrame((state) => {
        const { clock, mouse: stateMouse } = state;
        mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, stateMouse.x * 2, 0.1);
        mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, stateMouse.y * 2, 0.1);

        if (ref.current) {
            ref.current.rotation.y = clock.getElapsedTime() * 0.05;
            ref.current.rotation.x = mouse.current.y * 0.2;
            ref.current.rotation.z = mouse.current.x * 0.2;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={stride} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#D4AF37"
                    size={0.015}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.warn("WebGL not supported or Canvas crashed:", error);
    }

    render() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children; 
    }
}

const ParticleBackground = () => {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#0F0F0F_100%)]">
            <ErrorBoundary>
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <Particles />
                </Canvas>
            </ErrorBoundary>
        </div>
    );
};

export default ParticleBackground;
