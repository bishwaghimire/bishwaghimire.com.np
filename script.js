// Smooth scroll to anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});





// projects section
const projectList = document.getElementById("projectList");
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalTech = document.getElementById("modalTech");
const modalGithub = document.getElementById("modalGithub");
const modalDemo = document.getElementById("modalDemo");
const closeModal = document.getElementById("closeModal");

// Load projects from JSON
fetch("assets/projects.json")
  .then(res => res.json())
  .then(data => renderProjects(data))
  .catch(err => console.error("Failed to load projects:", err));


function renderProjects(projects) {
  projectList.innerHTML = "";

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-img">
      <h3>${project.title}</h3>
      <p>${project.short}</p>
      <span class="tech">${project.tech}</span>
    `;

    card.addEventListener("click", () => openModal(project));
    projectList.appendChild(card);
  });
}

function openModal(project) {
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalTech.textContent = "Tech Stack: " + project.tech;


  // If modal image exists, add/update it
  let img = modal.querySelector(".modal-img");
  if (!img) {
    img = document.createElement("img");
    img.className = "modal-img";
    img.style.width = "100%";
    img.style.borderRadius = "12px";
    img.style.marginBottom = "15px";
    modal.querySelector(".modal-content").prepend(img);
  }
  img.src = project.image;


 if (project.github) {
    modalGithub.style.display = "inline-block";
    modalGithub.href = project.github;
  } else {
    modalGithub.style.display = "none";
    modalGithub.href = "#";
  }

  if (project.demo) {
    modalDemo.style.display = "inline-block";
    modalDemo.href = project.demo;
  } else {
    modalDemo.style.display = "none";
    modalDemo.href = "#";
  }

  // Show modal
  modal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") modal.style.display = "none";
});


// Arrow up 
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.style.display = "flex";
  } else {
    scrollBtn.style.display = "none";
  }
});



/* ================================
   🔹 CHATBOT SYSTEM – ELITE VERSION
================================= */

// DOM Elements
const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("chatbot");
const closeChat = document.getElementById("close-chat");
const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let greeted = false;

/* ================================
   🔹 PROFILE DATA (Single Source)
================================= */

const PROFILE = {
  name: "Bishwa Ghimire",
  role: "AI & Machine Learning Enthusiast",
  university: "Tribhuvan University",
  location: "Nepal",
  email: "bishwaghimire4560@gmail.com",
  timezone: "GMT+5:45 (Nepal Standard Time)",
  skills: [
    "Python",
    "JavaScript",
    "HTML/CSS",
    "Machine Learning",
    "Deep Learning",
    "PyTorch",
    "Node.js"
  ]
};

/* ================================
   🔹 FAQ INTENTS
================================= */

const faq = [

  // Greetings
  {
    keywords: ["hello", "hi", "hey"],
    answer: [
      "Hello 👋 I'm Bishwa Bot. Ask me about AI, projects, or skills.",
      "Hi there! 🤖 Ready to explore some intelligent systems?",
      "Hey! Let’s talk about AI and innovation."
    ]
  },

  // Identity
  {
    keywords: ["name", "who are you"],
    answer: `I'm Bishwa Bot 🤖 representing ${PROFILE.name}.`
  },

  {
    keywords: ["about", "background"],
    answer: `${PROFILE.name} is an ${PROFILE.role} studying at ${PROFILE.university}.`
  },

  // Education
  {
    keywords: ["education", "university", "degree"],
    answer: `Currently pursuing Computer Science at ${PROFILE.university}.`
  },

  // Location
  {
    keywords: ["location", "based"],
    answer: `Based in ${PROFILE.location}.`
  },

  {
    keywords: ["timezone"],
    answer: `Timezone: ${PROFILE.timezone}`
  },

  // Skills
  {
    keywords: ["skills", "tech stack", "technologies"],
    answer: `Core stack includes: ${PROFILE.skills.join(", ")}.`
  },

  {
    keywords: ["machine learning", "ml"],
    answer: "Experienced in model building, data preprocessing, and evaluation pipelines."
  },

  {
    keywords: ["deep learning", "neural network", "cnn"],
    answer: "Works with neural networks and CNN architectures using PyTorch."
  },

  {
    keywords: ["ai", "artificial intelligence"],
    answer: "Focused on building intelligent systems that learn and adapt."
  },

  // Projects
  {
    keywords: ["projects", "portfolio"],
    answer: "You can explore featured AI and full-stack projects in the Projects section above."
  },

  {
    keywords: ["github", "repository"],
    answer: "All repositories are available on the linked GitHub profile."
  },
  { 
    keywords: ["blog"], 
    answer: "Blogs are coming soon! Stay tuned 👨‍💻." 
  },

  // Work
  {
    keywords: ["experience", "background experience"],
    answer: "Experience includes AI projects, automation systems, and full-stack web development."
  },

  {
    keywords: ["hire", "availability", "internship"],
    answer: "Open to AI internships, freelance work, and collaboration opportunities."
  },

  // Contact
  {
    keywords: ["contact", "email", "reach"],
    answer: `You can reach him via email: ${PROFILE.email}`
  },

  {
    keywords: ["resume", "cv"],
    answer: "Resume is available at the top of the homepage."
  },

  // Personality
  {
    keywords: ["goal", "future"],
    answer: "Long-term vision: Contribute to next-generation intelligent AI systems."
  },

  {
    keywords: ["sleep", "night owl"],
    answer: "⚡ Call him when others are wasting time sleeping — he’ll be training models and chasing the future of AI."
  },

  {
    keywords: ["motivation", "discipline"],
    answer: "Consistency beats motivation. Structured learning builds mastery."
  }

];

/* ================================
   🔹 UI BEHAVIOR
================================= */

chatToggle.addEventListener("click", () => {
  chatbot.style.display = "flex";
  if (!greeted) {
    addMessage("bot", "Hi there! 👋 I'm Bishwa Bot. Ask me about AI, projects, skills, or collaborations.");
    greeted = true;
  }
});

closeChat.addEventListener("click", () => {
  chatbot.style.display = "none";
});

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

/* ================================
   🔹 MESSAGE SYSTEM
================================= */

function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage("user", msg);
  userInput.value = "";

  respondTo(msg);
}

function addMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${sender}`;
  msgDiv.textContent = text;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

/* ================================
   🔹 TYPING INDICATOR
================================= */

function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-message bot typing";
  typingDiv.id = "typing-indicator";
  typingDiv.textContent = "Bishwa Bot is typing...";
  chatBody.appendChild(typingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

/* ================================
   🔹 SMART MATCHING ENGINE
================================= */

function respondTo(input) {

  const message = input.toLowerCase().trim();
  let bestMatch = null;
  let highestScore = 0;

  for (const entry of faq) {
    let score = 0;

    for (const keyword of entry.keywords) {
      if (message.includes(keyword)) {
        score += keyword.length; // weighted scoring
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  showTyping();

  setTimeout(() => {
    removeTyping();

    let response;

    if (bestMatch && highestScore > 0) {
      response = Array.isArray(bestMatch.answer)
        ? bestMatch.answer[Math.floor(Math.random() * bestMatch.answer.length)]
        : bestMatch.answer;
    } else {
      response = "I'm not sure about that yet 🤔 Try asking about AI, projects, skills, or contact information.";
    }

    addMessage("bot", response);

  }, 800);
}
