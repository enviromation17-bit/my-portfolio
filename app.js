(function(){
  var o1=document.getElementById('o1'),o2=document.getElementById('o2'),o3=document.getElementById('o3');
  var t=0;
  function tick(){
    t+=0.006;
    if(o1){o1.style.transform='translate('+Math.sin(t*0.9)*80+'px,'+Math.cos(t*0.7)*60+'px) scale('+(1+Math.sin(t*0.5)*0.08)+')';}
    if(o2){o2.style.transform='translate('+Math.cos(t*0.8)*120+'px,'+Math.sin(t*0.6)*80+'px) scale('+(1+Math.cos(t*0.4)*0.12)+')';}
    if(o3){o3.style.transform='translate('+Math.sin(t*0.7+1)*100+'px,'+Math.cos(t*0.9+1)*70+'px)';}
    requestAnimationFrame(tick);
  }
  tick();

  var av=document.getElementById('avatarR');
  if(av){
    var up=true,y=0;
    setInterval(function(){
      y=up?-2.2:0;up=!up;
      av.style.transition='transform 1.8s ease-in-out';
      av.style.transform='translateY('+y+'px)';
    },1800);
  }

  var nav=document.getElementById('nav');
  window.addEventListener('scroll',function(){
    if(nav)nav.classList.toggle('scrolled',window.scrollY>24);
  },{passive:true});

  document.querySelectorAll('.mag').forEach(function(btn){
    var wrap=btn;
    wrap.addEventListener('mousemove',function(e){
      var r=wrap.getBoundingClientRect();
      var x=e.clientX-r.left-r.width/2;
      var y=e.clientY-r.top-r.height/2;
      wrap.style.transform='translate('+(x*0.22)+'px,'+(y*0.35)+'px)';
      wrap.style.transition='transform .15s ease-out';
    });
    wrap.addEventListener('mouseleave',function(){
      wrap.style.transform='translate(0,0)';
      wrap.style.transition='transform .5s cubic-bezier(.2,.9,.3,1.2)';
    });
  });

  window.addEventListener('load',function(){
    if(typeof gsap==='undefined')return;
    if(typeof ScrollTrigger!=='undefined')gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-stagger]').forEach(function(el){
      var delay=parseFloat(el.getAttribute('data-delay')||'0');
      var text=el.textContent;
      el.innerHTML=text.split(' ').map(function(w){return '<span class="word" style="display:inline-block;margin-right:0.22em">'+w+'</span>'}).join('');
      gsap.from(el.querySelectorAll('.word'),{
        y:42,filter:'blur(14px)',opacity:0,duration:1,stagger:0.06,delay:delay,ease:'power3.out'
      });
    });

    gsap.from('.lead',{y:28,filter:'blur(12px)',opacity:0,duration:1.1,delay:0.4,ease:'power3.out'});
    gsap.from('.actions',{y:16,opacity:0,duration:0.8,delay:0.55,ease:'power3.out'});
    gsap.from('.agent-card',{y:36,opacity:0,duration:1,delay:0.25,ease:'power3.out'});
    gsap.from('.note-card',{y:20,opacity:0,duration:0.8,delay:0.4,ease:'power3.out'});

    if(typeof ScrollTrigger!=='undefined'){
      gsap.utils.toArray('.flow-card').forEach(function(el,i){
        gsap.from(el,{
          scrollTrigger:{trigger:el,start:'top 90%',once:true},
          y:28,filter:'blur(12px)',opacity:0,duration:0.9,delay:i*0.05,ease:'power3.out'
        });
      });
      gsap.from('.cta-box',{
        scrollTrigger:{trigger:'.cta-box',start:'top 88%',once:true},
        y:32,opacity:0,duration:1,ease:'power3.out'
      });
    }
  });
})();
