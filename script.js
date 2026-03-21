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

document.querySelectorAll('.mobile-link').forEach(link =>
  link.addEventListener('click', () => openMenu(false))
);

document.addEventListener('click', e => {
  if (!e.target.closest('header')) openMenu(false);
});


/* ================================================================
   SMOOTH SCROLL
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
================================================================ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (hamburger.classList.contains('open'))        openMenu(false);
    if (modal.style.display === 'flex')              closeModalFn();
    if (chatbot.classList.contains('chat-visible'))  closeChatFn();
    if (resumeModal.style.display === 'flex')        closeResumeFn();
  }
});


/* ================================================================
   SCROLL TO TOP
================================================================ */
const scrollBtn = $id('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});


/* ================================================================
   RESUME MODAL
================================================================ */
const resumeViewBtn        = $id('resumeViewBtn');
const resumeModal          = $id('resumeModal');
const closeResumeBtn       = $id('closeResumeModal');
const closeResumeBtnMobile = $id('closeResumeModalMobile');
const resumeFrame          = $id('resumeFrame');
const resumeMobileFallback = $id('resumeMobileFallback');
const resumeDesktopHeader  = $id('resumeDesktopHeader');
const RESUME_PATH          = 'assets/Bishwa-Prasad-Ghimire-resume.pdf';

fetch(RESUME_PATH, { method: 'HEAD' })
  .then(res => {
    if (!res.ok) {
      resumeViewBtn.disabled = true;
      resumeViewBtn.title = 'Resume not available yet';
    }
  })
  .catch(() => {
    resumeViewBtn.disabled = true;
    resumeViewBtn.title = 'Resume not available yet';
  });

resumeViewBtn.addEventListener('click', () => {
  if (resumeViewBtn.disabled) return;

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  if (isMobile) {
    resumeDesktopHeader.style.display = 'none';
    resumeFrame.style.display = 'none';
    resumeMobileFallback.style.display = 'flex';
    renderResumePDF();
  } else {
    resumeDesktopHeader.style.display = 'flex';
    resumeFrame.src = RESUME_PATH + '#toolbar=0&zoom=80';
    resumeFrame.style.display = 'block';
    resumeMobileFallback.style.display = 'none';
  }

  resumeModal.style.display = 'flex';
  document.body.classList.add('modal-open');
});

function closeResumeFn() {
  resumeModal.style.display = 'none';
  resumeFrame.src = '';
  document.body.classList.remove('modal-open');
}

closeResumeBtn.addEventListener('click', closeResumeFn);
closeResumeBtnMobile.addEventListener('click', closeResumeFn);
resumeModal.addEventListener('click', e => {
  if (e.target === resumeModal) closeResumeFn();
});

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function renderResumePDF() {
  const canvas = $id('resumeCanvas');
  if (!canvas || canvas.dataset.rendered === '1') return;

  pdfjsLib.getDocument(RESUME_PATH).promise.then(pdf => {
    pdf.getPage(1).then(page => {
      const viewport = page.getViewport({ scale: 2.5 });
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width  = '100%';
      canvas.style.height = 'auto';
      page.render({ canvasContext: canvas.getContext('2d'), viewport });
      canvas.dataset.rendered = '1';
    });
  });
}


/* ================================================================
   PROJECTS
================================================================ */
const projectList   = $id('projectList');
const modal         = $id('projectModal');
const modalTitle    = $id('modalTitle');
const modalDesc     = $id('modalDescription');
const modalTech     = $id('modalTech');
const modalGithub   = $id('modalGithub');
const modalDemo     = $id('modalDemo');
const closeModalBtn = $id('closeModal');

let lastFocusedCard = null;

fetch('assets/projects.json')
  .then(res => res.json())
  .then(data => renderProjects(data))
  .catch(err => {
    console.error('Failed to load projects:', err);
    projectList.innerHTML =
      '<p style="text-align:center;opacity:0.7;">Could not load projects. Please try again later.</p>';
  });

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

    card.addEventListener('click', () => { lastFocusedCard = card; openModal(project); });
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

  // ADD THIS LINE at the top
  gtagEvent('project_view', { project_name: project.title, project_tech: project.tech });

  modalTitle.textContent = project.title;
  modalDesc.textContent  = project.description;
  modalTech.textContent  = 'Tech Stack: ' + project.tech;

  let img = modal.querySelector('.modal-img');
  if (!img) {
    img = document.createElement('img');
    img.className = 'modal-img';
    modal.querySelector('.modal-content').prepend(img);
  }
  img.src = project.image;
  img.alt = project.title;

  if (project.github) {
    modalGithub.style.display = 'inline-block';
    modalGithub.href = project.github;
  } else {
    modalGithub.style.display = 'none';
    modalGithub.href = '#';
  }

  if (project.demo) {
    modalDemo.style.display = 'inline-block';
    modalDemo.href = project.demo;
  } else {
    modalDemo.style.display = 'none';
    modalDemo.href = '#';
  }

  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
  modalTitle.setAttribute('tabindex', '-1');
  modalTitle.focus();
}

function closeModalFn() {
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
  if (lastFocusedCard) { lastFocusedCard.focus(); lastFocusedCard = null; }
}

closeModalBtn.addEventListener('click', closeModalFn);
modal.addEventListener('click', e => { if (e.target === modal) closeModalFn(); });


/* ================================================================
   ACTIVE NAV ON SCROLL
================================================================ */
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
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => observer.observe(section));


/* ================================================================
   TYPEWRITER
================================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const texts = [
    'AI & Machine Learning Developer',
    'Deep Learning Engineer',
    'CSIT Student at Tribhuvan University'
  ];

  let i = 0, j = 0, isDeleting = false;
  const typingSpeed = 120, deletingSpeed = 60, pauseTime = 2500;

  function type() {
    const element = document.getElementById('typed-role');
    const current = texts[i];
    element.textContent = current.substring(0, j);

    if (!isDeleting) {
      j++;
      if (j > current.length) { isDeleting = true; setTimeout(type, pauseTime); return; }
    } else {
      j--;
      if (j === 0) { isDeleting = false; i = (i + 1) % texts.length; }
    }

    setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
  }

  setTimeout(type, 800);
});


/* ================================================================
   CHATBOT
================================================================ */
const chatToggle = $id('chat-toggle');
const chatbot    = $id('chatbot');
const closeChat  = $id('close-chat');
const chatBody   = $id('chat-body');
const userInput  = $id('user-input');
const sendBtn    = $id('send-btn');

let sessionGreeted = false;

/* ── Profile data ─────────────────────────────────────────────── */
const PROFILE = {
  name:       'Bishwa Ghimire',
  role:       'AI & Machine Learning Developer',
  university: 'Tribhuvan University (Butwal Multiple Campus)',
  degree:     'BSc. CSIT',
  location:   'Butwal, Nepal',
  email:      'contact@bishwaghimire.com.np',
  phone:      '+977 9746380827',
  timezone:   'GMT+5:45 (Nepal Standard Time)',
  github:     'https://github.com/bishwaghimire',
  linkedin:   'https://www.linkedin.com/in/bishwa-ghimire-66bb5939b',
  skills: {
    ml:   ['Scikit-Learn', 'Model Evaluation', 'Feature Engineering', 'Data Preprocessing'],
    dl:   ['PyTorch', 'CNNs', 'Neural Network Training', 'Optimization'],
    prog: ['Python', 'JavaScript'],
    data: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'OpenCV'],
    web:  ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    tools:['Git']
  },
  projects: [
    {
      name:   'Nepali Handwritten Character Recognition (CNN)',
      tech:   'Python, PyTorch, NumPy, Matplotlib',
      desc:   'Deep learning research project recognizing 59 classes of Nepali handwritten characters using CNNs with character-wise accuracy analysis (~98.92% accuracy).',
      github: 'https://github.com/bishwaghimire/nepali-handwritten-recognition'
    },
    {
      name:   'Titanic Survival Prediction',
      tech:   'Python, Pandas, Scikit-Learn, Matplotlib',
      desc:   'Supervised ML classification model on the Titanic dataset with EDA, feature engineering, and model evaluation.',
      github: 'https://github.com/bishwaghimire/titanic-survival-prediction'
    },
    {
      name:   'Fake News Detection using NLP',
      tech:   'Python, NLP, Scikit-Learn, TF-IDF',
      desc:   'Text classification system using TF-IDF vectorization and Logistic Regression to detect fake news.',
      github: 'https://github.com/bishwaghimire/fake-news-detection'
    },
    {
      name:   'Iris Species Classification',
      tech:   'Python, Scikit-Learn, Pandas',
      desc:   'Classical ML model predicting Iris species from numerical features with visualization and accuracy evaluation.',
      github: 'https://github.com/bishwaghimire/iris-classifier'
    },
    {
      name:   'Mini OTT Streaming Platform (Frontend)',
      tech:   'HTML, CSS, JavaScript',
      desc:   'Responsive OTT-style streaming UI with dynamic movie cards, overlays, and trailer previews.',
      github: 'https://github.com/bishwaghimire/mini-ott-platform'
    }
  ],
  experience: [
    {
      year:  '2024 – Present',
      title: 'BSc. CSIT',
      org:   'Butwal Multiple Campus – Tribhuvan University',
      desc:  'Pursuing Computer Science with focus on AI, ML, and Data Science.'
    },
    {
      year:  '2025',
      title: 'Nepali Handwritten Character Recognition Research',
      org:   'Research Project',
      desc:  'Developed a CNN model for recognizing Nepali handwritten characters with character-wise accuracy analysis.'
    },
    {
      year:  '2025',
      title: 'ML & Deep Learning Projects',
      org:   'Personal Research & Implementation',
      desc:  'Designed and implemented ML models using Scikit-Learn and deep learning models using PyTorch.'
    },
    {
      year:  '2024',
      title: 'Web Development Workshop',
      org:   'Synthbit Technologies',
      desc:  'Completed frontend web development workshop covering HTML, CSS, JavaScript, and responsive design.'
    }
  ],
  achievements: [
    'CNN-based Nepali Handwritten Character Recognition (~98.92% accuracy)',
    'Nepali Text Sentiment Analysis project',
    'Web Development Workshop — Synthbit Technologies (2024)',
    'Published Android apps under Bishwa Studio on Google Play Store',
    'Active contributor to Nepali-language AI research'
  ],
  apps: ['Heart Touching Quotes', 'NepaliSayari', 'Captions', 'FlirtFusion']
};

/* ── FAQ intents ──────────────────────────────────────────────── */
const faq = [
  {
    keywords: ['hello', 'hi', 'hey', 'sup', 'yo', 'hola', 'namaste'],
    answer: [
      "Hello. I'm Bishwa Bot. Ask me about Bishwa's research, projects, skills, or contact details.",
      "Hi. I can tell you about Bishwa's AI work, tech stack, or how to reach him.",
      "Hello. What would you like to know about Bishwa's portfolio?"
    ]
  },
  {
    keywords: ['who', 'about', 'bishwa', 'introduce', 'yourself', 'tell me'],
    answer: `${PROFILE.name} is an ${PROFILE.role} pursuing ${PROFILE.degree} at ${PROFILE.university}. His work is focused on Deep Learning, Computer Vision, and Nepali NLP — with a primary research project on CNN-based Nepali Handwritten Character Recognition.`
  },
  {
    keywords: ['education', 'university', 'college', 'degree', 'study', 'student', 'csit', 'tribhuvan'],
    answer: `Bishwa is pursuing ${PROFILE.degree} at ${PROFILE.university}. Core focus areas: Artificial Intelligence, Machine Learning, and Data Science.`
  },
  {
    keywords: ['skills', 'tech stack', 'technologies', 'tools', 'languages', 'expertise', 'know'],
    answer: `Bishwa's technical stack:\n- ML: ${PROFILE.skills.ml.join(', ')}\n- Deep Learning: ${PROFILE.skills.dl.join(', ')}\n- Programming: ${PROFILE.skills.prog.join(', ')}\n- Data: ${PROFILE.skills.data.join(', ')}\n- Web: ${PROFILE.skills.web.join(', ')}`
  },
  {
    keywords: ['python'],
    answer: "Python is Bishwa's primary language — used across ML pipelines (Scikit-Learn, PyTorch), data analysis (Pandas, NumPy), and scripting."
  },
  {
    keywords: ['pytorch', 'deep learning', 'neural network', 'cnn', 'convolutional'],
    answer: 'Bishwa builds CNN architectures using PyTorch. His primary research — Nepali Handwritten Character Recognition — achieved ~98.92% accuracy across 59 character classes.'
  },
  {
    keywords: ['machine learning', 'ml', 'scikit', 'sklearn', 'model'],
    answer: 'Bishwa has practical ML experience in feature engineering, model training, evaluation metrics, and pipelines using Scikit-Learn. Projects include Titanic survival prediction and Iris classification.'
  },
  {
    keywords: ['nlp', 'natural language', 'text', 'fake news', 'sentiment', 'tfidf'],
    answer: 'NLP projects include Fake News Detection (TF-IDF and Logistic Regression) and a Nepali Text Sentiment Analysis system. Nepali-language NLP is a research niche Bishwa actively works in.'
  },
  {
    keywords: ['ai', 'artificial intelligence', 'computer vision', 'opencv'],
    answer: "Bishwa's AI focus is on building systems that learn from data, with primary research in Computer Vision for Nepali script recognition using CNNs."
  },
  {
    keywords: ['nepali', 'handwritten', 'character', 'recognition', 'ocr', 'devanagari'],
    answer: `Flagship research: CNN-based Nepali Handwritten Character Recognition.\n- 59 character classes\n- ~98.92% accuracy\n- Framework: PyTorch\n- Includes detailed character-wise accuracy analysis\n- GitHub: ${PROFILE.projects[0].github}`
  },
  {
    keywords: ['projects', 'portfolio', 'built', 'work', 'applications', 'show'],
    answer: `${PROFILE.projects.length} featured projects:\n\n${PROFILE.projects.map((p, i) => `${i + 1}. ${p.name}\n   ${p.tech}`).join('\n\n')}\n\nSee the AI Projects section for full details.`
  },
  {
    keywords: ['titanic', 'survival', 'classification', 'logistic'],
    answer: `Titanic Survival Prediction: supervised ML classification with EDA, feature engineering, and Logistic Regression.\nStack: ${PROFILE.projects[1].tech}\nGitHub: ${PROFILE.projects[1].github}`
  },
  {
    keywords: ['ott', 'streaming', 'movie', 'frontend', 'web project'],
    answer: `Mini OTT Streaming Platform: responsive streaming UI with dynamic movie cards and trailer previews.\nStack: ${PROFILE.projects[4].tech}\nGitHub: ${PROFILE.projects[4].github}`
  },
  {
    keywords: ['android', 'app', 'play store', 'bishwa studio', 'bishwa labs', 'mobile'],
    answer: `Bishwa independently develops Android apps under Bishwa Studio / Bishwa Labs, published on the Google Play Store. Apps: ${PROFILE.apps.join(', ')}.`
  },
  {
    keywords: ['experience', 'background', 'journey', 'timeline', 'career', 'internship', 'work'],
    answer: `Timeline:\n\n${PROFILE.experience.map(e => `${e.year}\n${e.title} — ${e.org}`).join('\n\n')}\n\nSee the Experience and Education section for details.`
  },
  {
    keywords: ['achievement', 'accomplishment', 'award', 'certification', 'cert'],
    answer: `Notable achievements:\n${PROFILE.achievements.map(a => `- ${a}`).join('\n')}`
  },
  {
    keywords: ['github', 'repository', 'repo', 'code', 'source'],
    answer: `All code is on GitHub: ${PROFILE.github}`
  },
  {
    keywords: ['linkedin', 'professional', 'profile', 'network'],
    answer: `LinkedIn: ${PROFILE.linkedin}`
  },
  {
    keywords: ['contact', 'email', 'reach', 'message', 'connect', 'hire', 'collaborate'],
    answer: `Contact details:\nEmail: ${PROFILE.email}\nPhone: ${PROFILE.phone}\nLocation: ${PROFILE.location}\n\nOr use the Contact section to send a message directly.`
  },
  {
    keywords: ['resume', 'cv', 'download', 'pdf'],
    answer: 'Resume is available via the View Resume button at the top of the page.'
  },
  {
    keywords: ['location', 'based', 'where', 'nepal', 'butwal'],
    answer: `Based in ${PROFILE.location} (${PROFILE.timezone}).`
  },
  {
    keywords: ['available', 'availability', 'opportunity', 'freelance', 'open to'],
    answer: 'Bishwa is open to AI/ML internships, research collaborations, and freelance work. Reach out via the Contact section or directly by email.'
  },
  {
    keywords: ['goal', 'future', 'vision', 'ambition', 'plan'],
    answer: 'Long-term goal: contribute to next-generation AI systems with a focus on low-resource language NLP (Nepali) and Computer Vision research.'
  },
  {
    keywords: ['research', 'paper', 'publication', 'study'],
    answer: 'Research focus: CNN-based Nepali Handwritten Character Recognition — character-wise accuracy analysis across 58-59 classes, model optimization, and generalization to real-world handwriting variability.'
  },
  {
    keywords: ['blog', 'article', 'post', 'write'],
    answer: 'Blog posts are coming. Topics will cover AI, Deep Learning, and Nepali NLP.'
  },
  {
    keywords: ['fun', 'hobby', 'interest', 'passion', 'outside'],
    answer: 'Outside formal work: training models, reading current AI research, and building independent projects. Consistency is the work.'
  },
  {
    keywords: ['thanks', 'thank', 'okay', 'ok', 'cool', 'got it', 'nice', 'awesome', 'great'],
    answer: [
      "Sure. Anything else you want to know?",
      "No problem. Ask about projects, skills, or contact info.",
      "Glad that helped. Feel free to ask anything else."
    ]
  }
];


/* ================================================================
   CHATBOT LOGIC
================================================================ */
chatToggle.addEventListener('click', openChatFn);
chatToggle.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openChatFn();
  }
});
closeChat.addEventListener('click', closeChatFn);
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;
  gtagEvent('chatbot_message_sent', { message_length: msg.length }); 
  addMessage('user', msg);
  userInput.value = '';
  respondTo(msg);
}

function getCurrentTime() {
  const now  = new Date();
  let h      = now.getHours();
  const m    = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function openChatFn() {
  chatbot.classList.add('chat-visible');
  chatToggle.classList.add('chat-is-open');
  chatToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('chat-open');

  if (!sessionGreeted) {
    setTimeout(() => addMessage('bot', "Hello. I'm Bishwa Bot."), 300);
    setTimeout(() => {
      addMessage('bot', "Ask me about Bishwa's research, projects, skills, or contact details.");
      addQuickReplies(['Projects', 'Skills', 'Research', 'Contact']);
    }, 900);
    sessionGreeted = true;
  }
  userInput.focus();
}

function closeChatFn() {

  // ADD THIS at the top
  if (chatOpenTime) {
    const seconds = Math.round((Date.now() - chatOpenTime) / 1000);
    gtagEvent('chatbot_session', { seconds_spent: seconds, label: seconds + 's on chatbot' });
    chatOpenTime = null;
  }

  chatbot.classList.remove('chat-visible');
  chatToggle.classList.remove('chat-is-open');
  chatToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('chat-open');
}

function addMessage(sender, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `chat-message ${sender}`;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';

  text.split('\n').forEach((line, i, arr) => {
    bubble.appendChild(document.createTextNode(line));
    if (i < arr.length - 1) bubble.appendChild(document.createElement('br'));
  });

  const time = document.createElement('span');
  time.className   = 'chat-time';
  time.textContent = getCurrentTime();

  wrapper.appendChild(bubble);
  wrapper.appendChild(time);
  chatBody.appendChild(wrapper);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addQuickReplies(options) {
  const existing = chatBody.querySelector('.chat-quick-replies');
  if (existing) existing.remove();

  const row = document.createElement('div');
  row.className = 'chat-quick-replies';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'chat-chip';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      row.remove();
      addMessage('user', opt);
      respondTo(opt);
    });
    row.appendChild(btn);
  });

  chatBody.appendChild(row);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
  const wrapper = document.createElement('div');
  wrapper.className = 'chat-message bot typing';
  wrapper.id        = 'typing-indicator';

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

function respondTo(input) {
  const message = input.toLowerCase().trim();
  let bestMatch    = null;
  let highestScore = 0;

  for (const entry of faq) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (message.includes(keyword)) score += keyword.length;
    }
    if (score > highestScore) { highestScore = score; bestMatch = entry; }
  }

  showTyping();

  const delay = bestMatch && typeof bestMatch.answer === 'string' && bestMatch.answer.includes('\n')
    ? 1200 : 800;

  setTimeout(() => {
    removeTyping();

    const response = (bestMatch && highestScore > 0)
      ? (Array.isArray(bestMatch.answer)
          ? bestMatch.answer[Math.floor(Math.random() * bestMatch.answer.length)]
          : bestMatch.answer)
      : "Not sure about that. Try asking about AI projects, research, skills, or contact details.";

    addMessage('bot', response);

    const chips = getFollowUpChips(bestMatch);
    if (chips.length) addQuickReplies(chips);
  }, delay);
}

function getFollowUpChips(matched) {
  if (!matched) return ['Projects', 'Skills', 'Contact'];

  const kw = matched.keywords;

  if (kw.includes('projects') || kw.includes('portfolio'))
    return ['Nepali OCR', 'Fake News NLP', 'Skills'];
  if (kw.includes('skills') || kw.includes('tech stack'))
    return ['PyTorch', 'Python', 'Projects'];
  if (kw.includes('pytorch') || kw.includes('cnn') || kw.includes('nepali'))
    return ['GitHub', 'Other Projects', 'Contact'];
  if (kw.includes('contact') || kw.includes('hire'))
    return ['GitHub', 'LinkedIn', 'Resume'];
  if (kw.includes('education') || kw.includes('experience'))
    return ['Skills', 'Projects', 'Contact'];
  if (kw.includes('github'))
    return ['Projects', 'LinkedIn', 'Contact'];
  if (kw.includes('thanks') || kw.includes('okay'))
    return ['Projects', 'Skills', 'Research'];

  return [];
}



/* ================================================================
   VOICE INPUT — add this block right after:
   "userInput.addEventListener('keydown', e => { ... });"
   in the CHATBOT section of script.js
================================================================ */

/* ── Voice button injection ── */
(function initVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;

  const micBtn = $id('mic-btn');
  if (!micBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition       = new SpeechRecognition();
  recognition.lang        = 'en-US';
  recognition.continuous  = false;
  recognition.interimResults = false;

  let isListening = false;

  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('mic-listening');
    micBtn.setAttribute('aria-label', 'Stop listening');
  };

  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove('mic-listening');
    micBtn.setAttribute('aria-label', 'Voice input');
    if (userInput.value.trim()) sendMessage();
  };

  recognition.onresult = e => {
    userInput.value = e.results[0][0].transcript;
  };

  recognition.onerror = e => {
    isListening = false;
    micBtn.classList.remove('mic-listening');
    micBtn.setAttribute('aria-label', 'Voice input');
    if (e.error === 'not-allowed') {
      addMessage('bot', 'Microphone access was denied. Enable it in your browser settings to use voice input.');
    }
  };

  micBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
    } else {
      userInput.value = '';
      try { recognition.start(); } catch (err) { /* already running */ }
    }
  });
})();

/* ================================================================
   GA4 CUSTOM EVENT TRACKING
================================================================ */

function gtagEvent(name, params = {}) {
  if (typeof gtag !== 'undefined') gtag('event', name, params);
}

/* ── 1. Resume view ── */
$id('resumeViewBtn')?.addEventListener('click', () => {
  gtagEvent('resume_view', { method: 'modal' });
});

/* ── 2. Resume download ── */
document.querySelector('.resume-download-btn')?.addEventListener('click', () => {
  gtagEvent('resume_download', { method: 'desktop_button' });
});

/* ── Mobile resume fallback download ── */
document.querySelector('.resume-fallback-btn.secondary')?.addEventListener('click', () => {
  gtagEvent('resume_download', { method: 'mobile_fallback' });
});

/* ── Mobile resume open full PDF ── */
document.querySelector('.resume-fallback-btn.primary')?.addEventListener('click', () => {
  gtagEvent('resume_open_pdf', { method: 'mobile_fallback' });
});

/* ── 3. Chatbot opened ── */
$id('chat-toggle')?.addEventListener('click', () => {
  gtagEvent('chatbot_open');
});

/* ── 4. Social links ── */
document.querySelectorAll('.social-links a').forEach(link => {
  link.addEventListener('click', () => {
    const label = link.getAttribute('aria-label') || '';
    const platform = label.includes('GitHub')   ? 'GitHub'
                   : label.includes('LinkedIn') ? 'LinkedIn'
                   : label.includes('Facebook') ? 'Facebook'
                   : label.includes('X (Twitter)') ? 'X'
                   : 'Unknown';
    gtagEvent('social_click', { platform });
  });
});

/* ── 5. Project card opened (modal) ── */

/* ── 6. Project GitHub link clicked (inside modal) ── */
$id('modalGithub')?.addEventListener('click', () => {
  gtagEvent('project_github_click', {
    project_name: $id('modalTitle')?.textContent || 'unknown'
  });
});

/* ── 7. Project demo link clicked (inside modal) ── */
$id('modalDemo')?.addEventListener('click', () => {
  gtagEvent('project_demo_click', {
    project_name: $id('modalTitle')?.textContent || 'unknown'
  });
});

/* ── 8. Contact form submitted (only on success) ── */
// Already handled inside the inline <script> in index.html — don't add again here

/* ── 9. Section visibility (fires once per section per page load) ── */
const trackingSections = ['about', 'projects', 'skills', 'research', 'experience', 'contact'];
const sectionTracker = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      gtagEvent('section_viewed', { section_name: entry.target.id });
      sectionTracker.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

trackingSections.forEach(id => {
  const el = $id(id);
  if (el) sectionTracker.observe(el);
});

/* ── 10. Scroll depth milestones ── */
const depthFired = {};
window.addEventListener('scroll', () => {
  const scrollPct = Math.round(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  );
  [25, 50, 75, 90].forEach(milestone => {
    if (scrollPct >= milestone && !depthFired[milestone]) {
      depthFired[milestone] = true;
      gtagEvent('scroll_depth', { depth_percent: milestone, label: milestone + '%' });
    }
  });
});

/* ── 11. Time on page (fires at 30s and 60s) ── */
[5000, 10000, 30000, 60000, 120000].forEach(ms => {
  setTimeout(() => {
    gtagEvent('time_on_page', { seconds: ms / 1000 });
  }, ms);
});

/* ── 12. Dark mode toggled ── */
$id('darkModeToggle')?.addEventListener('click', () => {
  const isNowDark = document.body.classList.contains('dark-mode');
  gtagEvent('theme_toggle', { theme: isNowDark ? 'light' : 'dark' });
});

/* ── 13. Chatbot message sent ── */

/* ── 14. Chatbot session duration ── */
let chatOpenTime = null;

$id('chat-toggle')?.addEventListener('click', () => {
  chatOpenTime = Date.now();
});
