const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');

if(menuBtn&&nav){
  menuBtn.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
  }));
}

const contactForm=document.querySelector('.contact-form');

if(contactForm){
  const isEnglish=(document.documentElement.lang||'').toLowerCase().startsWith('en');
  const captchaBox=contactForm.querySelector('.captcha-note');
  const submitButton=contactForm.querySelector('button[type="submit"]');
  const n1=Math.floor(Math.random()*7)+2;
  const n2=Math.floor(Math.random()*7)+2;
  const expected=n1+n2;

  if(captchaBox){
    captchaBox.innerHTML=`
      <div style="width:100%">
        <strong>${isEnglish?'Human verification':'Verifica anti-bot'}</strong>
        <div style="display:flex;align-items:center;gap:12px;margin-top:8px;flex-wrap:wrap">
          <label for="human-check" style="margin:0">${isEnglish?'What is':'Quanto fa'} ${n1} + ${n2}?</label>
          <input id="human-check" type="number" inputmode="numeric" autocomplete="off" required aria-label="${isEnglish?'Human verification answer':'Risposta verifica anti-bot'}" style="width:90px;padding:9px 11px;border:1px solid rgba(18,36,38,.22);border-radius:6px;background:#fff">
        </div>
        <small style="display:block;margin-top:6px">${isEnglish?'Anti-spam protection is also applied to the submission.':'La richiesta è inoltre protetta dai filtri anti-spam del servizio di invio.'}</small>
      </div>`;
  }

  const feedback=document.createElement('div');
  feedback.setAttribute('role','status');
  feedback.setAttribute('aria-live','polite');
  feedback.style.display='none';
  feedback.style.marginTop='16px';
  feedback.style.padding='14px 16px';
  feedback.style.borderRadius='8px';
  feedback.style.fontWeight='600';
  contactForm.appendChild(feedback);

  contactForm.addEventListener('submit',async event=>{
    event.preventDefault();

    const humanInput=contactForm.querySelector('#human-check');
    if(!humanInput||Number(humanInput.value)!==expected){
      feedback.style.display='block';
      feedback.style.background='#fff3cd';
      feedback.style.color='#664d03';
      feedback.textContent=isEnglish?'Please answer the human verification correctly.':'Rispondi correttamente alla verifica anti-bot.';
      if(humanInput) humanInput.focus();
      return;
    }

    const originalButton=submitButton?submitButton.innerHTML:'';
    if(submitButton){
      submitButton.disabled=true;
      submitButton.innerHTML=isEnglish?'Sending…':'Invio in corso…';
    }

    feedback.style.display='none';

    try{
      const data=new FormData(contactForm);
      data.delete('_next');
      data.set('_url',window.location.href.split('#')[0]);

      const endpoint=contactForm.action.replace('https://formsubmit.co/','https://formsubmit.co/ajax/');
      const response=await fetch(endpoint,{
        method:'POST',
        headers:{'Accept':'application/json'},
        body:data
      });

      let result={};
      try{result=await response.json();}catch(e){}

      if(!response.ok||result.success===false){
        throw new Error(result.message||'Submission failed');
      }

      contactForm.reset();
      if(humanInput) humanInput.value='';
      feedback.style.display='block';
      feedback.style.background='#dff2ea';
      feedback.style.color='#114b3a';
      feedback.textContent=isEnglish?'Thank you. Your request has been sent successfully. We will contact you shortly.':'Grazie. La tua richiesta è stata inviata correttamente. Ti ricontatteremo al più presto.';
    }catch(error){
      feedback.style.display='block';
      feedback.style.background='#f8d7da';
      feedback.style.color='#842029';
      feedback.textContent=isEnglish?'The request could not be sent. Please try again or email us directly.':'Non è stato possibile inviare la richiesta. Riprova oppure scrivici direttamente via email.';
    }finally{
      if(submitButton){
        submitButton.disabled=false;
        submitButton.innerHTML=originalButton;
      }
    }
  });
}
