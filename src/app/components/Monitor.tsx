"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export default function Monitor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const scene = new THREE.Scene();

    // 🎥 Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5); // 5 units in front of the monitor
    camera.lookAt(0, 0, 0);      // look straight at the center

    // 🖥️ Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 💡 Lights
    const light = new THREE.DirectionalLight("#ffffff", 2);
    light.position.set(3, 3, 3);
    scene.add(light);
    scene.add(new THREE.AmbientLight("#ffffff", 0.5));

    // 🎮 Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.enablePan = true;

    // 🖥️ Monitor body (bezel)
    const monitorGeometry = new RoundedBoxGeometry(2.5, 1.5, 0.1, 16, 0.05);
    const monitorMaterial = new THREE.MeshStandardMaterial({
      color: "#111",
      metalness: 0.5,
      roughness: 0.3,
    });
    const monitorMesh = new THREE.Mesh(monitorGeometry, monitorMaterial);
    monitorMesh.castShadow = true;
    monitorMesh.receiveShadow = true;
    scene.add(monitorMesh);
    monitorMesh.rotation.set(0, 0, 0); // no rotation
    
    // 🖼️ Screen
    const loader = new THREE.TextureLoader();
    const screenTexture = loader.load("/screen.png"); // Replace with your screen content
    screenTexture.colorSpace = THREE.SRGBColorSpace;

    const screenGeometry = new THREE.PlaneGeometry(2.3, 1.3);
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.z = 0.051;
    monitorMesh.add(screenMesh);

    // ✨ Glass overlay
    const glassGeometry = new THREE.PlaneGeometry(2.3, 1.3);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      transmission: 0.9,
      transparent: true,
      opacity: 0.2,
      roughness: 0.1,
      metalness: 0.5,
      reflectivity: 1.0,
      clearcoat: 1.0,
    });
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    glassMesh.position.z = 0.052;
    monitorMesh.add(glassMesh);

    // 🦵 Monitor stand
    const standGeometry = new RoundedBoxGeometry(0.2, 0.5, 0.2, 8, 0.02);
    const standMaterial = new THREE.MeshStandardMaterial({
      color: "#222",
      metalness: 0.6,
      roughness: 0.3,
    });
    const standMesh = new THREE.Mesh(standGeometry, standMaterial);
    standMesh.position.set(0, -1, 0);
    monitorMesh.add(standMesh);

    const baseGeometry = new RoundedBoxGeometry(0.7, 0.05, 0.5, 8, 0.02);
    const baseMesh = new THREE.Mesh(baseGeometry, standMaterial);
    baseMesh.position.set(0, -1.275, 0);
    monitorMesh.add(baseMesh);

    // 🌀 Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 📏 Resize handling
    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-[400px] h-[300px] overflow-hidden" />;
}
