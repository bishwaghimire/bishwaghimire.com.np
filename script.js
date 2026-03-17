'use strict';

/* ================================================================
   UTILITY
================================================================ */
const $id = id => document.getElementById(id);


/* ================================================================
   DARK MODE
================================================================ */
const darkBtn     = $id('darkModeToggle');
const toggleIcon  = darkBtn.querySelector('.toggle-icon');
const toggleLabel = darkBtn.querySelector('.toggle-label');

function applyDark(on) {
  document.body.classList.toggle('dark-mode', on);
  toggleIcon.textContent  = on ? '☀️' : '🌙';
  toggleLabel.textContent = on ? 'Light' : 'Dark';
  localStorage.setItem('darkMode', on ? '1' : '0');
}

// Restore preference on page load
applyDark(localStorage.getItem('darkMode') !== '0');

darkBtn.addEventListener('click', () =>
  applyDark(!document.body.classList.contains('dark-mode'))
);


/* ================================================================
   HAMBURGER MENU
================================================================ */
const hamburger  = $id('hamburger');
const mobileMenu = $id('mobileMenu');

function openMenu(state) {
  hamburger.classList.toggle('open', state);
  mobileMenu.classList.toggle('open', state);
  hamburger.setAttribute('aria-expanded', String(state));
  mobileMenu.setAttribute('aria-hidden',  String(!state));
}

hamburger.addEventListener('click', e => {
  e.stopPropagation();
  openMenu(!hamburger.classList.contains('open'));
});

// Close on mobile link click
document.querySelectorAll('.mobile-link').forEach(link =>
  link.addEventListener('click', () => openMenu(false))
);

// Close when clicking outside the header
document.addEventListener('click', e => {
  if (!e.target.closest('header')) openMenu(false);
});


/* ================================================================
   SMOOTH SCROLL
   FIX #3: Exclude exact href="#" so fallback modal links don't
   scroll the page to the top when accidentally triggered.
================================================================ */
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});


/* ================================================================
   UNIFIED ESCAPE KEY HANDLER
   FIX #4: Single keydown listener handles all Escape actions so
   multiple competing listeners don't pile up on document.
================================================================ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    // Close hamburger menu if open
    if (hamburger.classList.contains('open')) {
      openMenu(false);
    }
    // Close project modal if open
    if (modal.style.display === 'flex') {
      closeModalFn();
    }
    // Close chatbot if open
    if (chatbot.classList.contains('chat-visible')) {
      closeChatFn();
    }
  }
});


/* ================================================================
   SCROLL TO TOP BUTTON
================================================================ */
const scrollBtn = $id('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});

// ─── Resume Button Auto Enable/Disable ───────────────────────
const resumeBtn = document.querySelector('.resume-btn');

fetch('assets/Bishwa-Prasad-Ghimire-resume.pdf', { method: 'HEAD' })
  .then(res => {
    if (!res.ok) {
      resumeBtn.classList.add('disabled');
      resumeBtn.removeAttribute('download');
      resumeBtn.setAttribute('aria-disabled', 'true');
      resumeBtn.title = 'Resume not available yet';
    }
  })
  .catch(() => {
    resumeBtn.classList.add('disabled');
    resumeBtn.removeAttribute('download');
    resumeBtn.setAttribute('aria-disabled', 'true');
    resumeBtn.title = 'Resume not available yet';
  });


  resumeBtn.addEventListener('click', e => {
  if (resumeBtn.classList.contains('disabled')) {
    e.preventDefault();
  }
});

/* ================================================================
   PROJECTS — load from JSON and render cards
================================================================ */
const projectList    = $id('projectList');
const modal          = $id('projectModal');
const modalTitle     = $id('modalTitle');
const modalDesc      = $id('modalDescription');
const modalTech      = $id('modalTech');
const modalGithub    = $id('modalGithub');
const modalDemo      = $id('modalDemo');
const closeModalBtn  = $id('closeModal');

// Track which card triggered the modal so we can restore focus on close (FIX #6)
let lastFocusedCard = null;

// FIX #9: Show a user-visible error message if the fetch fails
fetch('assets/projects.json')
  .then(res => res.json())
  .then(data => renderProjects(data))
  .catch(err => {
    console.error('Failed to load projects:', err);
    projectList.innerHTML =
      '<p style="text-align:center;opacity:0.7;">Could not load projects. Please try again later.</p>';
  });


// FIX #10: Use createElement + textContent/setAttribute instead of innerHTML
// to eliminate any XSS risk from data in projects.json
function renderProjects(projects) {
  projectList.innerHTML = '';

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View details for ' + project.title);

    const img = document.createElement('img');
    img.src       = project.image;
    img.alt       = project.title;
    img.className = 'project-img';

    const title = document.createElement('h3');
    title.textContent = project.title;

    const desc = document.createElement('p');
    desc.textContent = project.short;

    const tech = document.createElement('span');
    tech.className   = 'tech';
    tech.textContent = project.tech;

    card.append(img, title, desc, tech);

    // Open modal on click or Enter/Space for keyboard users
    card.addEventListener('click', () => {
      lastFocusedCard = card;
      openModal(project);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocusedCard = card;
        openModal(project);
      }
    });

    projectList.appendChild(card);
  });
}


function openModal(project) {
  // Populate text content safely
  modalTitle.textContent = project.title;
  modalDesc.textContent  = project.description;
  modalTech.textContent  = 'Tech Stack: ' + project.tech;

  // Add or update modal image
  let img = modal.querySelector('.modal-img');
  if (!img) {
    img = document.createElement('img');
    img.className = 'modal-img';
    modal.querySelector('.modal-content').prepend(img);
  }
  img.src = project.image;
  img.alt = project.title;

  // GitHub link
  if (project.github) {
    modalGithub.style.display = 'inline-block';
    modalGithub.href = project.github;
  } else {
    modalGithub.style.display = 'none';
    modalGithub.href = '#';
  }

  // Demo link
  if (project.demo) {
    modalDemo.style.display = 'inline-block';
    modalDemo.href = project.demo;
  } else {
    modalDemo.style.display = 'none';
    modalDemo.href = '#';
  }

  // Show modal and lock body scroll
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');

  // FIX #6: Move keyboard focus into the modal so keyboard/screen-reader
  // users aren't left tabbing through content hidden behind the overlay.
  // modalTitle has tabindex="-1" set in HTML (add it if not already there).
  modalTitle.setAttribute('tabindex', '-1');
  modalTitle.focus();
}


// Centralised close function so all triggers call the same path
function closeModalFn() {
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');

  // FIX #6: Restore focus to the card that opened the modal
  if (lastFocusedCard) {
    lastFocusedCard.focus();
    lastFocusedCard = null;
  }
}

// Close via ✕ button
closeModalBtn.addEventListener('click', closeModalFn);

// Close via clicking the dark overlay
modal.addEventListener('click', e => {
  if (e.target === modal) closeModalFn();
});
// NOTE: Escape key is handled by the unified handler above (FIX #1 + #4)


/* ================================================================
   CHATBOT
================================================================ */
const chatToggle = $id('chat-toggle');
const chatbot    = $id('chatbot');
const closeChat  = $id('close-chat');
const chatBody   = $id('chat-body');
const userInput  = $id('user-input');
const sendBtn    = $id('send-btn');

// FIX #11: Track per-session greeting so re-opening shows greeting again
let sessionGreeted = false;

/* ── Profile data ─────────────────────────────────────────────── */
const PROFILE = {
  name:     'Bishwa Ghimire',
  role:     'AI & Machine Learning Enthusiast',
  university: 'Tribhuvan University',
  location: 'Nepal',
  email:    'bishwaghimire4560@gmail.com',
  timezone: 'GMT+5:45 (Nepal Standard Time)',
  skills:   ['Python', 'JavaScript', 'HTML/CSS', 'Machine Learning',
             'Deep Learning', 'PyTorch', 'Node.js']
};

/* ── FAQ intents ──────────────────────────────────────────────── */
const faq = [
  {
    keywords: ['hello', 'hi', 'hey'],
    answer: [
      "Hello 👋 I'm Bishwa Bot. Ask me about AI, projects, or skills.",
      "Hi there! 🤖 Ready to explore some intelligent systems?",
      "Hey! Let's talk about AI and innovation."
    ]
  },
  {
    keywords: ['name', 'who are you'],
    answer: `I'm Bishwa Bot 🤖 representing ${PROFILE.name}.`
  },
  {
    keywords: ['about', 'background'],
    answer: `${PROFILE.name} is an ${PROFILE.role} studying at ${PROFILE.university}.`
  },
  {
    keywords: ['education', 'university', 'degree'],
    answer: `Currently pursuing Computer Science at ${PROFILE.university}.`
  },
  {
    keywords: ['location', 'based'],
    answer: `Based in ${PROFILE.location}.`
  },
  {
    keywords: ['timezone'],
    answer: `Timezone: ${PROFILE.timezone}`
  },
  {
    keywords: ['skills', 'tech stack', 'technologies'],
    answer: `Core stack includes: ${PROFILE.skills.join(', ')}.`
  },
  {
    keywords: ['machine learning', 'ml'],
    answer: 'Experienced in model building, data preprocessing, and evaluation pipelines.'
  },
  {
    keywords: ['deep learning', 'neural network', 'cnn'],
    answer: 'Works with neural networks and CNN architectures using PyTorch.'
  },
  {
    keywords: ['ai', 'artificial intelligence'],
    answer: 'Focused on building intelligent systems that learn and adapt.'
  },
  {
    keywords: ['projects', 'portfolio'],
    answer: 'You can explore featured AI and full-stack projects in the Projects section above.'
  },
  {
    keywords: ['github', 'repository'],
    answer: 'All repositories are available on the linked GitHub profile.'
  },
  {
    keywords: ['blog'],
    answer: 'Blogs are coming soon! Stay tuned 👨‍💻.'
  },
  {
    keywords: ['experience', 'background experience'],
    answer: 'Experience includes AI projects, automation systems, and full-stack web development.'
  },
  {
    keywords: ['hire', 'availability', 'internship'],
    answer: 'Open to AI internships, freelance work, and collaboration opportunities.'
  },
  {
    keywords: ['contact', 'email', 'reach'],
    answer: `You can reach him via email: ${PROFILE.email}`
  },
  {
    keywords: ['resume', 'cv'],
    answer: 'Resume is available at the top of the homepage.'
  },
  {
    keywords: ['goal', 'future'],
    answer: 'Long-term vision: Contribute to next-generation intelligent AI systems.'
  },
  {
    keywords: ['sleep', 'night owl'],
    answer: "⚡ Call him when others are wasting time sleeping — he'll be training models and chasing the future of AI."
  },
  {
    keywords: ['motivation', 'discipline'],
    answer: 'Consistency beats motivation. Structured learning builds mastery.'
  }
];


chatToggle.addEventListener('click', openChatFn);
closeChat.addEventListener('click', closeChatFn);
// Escape key for chatbot is handled by the unified handler above (FIX #4)

/* ── Message helpers ──────────────────────────────────────────── */
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;
  addMessage('user', msg);
  userInput.value = '';
  respondTo(msg);
}


/* ================================================================
   CHATBOT JS — Replace these functions in script.js
   (keep everything else like faq, PROFILE, sendMessage, respondTo)
================================================================ */

/* ── Helper: current time ── */
function getCurrentTime() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/* ── Replace openChatFn() ── */
function openChatFn() {
  chatbot.classList.add('chat-visible');
  chatToggle.classList.add('chat-is-open');
  chatToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('chat-open');

  if (!sessionGreeted) {
    addMessage('bot', "Hi there! 👋 I'm Bishwa Bot. Ask me about AI, projects, skills, or collaborations.");
    sessionGreeted = true;
  }
  userInput.focus();
}

/* ── Replace closeChatFn() ── */
function closeChatFn() {
  chatbot.classList.remove('chat-visible');
  chatToggle.classList.remove('chat-is-open');
  chatToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('chat-open');
}

/* ── Replace addMessage() ── */
function addMessage(sender, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `chat-message ${sender}`;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;

  const time = document.createElement('span');
  time.className = 'chat-time';
  time.textContent = getCurrentTime();

  wrapper.appendChild(bubble);
  wrapper.appendChild(time);
  chatBody.appendChild(wrapper);
  chatBody.scrollTop = chatBody.scrollHeight;
}

/* ── Replace showTyping() ── */
function showTyping() {
  const wrapper = document.createElement('div');
  wrapper.className = 'chat-message bot typing';
  wrapper.id = 'typing-indicator';

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'typing-dot';
    bubble.appendChild(dot);
  }

  wrapper.appendChild(bubble);
  chatBody.appendChild(wrapper);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
  const el = $id('typing-indicator');
  if (el) el.remove();
}

/* ── Smart matching engine ────────────────────────────────────── */
function respondTo(input) {
  const message = input.toLowerCase().trim();
  let bestMatch   = null;
  let highestScore = 0;

  for (const entry of faq) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (message.includes(keyword)) score += keyword.length;
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch    = entry;
    }
  }

  showTyping();

  setTimeout(() => {
    removeTyping();

    const response = (bestMatch && highestScore > 0)
      ? (Array.isArray(bestMatch.answer)
          ? bestMatch.answer[Math.floor(Math.random() * bestMatch.answer.length)]
          : bestMatch.answer)
      : "I'm not sure about that yet 🤔 Try asking about AI, projects, skills, or contact information.";

    addMessage('bot', response);
  }, 800);
}

// Active nav on scroll
const sections = document.querySelectorAll('section[id], .contact-section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu ul li a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  rootMargin: '-40% 0px -50% 0px'
});

sections.forEach(section => observer.observe(section));




document.addEventListener("DOMContentLoaded", function () {

const texts = [
  "AI & Machine Learning Developer",
  "Deep Learning Engineer",
  "CSIT Student at Tribhuvan University"
];

let i = 0;
let j = 0;
let isDeleting = false;

const typingSpeed = 120;
const deletingSpeed = 60;
const pauseTime = 2500;

function type() {

  const element = document.getElementById("typed-role");
  const current = texts[i];

  element.textContent = current.substring(0, j);

  if (!isDeleting) {
    j++;

    if (j > current.length) {
      isDeleting = true;
      setTimeout(type, pauseTime);
      return;
    }

  } else {

    j--;

    if (j === 0) {
      isDeleting = false;
      i = (i + 1) % texts.length;
    }

  }

  setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
}

setTimeout(type, 800);
})