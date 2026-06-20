const filterButtons=document.querySelectorAll('.filter');
const searchInput=document.querySelector('.search-box input');
const archiveItems=document.querySelectorAll('.archive-item');
const countLabel=document.querySelector('[data-count]');
const emptyMessage=document.querySelector('.archive-empty');
let activeCategory='all';
function updateArchive(){const query=searchInput.value.trim().toLowerCase();let visibleCount=0;archiveItems.forEach(item=>{const categoryMatches=activeCategory==='all'||item.dataset.category===activeCategory;const searchMatches=!query||item.dataset.search.toLowerCase().includes(query);const visible=categoryMatches&&searchMatches;item.hidden=!visible;if(visible)visibleCount+=1});countLabel.textContent=visibleCount;emptyMessage.hidden=visibleCount!==0}
filterButtons.forEach(button=>button.addEventListener('click',()=>{filterButtons.forEach(item=>item.classList.remove('active'));button.classList.add('active');activeCategory=button.dataset.filter;updateArchive()}));
searchInput.addEventListener('input',updateArchive);
