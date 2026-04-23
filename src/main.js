import './style.css';
import html2pdf from 'html2pdf.js';
import { supabase } from './supabase';

// Application State
let state = {
  activeSection: 'personal',
  selectedTemplate: 'modern',
  user: null,
  currentResumeId: null,
  authMode: 'signin',
  data: {
    personal: {
      name: 'Aditya Prakash',
      email: 'aditya@example.com',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      linkedin: 'linkedin.com/in/adityaprakash',
      portfolio: 'adityaprak.ash',
    },
    summary: 'Innovative Senior Software Engineer with over 8 years of experience in AI-driven development and high-performance system architecture. Proven track record of leading cross-functional teams to deliver scalable cloud solutions.',
    experience: [
      {
        company: 'Google',
        role: 'Senior Staff Engineer',
        location: 'California, USA',
        period: '2021 - Present',
        description: 'Pioneering development on Project Antigravity, an advanced AI coding assistant.'
      }
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'Master of Science in Computer Science',
        period: '2016 - 2018',
        description: 'GPA: 4.0/4.0'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'System Design'],
    certifications: [
      { name: 'AWS Solutions Architect Professional', date: '2023' },
      { name: 'Google Cloud Professional MLE', date: '2022' }
    ],
    projects: [
      {
        title: 'Open Source UI Library',
        link: 'github.com/aditya/pastel-ui',
        description: 'A React-based UI library focused on accessibility.'
      }
    ],
    achievements: ['Won Top Coder Challenge 2023', '3 Patents in AI'],
    languages: ['English (Native)', 'Hindi (Native)'],
    interests: ['Photography', 'Marathon Running']
  }
};

// DOM Elements
const accordionEditor = document.getElementById('accordion-editor');
const resumePreview = document.getElementById('resume-preview');
const templateSelector = document.getElementById('template-selector');
const downloadBtn = document.getElementById('download-btn');
const saveBtn = document.getElementById('save-btn');
const dashboardBtn = document.getElementById('dashboard-btn');

// Modal Elements
const authModal = document.getElementById('auth-modal');
const dashboardModal = document.getElementById('dashboard-modal');
const saveModal = document.getElementById('save-modal');
const closeAuth = document.getElementById('close-auth');
const closeDashboard = document.getElementById('close-dashboard');
const resumesList = document.getElementById('resumes-list');
const resumeTitleInput = document.getElementById('resume-title');
const confirmSaveBtn = document.getElementById('confirm-save-btn');

// Auth DOM
const authForm = document.getElementById('auth-form');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const authTitle = document.getElementById('auth-title');
const authSubmit = document.getElementById('auth-submit');
const authSwitchLink = document.getElementById('auth-switch-link');
const authSwitchText = document.getElementById('auth-switch-text');
const userProfile = document.getElementById('user-profile');
const userEmailDisplay = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

const sections = [
  { id: 'personal', title: 'Personal Information', icon: '👤' },
  { id: 'summary', title: 'Professional Summary', icon: '📝' },
  { id: 'experience', title: 'Work Experience', icon: '💼' },
  { id: 'education', title: 'Education', icon: '🎓' },
  { id: 'skills', title: 'Skills', icon: '⚡' },
  { id: 'certifications', title: 'Certifications', icon: '📜' },
  { id: 'projects', title: 'Projects', icon: '🚀' },
  { id: 'achievements', title: 'Achievements', icon: '🏆' },
  { id: 'languages', title: 'Languages', icon: '🌐' },
  { id: 'interests', title: 'Interests', icon: '❤️' }
];

async function init() {
  renderEditor();
  updatePreview();
  setupEventListeners();
  checkSession();
}

async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  updateUserUI(session?.user || null);
}

function updateUserUI(user) {
  state.user = user;
  if (user) {
    userProfile.style.display = 'flex';
    userEmailDisplay.textContent = user.email;
    authModal.classList.remove('active');
  } else {
    userProfile.style.display = 'none';
    state.currentResumeId = null;
  }
}

function setupEventListeners() {
  templateSelector.addEventListener('change', (e) => {
    state.selectedTemplate = e.target.value;
    updatePreview();
  });

  downloadBtn.addEventListener('click', handleDownload);
  
  saveBtn.addEventListener('click', () => {
    if (!state.user) {
      authModal.classList.add('active');
      return;
    }
    resumeTitleInput.value = state.data.personal.name || 'My Resume';
    saveModal.classList.add('active');
  });

  confirmSaveBtn.addEventListener('click', performSave);
  dashboardBtn.addEventListener('click', openDashboard);
  
  closeAuth.addEventListener('click', () => authModal.classList.remove('active'));
  closeDashboard.addEventListener('click', () => dashboardModal.classList.remove('active'));

  authSwitchLink.addEventListener('click', (e) => {
    e.preventDefault();
    state.authMode = state.authMode === 'signin' ? 'signup' : 'signin';
    authTitle.textContent = state.authMode === 'signin' ? 'Sign In to Download' : 'Create Account';
    authSubmit.textContent = state.authMode === 'signin' ? 'Continue' : 'Create Account';
    authSwitchText.textContent = state.authMode === 'signin' ? "Don't have an account?" : "Already have an account?";
    authSwitchLink.textContent = state.authMode === 'signin' ? 'Sign Up' : 'Sign In';
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.style.display = 'none';
    authSubmit.disabled = true;
    authSubmit.textContent = 'Processing...';

    const email = authEmail.value;
    const password = authPassword.value;

    try {
      let result;
      if (state.authMode === 'signin') {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) {
        authError.textContent = result.error.message;
        authError.style.display = 'block';
      } else {
        if (state.authMode === 'signup' && !result.data.session) {
            authError.textContent = 'Success! Please check your email for the confirmation link.';
            authError.style.display = 'block';
            authError.style.color = '#4CAF50';
        } else {
            updateUserUI(result.data.user);
        }
      }
    } catch (err) {
      authError.textContent = 'An unexpected error occurred.';
      authError.style.display = 'block';
    } finally {
      authSubmit.disabled = false;
      authSubmit.textContent = state.authMode === 'signin' ? 'Continue' : 'Create Account';
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    updateUserUI(null);
  });
}

async function performSave() {
  const title = resumeTitleInput.value.trim() || 'My Resume';
  confirmSaveBtn.disabled = true;
  confirmSaveBtn.textContent = 'Generating PDF & Uploading...';

  try {
    // 1. Generate PDF Blob
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: 10,
      filename: `${title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    const blob = await html2pdf().set(opt).from(element).toPdf().get('pdf').output('blob');

    // 2. Prepare Database Record (get/create ID first)
    let resumeId = state.currentResumeId;
    if (!resumeId) {
        const { data, error } = await supabase
            .from('resumes')
            .insert([{ 
                user_id: state.user.id, 
                title: title, 
                resume_data: state.data, 
                template: state.selectedTemplate 
            }])
            .select()
            .single();
        if (error) throw error;
        resumeId = data.id;
        state.currentResumeId = resumeId;
    }

    // 3. Upload to Storage
    const filePath = `${state.user.id}/${resumeId}.pdf`;
    const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, blob, { upsert: true });

    if (uploadError) throw uploadError;

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

    // 5. Update Database Record with PDF URL
    const { error: updateError } = await supabase
        .from('resumes')
        .update({ 
            title: title,
            resume_data: state.data,
            template: state.selectedTemplate,
            pdf_url: publicUrl,
            updated_at: new Date()
        })
        .eq('id', resumeId);

    if (updateError) throw updateError;
    
    confirmSaveBtn.textContent = 'Saved Successfully!';
    setTimeout(() => {
      saveModal.classList.remove('active');
      confirmSaveBtn.disabled = false;
      confirmSaveBtn.textContent = 'Save Version';
      saveBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Saved';
    }, 1000);

  } catch (err) {
    console.error(err);
    alert('Failed to save resume: ' + err.message);
    confirmSaveBtn.textContent = 'Retry Save';
    confirmSaveBtn.disabled = false;
  }
}

async function openDashboard() {
  dashboardModal.classList.add('active');
  loadResumes();
}

async function loadResumes() {
  resumesList.innerHTML = '<div class="loading-spinner">Fetching your resumes...</div>';
  
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    resumesList.innerHTML = `<div class="error">Error loading resumes: ${error.message}</div>`;
    return;
  }

  if (data.length === 0) {
    resumesList.innerHTML = '<div class="loading-spinner">No saved resumes found. Start creating!</div>';
    return;
  }

  resumesList.innerHTML = data.map(resume => `
    <div class="resume-card" onclick="loadResumeById('${resume.id}')">
      <div>
        <div class="resume-card-title">${resume.title}</div>
        <div class="resume-card-date">Modified: ${new Date(resume.updated_at).toLocaleDateString()}</div>
      </div>
      <div class="resume-card-actions">
        ${resume.pdf_url ? `<a href="${resume.pdf_url}" target="_blank" class="btn-ghost" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; color: var(--primary); text-decoration: none;" onclick="event.stopPropagation()">View PDF</a>` : ''}
        <button class="btn-ghost" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; color: #ff5252;" onclick="event.stopPropagation(); deleteResume('${resume.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

window.loadResumeById = async (id) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    alert('Error loading resume: ' + error.message);
    return;
  }

  state.data = data.resume_data;
  state.selectedTemplate = data.template;
  state.currentResumeId = data.id;
  
  templateSelector.value = state.selectedTemplate;
  renderEditor();
  updatePreview();
  dashboardModal.classList.remove('active');
  saveBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Update';
};

window.deleteResume = async (id) => {
  if (!confirm('Are you sure you want to delete this resume?')) return;
  
  try {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);
      if (dbError) throw dbError;

      // 2. Delete from storage (optional but good practice)
      const filePath = `${state.user.id}/${id}.pdf`;
      await supabase.storage.from('resumes').remove([filePath]);

      if (state.currentResumeId === id) {
          state.currentResumeId = null;
          saveBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save';
      }
      loadResumes();
  } catch (err) {
      alert('Error deleting resume: ' + err.message);
  }
};

async function handleDownload() {
  if (!state.user) {
    authModal.classList.add('active');
    return;
  }

  downloadBtn.innerHTML = 'Generating...';
  downloadBtn.disabled = true;
  const element = document.getElementById('resume-preview');
  const opt = {
    margin: 10,
    filename: `${state.data.personal.name.replace(/\s+/g, '_')}_Resume.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save().then(() => {
    downloadBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download';
    downloadBtn.disabled = false;
  });
}

function renderEditor() {
  accordionEditor.innerHTML = sections.map(section => `
    <div class="accordion-item ${state.activeSection === section.id ? 'active' : ''}" id="accordion-${section.id}">
      <div class="accordion-header" onclick="toggleAccordion('${section.id}')">
        <div class="accordion-title">
          <span style="font-style: normal;">${section.icon}</span>
          <span>${section.title}</span>
        </div>
        <svg class="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      <div class="accordion-content">
        ${renderSectionForm(section.id)}
      </div>
    </div>
  `).join('');
  attachInputListeners();
}

window.toggleAccordion = (id) => {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    if (item.id === `accordion-${id}`) {
      const isActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
        state.activeSection = id;
      } else {
        state.activeSection = null;
      }
    }
  });
};

function renderSectionForm(section) {
  let html = '';
  if (section === 'personal') {
    html = `
      <div class="field-group">
        <div class="input-field"><label>Full Name</label><input type="text" data-key="personal.name" value="${state.data.personal.name}"></div>
        <div class="input-field"><label>Email</label><input type="email" data-key="personal.email" value="${state.data.personal.email}"></div>
      </div>
      <div class="field-group">
        <div class="input-field"><label>Phone</label><input type="text" data-key="personal.phone" value="${state.data.personal.phone}"></div>
        <div class="input-field"><label>Location</label><input type="text" data-key="personal.location" value="${state.data.personal.location}"></div>
      </div>
      <div class="field-group">
        <div class="input-field"><label>LinkedIn</label><input type="text" data-key="personal.linkedin" value="${state.data.personal.linkedin}"></div>
        <div class="input-field"><label>Portfolio</label><input type="text" data-key="personal.portfolio" value="${state.data.personal.portfolio}"></div>
      </div>
    `;
  } else if (section === 'summary') {
    html = `<div class="input-field"><label>Professional Summary</label><textarea rows="5" data-key="summary">${state.data.summary}</textarea></div>`;
  } else if (['experience', 'education', 'projects', 'certifications'].includes(section)) {
    html = state.data[section].map((item, index) => `
      <div style="background: var(--bg-sidebar); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; position: relative; border: 1px solid rgba(0,0,0,0.05);">
        <button class="btn-ghost" style="position: absolute; top: 0.75rem; right: 0.75rem; color: #ff5252; font-size: 1.2rem;" onclick="removeItem('${section}', ${index})">✕</button>
        ${renderDynamicFields(section, item, index)}
      </div>
    `).join('');
    html += `<button class="btn btn-outline" style="width: 100%; border-style: dashed;" onclick="addItem('${section}')">+ Add New ${section.slice(0, -1)}</button>`;
  } else {
    html = `
      <div class="input-field">
        <label>${section.charAt(0).toUpperCase() + section.slice(1)} (Separate by commas)</label>
        <textarea rows="4" data-key="${section}" data-type="list" placeholder="React, Node.js, Python...">${state.data[section].join(', ')}</textarea>
      </div>
    `;
  }
  return html;
}

function renderDynamicFields(type, item, index) {
  if (type === 'experience') {
    return `
      <div class="field-group"><div class="input-field"><label>Company</label><input type="text" data-key="experience.${index}.company" value="${item.company}"></div><div class="input-field"><label>Role</label><input type="text" data-key="experience.${index}.role" value="${item.role}"></div></div>
      <div class="field-group"><div class="input-field"><label>Period</label><input type="text" data-key="experience.${index}.period" value="${item.period}"></div><div class="input-field"><label>Location</label><input type="text" data-key="experience.${index}.location" value="${item.location}"></div></div>
      <div class="input-field"><label>Description</label><textarea rows="3" data-key="experience.${index}.description">${item.description}</textarea></div>`;
  } else if (type === 'education') {
    return `
      <div class="field-group"><div class="input-field"><label>School</label><input type="text" data-key="education.${index}.school" value="${item.school}"></div><div class="input-field"><label>Degree</label><input type="text" data-key="education.${index}.degree" value="${item.degree}"></div></div>
      <div class="field-group"><div class="input-field"><label>Period</label><input type="text" data-key="education.${index}.period" value="${item.period}"></div><div class="input-field"><label>Description/GPA</label><input type="text" data-key="education.${index}.description" value="${item.description}"></div></div>`;
  } else if (type === 'projects') {
    return `
      <div class="field-group"><div class="input-field"><label>Title</label><input type="text" data-key="projects.${index}.title" value="${item.title}"></div><div class="input-field"><label>Link</label><input type="text" data-key="projects.${index}.link" value="${item.link}"></div></div>
      <div class="input-field"><label>Description</label><textarea rows="2" data-key="projects.${index}.description">${item.description}</textarea></div>`;
  } else if (type === 'certifications') {
    return `
      <div class="field-group"><div class="input-field"><label>Certificate Name</label><input type="text" data-key="certifications.${index}.name" value="${item.name}"></div><div class="input-field"><label>Date</label><input type="text" data-key="certifications.${index}.date" value="${item.date}"></div></div>`;
  }
}

function attachInputListeners() {
  accordionEditor.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', (e) => {
      const key = e.target.dataset.key;
      if (!key) return;
      const type = e.target.dataset.type;
      let value = e.target.value;
      if (type === 'list') {
        value = value.split(',').map(s => s.trim()).filter(s => s !== '');
      }
      updateState(key, value);
      updatePreview();
    });
    input.addEventListener('click', (e) => e.stopPropagation());
  });
}

function updateState(path, value) {
  const parts = path.split('.');
  let current = state.data;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) return;
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

window.addItem = (type) => {
  const newItem = type === 'experience' ? { company: '', role: '', location: '', period: '', description: '' }
                : type === 'education' ? { school: '', degree: '', period: '', description: '' }
                : type === 'certifications' ? { name: '', date: '' }
                : { title: '', link: '', description: '' };
  state.data[type].push(newItem);
  renderEditor();
  updatePreview();
};

window.removeItem = (type, index) => {
  state.data[type].splice(index, 1);
  renderEditor();
  updatePreview();
};

function updatePreview() {
  const d = state.data;
  if (state.selectedTemplate === 'minimal') {
    renderMinimalTemplate(d);
  } else {
    renderModernTemplate(d);
  }
}

function renderMinimalTemplate(d) {
  resumePreview.style.fontFamily = "'Inter', sans-serif";
  resumePreview.style.padding = "40px";
  resumePreview.style.color = "#000";
  
  resumePreview.innerHTML = `
    <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 2rem;">
      <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">${d.personal.name.toUpperCase()}</h1>
      <p>${d.personal.email}  |  ${d.personal.phone}  |  ${d.personal.location}</p>
      <p style="font-size: 0.85rem;">${d.personal.linkedin}  •  ${d.personal.portfolio}</p>
    </div>

    <section style="margin-bottom: 1.5rem;">
      <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 0.5rem; font-size: 1.1rem;">Summary</h3>
      <p style="text-align: justify; font-size: 0.95rem;">${d.summary}</p>
    </section>

    <section style="margin-bottom: 1.5rem;">
      <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 1rem; font-size: 1.1rem;">Experience</h3>
      ${d.experience.map(exp => `
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 700;"><span>${exp.company.toUpperCase()}</span><span>${exp.period}</span></div>
          <div style="display: flex; justify-content: space-between; font-style: italic; font-size: 0.9rem;"><span>${exp.role}</span><span>${exp.location}</span></div>
          <p style="font-size: 0.95rem; margin-top: 5px;">${exp.description}</p>
        </div>`).join('')}
    </section>

    <section style="margin-bottom: 1.5rem;">
      <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 1rem; font-size: 1.1rem;">Education</h3>
      ${d.education.map(edu => `
        <div style="margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 700;"><span>${edu.school.toUpperCase()}</span><span>${edu.period}</span></div>
          <p style="font-size: 0.95rem;">${edu.degree} ${edu.description ? `(${edu.description})` : ''}</p>
        </div>`).join('')}
    </section>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      <section>
        <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 0.5rem; font-size: 1.1rem;">Skills</h3>
        <p style="font-size: 0.95rem;">${d.skills.join(', ')}</p>
      </section>
      <section>
        <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 0.5rem; font-size: 1.1rem;">Certifications</h3>
        <p style="font-size: 0.95rem;">${d.certifications.map(c => `${c.name} (${c.date})`).join(', ')}</p>
      </section>
    </div>
  `;
}

function renderModernTemplate(d) {
  resumePreview.style.fontFamily = "'Outfit', sans-serif";
  resumePreview.style.padding = "0";
  resumePreview.style.color = "#2D3436";
  
  resumePreview.innerHTML = `
    <div style="display: flex; height: 100%; min-height: 1120px;">
      <!-- Sidebar -->
      <div style="width: 33%; background: #F3E5F5; padding: 50px 25px; display: flex; flex-direction: column; gap: 2.5rem;">
        <div>
          <h1 style="font-size: 2rem; color: #4A148C; margin-bottom: 1.5rem; font-weight: 700; line-height: 1.1;">${d.personal.name}</h1>
          <div style="font-size: 0.8rem; color: #6A1B9A; display: flex; flex-direction: column; gap: 0.6rem;">
            <span>📧 ${d.personal.email}</span>
            <span>📞 ${d.personal.phone}</span>
            <span>📍 ${d.personal.location}</span>
            <span style="word-break: break-all;">🔗 ${d.personal.linkedin}</span>
          </div>
        </div>

        <section>
          <h3 style="color: #4A148C; border-bottom: 2px solid #BA68C8; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1.25rem; font-weight: 700; letter-spacing: 1px;">Skills</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${d.skills.map(s => `<span style="background: white; padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; color: #7B1FA2; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">${s}</span>`).join('')}
          </div>
        </section>

        <section>
          <h3 style="color: #4A148C; border-bottom: 2px solid #BA68C8; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1.25rem; font-weight: 700; letter-spacing: 1px;">Education</h3>
          ${d.education.map(edu => `
            <div style="margin-bottom: 1.25rem;">
              <div style="font-weight: 700; font-size: 0.85rem; color: #4A148C;">${edu.school}</div>
              <div style="font-size: 0.75rem; color: #7B1FA2;">${edu.degree}</div>
              <div style="font-size: 0.7rem; color: #9C27B0; font-weight: 600;">${edu.period}</div>
            </div>`).join('')}
        </section>

        <section>
          <h3 style="color: #4A148C; border-bottom: 2px solid #BA68C8; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1.25rem; font-weight: 700; letter-spacing: 1px;">Languages</h3>
          <p style="font-size: 0.8rem; color: #6A1B9A;">${d.languages.join(' • ')}</p>
        </section>
      </div>

      <!-- Main -->
      <div style="width: 67%; padding: 50px 40px; display: flex; flex-direction: column; gap: 2.5rem; background: white;">
        <section>
          <h3 style="color: #4A148C; font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; border-left: 4px solid #E1BEE7; padding-left: 1rem;">Profile</h3>
          <p style="font-size: 0.95rem; line-height: 1.7; color: #444; text-align: justify;">${d.summary}</p>
        </section>

        <section>
          <h3 style="color: #4A148C; font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; border-left: 4px solid #BBDEFB; padding-left: 1rem;">Experience</h3>
          ${d.experience.map(exp => `
            <div style="margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                <h4 style="font-size: 1rem; color: #2D3436; font-weight: 700;">${exp.company}</h4>
                <span style="font-size: 0.75rem; color: #4A148C; font-weight: 700; background: #E1BEE7; padding: 2px 8px; border-radius: 4px;">${exp.period}</span>
              </div>
              <div style="color: #6A1B9A; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">${exp.role} | ${exp.location}</div>
              <p style="font-size: 0.9rem; line-height: 1.6; color: #636E72; white-space: pre-line;">${exp.description}</p>
            </div>`).join('')}
        </section>

        <section>
          <h3 style="color: #4A148C; font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; border-left: 4px solid #C8E6C9; padding-left: 1rem;">Key Projects</h3>
          ${d.projects.map(proj => `
            <div style="margin-bottom: 1.5rem;">
              <div style="font-weight: 700; font-size: 0.95rem; display: flex; justify-content: space-between;">
                <span>${proj.title}</span>
                <span style="font-weight: 400; font-size: 0.75rem; color: #7B1FA2;">${proj.link}</span>
              </div>
              <p style="font-size: 0.85rem; color: #636E72; margin-top: 4px;">${proj.description}</p>
            </div>`).join('')}
        </section>
        
        <section>
          <h3 style="color: #4A148C; font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; border-left: 4px solid #FFECB3; padding-left: 1rem;">Achievements</h3>
          <ul style="font-size: 0.9rem; color: #444; line-height: 1.6; padding-left: 1.2rem;">
            ${d.achievements.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </section>
      </div>
    </div>
  `;
}

init();
