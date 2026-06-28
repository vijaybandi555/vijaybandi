const loader = document.getElementById('loader');
const nav = document.querySelector('.nav');
const progress = document.querySelector('.scroll-progress');
const typedText = document.getElementById('typed-text');
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav nav a'));
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const commandPalette = document.getElementById('commandPalette');
const cursorGlow = document.querySelector('.cursor-glow');
const particlesCanvas = document.getElementById('particles');
const ctx = particlesCanvas.getContext('2d');
const projectButtons = Array.from(document.querySelectorAll('[data-project]'));
const themeToggle = document.getElementById('themeToggle');
const projectData = {
  churn: {
    title: 'Telecom Churn Intelligence',
    problem: 'Retention teams needed a proactive way to identify churn risk before revenue was affected.',
    architecture: 'Azure Data Factory, Databricks, MLflow, Power BI',
    metrics: 'Reduced churn by 18% and increased retention campaign efficiency by 26%.'
  },
  streaming: {
    title: 'Real-Time Streaming Analytics',
    problem: 'The team needed sub-second visibility into streaming customer and device signals.',
    architecture: 'Kafka, Spark Structured Streaming, Kubernetes, Terraform',
    metrics: 'Cut incident response time by 40% and improved event throughput by 3.2x.'
  },
  warehouse: {
    title: 'Snowflake Warehouse Platform',
    problem: 'Reporting and analytics were fragmented across legacy sources and manual pipelines.',
    architecture: 'Snowflake, Airflow, Python, dbt-style modeling principles',
    metrics: 'Accelerated reporting SLAs by 70% and improved data accessibility enterprise-wide.'
  }
};

function initThemeToggle() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
  } else {
    document.documentElement.classList.remove('light-theme');
  }
}

function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });
}

function initProgressBar() {
  const update = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = height > 0 ? scrollTop / height : 0;
    progress.style.transform = `scaleX(${progressValue})`;
    nav.classList.toggle('shrink', scrollTop > 50);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initTyping() {
  const words = ['Data Engineer', 'MLOps Engineer', 'AI Engineer', 'Cloud Architect', 'Production Support Expert', 'Automation Engineer'];
  let index = 0;
  let letterIndex = 0;
  let deleting = false;

  const type = () => {
    const current = words[index];
    typedText.textContent = current.slice(0, letterIndex);

    if (!deleting && letterIndex < current.length) {
      letterIndex += 1;
    } else if (deleting && letterIndex > 0) {
      letterIndex -= 1;
    } else {
      deleting = !deleting;
      if (!deleting) index = (index + 1) % words.length;
    }

    const speed = deleting ? 45 : 90;
    setTimeout(type, speed);
  };

  type();
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

function initNavHighlight() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { threshold: 0.55 });

  sections.forEach((section) => observer.observe(section));
}

function initParticles() {
  const resize = () => {
    particlesCanvas.width = window.innerWidth * window.devicePixelRatio;
    particlesCanvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };

  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }));

  const animate = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  };

  resize();
  animate();
  window.addEventListener('resize', resize);
}

function initCursorGlow() {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.setProperty('--mx', `${event.clientX}px`);
    cursorGlow.style.setProperty('--my', `${event.clientY}px`);
  });
}

function initTestimonials() {
  const testimonials = Array.from(document.querySelectorAll('.testimonial'));
  let current = 0;
  setInterval(() => {
    testimonials[current].classList.remove('active');
    current = (current + 1) % testimonials.length;
    testimonials[current].classList.add('active');
  }, 4500);
}

function initCommandPalette() {
  window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      commandPalette.classList.add('open');
    }
    if (event.key === 'Escape') commandPalette.classList.remove('open');
  });

  commandPalette.addEventListener('click', () => commandPalette.classList.remove('open'));
}

function initProjectModal() {
  projectButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const data = projectData[button.dataset.project];
      if (!data) return;
      const modal = document.createElement('div');
      modal.className = 'command-palette open';
      modal.innerHTML = `
        <div class="command-card glass">
          <h3>${data.title}</h3>
          <p><strong>Problem:</strong> ${data.problem}</p>
          <p><strong>Architecture:</strong> ${data.architecture}</p>
          <p><strong>Business Impact:</strong> ${data.metrics}</p>
          <button class="btn primary" data-close="true">Close</button>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', (event) => {
        if (event.target.matches('[data-close="true"]') || event.target === modal) {
          modal.remove();
        }
      });
    });
  });
}

initLoader();
initThemeToggle();
initProgressBar();
initTyping();
initReveal();
initNavHighlight();
initParticles();
initCursorGlow();
initTestimonials();
initCommandPalette();
initProjectModal();
