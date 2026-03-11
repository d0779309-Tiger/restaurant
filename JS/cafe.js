/* ═══════════════════════════════════════════
   THREE.JS PARTICLE BACKGROUND
═══════════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 50;

  const count = 700;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    const t = Math.random();
    colors[i * 3]     = 0.5 + t * 0.3;
    colors[i * 3 + 1] = 0.3 + t * 0.2;
    colors[i * 3 + 2] = 0.05 + t * 0.1;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    points.rotation.y = t * 0.025 + mouseX * 0.08;
    points.rotation.x = t * 0.012 + mouseY * 0.05;
    renderer.render(scene, camera);
  }
  animate();
})();

/* ═══════════════════════════════════════════
   MOTION BLUR TRAIL CANVAS
═══════════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('trail-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let mx = -200, my = -200;
  const trail = [];
  const MAX = 28;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function lerp(a, b, t) { return a + (b - a) * t; }

  let cx = mx, cy = my;
  function animateTrail() {
    requestAnimationFrame(animateTrail);
    cx = lerp(cx, mx, 0.18);
    cy = lerp(cy, my, 0.18);
    trail.push({ x: cx, y: cy });
    if (trail.length > MAX) trail.shift();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i < trail.length; i++) {
      const p0 = trail[i - 1], p1 = trail[i];
      const alpha = (i / trail.length) * 0.35;
      const radius = (i / trail.length) * 7;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.strokeStyle = `rgba(200,133,58,${alpha})`;
      ctx.lineWidth = radius;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }
  animateTrail();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
})();

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
(function() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    requestAnimationFrame(animCursor);
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  animCursor();

  document.querySelectorAll('a, button, .menu-card, .value-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const line   = document.getElementById('loader-line');
  setTimeout(() => { line.style.width = '220px'; }, 100);
  setTimeout(() => {
    gsap.to(loader, { opacity: 0, duration: 0.8, ease: 'power2.inOut', onComplete: () => {
      loader.style.display = 'none';
      initHeroAnim();
    }});
  }, 2200);
});

/* ═══════════════════════════════════════════
   HERO STAGGERED COLUMN ANIMATION
═══════════════════════════════════════════ */
function initHeroAnim() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.stagger-col', {
    opacity: 1,
    y: 0,
    duration: 1.4,
    stagger: 0.12,
    ease: 'expo.out',
    onStart: function() {
      document.querySelectorAll('.stagger-col').forEach(c => c.style.opacity = '0');
    }
  });

  gsap.to('#hero-eyebrow', { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'expo.out' });
  gsap.to('#hl1', { opacity: 1, y: '0%', duration: 1.1, delay: 0.6, ease: 'expo.out' });
  gsap.to('#hl2', { opacity: 1, y: '0%', duration: 1.1, delay: 0.75, ease: 'expo.out' });
  gsap.to('#hero-sub', { opacity: 1, y: 0, duration: 1, delay: 0.95, ease: 'expo.out' });
  gsap.to('#hero-cta', { opacity: 1, y: 0, duration: 1, delay: 1.15, ease: 'expo.out' });
  gsap.to('#scroll-ind', { opacity: 1, duration: 1, delay: 1.5, ease: 'power2.out' });
}

/* ═══════════════════════════════════════════
   STAGGERED SCROLL (4-col parallax)
═══════════════════════════════════════════ */
document.querySelectorAll('.hero-col').forEach((col) => {
  const speed = parseFloat(col.dataset.speed) || 0;
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: col,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => {
        col.style.transform = `translateY(${self.progress * speed * 180}px)`;
      }
    });
  }
});

/* ═══════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ═══════════════════════════════════════════
   NAV SCROLL EFFECT
═══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (window.scrollY > 80) {
    nav.style.background = 'rgba(26,15,8,0.92)';
    nav.style.backdropFilter = 'blur(16px)';
    nav.style.borderBottom = '1px solid rgba(245,239,224,0.06)';
  } else {
    nav.style.background = 'transparent';
    nav.style.backdropFilter = 'none';
    nav.style.borderBottom = 'none';
  }
});

/* ═══════════════════════════════════════════
   MENU FILTER
═══════════════════════════════════════════ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.menu-card').forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || cat === filter) {
        gsap.to(card, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
        card.style.pointerEvents = 'auto';
      } else {
        gsap.to(card, { opacity: 0.15, scale: 0.97, duration: 0.4, ease: 'expo.out' });
        card.style.pointerEvents = 'none';
      }
    });
  });
});

/* ═══════════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════════ */
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ═══════════════════════════════════════════
   NUMBER COUNTER ANIMATION
═══════════════════════════════════════════ */
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num').forEach(el => {
      const raw = el.textContent.trim();
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const suffix = raw.replace(/[0-9.]/g, '');
      const duration = 1200;
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(num * ease) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    statObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.story-stats').forEach(el => statObserver.observe(el));
