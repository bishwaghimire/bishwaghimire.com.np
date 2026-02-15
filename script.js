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



// Chatbot functionality
const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("chatbot");
const closeChat = document.getElementById("close-chat");
const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let greeted = false;

chatToggle.addEventListener("click", () => {
  chatbot.style.display = "flex";
  if (!greeted) {
    addMessage("bot", "Hi there! 👋 I'm Bishow Bot. Ask me anything about my background, projects, skills, or how to get in touch.");
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

function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage("user", msg);
  respondTo(msg);
  userInput.value = "";
}

function addMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${sender}`;
  msgDiv.textContent = text;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}



function respondTo(input) {
  input = input.toLowerCase();

  // FAQ dictionary: keyword(s) to answer
  const faq = [
    { keywords: ["hello", "hi", "hey","hlo"], answer: "Hey there! 👋 I'm Bishow Bot. How can I assist you today?" },
  { keywords: ["good morning","morning"], answer: "Good morning! ☀️ Ready to dive into some projects or skills?" },
  { keywords: ["good afternoon"], answer: "Good afternoon! 😊 Let me know what you'd like to explore." },
  { keywords: ["good evening","evening"], answer: "Good evening! 🌙 I'm here to answer your questions anytime." },
  { keywords: ["how are you", "how's it going"], answer: "I’m running at full speed! 🚀 How can I help you today?" },
  { keywords: ["what's up","whats up", "sup"], answer: "All good here! 🤖 Just waiting to help you explore Bishow’s world." },
  { keywords: ["name","who"], answer: "I'm Bishow Bot 🤖, here to guide you around Bishow’s portfolio." },
  { keywords: ["full name",], answer: "My name is Bishow Ghimire." },
  { keywords: ["education", "degree", "university", "school"], answer: "I graduated with a Bachelor's degree in Computer Science from Tribhuwan University, Nepal." },
  { keywords: ["birthplace", "hometown"], answer: "I was born and raised in Butwal, Nepal." },
  { keywords: ["languages spoken", "language"], answer: "I speak English, Nepali, and a bit of Hindi." },
  { keywords: ["age"], answer: "I prefer to keep my exact age private, but I’m an experienced developer in my mid-20s." },
  { keywords: ["hobbies", "interests"], answer: "In my free time, I enjoy hiking, photography, and playing chess." },
  { keywords: ["location", "where"], answer: "I’m currently based in Butwal, Nepal." },
  { keywords: ["work experience", "experience", "background"], answer: "I have over 1 years of experience in web development, specializing in full-stack web and AI projects." },
  { keywords: ["contact info", "contact details"], answer: "You can reach me via email at bishowghi2061@example.com." },
  { keywords: ["resume", "cv"], answer: "My resume is available for download at the top of the homepage." },
  { keywords: ["goals", "career goals"], answer: "My goal is to build innovative software solutions that make a positive impact." },
  { keywords: ["strengths"], answer: "I am detail-oriented, proactive, and have strong problem-solving skills." },
  { keywords: ["favorite technology", "favorite tech"], answer: "I love working with Python and React for building scalable applications." },
  { keywords: ["work style"], answer: "I prefer clear communication, collaborative environments, and agile methodologies." },
  { keywords: ["availability"], answer: "I’m currently available for new projects and freelance work." },
  { keywords: ["timezone"], answer: "I’m in the GMT+5:45 timezone, Nepal Standard Time." },
  { keywords: ["team experience", "teamwork"], answer: "I have worked with both small startups and large distributed teams remotely and onsite." },
  //{ keywords: ["fun fact"], answer: "A fun fact about me: I once built a robot that can play chess autonomously!" },
  { keywords: ["personal values"], answer: "Integrity, continuous learning, and empathy are core values I live by." },
    { keywords: ["project", "work"], answer: "You can check my projects under the 'Projects' section above." },
    { keywords: ["contact", "email", "reach"], answer: "Sure! You can email me at bishowghi2061@example.com." },
    { keywords: ["skills", "skill","technology","technology use","technologies", "tech"], answer: "I use Python, JavaScript, HTML/CSS, and I love working with AI & ML." },
    { keywords: ["resume", "cv"], answer: "You can download my resume from the top of the homepage." },
    { keywords: ["blog"], answer: "Blogs are coming soon! Stay tuned 👨‍💻." },
    { keywords: ["education", "degree", "university"], answer: "I have a degree in Computer Science from Tribhuwan University." },
    { keywords: ["experience", "background"], answer: "I have 1+ years experience in full-stack development and AI projects." },
    { keywords: ["languages", "programming languages","knowledge"], answer: "I code in Python, Html, CSS, JavaScript, and c/C++." },
    { keywords: ["frameworks", "libraries"], answer: "Familiar with React, Node.js, Django, and Pytorch." },
    { keywords: ["github", "repo", "repository"], answer: "You can find my code repositories on my GitHub profile linked below." },
    { keywords: ["availability", "hire", "job"], answer: "I’m open to freelance projects and full-time opportunities." },
    { keywords: ["contact time", "best time to contact"], answer: "You can reach me via email anytime; I usually respond within 24 hours." },
    //{ keywords: ["certifications", "certified"], answer: "I hold certifications in AWS, Google Cloud, and Data Science." },
    { keywords: ["open source"], answer: "I contribute regularly to open source projects on GitHub." },
    //{ keywords: ["portfolio"], answer: "This website showcases my portfolio and past projects." },
    //{ keywords: ["deployment"], answer: "I have experience deploying applications using Docker, Kubernetes, and AWS." },
    { keywords: ["testing"], answer: "I use Jest, Mocha, and Selenium for testing." },
    //{ keywords: ["methodologies"], answer: "I follow Agile and Scrum methodologies in my projects." },
    { keywords: ["communication"], answer: "I’m proficient in English and comfortable with remote collaboration tools." },
    { keywords: ["database", "databases"], answer: "Experienced with MySQL, MongoDB, and little with Firebase." },
    { keywords: ["api", "apis"], answer: "I build and consume RESTful and GraphQL APIs." },
    //{ keywords: ["cloud"], answer: "Skilled in AWS, Google Cloud, and Azure services." },
    { keywords: ["automation"], answer: "I automate workflows using Python scripts." },
    { keywords: ["security"], answer: "I implement security best practices including OAuth and JWT authentication." },
    { keywords: ["data science"], answer: "I analyze data and build ML models using Python, Numpy, Pandas, and scikit-learn." },
    { keywords: ["machine learning", "ml"], answer: "Experienced with PyTorch, and building ML pipelines." },
    { keywords: ["ai", "artificial intelligence"], answer: "Passionate about AI research and practical applications." },
    { keywords: ["chatbot","bot","Bot"], answer: "This chatbot is a simple rule-based bot built with vanilla JavaScript." },
    //{ keywords: ["performance"], answer: "I optimize applications for speed and scalability." },
    { keywords: ["collaboration"], answer: "I use Git, GitHub, and communication tools like LinkedIn, Facebook, X (Twitter)." },
    { keywords: ["code review"], answer: "I participate actively in code reviews to maintain code quality." },
    { keywords: ["learning"], answer: "I keep updated by reading tech blogs, attending webinars, and experimenting." },
    //{ keywords: ["hobbies"], answer: "Outside coding, I enjoy hiking, writing, and playing chess." },
    { keywords: ["availability"], answer: "Currently available for new projects starting next month." },
    { keywords: ["timezone"], answer: "I’m based in the GMT+5:45 timezone." },
    { keywords: ["salary", "rate"], answer: "Please contact me directly for discussions on rates and compensation." },
    { keywords: ["references"], answer: "References are available upon request." },
    { keywords: ["team"], answer: "I have worked in small and large teams, both remote and onsite." },
    { keywords: ["projects types"], answer: "My projects range from web apps, AI tools, automation scripts, and APIs." },
    { keywords: ["favorite tech"], answer: "I enjoy working with Python and html,Css,Js the most." },
    //{ keywords: ["goals"], answer: "My goal is to build impactful software that solves real-world problems." },
    //{ keywords: ["fun fact"], answer: "I once built a robot that can play chess autonomously!" },
    { keywords: ["contact method", "contact", "how to contact"], answer: "Email is the best way to reach me: bishowghi2061@example.com." },
    { keywords: ["work style"], answer: "I’m proactive, detail-oriented, and value clear communication." },
    { keywords: ["availability hours","available","when"], answer: "I’m usually available 9 AM to 6 PM local time." },
  ];

  // Find matching FAQ
  let response = "Sorry, I didn’t get that. Try asking about projects, skills, contact, or resume.";

  for (const entry of faq) {
    for (const kw of entry.keywords) {
      if (input.includes(kw)) {
        response = entry.answer;
        break;
      }
    }
    if (response !== "Sorry, I didn’t get that. Try asking about projects, skills, contact, or resume.") break;
  }

  setTimeout(() => addMessage("bot", response), 600);
}

