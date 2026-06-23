document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Page Loader
  const loader = document.getElementById('loader-overlay');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 800);
  });

  // 2. Custom Custom Cursor
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorOutline = document.querySelector('.custom-cursor-outline');
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot moves instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Outline lags behind smoothly
  function animateOutline() {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;
    
    outlineX += distX * 0.15;
    outlineY += distY * 0.15;
    
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Add hover effects for cursor
  const hoverables = document.querySelectorAll('a, button, select, input, textarea, .hover-target, .project-card, .skills-category-card, .cert-card');
  hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    item.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // Hide cursor on mouse leave window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = 0;
    cursorOutline.style.opacity = 0;
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = 1;
    cursorOutline.style.opacity = 1;
  });


  // 3. Background Neural Network Canvas Particles (Soft Light Theme)
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  let particleCount = 80;
  const connectionDistance = 120;
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (window.innerWidth < 768) {
      particleCount = 35;
    } else {
      particleCount = 80;
    }
    initParticles();
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      if (mouse.x != null && mouse.y != null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          this.x += forceDirectionX * force * 3;
          this.y += forceDirectionY * force * 3;
        }
      }

      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      let directionX = (Math.random() * 0.3) - 0.15;
      let directionY = (Math.random() * 0.3) - 0.15;
      let color = 'rgba(0, 113, 227, 0.15)'; // Apple Light Blue
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < connectionDistance) {
          opacityValue = 1 - (distance / connectionDistance);
          ctx.strokeStyle = `rgba(0, 113, 227, ${opacityValue * 0.08})`; // Soft connecting lines
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  animateParticles();


  // 4. Role Changer Typewriter Animation
  const roles = [
    "Software Developer",
    "AI/ML Enthusiast",
    "Cloud Learner",
    "Problem Solver",
    "Future Software Engineer"
  ];
  let currentRoleIdx = 0;
  let currentText = "";
  let isDeleting = false;
  const typewriterEl = document.getElementById('role-typewriter');
  
  function typeWriter() {
    const fullText = roles[currentRoleIdx];
    
    if (isDeleting) {
      currentText = fullText.substring(0, currentText.length - 1);
    } else {
      currentText = fullText.substring(0, currentText.length + 1);
    }
    
    typewriterEl.textContent = currentText;
    
    let typingSpeed = isDeleting ? 40 : 100;
    
    if (!isDeleting && currentText === fullText) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && currentText === "") {
      isDeleting = false;
      currentRoleIdx = (currentRoleIdx + 1) % roles.length;
      typingSpeed = 500;
    }
    
    setTimeout(typeWriter, typingSpeed);
  }
  
  if (typewriterEl) {
    typeWriter();
  }


  // 5. Sticky Navbar shrink on scroll
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNav();
  });

  function highlightNav() {
    let scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }


  // 6. Mobile Navigation overlay toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.navbar-nav-custom');

  mobileToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    const isExpanded = navList.classList.contains('active');
    mobileToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });


  // 7. Dynamic 3D Hero Workspace Parallax & Tilt Effect
  const workspaceScene = document.querySelector('.workspace-container');
  const workspace3D = document.querySelector('.workspace-3d');
  
  if (workspaceScene && workspace3D) {
    workspaceScene.addEventListener('mousemove', (e) => {
      const rect = workspaceScene.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      
      const rotateX = -y / 10;
      const rotateY = x / 10;
      
      workspace3D.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
    
    workspaceScene.addEventListener('mouseleave', () => {
      workspace3D.style.transform = `rotateY(-5deg) rotateX(10deg)`;
      workspace3D.style.transition = 'transform 0.5s ease';
    });
    
    workspaceScene.addEventListener('mouseenter', () => {
      workspace3D.style.transition = 'none';
    });
  }


  // 8. Custom Neural Network Animation Inside Project 1 Card Header
  const project1Canvas = document.getElementById('project-neural-canvas');
  if (project1Canvas) {
    const pCtx = project1Canvas.getContext('2d');
    let pNodes = [];
    
    function initProjectCanvas() {
      project1Canvas.width = project1Canvas.parentElement.clientWidth;
      project1Canvas.height = project1Canvas.parentElement.clientHeight;
      
      pNodes = [];
      const nodeCount = 18;
      for (let i = 0; i < nodeCount; i++) {
        pNodes.push({
          x: Math.random() * project1Canvas.width,
          y: Math.random() * project1Canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2.5 + 1
        });
      }
    }
    
    function drawProjectNetwork() {
      pCtx.clearRect(0, 0, project1Canvas.width, project1Canvas.height);
      
      pNodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > project1Canvas.width) node.vx = -node.vx;
        if (node.y < 0 || node.y > project1Canvas.height) node.vy = -node.vy;
        
        pCtx.beginPath();
        pCtx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        pCtx.fillStyle = 'rgba(0, 113, 227, 0.4)'; // Apple light blue nodes
        pCtx.fill();
      });
      
      pCtx.strokeStyle = 'rgba(0, 113, 227, 0.06)'; // Faint connecting lines
      pCtx.lineWidth = 0.8;
      for (let i = 0; i < pNodes.length; i++) {
        for (let j = i + 1; j < pNodes.length; j++) {
          let dist = Math.hypot(pNodes[i].x - pNodes[j].x, pNodes[i].y - pNodes[j].y);
          if (dist < 75) {
            pCtx.beginPath();
            pCtx.moveTo(pNodes[i].x, pNodes[i].y);
            pCtx.lineTo(pNodes[j].x, pNodes[j].y);
            pCtx.stroke();
          }
        }
      }
      requestAnimationFrame(drawProjectNetwork);
    }
    
    window.addEventListener('resize', initProjectCanvas);
    initProjectCanvas();
    drawProjectNetwork();
  }


  // 9. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));


  // 10. Scroll Animated Skills Section Progress (Bars & Circles)
  const skillsSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const svgCircleFills = document.querySelectorAll('.svg-circle-fill');
  let skillsAnimated = false;

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillBars.forEach(bar => {
          const val = bar.getAttribute('data-percent');
          bar.style.width = val + '%';
        });

        svgCircleFills.forEach(fill => {
          const percent = fill.getAttribute('data-percent');
          const offset = 226 - (226 * percent / 100);
          fill.style.strokeDashoffset = offset;
        });

        skillsAnimated = true;
      }
    });
  }, { threshold: 0.2 });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }


  // 11. Timeline Scroll Progress Indicator & Activation
  const timeline = document.querySelector('.timeline-container');
  const timelineBar = document.querySelector('.timeline-progress-bar');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timeline) {
    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const timelineStart = rect.top + window.scrollY;
      const timelineHeight = rect.height;
      const scrolled = window.scrollY - timelineStart + (viewportHeight * 0.7);
      
      let percentage = (scrolled / timelineHeight) * 100;
      percentage = Math.max(0, Math.min(100, percentage));
      
      timelineBar.style.height = percentage + '%';
      
      timelineItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < viewportHeight * 0.75) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  }


  // 12. Achievement Dynamic Roll-up Counter
  const achievementsSec = document.getElementById('achievements');
  const counterEl = document.getElementById('gate-counter');
  let counterAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterAnimated) {
        animateCounter();
        counterAnimated = true;
      }
    });
  }, { threshold: 0.4 });

  function animateCounter() {
    let startVal = 0;
    const endVal = 2026;
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * endVal);
      
      counterEl.textContent = currentVal;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counterEl.textContent = endVal;
        document.getElementById('gate-unlock-text').style.opacity = 1;
        document.getElementById('gate-unlock-text').style.transform = 'translateY(0)';
      }
    }
    requestAnimationFrame(updateCounter);
  }

  if (achievementsSec && counterEl) {
    counterObserver.observe(achievementsSec);
  }


  // 13. Contact Send Message Button Particle Explosion (Apple pastel color palette)
  const sendBtn = document.getElementById('contact-submit-btn');
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm && sendBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      createExplosion(sendBtn);

      const originalText = sendBtn.innerHTML;
      sendBtn.innerHTML = 'MESSAGE SENT <i class="fas fa-check ml-2"></i>';
      sendBtn.style.background = 'linear-gradient(135deg, #0071e3, #8622e7)';
      sendBtn.disabled = true;
      
      setTimeout(() => {
        contactForm.reset();
        sendBtn.innerHTML = originalText;
        sendBtn.style.background = '';
        sendBtn.disabled = false;
        
        const inputs = contactForm.querySelectorAll('.form-input-custom');
        inputs.forEach(input => {
          input.dispatchEvent(new Event('input'));
        });
      }, 3500);
    });
  }

  function createExplosion(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + window.scrollX;
    const y = rect.top + rect.height / 2 + window.scrollY;
    
    const count = 30;
    const container = document.body;
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 6 + 4 + 'px';
      particle.style.height = particle.style.width;
      
      // Apple inspired pastel blast colors
      const colors = ['#0071e3', '#8622e7', '#00b0ff', '#ffa116', '#ff2d55'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.backgroundColor = randomColor;
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.boxShadow = `0 2px 8px ${randomColor}`;
      particle.style.zIndex = '9999';
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      container.appendChild(particle);
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      let curX = x;
      let curY = y;
      let opacity = 1;
      
      function animateExplosionParticle() {
        curX += vx;
        curY += vy + 0.1;
        opacity -= 0.02;
        
        particle.style.left = curX + 'px';
        particle.style.top = curY + 'px';
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animateExplosionParticle);
        } else {
          particle.remove();
        }
      }
      requestAnimationFrame(animateExplosionParticle);
    }
  }

});
