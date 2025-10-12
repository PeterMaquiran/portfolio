"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export default function Phone({
  canvasHeight =window.innerHeight+'px',
  canvasWidth = window.innerWidth+'px',
  screenSource = "/phone.png",
  enableZoom = false,
  enablePan = false,
  cameraStepBack = 2,
  spin = true,
  spinDuration = 2500,
  zoomEnabled = true, // 👈 new
  targetCameraStepBack, // 👈 how close the zoom will go
  zoomSpeed = 0.03, // 👈 smoothness
}: {
  canvasHeight?: string;
  canvasWidth?: string;
  screenSource?: string;
  enableZoom?: boolean;
  enablePan?: boolean;
  cameraStepBack?: number;
  spin?: boolean;
  spinDuration?: number;
  zoomEnabled?: boolean; // 👈 enable/disable smooth zoom
  targetCameraStepBack?: number; // 👈 target zoom distance
  zoomSpeed?: number; // 👈 how smooth it zooms
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
    camera.position.set(0, 0, cameraStepBack);
    camera.lookAt(0, 0, 0);

    // 🖥️ Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 💡 Lights
    const dirLight = new THREE.DirectionalLight("#ffffff", 2);
    dirLight.position.set(2, 2, 3);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight("#ffffff", 0.4));

    // 🎮 Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;

    // 📱 Phone body
    const phoneGeometry = new RoundedBoxGeometry(1, 2, 0.1, 16, 0.1);
    const phoneMaterial = new THREE.MeshStandardMaterial({
      color: "#2a2a2a",
      metalness: 0.6,
      roughness: 0.3,
    });
    const phoneMesh = new THREE.Mesh(phoneGeometry, phoneMaterial);
    phoneMesh.castShadow = true;
    phoneMesh.receiveShadow = true;
    scene.add(phoneMesh);

    // 🖼️ Screen texture
    const loader = new THREE.TextureLoader();
    const screenTexture = loader.load(screenSource);
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
      color: "#444",
      metalness: 0.8,
      roughness: 0.2,
    });
    const frontCam = new THREE.Mesh(camGeometry, camMaterial);
    frontCam.position.set(0, 0.88, 0.052);
    phoneMesh.add(frontCam);

    // 💎 Camera highlight
    const camHighlightGeometry = new THREE.CircleGeometry(0.015, 32);
    const camHighlightMaterial = new THREE.MeshBasicMaterial({
      color: "#66ccff",
      transparent: true,
      opacity: 0.25,
    });
    const camHighlight = new THREE.Mesh(
      camHighlightGeometry,
      camHighlightMaterial
    );
    camHighlight.position.set(0.01, 0.89, 0.053);
    phoneMesh.add(camHighlight);

    // 🌪️ Spin setup
    const startRotation = Math.PI;
    const endRotation = 0;
    phoneMesh.rotation.y = spin ? startRotation : endRotation;
    let startTime: number | null = null;

    // Easing function
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    
    // 🌀 Animation variables
    // 🌀 Animation variables
    let zoomAnimating = typeof targetCameraStepBack == 'number';
    let animationFrameId: number;

    // 🎞️ Animation loop
    const animate = (time: number) => {
      requestAnimationFrame(animate);
      controls.update();

      // 🔁 Smooth spin
      if (spin) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const t = Math.min(elapsed / spinDuration, 1);
        const eased = easeOutCubic(t);
        phoneMesh.rotation.y =
          startRotation + (endRotation - startRotation) * eased;
      }

      // 🔍 Smooth zoom
      if (zoomAnimating) {
        // Smooth interpolate camera position
        camera.position.z += (targetCameraStepBack! - camera.position.z) * zoomSpeed;

        // Check if zoom is nearly finished
        if (Math.abs(camera.position.z - targetCameraStepBack!) < 0.01) {
          zoomAnimating = false;
          //controls.enableZoom = false; // 👈 disable user zoom afterwards
        }
      }

      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    // 📏 Resize handling
    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    });
    resizeObserver.observe(container);


    function onClick(event: MouseEvent) {
      zoomAnimating = false;
    }


    // 🧹 Cleanup
    return () => {
      resizeObserver.disconnect();
      controls.dispose();
      screenTexture.dispose();

      [
        phoneGeometry,
        screenGeometry,
        glassGeometry,
        camGeometry,
        camHighlightGeometry,
      ].forEach((geo) => geo.dispose());

      [
        phoneMaterial,
        screenMaterial,
        glassMaterial,
        camMaterial,
        camHighlightMaterial,
      ].forEach((mat) => mat.dispose());

      renderer.dispose();
      container.removeChild(renderer.domElement);
      // Attach listener
      renderer.domElement.addEventListener("click", onClick);
      scene.clear();
    };
  }, [
    screenSource,
    enableZoom,
    enablePan,
    cameraStepBack,
    spin,
    spinDuration,
    zoomEnabled,
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
