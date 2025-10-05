"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export default function Phone({
  canvasHeight ='300px',
  canvasWidth = '280px',
}: {
  canvasHeight: string,
  canvasWidth: string,
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const scene = new THREE.Scene();

    // 🎥 Camera
    const camera = new THREE.PerspectiveCamera(
      25,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    // Move camera slightly to the side and above
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
    light.position.set(2, 2, 3);
    scene.add(light);
    scene.add(new THREE.AmbientLight("#ffffff", 0.4));

    // 🎮 Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;

    // 📱 Rounded phone body
    const phoneGeometry = new RoundedBoxGeometry(1, 2, 0.1, 16, 0.1);
    const phoneMaterial = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      metalness: 0.6,
      roughness: 0.3,
    });
    const phoneMesh = new THREE.Mesh(phoneGeometry, phoneMaterial);
    phoneMesh.castShadow = true;
    phoneMesh.receiveShadow = true;
    phoneMesh.rotation.set(0, 0, 0); // no rotation

    scene.add(phoneMesh);

    // 🖼️ Screen texture
    const loader = new THREE.TextureLoader();
    const screenTexture = loader.load("/phone.png");
    screenTexture.colorSpace = THREE.SRGBColorSpace;

    const screenGeometry = new THREE.PlaneGeometry(0.88, 1.76);
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.z = 0.051;
    phoneMesh.add(screenMesh);

    // ✨ Glass overlay
    const glassGeometry = new THREE.PlaneGeometry(0.88, 1.76);
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
    phoneMesh.add(glassMesh);

    // 📸 Front camera
    const camGeometry = new THREE.CircleGeometry(0.035, 32);
    const camMaterial = new THREE.MeshStandardMaterial({
      color: "#222",
      metalness: 0.8,
      roughness: 0.2,
    });
    const frontCam = new THREE.Mesh(camGeometry, camMaterial);
    frontCam.position.set(0, 0.88, 0.052);
    phoneMesh.add(frontCam);

    // 💎 Camera reflection
    const camHighlightGeometry = new THREE.CircleGeometry(0.015, 32);
    const camHighlightMaterial = new THREE.MeshBasicMaterial({
      color: "#66ccff",
      transparent: true,
      opacity: 0.25,
    });
    const camHighlight = new THREE.Mesh(camHighlightGeometry, camHighlightMaterial);
    camHighlight.position.set(0.01, 0.89, 0.053);
    phoneMesh.add(camHighlight);

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

  return (
    <div
      ref={containerRef}
      className={`w-[${canvasHeight}] h-[${canvasWidth}] overflow-hidden`}
    />
  );
}
