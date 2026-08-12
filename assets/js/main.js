const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}));}
const form=document.querySelector('.form');
if(form){form.addEventListener('submit',e=>{e.preventDefault();const msg=form.dataset.message||'Thank you.';const note=form.querySelector('.form-note');if(note)note.textContent=msg;form.reset();});}
