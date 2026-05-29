// LOADER
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPercent = document.getElementById('loaderPercent');

let progress = 0;

const interval = setInterval(() => {
  progress += Math.random() * 12;
  if (progress >= 100) {
    progress = 100;
    loaderBar.style.width = '100%';
    loaderPercent.textContent = '100';
    clearInterval(interval);
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 800);
    }, 400);
  } else {
    loaderBar.style.width = progress + '%';
    loaderPercent.textContent = Math.floor(progress);
  }
}, 100);

const canvas = document.getElementById('liquidCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let blobs = [];
let mouse = { x: 0, y: 0 };

const PINK = '#E89EB8';
const DARK = '#1a0d12';

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createBlobs() {
  blobs = [];
  const count = 6;
  for (let i = 0; i < count; i++) {
    blobs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 220 + 120,
      opacity: Math.random() * 0.12 + 0.04,
    });
  }
}

function updateBlobs() {
  blobs.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x < -b.radius) b.x = width + b.radius;
    if (b.x > width + b.radius) b.x = -b.radius;
    if (b.y < -b.radius) b.y = height + b.radius;
    if (b.y > height + b.radius) b.y = -b.radius;

    const dx = mouse.x - b.x;
    const dy = mouse.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 300) {
      b.vx -= (dx / dist) * 0.015;
      b.vy -= (dy / dist) * 0.015;
    }

    b.vx *= 0.995;
    b.vy *= 0.995;
  });
}

function drawBlobs() {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, width, height);

  blobs.forEach(b => {
    const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
    gradient.addColorStop(0, `rgba(232, 158, 184, ${b.opacity})`);
    gradient.addColorStop(0.5, `rgba(180, 100, 140, ${b.opacity * 0.5})`);
    gradient.addColorStop(1, `rgba(8, 8, 8, 0)`);

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  });
}

function animate() {
  updateBlobs();
  drawBlobs();
  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
  resize();
  createBlobs();
});

resize();
createBlobs();
animate();

// ENTER BUTTON — munculin main web
document.getElementById('enterBtn').addEventListener('click', () => {
  const prologue = document.getElementById('prologue');
  const mainWeb = document.getElementById('mainWeb');

  prologue.style.transition = 'opacity 1s ease';
  prologue.style.opacity = '0';

  setTimeout(() => {
    prologue.style.display = 'none';
    mainWeb.classList.add('visible');
    document.body.style.overflow = 'auto';
    observeItems();
    setTimeout(() => {
      mainWeb.style.opacity = '1';
    }, 50);
  }, 1000);
});

// SCROLL ANIMATION — masonry item slide dari samping
function observeItems() {
  const items = document.querySelectorAll('.masonry-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  items.forEach(item => observer.observe(item));
}

// FOLDER TOGGLE
const folderHeaders = document.querySelectorAll('.folder-header');

function toggleFolder(folder, open) {
  if (!folder) return;
  folder.classList.toggle('open', open);
  const header = folder.querySelector('.folder-header');
  if (header) header.setAttribute('aria-expanded', String(open));

  if (open) {
    const items = folder.querySelectorAll('.masonry-item');
    items.forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 60);
    });
  }
}

folderHeaders.forEach(header => {
  const folder = header.closest('.folder');

  header.addEventListener('click', () => {
    const isOpen = folder.classList.contains('open');
    if (!isOpen) {
      // Close all other folders when opening this one
      document.querySelectorAll('.folder.open').forEach(openFolder => {
        if (openFolder !== folder) {
          toggleFolder(openFolder, false);
        }
      });
    }
    toggleFolder(folder, !isOpen);
  });

  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFolder(folder, !folder.classList.contains('open'));
    }
  });
});

// FILTER PORTFOLIO
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const folders = document.querySelectorAll('.folder');

    folders.forEach(folder => {
      const match = filter === 'all' || folder.dataset.folder === filter;
      folder.style.display = match ? 'block' : 'none';

      if (match && filter !== 'all') {
        folder.classList.add('open');
        const items = folder.querySelectorAll('.masonry-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 60);
        });
      }
    });
  });
});

// SMOOTH SCROLL navbar
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const navHamburger = document.getElementById('navHamburger');
const navDropdown = document.getElementById('navDropdown');

navHamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  navDropdown.classList.toggle('open');
  navHamburger.classList.toggle('open');
});

document.addEventListener('click', () => {
  navDropdown.classList.remove('open');
  navHamburger.classList.remove('open');
});

navDropdown.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navDropdown.classList.remove('open');
  });
});

const navCollectionText = document.getElementById('navCollectionText');
const navCollection = document.getElementById('navCollection');
const collectionWord = 'COLLECTION';
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let collectionInterval = null;

navCollection.addEventListener('mouseenter', () => {
  let iteration = 0;
  clearInterval(collectionInterval);
  collectionInterval = setInterval(() => {
    navCollectionText.textContent = collectionWord
      .split('')
      .map((letter, i) => {
        if (i < iteration) return collectionWord[i];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
    if (iteration >= collectionWord.length) clearInterval(collectionInterval);
    iteration += 0.6;
  }, 40);
});

navCollection.addEventListener('mouseleave', () => {
  clearInterval(collectionInterval);
  navCollectionText.textContent = '';
});

// LOGO SCROLL TO HOME
document.querySelector('.nav-logo').addEventListener('click', () => {
  const hero = document.getElementById('hero');
  if (hero) {
    hero.scrollIntoView({ behavior: 'smooth' });
  }
});

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbThumbs = document.getElementById('lbThumbs');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let currentIndex = 0;
let currentItems = [];

function openLightbox(items, index) {
  currentItems = items;
  currentIndex = index;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderLightbox();
  buildThumbs();
}

function renderLightbox() {
  const currentImage = currentItems[currentIndex];
  lbImg.src = currentImage.src;
  lbImg.alt = currentImage.alt || 'Portfolio preview';
  document.querySelectorAll('.lb-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentIndex);
    if (i === currentIndex) {
      t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

function buildThumbs() {
  lbThumbs.innerHTML = '';
  currentItems.forEach((item, i) => {
    const thumb = document.createElement('img');
    thumb.src = item.src;
    thumb.classList.add('lb-thumb');
    if (i === currentIndex) thumb.classList.add('active');
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = i;
      renderLightbox();
    });
    lbThumbs.appendChild(thumb);
  });
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

lbClose.addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});

lbPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
  renderLightbox();
});

lbNext.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentItems.length;
  renderLightbox();
});

// Close lightbox when clicking on background
lbThumbs.addEventListener('click', (e) => {
  e.stopPropagation();
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % currentItems.length;
    renderLightbox();
  }
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    renderLightbox();
  }
  if (e.key === 'Escape') closeLightbox();
});

// attach lightbox ke semua masonry item
function attachLightbox() {
  const allItems = document.querySelectorAll('.masonry-item');
  allItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const category = item.dataset.category;

      const categoryItems = Array.from(document.querySelectorAll(
        `.masonry-item[data-category="${category}"] img`
      ));

      const indexInCategory = categoryItems.indexOf(img);
      openLightbox(categoryItems, indexInCategory);
    });
  });
}

attachLightbox();

document.querySelectorAll('img[src*="assets/"]:not(.nav-logo-img):not(.about-profile-img)').forEach(img => {
  img.loading = 'lazy';
});

// PROJECT PREVIEW
const projectData = {
  binphotogen: {
    title: 'BinPhotoGen',
    description: 'This project allows users to upload an image and automatically generate binary code that precisely represents the uploaded image. The system converts visual data into binary format while maintaining its structure and detail. Users can then download the generated binary output for further use.',
    date: 'build on May 12, 2026',
    video: 'assets/binphotogen.webm',
    link: 'https://avfour.github.io/BinPhotoGen/'
  },
  frierenxhimmel: {
    title: 'Frieren x Himmel',
    description: 'Frieren x Himmel is an immersive, front-end web project designed around a dynamic scroll-driven interactive UI/UX. Serving as a visual tribute to Frieren and Hero Himmel, the website utilizes advanced scroll animations and fluid transitions to guide users through their emotional journey and character history. Developed by avfour purely through precise prompting with Gemini, this project demonstrates the power of AI-assisted engineering in building complex, high-fidelity scroll effects that seamlessly blend cinematic storytelling with modern web interactivity.',
    date: 'build on May 19, 2026',
    video: 'assets/frierenxhimmel.webm',
    link: 'https://avfour.github.io/Frieren-x-Himmel-Gemini/'
  },
  escoffier: {
    title: 'Escoffier Delights',
    description: 'Escoffier Delights is a culinary landing page project designed as a digital food product catalog. Inspired by the classic culinary world of Escoffier, this project transforms traditional themes into a modern visual experience that is friendly, vibrant, and light, thanks to its cartoonish art style. Adopting a semi-minimalist design approach, the page focuses on seamless user navigation, allowing visitors to browse the food product list effortlessly without being distracted by cluttered visual elements.',
    date: 'build on May 14, 2026',
    video: 'assets/escoffierdelights.webm',
    link: 'https://avfour.github.io/Escoffier-Delights/'
  }
};

const projectModal = document.getElementById('projectModal');
const projectModalCard = document.getElementById('projectModalCard');
const closeProjectBtn = document.getElementById('closeProjectBtn');
const projectVideo = document.getElementById('projectVideo');
const projectActionBtn = document.getElementById('projectActionBtn');

let currentProjectLink = '';

document.querySelectorAll('.project-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.project;
    const data = projectData[key];
    if (!data) return;

    currentProjectLink = data.link;
    document.getElementById('projectModalTitle').textContent = data.title;
    document.getElementById('projectModalDesc').textContent = data.description;
    document.getElementById('projectModalDate').textContent = data.date;

    projectModal.classList.add('open');
    projectModalCard.classList.remove('opened');
    document.body.style.overflow = 'hidden';

    projectVideo.src = data.video;
    projectVideo.muted = true;

    setTimeout(() => {
      projectModalCard.classList.add('opened');
      projectVideo.play().catch(() => {});
    }, 300);
  });
});

function closeProjectModal() {
  projectModal.classList.remove('open');
  projectModalCard.classList.remove('opened');
  document.body.style.overflow = 'auto';
  projectVideo.pause();
  projectVideo.currentTime = 0;
  projectVideo.src = '';
}

closeProjectBtn.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) closeProjectModal();
});

projectActionBtn.addEventListener('click', () => {
  window.open(currentProjectLink, '_blank', 'noopener noreferrer');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModal.classList.contains('open')) closeProjectModal();
});

// SCROLL BUTTONS
const scrollTopBtn = document.getElementById('scrollTop');
const scrollBottomBtn = document.getElementById('scrollBottom');
let scrollAnimationFrame = null;

const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
const goToSupportPage = () => {
  window.location.href = 'page2.html';
};

function updateScrollButtons() {
  const atBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 10;

  if (window.scrollY > 100) {
    scrollTopBtn.classList.add('visible');
    scrollBottomBtn.classList.add('visible');

    if (!atBottom) {
      scrollBottomBtn.classList.remove('support-mode');
      scrollBottomBtn.style.width = '40px';
      scrollBottomBtn.innerHTML = '↓';
      scrollBottomBtn.onclick = scrollToBottom;
    } else {
      scrollBottomBtn.classList.add('support-mode');
      scrollBottomBtn.style.width = '90px';
      scrollBottomBtn.innerHTML = 'Support Me';
      scrollBottomBtn.onclick = goToSupportPage;
    }
  } else {
    scrollTopBtn.classList.remove('visible');
    scrollBottomBtn.classList.remove('visible', 'support-mode');
    scrollBottomBtn.style.width = '40px';
    scrollBottomBtn.innerHTML = '↓';
    scrollBottomBtn.onclick = scrollToBottom;
  }
}

window.addEventListener('scroll', () => {
  if (scrollAnimationFrame) return;
  scrollAnimationFrame = requestAnimationFrame(() => {
    updateScrollButtons();
    scrollAnimationFrame = null;
  });
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollBottomBtn.addEventListener('click', () => {
  if (scrollBottomBtn.classList.contains('support-mode')) {
    goToSupportPage();
  } else {
    scrollToBottom();
  }
});

// CURSOR
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

// Disable custom cursor on mobile devices
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

if (!isMobile && cursorDot && cursorRing) {
  let ringX = 0, ringY = 0;
  let dotX = 0, dotY = 0;

  window.addEventListener('mousemove', (e) => {
    dotX = e.clientX;
    dotY = e.clientY;

    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '0.5';
  }, true);

  function animateRing() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = document.querySelectorAll('a, button, .masonry-item, .filter-btn, .lb-thumb');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
} else {
  // Hide cursor elements on mobile
  if (cursorDot) cursorDot.style.display = 'none';
  if (cursorRing) cursorRing.style.display = 'none';
}

// fade in kalau balik dari page2
if (document.referrer.includes('page2.html')) {
  const mainWeb = document.getElementById('mainWeb');
  const prologue = document.getElementById('prologue');
  if (prologue) prologue.style.display = 'none';
  if (mainWeb) {
    mainWeb.classList.add('visible');
    mainWeb.style.opacity = '0';
    document.body.style.overflow = 'auto';
    observeItems();
    setTimeout(() => {
      mainWeb.style.transition = 'opacity 1s ease';
      mainWeb.style.opacity = '1';
    }, 50);
  }
}