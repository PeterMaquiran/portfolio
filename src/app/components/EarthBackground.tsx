"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function StableRealisticEarth() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    // Camera settings from first example (21.5 FOV, specific position)
    const camera = new THREE.PerspectiveCamera(21.5, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(4.5, 2, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Controls (Syncing with first example: enable damping, no zoom/pan)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;

    // 3. Static Sun (Aligned to the light position in the first example: 0, 0, 3)
    const sunPos = new THREE.Vector3(0, 0, 3);
    const sunDirection = sunPos.clone().normalize();
    const sunLight = new THREE.DirectionalLight(0xffffff, 3);
    sunLight.position.copy(sunPos);
    scene.add(sunLight);

    // Ambient light from first example to soften shadows
    const ambient = new THREE.AmbientLight("#182134", 0.5);
    scene.add(ambient);

    const loader = new THREE.TextureLoader();
    const textures = {
      day: loader.load("/Gemini_Generated_Image_xbfeynxbfeynxbfe.png"),
      night: loader.load("https://threejs.org/examples/textures/planets/earth_lights_2048.png"),
      spec: loader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"),
      clouds: loader.load("https://threejs.org/examples/textures/planets/earth_clouds_1024.png"),
    };

    // 4. Earth with Axial Tilt
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5); 
    scene.add(earthGroup);

    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uDayTex: { value: textures.day },
        uNightTex: { value: textures.night },
        uSpecTex: { value: textures.spec },
        uSunDir: { value: sunDirection },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uDayTex;
        uniform sampler2D uNightTex;
        uniform sampler2D uSpecTex;
        uniform vec3 uSunDir;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec3 dayColor = texture2D(uDayTex, vUv).rgb;
          vec3 nightColor = texture2D(uNightTex, vUv).rgb;
          float specMask = texture2D(uSpecTex, vUv).r;
          float diff = dot(vNormal, uSunDir);
          
          // Day/Night transition logic
          float dayWeight = smoothstep(-0.1, 0.1, diff);
          vec3 color = mix(nightColor * 2.5, dayColor, dayWeight);
          
          float spec = pow(max(dot(vNormal, uSunDir), 0.0), 32.0) * specMask;
          color += (spec * 0.3);
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    // Setting initial rotation so the "terminator" is visible immediately
    earth.rotation.y = -1.5; 
    earthGroup.add(earth);

    // 5. Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      map: textures.clouds,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const clouds = new THREE.Mesh(earthGeometry, cloudMat);
    clouds.scale.setScalar(1.015);
    clouds.rotation.y = -1.5;
    earthGroup.add(clouds);

    // 6. Atmosphere
    const atmosMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
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
          float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 7.0);
          vec3 atmosColor = vec3(0.3, 0.6, 1.0);
          gl_FragColor = vec4(atmosColor, intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
    });

    const atmosphere = new THREE.Mesh(earthGeometry, atmosMat);
    atmosphere.scale.setScalar(1.04); 
    scene.add(atmosphere);

    // 7. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Speed updated to match your base example (0.0015)
      earth.rotation.y += 0.0015;
      clouds.rotation.y += 0.0018; // Clouds move slightly faster for depth

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudMat.dispose();
      atmosMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-[300px] h-[300px] cursor-grab active:cursor-grabbing" />;
}
