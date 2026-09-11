(()=>{
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
    document.querySelectorAll('.roles').forEach(x=>x.style.display='none');
    const pin=document.getElementById('pin'); const btn=document.querySelector('#loginView .pinbox .btn.gold');
    if(!pin||!btn||typeof window.login!=='function')return;
    const original=window.login;
    const go=()=>{
      const p=pin.value.trim(); const role=roleForPin(p); const err=document.getElementById('loginErr');
      if(role==='duplicate'){if(err){err.textContent='PIN назначен нескольким сотрудникам. Обратитесь к администратору';err.classList.remove('hidden')}return}
      if(!role){if(err){err.textContent='Неверный PIN';err.classList.remove('hidden')}return}
      const card=document.querySelector('.rolecard[data-role="'+role+'"]');
      if(card&&typeof window.pickRole==='function')window.pickRole(role,card);
      const loginView=document.getElementById('loginView');
      if(loginView && !document.getElementById('login')) loginView.id='login';
      original.call(window);
    };
    btn.onclick=go;
    pin.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go()}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0));else setTimeout(install,0);
})();
