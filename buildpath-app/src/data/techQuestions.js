// src/data/techQuestions.js
export const TECH_CATEGORIES = {
  Coding: {
    Easy: [
      { q: "Which data structure operates on a Last-In-First-Out (LIFO) basis?", options: ["Queue", "Stack", "Array", "Linked List"], correctIndex: 1 },
      { q: "What is the time complexity of searching in a perfectly balanced Binary Search Tree?", options: ["O(n)", "O(1)", "O(log n)", "O(n log n)"], correctIndex: 2 }
    ],
    Moderate: [
      { q: "In React, what hook is used to handle asynchronous API call side effects?", options: ["useState", "useContext", "useEffect", "useMemo"], correctIndex: 2 }
    ],
    Tough: [
      { q: "Which design pattern restricts the instantiation of a class to one single globally accessible object?", options: ["Factory Pattern", "Observer Pattern", "Singleton Pattern", "Strategy Pattern"], correctIndex: 2 }
    ],
    Advanced_Tough: [
      { q: "What memory anomaly occurs when thread execution ordering causes unpredictable results?", options: ["Race Condition", "Memory Leak", "Buffer Overflow", "Dangling Pointer"], correctIndex: 0 }
    ]
  },
  Cybersecurity: {
    Easy: [
      { q: "Which port is commonly used for secure SSH remote connections?", options: ["21", "22", "80", "443"], correctIndex: 1 }
    ],
    Moderate: [
      { q: "Which extension is highly used to manage proxy profiles and rotate IP paths in web browsers?", options: ["Tampermonkey", "SwitchyOmega", "AdBlock", "uBlock Origin"], correctIndex: 1 }
    ],
    Tough: [
      { q: "Which proxy bundle routes terminal traffic through three layered nodes with circuit rotations?", options: ["Tor Expert Bundle", "Nginx Reverse Proxy", "Squid Proxy", "HAProxy Load Balancer"], correctIndex: 0 }
    ],
    Advanced_Tough: [
      { q: "Which mitigation technique adds random data strings to passwords before processing them through hashing algorithms?", options: ["Salting", "Peppering", "Symmetric Masking", "Asymmetric Padding"], correctIndex: 0 }
    ]
  },
  AI: {
    Easy: [
      { q: "What does NLP stand for in Artificial Intelligence?", options: ["Natural Language Processing", "Neural Logic Programming", "Network Layer Protocol", "Node Local Packet"], correctIndex: 0 }
    ],
    Moderate: [
      { q: "Which activation function outputs values strictly bounded between 0 and 1?", options: ["ReLU", "Sigmoid", "Tanh", "Softmax"], correctIndex: 1 }
    ],
    Tough: [
      { q: "What phenomenon happens when a machine learning model learns training noise too perfectly?", options: ["Underfitting", "Overfitting", "Gradient Descent Decay", "Data Augmentation Shift"], correctIndex: 1 }
    ],
    Advanced_Tough: [
      { q: "In Transformers architecture, what mechanism computes global dependencies regardless of distance parameters?", options: ["Recurrent Connection", "Convolutional Kernel", "Self-Attention Mechanism", "Stochastic Pooling Matrix"], correctIndex: 2 }
    ]
  },
  Graphic_Designing: {
    Easy: [
      { q: "Which file format supports full native alpha-channel image transparency?", options: ["JPEG", "PNG", "GIF", "BMP"], correctIndex: 1 }
    ],
    Moderate: [
      { q: "What is the primary color space model used for professional print media design catalogs?", options: ["RGB Model", "CMYK Model", "HEX System Code", "HSL Slider Config"], correctIndex: 1 }
    ],
    Tough: [
      { q: "What dynamic grid layout rule divides a canvas into 9 blocks for structural focal alignment?", options: ["Golden Ratio Matrix", "Rule of Thirds", "Symmetry Principle", "Focal Point Rule Layer"], correctIndex: 1 }
    ],
    Advanced_Tough: [
      { q: "Which scaling method creates vector graphics using mathematical paths instead of fixed pixel grids?", options: ["Rasterization Mapping", "Vectorization Engine", "Anti-aliasing Filter", "Bicubic Interpolation"], correctIndex: 1 }
    ]
  }
};