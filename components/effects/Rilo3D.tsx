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
 * Original Renolt family silhouette (Business):
 * cream body, large swirl ear with blue inner, soft jacket, big eyes, smile.
 * Procedural Three.js until a Blender GLB is provided.
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
    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 40);
    camera.position.set(0, 0.55, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Soft product lighting (match brand renders)
    scene.add(new THREE.AmbientLight(0xfff8f0, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(2.2, 4.5, 3.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xdde8ff, 0.4);
    fill.position.set(-3, 2, 1);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.35);
    rim.position.set(-1, 1, -3);
    scene.add(rim);

    // Materials — original cream Rilo, not grey
    const cream = new THREE.MeshStandardMaterial({
      color: 0xf7f4ee,
      roughness: 0.55,
      metalness: 0.02,
    });
    const creamMatte = new THREE.MeshStandardMaterial({
      color: 0xf3efe6,
      roughness: 0.65,
      metalness: 0,
    });
    // Business jacket — blue-grey like brand board
    const jacketMat = new THREE.MeshStandardMaterial({
      color: 0x5a6d82,
      roughness: 0.6,
      metalness: 0.08,
    });
    // Ear inner — Business blue
    const earInnerMat = new THREE.MeshStandardMaterial({
      color: 0x6b7f96,
      roughness: 0.55,
      metalness: 0.05,
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.25,
      metalness: 0.1,
    });
    const highlight = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0,
    });
    const smileMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4 });

    const root = new THREE.Group();
    root.position.y = -0.15;
    scene.add(root);

    // —— Body (soft pear, mostly cream) ——
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.78, 40, 40), cream);
    torso.scale.set(1.05, 1.2, 0.92);
    torso.position.y = 0.05;
    root.add(torso);

    // Jacket wraps lower torso only (Business)
    const jacket = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 40, 28, 0, Math.PI * 2, 1.05, 1.35),
      jacketMat
    );
    jacket.scale.set(1.08, 1.05, 0.98);
    jacket.position.y = -0.05;
    root.add(jacket);

    // —— Head (large, family proportion) ——
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.92, 48, 48), cream);
    head.scale.set(1.05, 1.0, 0.95);
    head.position.y = 1.35;
    root.add(head);

    // —— Signature swirl ear (right side, curling back) ——
    const earGroup = new THREE.Group();
    earGroup.position.set(0.55, 1.65, -0.15);
    earGroup.rotation.set(-0.15, 0.35, 0.55);
    root.add(earGroup);

    const earOuter = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), creamMatte);
    earOuter.scale.set(1.15, 1.55, 0.55);
    earGroup.add(earOuter);

    const earCurl = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), creamMatte);
    earCurl.position.set(0.12, 0.35, -0.05);
    earCurl.scale.set(0.9, 1.1, 0.5);
    earGroup.add(earCurl);

    const earIn = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), earInnerMat);
    earIn.position.set(0.22, 0.05, 0.12);
    earIn.scale.set(1, 1.25, 0.45);
    earGroup.add(earIn);

    // —— Eyes (big glossy, brand style) ——
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), eyeMat);
    eyeL.position.set(-0.28, 1.32, 0.78);
    eyeL.scale.set(1, 1.15, 0.85);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.28;
    root.add(eyeL, eyeR);

    const hlL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), highlight);
    hlL.position.set(-0.22, 1.4, 0.9);
    const hlR = hlL.clone();
    hlR.position.x = 0.34;
    root.add(hlL, hlR);

    // Small secondary highlight
    const hl2L = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), highlight);
    hl2L.position.set(-0.34, 1.28, 0.88);
    const hl2R = hl2L.clone();
    hl2R.position.x = 0.22;
    root.add(hl2L, hl2R);

    // Smile curve (thin torus segment look via scaled sphere strip)
    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.025, 8, 24, Math.PI * 0.9),
      smileMat
    );
    smile.position.set(0, 1.05, 0.82);
    smile.rotation.set(0.2, 0, Math.PI);
    root.add(smile);

    // —— Arms ——
    const armL = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), cream);
    armL.position.set(-0.85, 0.15, 0.15);
    armL.scale.set(0.85, 1.35, 0.75);
    armL.rotation.z = 0.35;
    const armR = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), cream);
    armR.position.set(0.85, 0.2, 0.15);
    armR.scale.set(0.85, 1.35, 0.75);
    armR.rotation.z = -0.25;
    root.add(armL, armR);

    // —— Legs / feet ——
    const legL = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), cream);
    legL.position.set(-0.32, -0.95, 0.08);
    legL.scale.set(0.9, 1.15, 0.85);
    const legR = legL.clone();
    legR.position.x = 0.32;
    root.add(legL, legR);

    // Soft contact shadow
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.25;
    scene.add(shadow);

    // Subtle OpenAI-style dots (smaller, secondary)
    const dots: THREE.Mesh[] = [];
    const dotMat = new THREE.MeshStandardMaterial({
      color: 0xd4ff32,
      emissive: 0xd4ff32,
      emissiveIntensity: 0.55,
      roughness: 0.35,
    });
    for (let i = 0; i < 3; i++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), dotMat);
      dots.push(d);
      scene.add(d);
    }

    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const act = activityRef.current;

      let bob = Math.sin(t * 1.35) * 0.05;
      let rotY = Math.sin(t * 0.45) * 0.1;
      let armSwing = 0;
      let dotSpeed = 0.55;
      let eyeSY = 1;
      smile.visible = true;

      if (act === "think") {
        bob = Math.sin(t * 2) * 0.035;
        rotY = Math.sin(t * 0.7) * 0.14;
        dotSpeed = 1.5;
      } else if (act === "type") {
        armSwing = Math.sin(t * 7) * 0.4;
        dotSpeed = 1.1;
      } else if (act === "wave") {
        armSwing = Math.sin(t * 4.5) * 1.0;
        rotY = 0.2;
        dotSpeed = 1.2;
      } else if (act === "read") {
        rotY = -0.18;
        dotSpeed = 0.7;
      } else if (act === "sleep") {
        bob = Math.sin(t * 0.55) * 0.025;
        eyeSY = 0.12;
        smile.visible = false;
        dotSpeed = 0.2;
      }

      if (reduce) {
        bob = 0;
        armSwing = 0;
        rotY = 0.08;
      }

      root.position.y = -0.15 + bob;
      root.rotation.y = rotY;
      armR.rotation.z = -0.25 + armSwing;
      armL.rotation.z = 0.35 - armSwing * 0.25;
      eyeL.scale.y = eyeSY;
      eyeR.scale.y = eyeSY;

      const radius = 1.7;
      dots.forEach((d, i) => {
        const a = t * dotSpeed + (i * Math.PI * 2) / 3;
        d.position.set(
          Math.cos(a) * radius,
          0.55 + Math.sin(a * 1.2) * 0.4,
          Math.sin(a) * radius * 0.85
        );
        d.visible = !reduce;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      [
        cream,
        creamMatte,
        jacketMat,
        earInnerMat,
        eyeMat,
        highlight,
        smileMat,
        dotMat,
      ].forEach((m) => m.dispose());
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
