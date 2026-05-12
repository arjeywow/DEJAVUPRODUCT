document.addEventListener('DOMContentLoaded', () => {
  
  // 1. CURSOR (Solo para PC)
  const cd = document.getElementById('cd');
  const cr = document.getElementById('cr');

  // Verifica si el dispositivo usa un ratón real y no es táctil
  const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (cd && cr && isDesktop) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cd.style.left = mx + 'px';
      cd.style.top = my + 'px';
    });

    (function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cr.style.left = rx + 'px';
      cr.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .svc-card, .track, .art-card, .ct-method').forEach(el => {
      el.addEventListener('mouseenter', () => cr.classList.add('h'));
      el.addEventListener('mouseleave', () => cr.classList.remove('h'));
    });
  }

  // 2. EFECTO DE FONDO (AMBIENT CANVAS)
  const cv = document.getElementById('ambient-canvas');
  if (cv) {
    const cx = cv.getContext('2d');
    let W, H, pts = [];
    function rs() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
    rs();
    window.addEventListener('resize', rs);

    class P {
      constructor() { this.r(); }
      r() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.rad = Math.random() * 1.4 + 0.2;
        this.vx = (Math.random() - 0.5) * 0.14;
        this.vy = (Math.random() - 0.5) * 0.14;
        this.a = Math.random() * 0.4 + 0.08;
        this.g = Math.random() > 0.65;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.r();
      }
      draw() {
        cx.beginPath();
        cx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
        cx.fillStyle = this.g ? `rgba(46,204,113,${this.a})` : `rgba(160,180,190,${this.a * 0.45})`;
        cx.fill();
      }
    }
    for (let i = 0; i < 110; i++) pts.push(new P());

    (function ap() {
      cx.clearRect(0, 0, W, H);
      pts.forEach(p => { p.update(); p.draw(); });
      const g = cx.createRadialGradient(W / 2, H * 0.12, 0, W / 2, H * 0.12, W * 0.55);
      g.addColorStop(0, 'rgba(46,204,113,.04)');
      g.addColorStop(1, 'transparent');
      cx.fillStyle = g;
      cx.fillRect(0, 0, W, H);
      requestAnimationFrame(ap);
    })();
  }

  // 3. BARRA DE NAVEGACIÓN (NAV SCROLL)
  const nb = document.getElementById('navbar');
  if (nb) {
    window.addEventListener('scroll', () => nb.classList.toggle('sc', window.scrollY > 50));
  }

  // 4. MENÚ MÓVIL (HAMBURGER)
  const ham = document.getElementById('ham');
  const mm = document.getElementById('mMenu');
  if (ham && mm) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mm.classList.toggle('open');
    });
    document.querySelectorAll('.mm').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open');
      mm.classList.remove('open');
    }));
  }

  // 5. EFECTO REVEAL (APARECER AL HACER SCROLL)
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // 6. NÚMEROS ANIMADOS (STATS)
  function cu(el) {
    const t = +el.dataset.target;
    let c = 0, s = Math.ceil(t / 55);
    const ti = setInterval(() => {
      c = Math.min(c + s, t);
      el.textContent = c + (t >= 100 ? '' : '+');
      if (c >= t) clearInterval(ti);
    }, 22);
  }
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const so = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.stat-num').forEach(cu);
          so.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    so.observe(statsSection);
  }

  // 7. PAUSAR VINILO
  const vn = document.getElementById('vinyl');
  if (vn) {
    vn.addEventListener('mouseenter', () => vn.style.animationPlayState = 'paused');
    vn.addEventListener('mouseleave', () => vn.style.animationPlayState = 'running');
  }

  // 8. FORMULARIO REAL (Con FormSubmit)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Evita que la página se recargue al enviar

      const btn = document.getElementById('submit-btn');
      const formOk = document.getElementById('form-ok');
      const formErr = document.getElementById('form-err');

      // Cambiar texto del botón mientras envía
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Enviando...';
      btn.disabled = true;
      formOk.style.display = 'none';
      formErr.style.display = 'none';

      // Reemplaza ESTE correo por tu correo real
      const endpoint = "https://formsubmit.co/ajax/arjeywow@gmail.com";

      fetch(endpoint, {
          method: "POST",
          body: new FormData(contactForm)
      })
      .then(response => response.json())
      .then(data => {
          if (data.success === "true" || data.success) {
              formOk.style.display = 'block';
              contactForm.reset();
              setTimeout(() => { formOk.style.display = 'none'; }, 5000);
          } else {
              formErr.style.display = 'block';
          }
      })
      .catch(error => {
          console.error('Error:', error);
          formErr.style.display = 'block';
      })
      .finally(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
      });
    });
  }
});
