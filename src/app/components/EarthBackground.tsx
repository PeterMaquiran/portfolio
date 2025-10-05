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
      21.5,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(4.5, 2, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 🌞 Lighting
    const sun = new THREE.DirectionalLight("#ffffff", 2);
    sun.position.set(0, 0, 3);
    scene.add(sun);

    const ambient = new THREE.AmbientLight("#182134", 0.5);
    scene.add(ambient);

    // 🧭 Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0;
    controls.maxDistance = 10;

		// ⛔ prevent zoom and pan
		controls.enableZoom = false;
		controls.enablePan = false;


    // 🖼️ Textures
    const loader = new THREE.TextureLoader();
    const dayTexture = loader.load("/textures/earth_day_4096.jpg");
    const nightTexture = loader.load("/textures/earth_night_4096.jpg");
    const bumpTexture = loader.load("/textures/earth_bump_roughness_clouds_4096.jpg");
    dayTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.colorSpace = THREE.SRGBColorSpace;

    // 🌍 Earth Surface
    const geometry = new THREE.SphereGeometry(1, 64, 64);
		const dayMaterial = new THREE.MeshPhongMaterial({
			map: dayTexture,
			bumpMap: bumpTexture,
			bumpScale: 0.005, // increased from 0.05 → makes relief more visible
			specularMap: bumpTexture,
			shininess: 20,   // slight increase in highlight intensity
		});
    const earth = new THREE.Mesh(geometry, dayMaterial);
    scene.add(earth);

    // 🌃 Night lights overlay
    const nightMaterial = new THREE.MeshBasicMaterial({
      map: nightTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.5,
    });
    const nightEarth = new THREE.Mesh(geometry, nightMaterial);
    scene.add(nightEarth);

    // ✨ Atmospheric glow
		const glowMaterial = new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: `
				varying vec3 vNormal;
				void main() {
					vNormal = normalize(normalMatrix * normal);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				varying vec3 vNormal;
				void main() {
					// Slightly smoother falloff
					float intensity = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 5.5);
					// Soft lab(83 -18.93 -28.32 / 0.7) ≈ rgb(130,180,255)
					gl_FragColor = vec4(0.51, 0.71, 1.0, 0.5) * intensity;
				}
			`,
			side: THREE.BackSide,
			blending: THREE.AdditiveBlending,
			transparent: true,
		});


    const atmosphere = new THREE.Mesh(geometry, glowMaterial);
    atmosphere.scale.setScalar(1.1);
    scene.add(atmosphere);

    // 🌀 Animation
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.0015;
      nightEarth.rotation.y += 0.0015;
      atmosphere.rotation.y += 0.0015;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 📏 Responsive resize
    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    });
    //resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[280px] h-[270px] overflow-hidden"
    />
  );
}
