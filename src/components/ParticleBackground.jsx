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
                ? 'bg-[radial-gradient(ellipse_at_top_right,#ffffff_0%,#fbfbfa_45%,#f1f5f9_100%)]' 
                : 'bg-[radial-gradient(ellipse_at_top_right,#151518_0%,#0c0c0e_50%,#050506_100%)]'
        }`}>
            {/* Volumetric Atmospheric Light Rays */}
            <div className={`absolute top-0 right-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${
                isLight ? 'opacity-90' : 'opacity-70'
            }`}>
                {/* Primary Sunbeam / Moonbeam Bloom */}
                <div className={`absolute -top-10 -right-10 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full blur-3xl ${
                    isLight 
                        ? 'bg-[radial-gradient(circle,rgba(251,191,36,0.18)_0%,rgba(245,158,11,0.06)_45%,transparent_75%)]' 
                        : 'bg-[radial-gradient(circle,rgba(56,189,248,0.14)_0%,rgba(212,175,55,0.08)_40%,transparent_75%)]'
                }`} />

                {/* Diagonal Cathedral Light Beam */}
                <div 
                    className={`absolute -top-24 right-0 w-[500px] md:w-[850px] h-[900px] origin-top-right transform -rotate-12 blur-2xl ${
                        isLight
                            ? 'bg-gradient-to-b from-amber-300/20 via-yellow-200/6 to-transparent'
                            : 'bg-gradient-to-b from-cyan-400/12 via-amber-200/5 to-transparent'
                    }`} 
                />
            </div>

            {/* Oxford Bodleian Solarium Arch & Leaded Glass Tracery (SVG Vector) */}
            <div className="absolute top-0 right-0 w-[340px] sm:w-[480px] md:w-[650px] lg:w-[820px] pointer-events-none opacity-80 transition-all duration-700">
                <svg 
                    viewBox="0 0 800 1000" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                >
                    {/* Outer Gothic Pointed Arch Framing */}
                    <path 
                        d="M150 1000 V420 C150 200 400 50 800 20 V1000 Z" 
                        fill={isLight ? "url(#dayGlassGrad)" : "url(#nightGlassGrad)"}
                        className="transition-all duration-700"
                    />

                    {/* Concentric Arch Moldings */}
                    <path 
                        d="M150 1000 V420 C150 200 400 50 800 20" 
                        stroke={isLight ? "#B8860B" : "#D4AF37"} 
                        strokeWidth="3.5" 
                        strokeOpacity={isLight ? "0.35" : "0.5"}
                    />
                    <path 
                        d="M180 1000 V430 C180 225 415 85 800 55" 
                        stroke={isLight ? "#B8860B" : "#D4AF37"} 
                        strokeWidth="2" 
                        strokeOpacity={isLight ? "0.2" : "0.35"}
                    />

                    {/* Gothic Tracery Rose & Trefoil Foils */}
                    <circle 
                        cx="520" 
                        cy="260" 
                        r="140" 
                        stroke={isLight ? "#B8860B" : "#D4AF37"} 
                        strokeWidth="2.5" 
                        strokeOpacity={isLight ? "0.3" : "0.45"}
                    />
                    <circle 
                        cx="520" 
                        cy="260" 
                        r="70" 
                        stroke={isLight ? "#B8860B" : "#D4AF37"} 
                        strokeWidth="1.5" 
                        strokeOpacity={isLight ? "0.25" : "0.35"}
                    />

                    {/* Rosette Petals & Astronomical Rays */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const x1 = 520 + 70 * Math.cos(rad);
                        const y1 = 260 + 70 * Math.sin(rad);
                        const x2 = 520 + 140 * Math.cos(rad);
                        const y2 = 260 + 140 * Math.sin(rad);
                        return (
                            <line 
                                key={i} 
                                x1={x1} 
                                y1={y1} 
                                x2={x2} 
                                y2={y2} 
                                stroke={isLight ? "#B8860B" : "#D4AF37"} 
                                strokeWidth="1.5" 
                                strokeOpacity={isLight ? "0.25" : "0.4"} 
                            />
                        );
                    })}

                    {/* Vertical Cathedral Mullions */}
                    <line x1="280" y1="420" x2="280" y2="1000" stroke={isLight ? "#B8860B" : "#D4AF37"} strokeWidth="2.5" strokeOpacity={isLight ? "0.25" : "0.4"} />
                    <line x1="420" y1="400" x2="420" y2="1000" stroke={isLight ? "#B8860B" : "#D4AF37"} strokeWidth="2.5" strokeOpacity={isLight ? "0.25" : "0.4"} />
                    <line x1="560" y1="400" x2="560" y2="1000" stroke={isLight ? "#B8860B" : "#D4AF37"} strokeWidth="2.5" strokeOpacity={isLight ? "0.25" : "0.4"} />
                    <line x1="700" y1="420" x2="700" y2="1000" stroke={isLight ? "#B8860B" : "#D4AF37"} strokeWidth="2.5" strokeOpacity={isLight ? "0.25" : "0.4"} />

                    {/* Diamond Leaded Glass Grid Pattern across Mullions */}
                    {[500, 600, 700, 800, 900].map((y, idx) => (
                        <g key={idx}>
                            <line x1="180" y1={y} x2="800" y2={y} stroke={isLight ? "#B8860B" : "#D4AF37"} strokeWidth="1" strokeOpacity={isLight ? "0.15" : "0.25"} strokeDasharray="4 4" />
                            <line x1="180" y1={y + 50} x2="800" y2={y + 50} stroke={isLight ? "#B8860B" : "#D4AF37"} strokeWidth="1" strokeOpacity={isLight ? "0.12" : "0.2"} />
                        </g>
                    ))}

                    {/* Gradient Definitions */}
                    <defs>
                        <linearGradient id="dayGlassGrad" x1="800" y1="0" x2="200" y2="800" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.35" />
                            <stop offset="50%" stopColor="#FFFBEB" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="nightGlassGrad" x1="800" y1="0" x2="200" y2="800" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.18" />
                            <stop offset="40%" stopColor="#0F172A" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* GPU-Accelerated Golden Library Dust Particles */}
            <ErrorBoundary>
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <Particles isLight={isLight} />
                </Canvas>
            </ErrorBoundary>
        </div>
    );
};

export default ParticleBackground;
