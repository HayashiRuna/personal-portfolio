const progress = document.querySelector('.article-progress');
const articleBackLink = document.querySelector('.back-link');
if (articleBackLink) articleBackLink.href = '../articles.html';

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
}, { passive: true });
