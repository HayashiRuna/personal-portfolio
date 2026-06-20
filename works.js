const workFilters=document.querySelectorAll('.work-filter');
const workCards=document.querySelectorAll('.work-card');
const workEmpty=document.querySelector('.works-empty');
const modal=document.querySelector('.work-modal');
const media=document.querySelector('.modal-media');
const mediaFrame=document.querySelector('.modal-media-frame');
const galleryCount=document.querySelector('.gallery-count');
const zoomButton=document.querySelector('.zoom-toggle');

const photoFrames={
  shore:{src:'assets/works/winter-shore.webp',alt:'冬日海岸上的行人',orientation:'landscape',title:'潮线之外',kicker:'冬日海岸 · 01',summary:'海雾压低了地平线，一个人沿着潮水留下的边界缓慢前行。画面保留了冬季海岸近乎无声的辽阔。',details:{地点:'东部海岸',时间:'2026 · 01',画幅:'横幅 · 3:2'}},
  room:{src:'assets/works/afternoon-room.webp',alt:'窗边木桌上的水杯',orientation:'landscape',title:'光经过房间',kicker:'午后房间 · 02',summary:'风吹动窗帘，阳光短暂落在水杯和木桌上。没有事件发生的下午，也拥有值得被保存的形状。',details:{地点:'家中',时间:'2025 · 04',画幅:'横幅 · 4:3'}},
  night:{src:'assets/works/night-walk.webp',alt:'雨后巷道中的人物',orientation:'portrait',title:'雨停以后',kicker:'夜行 · 03',summary:'雨后的巷道把灯光拉得很长。门口停留的人与远处的窗口，共同构成一段安静的城市叙事。',details:{地点:'城市街巷',时间:'2026 · 06',画幅:'竖幅 · 2:3'}}
};

const projects={
  'winter-shore':{slides:[photoFrames.shore,photoFrames.room,photoFrames.night]},
  'night-walk':{slides:[photoFrames.night,photoFrames.shore,photoFrames.room]},
  'afternoon-room':{slides:[photoFrames.room,photoFrames.night,photoFrames.shore]},
  'island-app':{title:'小岛',kicker:'产品设计 · 2025',summary:'一个帮助人们记录日常感受的轻量应用。',details:{角色:'产品设计',周期:'8 周',范围:'研究 / UI / 原型'},theme:'island',label:'ISLAND\nJOURNAL'},
  'mountain-river':{title:'山止川行',kicker:'品牌设计 · 2025',summary:'为小型户外生活品牌建立视觉身份。',details:{角色:'品牌设计',周期:'6 周',范围:'策略 / 视觉 / 包装'},theme:'mountain',label:'山止\n川行'},
  'floating-light':{title:'浮光',kicker:'网站设计 · 2024',summary:'为数字艺术展览设计的线上体验。',details:{角色:'视觉与网页',周期:'5 周',范围:'概念 / UI / 前端'},theme:'light',label:'FLOATING\nLIGHT'}
};

let activeProject=null;
let activeSlide=0;
let view={scale:1,x:0,y:0};
let dragState=null;
let suppressImageClick=false;

workFilters.forEach(button=>button.addEventListener('click',()=>{workFilters.forEach(item=>item.classList.remove('active'));button.classList.add('active');const filter=button.dataset.filter;let visible=0;workCards.forEach(card=>{const show=filter==='all'||card.dataset.type===filter;card.hidden=!show;if(show)visible+=1});workEmpty.hidden=visible!==0}));

function slidesFor(project){
  if(project.slides)return project.slides;
  const names=['概念画面','视觉系统','应用延展'];
  const notes=['定义项目的核心气质与视觉方向。','建立颜色、字体和版式之间的秩序。','把视觉语言延展到真实的使用场景。'];
  return names.map((name,index)=>({theme:`${project.theme}${index===1?' alt':index===2?' detail':''}`,label:project.label,title:`${project.title} · ${name}`,kicker:project.kicker,summary:notes[index],details:{...project.details,画面:`0${index+1} / 03`}}));
}

function renderInfo(project,slide){
  document.querySelector('.modal-kicker').textContent=slide.kicker||project.kicker;
  document.querySelector('#modal-title').textContent=slide.title||project.title;
  document.querySelector('.modal-summary').textContent=slide.summary||project.summary;
  const details=document.querySelector('.modal-details');
  details.replaceChildren();
  Object.entries(slide.details||project.details).forEach(([term,value])=>{const row=document.createElement('div');const dt=document.createElement('dt');const dd=document.createElement('dd');dt.textContent=term;dd.textContent=value;row.append(dt,dd);details.append(row)});
}

function currentImage(){return media.querySelector('img')}
function clampView(){
  const image=currentImage();
  if(!image)return;
  const maxX=Math.max(0,(image.clientWidth*view.scale-mediaFrame.clientWidth)/2);
  const maxY=Math.max(0,(image.clientHeight*view.scale-mediaFrame.clientHeight)/2);
  view.x=Math.max(-maxX,Math.min(maxX,view.x));
  view.y=Math.max(-maxY,Math.min(maxY,view.y));
}
function applyView(){
  const image=currentImage();
  if(!image)return;
  clampView();
  image.style.transform=`translate3d(${view.x}px,${view.y}px,0) scale(${view.scale})`;
  image.classList.toggle('zoomed',view.scale>1);
  zoomButton.textContent=view.scale>1?'− 复位':'＋ 放大';
  zoomButton.setAttribute('aria-label',view.scale>1?'复位图片':'放大图片');
}
function setScale(scale){
  view.scale=Math.max(1,Math.min(4,scale));
  if(view.scale===1){view.x=0;view.y=0}
  applyView();
}
function resetView(){view={scale:1,x:0,y:0};applyView()}

function renderSlide(){
  const project=projects[activeProject];
  const slides=slidesFor(project);
  activeSlide=(activeSlide+slides.length)%slides.length;
  const slide=slides[activeSlide];
  media.replaceChildren();
  media.dataset.orientation=slide.orientation||'design';
  view={scale:1,x:0,y:0};
  renderInfo(project,slide);
  if(slide.src){
    const image=document.createElement('img');
    image.src=slide.src;image.alt=slide.alt;image.draggable=false;
    image.addEventListener('load',resetView,{once:true});
    image.addEventListener('click',()=>{if(suppressImageClick){suppressImageClick=false;return}setScale(view.scale>1?1:2)});
    image.addEventListener('dblclick',event=>{event.preventDefault();setScale(view.scale>1?1:2)});
    media.append(image);
  }else{
    const visual=document.createElement('div');visual.className=`modal-design ${slide.theme}`;
    const label=document.createElement('span');label.textContent=slide.label;visual.append(label);media.append(visual);
  }
  galleryCount.textContent=`${String(activeSlide+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  zoomButton.hidden=!slide.src;
}

function openProject(id){const project=projects[id];if(!project)return;activeProject=id;activeSlide=0;renderSlide();if(!modal.open)modal.showModal();document.body.classList.add('modal-open')}
function closeProject(updateUrl=true){if(modal.open)modal.close();document.body.classList.remove('modal-open');activeProject=null;if(updateUrl&&location.hash)history.replaceState(null,'',location.pathname+location.search)}
function syncHash(){const id=decodeURIComponent(location.hash.slice(1));if(projects[id])openProject(id);else if(modal.open)closeProject(false)}

media.addEventListener('wheel',event=>{if(!currentImage())return;event.preventDefault();setScale(view.scale+(event.deltaY<0?.25:-.25))},{passive:false});
media.addEventListener('pointerdown',event=>{const image=currentImage();if(!image||view.scale<=1)return;dragState={id:event.pointerId,startX:event.clientX,startY:event.clientY,x:view.x,y:view.y,moved:false};media.setPointerCapture(event.pointerId);image.classList.add('dragging')});
media.addEventListener('pointermove',event=>{if(!dragState||event.pointerId!==dragState.id)return;const dx=event.clientX-dragState.startX;const dy=event.clientY-dragState.startY;if(Math.abs(dx)+Math.abs(dy)>5)dragState.moved=true;view.x=dragState.x+dx;view.y=dragState.y+dy;applyView()});
function endDrag(event){if(!dragState||event.pointerId!==dragState.id)return;suppressImageClick=dragState.moved;currentImage()?.classList.remove('dragging');if(media.hasPointerCapture(event.pointerId))media.releasePointerCapture(event.pointerId);dragState=null}
media.addEventListener('pointerup',endDrag);media.addEventListener('pointercancel',endDrag);
window.addEventListener('resize',()=>{if(modal.open)applyView()});

document.querySelector('.modal-close').addEventListener('click',()=>closeProject());
document.querySelector('.gallery-prev').addEventListener('click',()=>{activeSlide-=1;renderSlide()});
document.querySelector('.gallery-next').addEventListener('click',()=>{activeSlide+=1;renderSlide()});
zoomButton.addEventListener('click',()=>setScale(view.scale>1?1:2));
modal.addEventListener('cancel',event=>{event.preventDefault();closeProject()});
modal.addEventListener('click',event=>{if(event.target===modal)closeProject()});
window.addEventListener('hashchange',syncHash);
window.addEventListener('keydown',event=>{if(!modal.open)return;if(event.key==='ArrowLeft'){activeSlide-=1;renderSlide()}if(event.key==='ArrowRight'){activeSlide+=1;renderSlide()}});
syncHash();
