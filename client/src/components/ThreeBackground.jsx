import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';

const Geometry = (props) => {
    const mesh = useRef();
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: props.color || 'white',
        roughness: 0.2,
        metalness: 0.8,
        wireframe: props.wireframe || false
    }), [props.color, props.wireframe]);

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * 0.1;
            mesh.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh {...props} ref={mesh} material={material} />
        </Float>
    );
};

const Scene = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} color="purple" intensity={0.5} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            {/* <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, -5, -10]} /> */}

            {/* Floating Shapes */}
            <Geometry position={[-4, 2, -5]} color="#4f46e5" geometry={new THREE.IcosahedronGeometry(1.5, 0)} />
            <Geometry position={[4, -2, -6]} color="#059669" geometry={new THREE.OctahedronGeometry(1.5, 0)} />
            <Geometry position={[0, 4, -8]} color="#db2777" geometry={new THREE.TorusGeometry(1, 0.4, 16, 100)} wireframe={true} />
            <Geometry position={[-6, -3, -10]} color="#fbbf24" geometry={new THREE.DodecahedronGeometry(1.5, 0)} />
            <Geometry position={[6, 3, -12]} color="#0ea5e9" geometry={new THREE.SphereGeometry(1, 16, 16)} wireframe={true} />
        </>
    );
};

const ThreeBackground = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-gradient-to-b from-slate-900 to-slate-800 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <Scene />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
