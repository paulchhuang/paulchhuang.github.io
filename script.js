// Theme toggle
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', newTheme);
  });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Smooth fade-in on scroll with stagger
const fadeEls = document.querySelectorAll(
  '.about-header, .awards-row, .about-details-grid, .about-footer, .project-card, .hero-content, .hero-visual'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// Hero immediate visibility
requestAnimationFrame(() => {
  document.querySelector('.hero-content')?.classList.add('visible');
  setTimeout(() => document.querySelector('.hero-visual')?.classList.add('visible'), 150);
});

// Active nav highlighting
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.style.color = (scrollY >= top && scrollY < top + height) ? 'var(--white)' : '';
    }
  });
});

// Random recent publications (2024–2026)
const recentPubs = [
  { year: '2026', venue: 'arXiv', title: 'EM-Vid: Training-Free Entity-Centric Memory for Efficient and Consistent Multi-Shot Video Generation', authors: 'J. Vandersanden, M. Gadelha, <strong>C.-H. P. Huang</strong>, H. Jeong, Y. Gryaditskaya', url: 'https://arxiv.org/abs/2605.23610', thumb: 'assets/publications/em_vid.png' },
  { year: '2026', venue: 'arXiv', title: 'Generative Movement of Object Trajectories in Videos', authors: 'K. Chhatre, H. Jeong, Y. Gryaditskaya, C. E. Peters, <strong>C.-H. P. Huang</strong>, P. Guerrero', url: 'https://chhatrekiran.github.io/trajectorymover/', thumb: 'assets/publications/trajectorymover.gif' },
  { year: '2026', venue: 'ECCV 2026', title: 'Memory-V2V: Augmenting Video-to-Video Diffusion Models with Memory', authors: 'D. Lee, <strong>C.-H. P. Huang</strong>, X. Chen, J. Ye, D. Ceylan, H. Jeong', url: 'https://dohunlee1.github.io/MemoryV2V/', thumb: 'assets/publications/memory_v2v.gif' },
  { year: '2026', venue: 'arXiv', title: 'WorldCam: Interactive Autoregressive 3D Gaming Worlds with Camera Pose as a Unifying Geometric Representation', authors: 'J. Nam, Y. Hong, <strong>C.-H. P. Huang</strong>, F. Liu, J. Lee, J. Kim, S. Jin, Y. Lee, J. Jung, S. Choi, S. Kim, Y. Zhou', url: 'https://cvlab-kaist.github.io/WorldCam/', thumb: 'assets/publications/worldcam.gif' },
  { year: '2026', venue: 'CVPR 2026', title: 'LoST: Level of Semantics Tokenization for 3D Shapes', authors: 'N. Dutt, Z. Shi, P. Guerrero, <strong>C.-H. P. Huang</strong>, D. Ceylan, N. Mitra, X. Chen', url: 'https://lost3d.github.io/', thumb: 'assets/publications/lost.png' },
  { year: '2026', venue: 'CVPR 2026', title: 'SpaceTimePilot: Generative Rendering of Dynamic Scenes Across Space and Time', authors: 'Z. Huang, H. Jeong, X. Chen, Y. Gryaditskaya, T. Wang, J. Lasenby, <strong>C.-H. P. Huang</strong>', url: 'https://zheninghuang.github.io/Space-Time-Pilot/', thumb: 'assets/projects/spacetimepilot.gif' },
  { year: '2026', venue: 'CVPR 2026', title: 'V-RGBX: Video Editing with Accurate Controls over Intrinsic Properties', authors: 'Y. Fang, T. Wu, V. Deschaintre, D. Ceylan, I. Georgiev, <strong>C.-H. P. Huang</strong>, Y. Hu, X. Chen, T. Wang', url: 'https://aleafy.github.io/vrgbx/', thumb: 'assets/publications/vrgbx.gif' },
  { year: '2025', venue: 'BMVC 2025', title: 'JOG3R: Towards 3D-Consistent Video Generators', authors: '<strong>C.-H. P. Huang</strong>, N. Mitra, H. Jeong, J. Yoon, D. Ceylan', url: 'https://paulchhuang.github.io/jog3rwebsite/', thumb: 'assets/publications/jog3r.jpg' },
  { year: '2025', venue: 'BMVC 2025', title: 'Boosting Camera Motion Control for Video Diffusion Transformers', authors: 'S. Y. Cheong, D. Ceylan, A. Mustafa, A. Gilbert, <strong>C.-H. P. Huang</strong>', url: 'https://soon-yau.github.io/CameraMotionGuidance/', thumb: 'assets/publications/boosting_camera.gif' },
  { year: '2025', venue: 'ICCV 2025', title: 'HUMOTO: A 4D Dataset of Mocap Human Object Interactions', authors: 'J. Lu, <strong>C.-H. P. Huang</strong>, U. Bhattacharya, Q. Huang, Y. Zhou', url: 'https://jiaxin-lu.github.io/humoto/', thumb: 'assets/publications/humoto.png' },
  { year: '2025', venue: 'CVPR 2025', title: 'Shape My Moves: Text-Driven Shape-Aware Synthesis of Human Motions', authors: 'T.-H. Liao, Y. Zhou, Y. Shen, <strong>C.-H. P. Huang</strong>, S. Mitra, J.-B. Huang, U. Bhattacharya', url: 'https://shape-move.github.io/', thumb: 'assets/publications/shape_my_moves.gif' },
  { year: '2025', venue: 'CVPR 2025', title: 'VideoHandle: Editing 3D Object Compositions in Videos Using Video Generative Priors', authors: 'J. Koo, P. Guerrero, <strong>C.-H. P. Huang</strong>, D. Ceylan, M. Sung', url: 'https://videohandles.github.io/', thumb: 'assets/publications/videohandle.gif' },
  { year: '2025', venue: 'CVPR 2025', title: 'Track4Gen: Teaching Video Diffusion Models to Track Points Improves Video Generation', authors: 'H. Jeong, <strong>C.-H. P. Huang</strong>, J. C. Ye, N. Mitra, D. Ceylan', url: 'https://hyeonho99.github.io/track4gen/', thumb: 'assets/publications/track4gen.gif' },
  { year: '2024', venue: 'arXiv', title: 'MatAtlas: Text-driven Consistent Geometry Texturing and Material Assignment', authors: 'D. Ceylan, V. Deschaintre, T. Groueix, R. Martin, <strong>C.-H. P. Huang</strong>, R. Rouffet, V. Kim, G. Lassagne', url: 'https://duyguceylan.github.io/matatlas/', thumb: 'assets/publications/matatlas.png' },
  { year: '2024', venue: 'NeurIPS 2024', title: 'ActAnywhere: Subject-Aware Video Background Generation', authors: 'B. Pan, Z. Xu, <strong>C.-H. P. Huang</strong>, K. K. Singh, Y. Zhou, L. Guibas, J. Yang', url: 'https://actanywhere.github.io/', thumb: 'assets/publications/actanywhere.png' },
  { year: '2024', venue: 'CVPR 2024', title: 'Synergistic Global-space Camera and Human Reconstruction from Videos', authors: 'Y. Zhao, T. Y. Wang, B. Raj, M. Xu, Y. Zhou, J. Yang, <strong>C.-H. P. Huang</strong>', url: 'https://paulchhuang.github.io/synchmr/', thumb: 'assets/publications/synchmr.gif' },
  { year: '2024', venue: 'CVPR 2024', title: 'Generative Rendering: Controllable 4D-Guided Video Generation with 2D Diffusion Models', authors: 'S. Cai, D. Ceylan, M. Gadelha, <strong>C.-H. P. Huang</strong>, T. Y. Wang, G. Wetzstein', url: 'https://primecai.github.io/generative_rendering/', thumb: 'assets/publications/generative_rendering.gif' },
  { year: '2024', venue: '3DV 2024', title: 'BLiSS: Bootstrapped Linear Shape Space', authors: 'S. Muralikrishnan, <strong>C.-H. P. Huang</strong>, D. Ceylan, N. Mitra', url: 'https://sanjeevmk.github.io/bliss_webpage/', thumb: 'assets/publications/bliss.png' },
];

const pubList = document.getElementById('pub-list');
if (pubList) {
  const shuffled = recentPubs.sort(() => Math.random() - 0.5).slice(0, 5);
  shuffled.sort((a, b) => b.year - a.year);

  shuffled.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'pub-item fade-in';
    el.style.transitionDelay = `${i * 60}ms`;
    const thumbHtml = p.thumb
      ? `<div class="pub-thumb"><a href="${p.url}" target="_blank"><img src="${p.thumb}" alt="" loading="lazy"></a></div>`
      : `<div class="pub-thumb pub-thumb--empty"></div>`;
    el.innerHTML = `
      <div class="pub-year">${p.year}</div>
      ${thumbHtml}
      <div class="pub-content">
        <div class="pub-venue">${p.venue}</div>
        <h4><a href="${p.url}" target="_blank">${p.title}</a></h4>
        <p class="pub-authors">${p.authors}</p>
      </div>`;
    pubList.appendChild(el);
    observer.observe(el);
  });
}
