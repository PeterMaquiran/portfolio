"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Earth() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      25,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(4.5, 2, 3);

    // ✅ Transparent background renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 🌞 Light
    const sun = new THREE.DirectionalLight("#ffffff", 2);
    sun.position.set(0, 0, 3);
    scene.add(sun);

    const ambient = new THREE.AmbientLight("#222222", 0.5);
    scene.add(ambient);

    // 🧭 Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1.2;
    controls.maxDistance = 10;

    // 🖼️ Textures
    const loader = new THREE.TextureLoader();
    const dayTexture = loader.load("/textures/earth_day_4096.jpg");
    const nightTexture = loader.load("/textures/earth_night_4096.jpg");
    const bumpTexture = loader.load("/textures/earth_bump_roughness_clouds_4096.jpg");
    dayTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.colorSpace = THREE.SRGBColorSpace;

    // 🌍 Earth
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      map: dayTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.05,
      specularMap: bumpTexture,
      shininess: 10,
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // 🌃 Night side
    const nightMaterial = new THREE.MeshBasicMaterial({
      map: nightTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.6,
    });
    const nightGlobe = new THREE.Mesh(geometry, nightMaterial);
    scene.add(nightGlobe);

    // ☁️ Atmosphere
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: "#4db2ff",
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.3,
    });
    const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial);
    atmosphere.scale.setScalar(1.05);
    scene.add(atmosphere);

    // 🕐 Animation
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.0015;
      nightGlobe.rotation.y += 0.0015;
      atmosphere.rotation.y += 0.0015;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 📏 Resize when container changes
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
      className="relative w-[400px] h-[400px]" style={{ height: '500px'}}
      // Tailwind: fixed 400x400 container, but you can change this
    />
  );
}
