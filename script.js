
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


const revealElements = document.querySelectorAll(
  '.service h3, .service ul, .formation h3, .formation ul, .admin h3, .admin ul'
);

revealElements.forEach(el => {
  el.classList.add('reveal');
  el.style.animation = 'none';
  el.style.opacity = '';
  el.style.transform = '';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));


const contactCard = document.querySelector('.contact-card');
if (contactCard) {
  contactCard.style.animation = 'none';
  contactCard.classList.add('reveal');

  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  contactObserver.observe(contactCard);
}


const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav_link a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--gold)';
    }
  });
});