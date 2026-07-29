// Scroll-based fade-in animations
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll(
    '.about__heading, .about__bio, .about__card, .pillar, ' +
    '.work__heading, .work__subtitle, .project, ' +
    '.stack__heading, .stack__category, ' +
    '.contact__heading, .contact__desc, .contact__card, ' +
    '.wip__header, .wip__card'
  );

  targets.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));

  // Stagger children within same parent
  document.querySelectorAll('.about__pillars, .stack__grid, .about__cards').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // Mobile hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Nav hide/show on scroll
  let lastScroll = 0;
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 100) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScroll = current;
  }, { passive: true });

  // Sealed League video — sound toggle + volume
  const videoCtl = document.getElementById('sealedLeagueCtl');
  if (videoCtl) {
    const video = videoCtl.parentElement.querySelector('.project__video');
    const soundBtn = videoCtl.querySelector('.video-ctl__btn');
    const volume = videoCtl.querySelector('.video-ctl__vol');

    // Starts muted so autoplay is allowed; slider holds the level to restore
    video.volume = volume.value / 100;

    const syncSound = () => {
      const muted = video.muted || video.volume === 0;
      videoCtl.classList.toggle('is-muted', muted);
      soundBtn.setAttribute('aria-pressed', String(!muted));
      soundBtn.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');
    };

    soundBtn.addEventListener('click', () => {
      const unmuting = video.muted;

      if (unmuting) {
        // The `muted` content attribute wins on some engines — clear it too
        video.removeAttribute('muted');
        video.muted = false;
        // Unmuting at zero volume would be silent — give it an audible level
        if (video.volume === 0) {
          video.volume = 0.7;
          volume.value = 70;
        }
        // Chrome pauses an autoplaying video the moment it becomes audible
        const resume = video.play();
        if (resume) resume.catch(() => {});
      } else {
        video.muted = true;
      }

      syncSound();
      console.log('[sealed-league] muted=%s volume=%s paused=%s', video.muted, video.volume, video.paused);
    });

    volume.addEventListener('input', () => {
      video.volume = volume.value / 100;
      video.muted = video.volume === 0;
      syncSound();
    });

    video.addEventListener('volumechange', syncSound);
    syncSound();
  }

  // Typing effect for hero greeting
  const greeting = document.querySelector('.hero__greeting');
  if (greeting) {
    const text = greeting.textContent;
    greeting.textContent = '';
    greeting.style.visibility = 'visible';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        greeting.textContent += text.charAt(i);
        i++;
        setTimeout(type, 50);
      }
    };
    setTimeout(type, 500);
  }
});
