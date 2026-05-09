// CURSOR
const cd=document.getElementById('cd'),cr=document.getElementById('cr');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px'});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;cr.style.left=rx+'px';cr.style.top=ry+'px';requestAnimationFrame(loop)})();
document.querySelectorAll('a,button,.svc-card,.track,.art-card,.ct-method').forEach(el=>{
  el.addEventListener('mouseenter',()=>cr.classList.add('h'));
  el.addEventListener('mouseleave',()=>cr.classList.remove('h'));
});

// AMBIENT
const cv=document.getElementById('ambient-canvas'),cx=cv.getContext('2d');
let W,H,pts=[];
function rs(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight}
rs();window.addEventListener('resize',rs);
class P{constructor(){this.r()}r(){this.x=Math.random()*W;this.y=Math.random()*H;this.rad=Math.random()*1.4+.2;this.vx=(Math.random()-.5)*.14;this.vy=(Math.random()-.5)*.14;this.a=Math.random()*.4+.08;this.g=Math.random()>.65}update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W||this.y<0||this.y>H)this.r()}draw(){cx.beginPath();cx.arc(this.x,this.y,this.rad,0,Math.PI*2);cx.fillStyle=this.g?`rgba(46,204,113,${this.a})`:`rgba(160,180,190,${this.a*.45})`;cx.fill()}}
for(let i=0;i<110;i++)pts.push(new P());
(function ap(){cx.clearRect(0,0,W,H);pts.forEach(p=>{p.update();p.draw()});const g=cx.createRadialGradient(W/2,H*.12,0,W/2,H*.
