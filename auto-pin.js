(()=>{
  let installed=false;
  function install(){
    if(installed)return true;
    const pin=document.getElementById('pin');
    const btn=document.querySelector('.pinbox .btn.gold');
    if(!pin||!btn||typeof state==='undefined')return false;
    const loginView=document.getElementById('loginView');
    if(loginView)loginView.id='login';
    document.querySelectorAll('.roles').forEach(x=>x.style.display='none');
    window.login=function(){
      const p=pin.value.trim();
      const err=document.getElementById('loginErr');
      if(err)err.textContent='';
      if(!/^\\d{4}$/.test(p)){if(err)err.textContent='Введите 4-значный PIN';return}
      const admin=String(state.settings.adminPin)===p;
      const wm=(state.waiters||[]).filter(x=>x.active!==false&&String(x.pin)===p);
      const km=(state.kitchenStaff||[]).filter(x=>x.active!==false&&String(x.pin)===p);
      const matches=(admin?['admin']:[]).concat(wm.length?['waiter']:[],km.length?['kitchen']:[]);
      if(matches.length===0){if(err)err.textContent='Неверный PIN';return}
      if(matches.length>1){if(err)err.textContent='Этот PIN назначен нескольким сотрудникам. Назначьте каждому свой PIN.';return}
      currentWaiter=null;currentKitchen=null;currentRole=matches[0];
      if(currentRole==='waiter'){
        currentWaiter=wm[0];
        sessionStorage.setItem('sabr_role','waiter');sessionStorage.setItem('sabr_waiter_id',String(currentWaiter.id));sessionStorage.removeItem('sabr_kitchen_id');
      }else if(currentRole==='kitchen'){
        currentKitchen=km[0];
        if(typeof ensureAudio==='function')ensureAudio();
        knownKitchenOrders=new Set(state.orders.map(o=>o.id));
        knownKitchenVersions=new Map(state.orders.map(o=>[o.id,o.updatedAt||o.createdAt]));
        sessionStorage.setItem('sabr_role','kitchen');sessionStorage.setItem('sabr_kitchen_id',String(currentKitchen.id));sessionStorage.removeItem('sabr_waiter_id');
      }else{
        sessionStorage.setItem('sabr_role','admin');sessionStorage.removeItem('sabr_waiter_id');sessionStorage.removeItem('sabr_kitchen_id');
      }
      pin.value='';
      if(typeof setupRole==='function')setupRole();
    };
    pin.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();window.login()}};
    btn.onclick=()=>window.login();
    installed=true;
    return true;
  }
  function boot(){if(install())return;let n=0;const t=setInterval(()=>{if(install()||++n>100)clearInterval(t)},100)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
