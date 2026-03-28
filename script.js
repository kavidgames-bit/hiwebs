/* ==============================
   script.js — hiwebs
============================== */

/* --- Cursor Glow --- */
const glow = document.querySelector(".light-glow");
document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

/* --- Header scroll --- */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
});

/* --- Hamburger menu --- */
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("open");
  const spans = hamburger.querySelectorAll("span");
  if (nav.classList.contains("open")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  } else {
    spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
  }
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    const spans = hamburger.querySelectorAll("span");
    spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
  });
});

/* --- Parallax video --- */
const heroVideo = document.querySelector(".hero-video");
let ticking = false;

if (heroVideo) {
  function updateParallax() {
    const scrollY = window.scrollY;
    heroVideo.style.transform =
      `translateY(${scrollY * 0.25}px) scale(${1.1 + scrollY * 0.0002})`;
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  });
}

/* --- Scroll Reveal --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el, i) => {
  // Stagger sibling reveals
  const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains("reveal"));
  const idx = siblings.indexOf(el);
  el.dataset.delay = idx * 100;
  revealObserver.observe(el);
});

/* --- Animated Counters --- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-number").forEach(el => counterObserver.observe(el));

/* ==============================
   PARTICLE SYSTEM
============================== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.15;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ==============================
   TYPEWRITER EFFECT
============================== */
const typewriterEl = document.getElementById("typewriter");
const phrases = [
  "aparecer primero.",
  "crecer con Ads.",
  "una web que venda.",
  "dominar Google."
];
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
let typeSpeed = 80;

function typewrite() {
  const current = phrases[phraseIdx];

  if (!deleting) {
    typewriterEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      typeSpeed = 2000; // pause at end
    } else {
      typeSpeed = 80;
    }
  } else {
    typewriterEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    typeSpeed = 40;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 300;
    }
  }
  setTimeout(typewrite, typeSpeed);
}
typewrite();

/* ==============================
   3D TILT EFFECT ON CARDS
============================== */
const tiltCards = document.querySelectorAll(".service-card, .process-card");

tiltCards.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* --- Contact form (demo — envía a WhatsApp) --- */
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");
    const success = document.getElementById("formSuccess");

    btn.disabled = true;
    btn.textContent = "Enviando...";

    // Simula envío y abre WhatsApp con los datos
    setTimeout(() => {
      const nombre = document.getElementById("nombre").value;
      const email = document.getElementById("email").value;
      const servicio = document.getElementById("servicio").value;
      const mensaje = document.getElementById("mensaje").value;

      const text = encodeURIComponent(
        `Hola! Soy ${nombre} (${email}).\n` +
        `Servicio de interés: ${servicio || "No especificado"}\n\n` +
        `${mensaje}`
      );

      window.open(`https://wa.me/5491100000000?text=${text}`, "_blank");

      btn.style.display = "none";
      success.style.display = "block";
      form.reset();
    }, 800);
  });
}
