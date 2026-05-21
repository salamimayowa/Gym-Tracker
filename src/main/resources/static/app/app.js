const API_BASE = '/api/v1';

function $(sel){ return document.querySelector(sel); }
function showPage(id){ document.querySelectorAll('.page').forEach(p=>p.style.display='none'); document.getElementById(id).style.display='block'; }

// Navigation
$('#nav-home').onclick = ()=> showPage('home');
$('#nav-register').onclick = ()=> showPage('register');
$('#nav-login').onclick = ()=> showPage('login');
$('#nav-book').onclick = ()=> showPage('book');
$('#nav-view').onclick = ()=> { showPage('view'); loadSessions(); };
$('#nav-workout').onclick = ()=> showPage('workout');
$('#nav-logout').onclick = ()=> { localStorage.removeItem('token'); updateAuthUI(); showPage('home'); };

function updateAuthUI(){ const token = localStorage.getItem('token'); if(token){ $('#nav-logout').style.display='inline-block'; } else { $('#nav-logout').style.display='none'; } }
updateAuthUI();

// Helpers
async function api(path, opts={}){
  const token = localStorage.getItem('token');
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  if(token){ opts.headers['Authorization'] = 'Bearer ' + token; }
  const res = await fetch(API_BASE + path, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch(e){ return text; }
}

// Register
$('#registerForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const form = e.target;
  const body = {
    fullName: form.fullName.value,
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
    gender: form.gender.value,
    dob: form.dob.value
  };
  const result = await api('/register',{method:'POST', body: JSON.stringify(body)});
  $('#registerResult').textContent = JSON.stringify(result, null, 2);
});

// Login
$('#loginForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const form = e.target;
  const body = { email: form.email.value, password: form.password.value };
  const result = await api('/login',{method:'POST', body: JSON.stringify(body)});
  $('#loginResult').textContent = JSON.stringify(result, null, 2);
  if(result && result.token){ localStorage.setItem('token', result.token); updateAuthUI(); }
});

// Book session
$('#bookForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const form = e.target;
  const dt = form.startTime.value; // e.g. 2026-05-18T13:45
  // convert to yyyy-MM-dd'T'HH:mm:ss
  const startTime = dt ? dt + ':00' : null;
  const body = { startTime };
  const result = await api('/bookSession',{method:'POST', body: JSON.stringify(body)});
  $('#bookResult').textContent = JSON.stringify(result, null, 2);
});

// View sessions
async function loadSessions(){
  $('#viewResult').textContent = 'Loading...';
  const result = await api('/view',{method:'GET'});
  $('#viewResult').textContent = JSON.stringify(result, null, 2);
}
$('#refreshSessions').addEventListener('click', loadSessions);

// Create workout
$('#workoutForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const form = e.target;
  const body = {
    exerciseName: form.exerciseName.value,
    targetReps: parseInt(form.targetReps.value,10),
    sets: parseInt(form.sets.value,10),
    workoutDate: form.workoutDate.value
  };
  const result = await api('/workout',{method:'POST', body: JSON.stringify(body)});
  $('#workoutResult').textContent = JSON.stringify(result, null, 2);
});

// Auto-show home
showPage('home');

// Simple check: try dummy endpoint to verify backend connection
(async ()=>{
  try{
    const d = await api('/dummy',{method:'GET'});
    console.log('API dummy:', d);
  }catch(e){ console.warn('Could not reach backend:', e); }
})();
