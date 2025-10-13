"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Phone({
  canvasHeight = window.innerHeight + "px",
  canvasWidth = window.innerWidth + "px",
  modelPath = "/esp32_wroom_32.glb",
  enableZoom = true,
  enablePan = false,
  cameraStepBack = 2,
  spin = true,
  spinDuration = 2500,
  targetCameraStepBack,
  zoomSpeed = 0.03,
}: {
  canvasHeight?: string;
  canvasWidth?: string;
  modelPath?: string;
  enableZoom?: boolean;
  enablePan?: boolean;
  cameraStepBack?: number;
  spin?: boolean;
  spinDuration?: number;
  targetCameraStepBack?: number;
  zoomSpeed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const scene = new THREE.Scene();

    // 🎥 Camera
    const camera = new THREE.PerspectiveCamera(
      25,
      container.clientWidth / container.clientHeight,
      0.01,
      100
    );
    camera.position.set(0, 0, 0.15);
    camera.lookAt(0, 0, 0);

    // 🖥️ Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 💡 Powerful lighting setup
    // Global ambient light
    scene.add(new THREE.AmbientLight(0xffffff, 5));

    // Hemisphere for natural ambient bounce
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333333, 3);
    hemiLight.position.set(0, 2, 0);
    scene.add(hemiLight);

    // Key light (main)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(3, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill light (opposite)
    const fillLight = new THREE.DirectionalLight(0xffffff, 1);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    // Back light (adds contour)
    const backLight = new THREE.DirectionalLight(0xffffff, 0);
    backLight.position.set(0, 2, -4);
    scene.add(backLight);

    // Top light (extra brightness from above)
    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 6, 0);
    scene.add(topLight);

    // Point lights around for extra sparkle
    const pointLights: THREE.PointLight[] = [];
    const pointPositions = [
      [2, 2, 2],
      [-2, 2, 2],
      [2, -2, 2],
      [-2, -2, -2],
      [0, 2, -2],
    ];
    for (const pos of pointPositions) {
      const pl = new THREE.PointLight(0xffffff, 1.3, 10);
      pl.position.set(pos[0], pos[1], pos[2]);
      scene.add(pl);
      pointLights.push(pl);
    }

    // Optional: soft environmental color
    scene.background = null;

    // 🎮 Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;

    // 🧩 Load GLB Model
    const loader = new GLTFLoader();
    let model: THREE.Object3D | null = null;

    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;
        model.scale.set(1.1, 1, 1); // adjust scale if too big/small
        model.position.set(0, 0, 0);
        model.rotation.x = 1.2; // start facing backward for spin
        model.rotation.z = 0.5; // start facing backward for spin
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              mesh.material.roughness = 0.3;
              mesh.material.metalness = 0.6;
            }
          }
        });
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB:", error);
      }
    );

    // 🌪️ Spin animation
    const startRotation = Math.PI;
    const endRotation = 0;
    let startTime: number | null = null;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (time: number) => {
      requestAnimationFrame(animate);
      controls.update();

      if (spin && model) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const t = Math.min(elapsed / spinDuration, 1);
        const eased = easeOutCubic(t);
        model.rotation.y = (startRotation + (endRotation - startRotation) * eased) % (Math.PI * 2) - 9;
      }

      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      controls.dispose();
      if (model) scene.remove(model);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [
    modelPath,
    enableZoom,
    enablePan,
    cameraStepBack,
    spin,
    spinDuration,
    targetCameraStepBack,
    zoomSpeed,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        height: canvasHeight,
        width: canvasWidth,
        cursor: "grab",
      }}
      className="overflow-hidden"
    />
  );
}
