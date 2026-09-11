(()=>{
  let installed=false;
  function getState(){try{return JSON.parse(localStorage.getItem('SABR_V2_DEMO')||'null')}catch(e){return null}}
  function roleForPin(pin){
    const s=getState(); if(!s)return null;
    const matches=[];
    if(s.settings && String(s.settings.adminPin)===pin) matches.push('admin');
    (s.waiters||[]).forEach(x=>{if(x.active!==false&&String(x.pin)===pin)matches.push('waiter')});
    (s.kitchenStaff||[]).forEach(x=>{if(x.active!==false&&String(x.pin)===pin)matches.push('kitchen')});
    return matches.length===1?matches[0]:matches.length>1?'duplicate':null;
  }
  function install(){
    if(installed)return true;
    document.querySelectorAll('.roles').forEach(x=>x.style.display='none');
    const pin=document.getElementById('pin');
    const btn=document.querySelector('.pinbox .btn.gold');
    if(!pin||!btn||typeof window.login!=='function')return false;
    const original=window.login;
    const go=()=>{
      const p=pin.value.trim();
      const role=roleForPin(p);
      const err=document.getElementById('loginErr');
      const show=(msg)=>{if(err){err.textContent=msg;err.classList.remove('hidden')}};
      if(role==='duplicate'){show('PIN назначен нескольким сотрудникам. Обратитесь к администратору');return}
      if(!role){show('Неверный PIN');return}
      const card=document.querySelector('.rolecard[data-role="'+role+'"]');
      if(card&&typeof window.pickRole==='function')window.pickRole(role,card);
      const loginView=document.getElementById('loginView');
      if(loginView&&!document.getElementById('login'))loginView.id='login';
      try{original.call(window)}catch(e){show('Ошибка входа: '+(e&&e.message?e.message:'неизвестная ошибка'));console.error(e)}
    };
    btn.onclick=go;
    pin.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go()}};
    installed=true;
    return true;
  }
  function boot(){
    if(install())return;
    let n=0;
    const timer=setInterval(()=>{if(install()||++n>100)clearInterval(timer)},100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
