import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ isLight }) {
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
                    color={isLight ? "#B8860B" : "#D4AF37"}
                    size={isLight ? 0.012 : 0.015}
                    opacity={isLight ? 0.35 : 0.8}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
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

import { useTheme } from '../context/ThemeContext';

const ParticleBackground = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <div className={`fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none transition-colors duration-700 overflow-hidden ${
            isLight 
                ? 'bg-[radial-gradient(ellipse_at_top_right,#ffffff_0%,#f8fafc_50%,#f1f5f9_100%)]' 
                : 'bg-[radial-gradient(ellipse_at_top_right,#1e1e1e_0%,#121212_50%,#080808_100%)]'
        }`}>
            {/* Celestial Body: Sun in Day Mode / Moon in Night Mode */}
            {isLight ? (
                /* Glowing Radiant Sun */
                <div className="absolute top-4 right-8 md:top-10 md:right-28 pointer-events-none transition-opacity duration-1000">
                    <div className="relative">
                        {/* Outer solar corona pulse */}
                        <div className="absolute -inset-10 rounded-full bg-amber-400/25 blur-3xl animate-pulse" />
                        <div className="absolute -inset-4 rounded-full bg-yellow-300/35 blur-xl" />
                        {/* Solar Disc */}
                        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-100 shadow-[0_0_60px_rgba(251,191,36,0.6),0_0_120px_rgba(245,158,11,0.35)] opacity-85" />
                    </div>
                </div>
            ) : (
                /* Luminous Crescent Moon */
                <div className="absolute top-4 right-8 md:top-10 md:right-28 pointer-events-none transition-opacity duration-1000">
                    <div className="relative">
                        {/* Lunar aura */}
                        <div className="absolute -inset-8 rounded-full bg-amber-200/15 blur-2xl" />
                        <div className="absolute -inset-4 rounded-full bg-cyan-400/10 blur-xl animate-pulse" />
                        {/* Moon Body & Shadow */}
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-amber-100 via-slate-100 to-amber-200 shadow-[0_0_50px_rgba(212,175,55,0.4),0_0_100px_rgba(255,255,255,0.2)] opacity-85 relative">
                            {/* Crescent mask creating beautiful crescent moon */}
                            <div className="absolute -top-1 -right-1 w-18 h-18 md:w-24 md:h-24 rounded-full bg-[#121212] opacity-95" />
                        </div>
                    </div>
                </div>
            )}

            <ErrorBoundary>
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <Particles isLight={isLight} />
                </Canvas>
            </ErrorBoundary>
        </div>
    );
};

export default ParticleBackground;
