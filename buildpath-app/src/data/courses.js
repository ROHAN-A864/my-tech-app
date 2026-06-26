// src/data/courses.js
// Central data file for all courses. Add/edit topics here — UI auto-updates.
// Each topic needs: id (unique!), title, link, xp

const courses = [
  {
    id: "coding",
    title: "Coding",
    icon: "💻",
    color: "#4F46E5",
    modules: [
      {
        id: "coding-basics",
        title: "Basics",
        topics: [
          { id: "coding-basics-1", title: "HTML Fundamentals", link: "https://www.w3schools.com/html/", xp: 10 },
          { id: "coding-basics-2", title: "CSS Fundamentals", link: "https://www.w3schools.com/css/", xp: 10 },
          { id: "coding-basics-3", title: "JavaScript Basics", link: "https://javascript.info/", xp: 15 },
          { id: "coding-basics-4", title: "Git & GitHub Basics", link: "https://docs.github.com/en/get-started", xp: 10 },
        ],
      },
      {
        id: "coding-intermediate",
        title: "Intermediate",
        topics: [
          { id: "coding-inter-1", title: "React Fundamentals", link: "https://react.dev/learn", xp: 20 },
          { id: "coding-inter-2", title: "Node.js & Express", link: "https://nodejs.org/en/docs", xp: 20 },
          { id: "coding-inter-3", title: "REST APIs", link: "https://restfulapi.net/", xp: 20 },
          { id: "coding-inter-4", title: "SQL & Databases", link: "https://www.sqltutorial.org/", xp: 20 },
        ],
      },
      {
        id: "coding-pro",
        title: "Pro",
        topics: [
          { id: "coding-pro-1", title: "System Design Basics", link: "https://github.com/donnemartin/system-design-primer", xp: 30 },
          { id: "coding-pro-2", title: "Data Structures & Algorithms", link: "https://www.geeksforgeeks.org/data-structures/", xp: 30 },
          { id: "coding-pro-3", title: "Microservices Architecture", link: "https://microservices.io/", xp: 30 },
        ],
      },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: "🛡️",
    color: "#DC2626",
    modules: [
      {
        id: "cyber-basics",
        title: "Basics",
        topics: [
          { id: "cyber-basics-1", title: "Networking Fundamentals", link: "https://www.cybrary.it/course/comptia-network-plus/", xp: 10 },
          { id: "cyber-basics-2", title: "Cybersecurity 101", link: "https://www.cisa.gov/cybersecurity-training-exercises", xp: 10 },
          { id: "cyber-basics-3", title: "Linux Basics for Hackers", link: "https://overthewire.org/wargames/bandit/", xp: 15 },
        ],
      },
      {
        id: "cyber-intermediate",
        title: "Intermediate",
        topics: [
          { id: "cyber-inter-1", title: "Web App Security (OWASP Top 10)", link: "https://owasp.org/www-project-top-ten/", xp: 20 },
          { id: "cyber-inter-2", title: "TryHackMe — Intro to Pentesting", link: "https://tryhackme.com/path/outline/beginner", xp: 25 },
          { id: "cyber-inter-3", title: "Cryptography Basics", link: "https://www.khanacademy.org/computing/computer-science/cryptography", xp: 20 },
        ],
      },
      {
        id: "cyber-pro",
        title: "Pro",
        topics: [
          { id: "cyber-pro-1", title: "Hack The Box — Pro Labs", link: "https://www.hackthebox.com/", xp: 35 },
          { id: "cyber-pro-2", title: "Malware Analysis Basics", link: "https://www.malwaretech.com/", xp: 35 },
          { id: "cyber-pro-3", title: "CTF Practice", link: "https://ctftime.org/", xp: 30 },
        ],
      },
    ],
  },
  {
    id: "ai",
    title: "AI",
    icon: "🤖",
    color: "#059669",
    modules: [
      {
        id: "ai-basics",
        title: "Basics",
        topics: [
          { id: "ai-basics-1", title: "Python for AI", link: "https://www.kaggle.com/learn/python", xp: 10 },
          { id: "ai-basics-2", title: "Intro to Machine Learning", link: "https://www.kaggle.com/learn/intro-to-machine-learning", xp: 15 },
          { id: "ai-basics-3", title: "Math for ML (Linear Algebra)", link: "https://www.khanacademy.org/math/linear-algebra", xp: 15 },
        ],
      },
      {
        id: "ai-intermediate",
        title: "Intermediate",
        topics: [
          { id: "ai-inter-1", title: "Deep Learning Specialization", link: "https://www.coursera.org/specializations/deep-learning", xp: 25 },
          { id: "ai-inter-2", title: "Neural Networks with PyTorch", link: "https://pytorch.org/tutorials/", xp: 25 },
          { id: "ai-inter-3", title: "NLP Basics", link: "https://huggingface.co/learn/nlp-course", xp: 20 },
        ],
      },
      {
        id: "ai-pro",
        title: "Pro",
        topics: [
          { id: "ai-pro-1", title: "Transformers & LLMs", link: "https://huggingface.co/learn/llm-course", xp: 35 },
          { id: "ai-pro-2", title: "Fine-tuning & Prompt Engineering", link: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview", xp: 30 },
          { id: "ai-pro-3", title: "MLOps Basics", link: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops", xp: 30 },
        ],
      },
    ],
  },
  {
    id: "design",
    title: "Graphic Designing",
    icon: "🎨",
    color: "#D946EF",
    modules: [
      {
        id: "design-basics",
        title: "Basics",
        topics: [
          { id: "design-basics-1", title: "Design Principles & Color Theory", link: "https://www.canva.com/learn/design-school/", xp: 10 },
          { id: "design-basics-2", title: "Typography Basics", link: "https://fonts.google.com/knowledge", xp: 10 },
          { id: "design-basics-3", title: "Figma for Beginners", link: "https://help.figma.com/hc/en-us/categories/360002042354-Getting-started", xp: 15 },
        ],
      },
      {
        id: "design-intermediate",
        title: "Intermediate",
        topics: [
          { id: "design-inter-1", title: "Adobe Photoshop Essentials", link: "https://helpx.adobe.com/photoshop/tutorials.html", xp: 20 },
          { id: "design-inter-2", title: "Adobe Illustrator Essentials", link: "https://helpx.adobe.com/illustrator/tutorials.html", xp: 20 },
          { id: "design-inter-3", title: "UI/UX Design Fundamentals", link: "https://www.interaction-design.org/courses", xp: 25 },
        ],
      },
      {
        id: "design-pro",
        title: "Pro",
        topics: [
          { id: "design-pro-1", title: "Brand Identity Design", link: "https://www.behance.net/", xp: 30 },
          { id: "design-pro-2", title: "Motion Graphics (After Effects)", link: "https://helpx.adobe.com/after-effects/tutorials.html", xp: 35 },
          { id: "design-pro-3", title: "Building a Design Portfolio", link: "https://www.adobe.com/creativecloud/design/discover/portfolio-design.html", xp: 25 },
        ],
      },
    ],
  },
];

export default courses;