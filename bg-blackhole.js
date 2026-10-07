(function () {
  (function initGlobal() {
    const canvas = document.getElementById('webgl');
    if (!canvas || typeof THREE === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x08090c, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 0, 14);

    const COUNT = 900;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r = 5 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      if (t > 0.85) { colors[i3] = 0.95; colors[i3+1] = 0.78; colors[i3+2] = 0.35; }
      else if (t > 0.65) { colors[i3] = 0.8; colors[i3+1] = 0.85; colors[i3+2] = 0.95; }
      else { const g = 0.4 + Math.random() * 0.3; colors[i3] = g; colors[i3+1] = g * 0.98; colors[i3+2] = g * 0.9; }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.05, vertexColors: true, transparent: true, opacity: 0.5,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0, scrollY = 0;
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    window.addEventListener('scroll', () => { scrollY = window.scrollY || 0; }, { passive: true });
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (!reduceMotion) {
        mouseX += (targetX - mouseX) * 0.04;
        mouseY += (targetY - mouseY) * 0.04;
        points.rotation.y = t * 0.012 + mouseX * 0.06;
        points.rotation.x = mouseY * 0.04;
      }
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pageP = Math.min(1, scrollY / maxScroll);
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.7 + pageP * 0.2 - camera.position.y) * 0.05;
      camera.position.z += (14 - pageP * 1.5 - camera.position.z) * 0.05;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();
  })();

  (function initPinned3D() {
    const canvas = document.getElementById('scrub3d');
    if (!canvas || typeof THREE === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x08090c, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.4, 9);

    function resize() {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    const N = 2200;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const base = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 1.4 + Math.pow(Math.random(), 0.7) * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.15 * (r / 6);
      base[i * 3] = r;
      base[i * 3 + 1] = theta;
      base[i * 3 + 2] = y;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;
      const t = (r - 1.4) / 5.5;
      if (t < 0.2) { col[i*3] = 1; col[i*3+1] = 0.95; col[i*3+2] = 0.75; }
      else if (t < 0.5) { col[i*3] = 0.95; col[i*3+1] = 0.72; col[i*3+2] = 0.3; }
      else { col[i*3] = 0.7; col[i*3+1] = 0.5; col[i*3+2] = 0.25; }
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.045, vertexColors: true, transparent: true, opacity: 0.85,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    const cloud = new THREE.Points(pGeo, pMat);
    scene.add(cloud);

    const hole = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    scene.add(hole);

    const photon = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.025, 12, 128),
      new THREE.MeshBasicMaterial({ color: 0xffe8b0, transparent: true, opacity: 0.9 })
    );
    photon.rotation.x = Math.PI / 2;
    scene.add(photon);

    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.01, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.2 })
    );
    ringA.rotation.x = Math.PI / 2 + 0.08;
    scene.add(ringA);

    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(5.0, 0.008, 6, 100),
      new THREE.MeshBasicMaterial({ color: 0x8b92a5, transparent: true, opacity: 0.12 })
    );
    ringB.rotation.x = Math.PI / 2 - 0.06;
    scene.add(ringB);

    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(4.5, 48),
      new THREE.MeshBasicMaterial({
        color: 0xd4a017, transparent: true, opacity: 0.06,
        side: THREE.DoubleSide, depthWrite: false
      })
    );
    glow.rotation.x = -Math.PI / 2;
    scene.add(glow);

    let scrub = 0;
    let mouseX = 0, mouseY = 0;
    window.addEventListener('blackhole:scrub', (e) => {
      scrub = (e.detail && typeof e.detail.progress === 'number') ? e.detail.progress : 0;
    });
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const dt = 0.016;
      const speed = 0.35 + scrub * 1.4;

      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        let r = base[i3];
        let theta = base[i3 + 1];
        const y = base[i3 + 2];
        const omega = (0.4 * speed) / Math.pow(r / 2 + 0.3, 1.3);
        theta += omega * dt;
        if (scrub > 0.02) {
          r -= scrub * 0.004 * (1.2 / (r + 0.2));
          if (r < 1.3) r = 1.4 + Math.random() * 5.5;
        }
        base[i3] = r;
        base[i3 + 1] = theta;
        arr[i3] = Math.cos(theta) * r;
        arr[i3 + 1] = y * (1 - scrub * 0.3);
        arr[i3 + 2] = Math.sin(theta) * r;
      }
      pGeo.attributes.position.needsUpdate = true;

      photon.rotation.z = t * 0.4 * speed;
      ringA.rotation.z = t * 0.12 * speed;
      ringB.rotation.z = -t * 0.08 * speed;

      const s = 1 + scrub * 0.25;
      hole.scale.setScalar(s);
      photon.scale.setScalar(s);

      const camZ = 9 - scrub * 3.5;
      const camY = 0.4 + scrub * 0.8 + mouseY * 0.3;
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.06;
      camera.position.y += (camY - camera.position.y) * 0.06;
      camera.position.z += (camZ - camera.position.z) * 0.06;
      camera.lookAt(0, 0, 0);

      pMat.opacity = 0.7 + scrub * 0.2;
      renderer.render(scene, camera);
    }
    animate();
  })();
})();
