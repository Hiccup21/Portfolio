// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx - 5 + 'px';
  cursor.style.top = my - 5 + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx - 18 + 'px';
  ring.style.top = ry - 18 + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
});

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal, .exp-item');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => obs.observe(el));

// Count-up animation
const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const dur = 1400;
    const start = performance.now();
    const tick = now => {
      const t = Math.min((now - start) / dur, 1);
      const ease = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
      el.textContent = Math.round(ease * target) + '+';
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

// Mobile menu
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

const PROJECTS = [
  {
    title: "Personal Portfolio Site",
    category: "Full Stack",
    desc: "Cloud-hosted portfolio deployed on AWS EC2 with Apache, secured with HTTPS via Let's Encrypt, and connected to a custom domain through Namecheap DNS.",
    tags: ["AWS EC2", "Apache", "Let's Encrypt", "Namecheap", "HTML/CSS/JS"],
    status: "live",
    statusLabel: "Live",
    icon: "🌐",
    liveUrl: "https://emmanuelcloud.space",
    casestudyUrl: "http://52.20.38.5/",
    codeUrl: "https://github.com/Hiccup21/Portfolio"
  },
  {
    title: "Chatgum — A chat application",
    category: "Full Stack",
    desc: "Real-time serverless chat app, Google OAuth, S3-backed media upload — built on a fully Terraform-managed AWS backend.",
    tags: ["Python", "HTML/CSS/JS", "API Gateway", "OAUTH", "AWS Lambda", "DynamoDB", "S3", "CloudFront", "Terraform"],
    status: "live",
    statusLabel: "Live",
    icon: "💬",
    liveUrl: "https://chatgum.emmanuelcloud.space",
    casestudyUrl: "http://34.195.77.225/",
    codeUrl: "Private"
  },
  {
    title: "Serverless Document Converter",
    category: "Cloud",
    desc: "Serverless document conversion system on AWS using S3 for storage, Lambda for processing, and API Gateway as the REST endpoint.",
    tags: ["AWS S3", "Lambda", "API Gateway", "Python", "Serverless"],
    status: "done",
    statusLabel: "Completed",
    icon: "📄",
    liveUrl: "#",
    casestudyUrl: "#",
    codeUrl: "#"
  },
];

/* ── Build filter buttons ── */
const categories = ["All", ...new Set(PROJECTS.map(p => p.category))];
const filterBar = document.getElementById("filterBar");
categories.forEach((cat, i) => {
  const btn = document.createElement("button");
  btn.className = "filter-btn" + (i === 0 ? " active" : "");
  btn.textContent = cat;
  btn.onclick = () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".project-card").forEach(card => {
      card.classList.toggle("hidden", cat !== "All" && card.dataset.category !== cat);
    });
  };
  filterBar.appendChild(btn);
});

/* ── Render project cards ── */
const grid = document.getElementById("projectsGrid");
PROJECTS.forEach(p => {
  const card = document.createElement("div");
  card.className = "project-card";
  card.dataset.category = p.category;

  // Live button
  const liveBtn = p.liveUrl !== "#"
    ? `<a href="${p.liveUrl}" target="_blank" class="proj-link primary">Live ↗</a>`
    : `<span class="proj-link primary" style="opacity:.4;cursor:default;">Live ↗</span>`;

  // Case Study button — only shows if casestudyUrl is set and not "#"
  const casestudyBtn = p.casestudyUrl && p.casestudyUrl !== "#"
    ? `<a href="${p.casestudyUrl}" target="_blank" class="proj-link casestudy">Case Study</a>`
    : "";

  // Code button
  const codeBtn = p.codeUrl !== "#"
    ? `<a href="${p.codeUrl}" target="_blank" class="proj-link ghost">Code</a>`
    : `<span class="proj-link ghost" style="opacity:.4;cursor:default;">Code</span>`;

  card.innerHTML = `
    <div class="proj-thumb" style="background:linear-gradient(135deg,var(--black),var(--blue-mid))">
      <div class="proj-thumb-icon">${p.icon}</div>
      <div class="proj-status status-${p.status}">${p.statusLabel}</div>
    </div>
    <div class="proj-body">
      <div class="proj-cat">${p.category}</div>
      <div class="proj-title">${p.title}</div>
      <p class="proj-desc">${p.desc}</p>
      <div class="proj-tags">${p.tags.map(t => `<span class="proj-tag">${t}</span>`).join("")}</div>
      <div class="proj-links" style="flex-wrap:wrap;">${liveBtn}${casestudyBtn}${codeBtn}</div>
    </div>`;
  grid.appendChild(card);
});
