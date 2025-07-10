const sections = ['login', 'register', 'map', 'post', 'feed'];
let selectedZone = 'Canteen';
const feedList = document.getElementById('feed-list');
const feedTitle = document.getElementById('feed-title');
const postForm = document.getElementById('postForm');

const pings = []; // in-memory store

function showSection(id) {
  sections.forEach(section => {
    const el = document.getElementById(section);
    if (el) el.style.display = section === id ? 'block' : 'none';
  });
}

function renderFeed() {
  feedTitle.textContent = `Live Moments at ${selectedZone}`;
  feedList.innerHTML = '';

  const filtered = pings.filter(p => p.location === selectedZone);
  if (filtered.length === 0) {
    feedList.innerHTML = '<p>No moments here yet. Be the first!</p>';
  } else {
    filtered.forEach(p => {
      const div = document.createElement('div');
      div.className = 'ping';
      div.innerHTML = `<strong>${p.text}</strong> – ${p.user}`;
      feedList.appendChild(div);
    });
  }
}

document.querySelectorAll('.zone-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    selectedZone = link.dataset.zone;
    location.hash = 'feed';
  });
});

window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1) || 'login';
  showSection(hash);
  if (hash === 'feed') renderFeed();
});

postForm.addEventListener('submit', e => {
  e.preventDefault();
  const location = document.getElementById('post-location').value;
  const text = document.getElementById('post-text').value;
  const category = document.getElementById('post-category').value;
  const expiry = document.getElementById('post-expiry').value;

  pings.push({ location, text, user: 'Anonymous', category, expiry });
  selectedZone = location;
  location.hash = 'feed';
});

document.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.slice(1) || 'login';
  showSection(hash);
});
