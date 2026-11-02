"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type Rilo3DActivity = "idle" | "type" | "think" | "read" | "wave" | "sleep";

type Props = {
  activity?: Rilo3DActivity;
  className?: string;
  size?: number;
};

/**
 * Stylized 3D Business Rilo + OpenAI-style orbit dots.
 * Procedural Three.js (no Blender binary in this host).
 * Ready to swap for a Blender-exported GLB later via GLTFLoader.
 */
export default function Rilo3D({ activity = "idle", className = "", size = 160 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef(activity);

  useEffect(() => {
    activityRef.current = activity;
  }, [activity]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const w = size;
    const h = size;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 50);
    camera.position.set(0, 0.35, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights — soft studio
    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    const key = new THREE.DirectionalLight(0xffffff, 0.95);
    key.position.set(2.5, 4, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xa8c4ff, 0.35);
    fill.position.set(-3, 1, -2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xd4ff32, 0.25);
    rim.position.set(0, -1, -3);
    scene.add(rim);

    const cream = new THREE.MeshStandardMaterial({
      color: 0xfaf8f4,
      roughness: 0.45,
      metalness: 0.05,
    });
    const jacket = new THREE.MeshStandardMaterial({
      color: 0x5b6b7c,
      roughness: 0.55,
      metalness: 0.15,
    });
    const earIn = new THREE.MeshStandardMaterial({
      color: 0x6b7c8f,
      roughness: 0.5,
      metalness: 0.1,
    });
    const black = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3 });
    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

    const root = new THREE.Group();
    scene.add(root);

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 32), cream);
    body.scale.set(1, 1.15, 0.9);
    body.position.y = -0.15;
    root.add(body);

    // Jacket band
    const coat = new THREE.Mesh(new THREE.SphereGeometry(0.74, 32, 24, 0, Math.PI * 2, 0.9, 1.2), jacket);
    coat.scale.set(1.02, 1.05, 0.95);
    coat.position.y = -0.28;
    root.add(coat);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), cream);
    head.position.y = 0.85;
    root.add(head);

    // Swirl ear
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), cream);
    ear.position.set(0.48, 1.15, -0.1);
    ear.scale.set(1.1, 1.3, 0.7);
    root.add(ear);
    const earInner = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), earIn);
    earInner.position.set(0.58, 1.18, 0.02);
    root.add(earInner);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), black);
    eyeL.position.set(-0.2, 0.9, 0.52);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.2;
    root.add(eyeL, eyeR);
    const sparkL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), white);
    sparkL.position.set(-0.16, 0.95, 0.6);
    const sparkR = sparkL.clone();
    sparkR.position.x = 0.24;
    root.add(sparkL, sparkR);

    // Arms
    const armL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), cream);
    armL.position.set(-0.7, 0.05, 0.1);
    armL.scale.set(0.9, 1.3, 0.8);
    const armR = armL.clone();
    armR.position.x = 0.7;
    root.add(armL, armR);

    // Legs
    const legL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), cream);
    legL.position.set(-0.28, -0.95, 0.05);
    legL.scale.set(0.85, 1.1, 0.85);
    const legR = legL.clone();
    legR.position.x = 0.28;
    root.add(legL, legR);

    // OpenAI-style orbit dots
    const dots: THREE.Mesh[] = [];
    const dotMat = new THREE.MeshStandardMaterial({
      color: 0xd4ff32,
      emissive: 0xd4ff32,
      emissiveIntensity: 0.7,
      roughness: 0.3,
    });
    for (let i = 0; i < 3; i++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), dotMat);
      dots.push(d);
      scene.add(d);
    }

    // Soft ground shadow disc
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.7, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.15;
    scene.add(shadow);

    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const act = activityRef.current;

      let bob = Math.sin(t * 1.4) * 0.06;
      let rotY = Math.sin(t * 0.5) * 0.12;
      let armSwing = 0;
      let dotSpeed = 0.7;
      let eyeScaleY = 1;

      if (act === "think") {
        bob = Math.sin(t * 2.2) * 0.04;
        rotY = Math.sin(t * 0.8) * 0.18;
        dotSpeed = 1.8;
      } else if (act === "type") {
        bob = Math.sin(t * 2.8) * 0.03;
        armSwing = Math.sin(t * 8) * 0.35;
        dotSpeed = 1.3;
      } else if (act === "wave") {
        armSwing = Math.sin(t * 5) * 0.9;
        rotY = 0.25;
        dotSpeed = 1.5;
      } else if (act === "read") {
        rotY = -0.2 + Math.sin(t * 0.4) * 0.05;
        dotSpeed = 0.9;
      } else if (act === "sleep") {
        bob = Math.sin(t * 0.6) * 0.03;
        rotY = 0.15;
        eyeScaleY = 0.15;
        dotSpeed = 0.25;
      }

      if (reduce) {
        bob = 0;
        armSwing = 0;
        rotY = 0.1;
      }

      root.position.y = bob;
      root.rotation.y = rotY;
      armR.rotation.z = -0.2 + armSwing;
      armL.rotation.z = 0.15 - armSwing * 0.3;
      eyeL.scale.y = eyeScaleY;
      eyeR.scale.y = eyeScaleY;

      // Orbit dots (OpenAI energy)
      const radius = 1.55;
      dots.forEach((d, i) => {
        const a = t * dotSpeed + (i * Math.PI * 2) / 3;
        d.position.set(Math.cos(a) * radius, 0.4 + Math.sin(a * 1.3) * 0.35, Math.sin(a) * radius);
        d.visible = !reduce || i === 0;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      cream.dispose();
      jacket.dispose();
      earIn.dispose();
      black.dispose();
      white.dispose();
      dotMat.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: size, height: size, margin: "0 auto" }}
      aria-hidden
    />
  );
}
