import './style.css';
import html2pdf from 'html2pdf.js';
import { supabase } from './supabase';

// Application State
let state = {
  activeSection: 'personal',
  selectedTemplate: 'executive',
  user: null,
  currentResumeId: null,
  authMode: 'signin',
  data: {
    sectionVisibility: {
      personal: true,
      education: true,
      academicAchievements: true,
      workExperience: true,
      internships: true,
      projectsResearch: true,
      positionsOfResponsibility: true,
      extraCurricular: true,
      summary: true,
      skills: true
    },
    customSections: [],
    personal: {
      name: 'Aditya Prakash',
      subtitle: 'Male, 27 Years',
      institute: 'Indian Institute of Management Indore',
      contact: 'Tel: 0731 – 2439661-63 E-mail: placement@iimidr.ac.in',
      email: 'aditya@example.com',
      phone: '+91 98765 43210',
      location: 'Lucknow / Indore, India',
      linkedin: 'linkedin.com/in/adityaprakash',
      portfolio: 'adityaprak.ash',
    },
    summary: 'Experienced Software Engineer and MBA candidate at IIM Indore with 55 months of experience at Cognizant building enterprise healthcare and scalable backend solutions.',
    education: [
      {
        degree: 'MBA',
        school: 'Indian Institute Of Management, Indore',
        description: '-',
        period: '2026'
      },
      {
        degree: 'B.Tech (CSE)',
        school: 'DIT University',
        description: '86.80 %',
        period: '2019'
      },
      {
        degree: 'Class XII(CBSE)',
        school: 'Kendriya Vidyalaya, Aliganj, Lucknow',
        description: '90.83 %',
        period: '2014'
      },
      {
        degree: 'Class X(CBSE)',
        school: 'Kendriya Vidyalaya, Aliganj, Lucknow',
        description: '95.00 %',
        period: '2012'
      }
    ],
    academicAchievements: [
      {
        text: 'Earned <b>top 3 grades in 49 out of 57 subjects</b> during undergraduate studies, demonstrating <b>consistent academic excellence</b>',
        year: '2019'
      },
      {
        text: 'Garnered the <b>Star of the Week award</b> for <b>Exemplary Behaviour and Academic Excellence</b> in assessments during Python training by RCPL',
        year: '2017'
      },
      {
        text: '<b>Excelled in comprehensive Python training</b> with an <b>A+ grade</b>, showcasing advanced proficiency and <b>unwavering commitment</b>',
        year: '2017'
      },
      {
        text: '<b>Demonstrated proficiency in Core Java with Advanced Java</b> during training at RCPL Summer Training Nodal Center, earning an <b>A+ grade</b>',
        year: '2017'
      },
      {
        text: 'Obtained a <b>Certificate of Merit</b> for successfully completing <b>Java Programming course</b> with a <b>Distinction</b>, issued by Aptech',
        year: '2016'
      },
      {
        text: "<b>Achieved 1st place</b> in the competitive <b>'Code-A-Thon'</b> event hosted by the <b>CSI DITU Student Chapter</b> during my freshman year of college",
        year: '2016'
      }
    ],
    experienceSummary: {
      totalMonths: '55 Months',
      company: 'COGNIZANT TECHNOLOGY SOLUTIONS',
      role: 'Software Engineer',
      period: "Nov'19 - Jun'24",
      projects: [
        {
          title: 'Adverse Event Reporting Interface between EDC and Security',
          bullets: [
            '<b>Played a key role in developing 2 applications</b> for a leading pharmaceutical company, maintaining high-quality standards',
            '<b>Successfully coordinated with a cross-functional team of 20 members</b> to complete a critical project ahead of schedule',
            '<b>Mentored 2-member offshore team</b>, steering them through project complexities and ensuring timely task completions',
            '<b>Implemented key automation workflows</b>, reducing system errors by <b>40%</b> and substantially increasing overall efficiency'
          ]
        },
        {
          title: 'Metadata Repository Management System',
          bullets: [
            '<b>Orchestrated the design, execution, and upkeep of a scalable backend system</b> to ensure high performance and reliability',
            '<b>Enhanced the capabilities of an existing Metadata Repository Management application by 30%</b> through Java changes',
            '<b>Programmed SPARQL queries to enhance performance by 40%</b>, optimizing RDF data manipulation for efficient retrieval'
          ]
        },
        {
          title: 'Insurance Management System',
          bullets: [
            'Developed and seamlessly incorporated <b>10+ new functionalities</b> using Java technologies, enhancing established systems',
            'Upgraded the functionality of regulatory modules, <b>achieving a significant 15% reduction</b> in compliance-related issues',
            'Designed and deployed intuitive user interfaces using <b>JavaScript</b>, leading to enhancement in the interface functionality'
          ]
        }
      ],
      achievements: [
        '<b>Excelled as a Jr. Software Engineer</b>, earning a <b>top rating of 5</b> for outstanding performance and exceptional technical skills',
        '<b>Received commendations from clients</b> for delivering highly robust and reliable software solutions under strict deadlines'
      ]
    },
    internship: {
      company: 'COGNIZANT TECHNOLOGY SOLUTIONS,\nHyderabad',
      role: 'Programmer Analyst Trainee',
      period: "Jul'19 - Nov'19",
      bullets: [
        'Developed a full-stack e-commerce web application, leveraging various front-end and back-end technologies resulting in a <b>scalable platform</b>',
        'Enhanced the UI of the e-commerce platform, resulting in a <b>10% increase</b> in time spent browsing products on an average during user testing'
      ]
    },
    projectsResearch: {
      category: 'Academic Projects',
      items: [
        {
          title: 'DITU Assistant',
          period: "Aug'18-Apr'19",
          bullets: [
            'Developed a centralised platform enabling over <b>50+ faculty members</b> to curate and manage their question banks autonomously',
            '<b>Implemented a feature enabling effortless creation of exam papers in 4-5 clicks</b> through intuitive click-based design'
          ]
        },
        {
          title: 'Face Recognition System',
          period: "Aug'17-Apr'18",
          bullets: [
            '<b>Engineered a web application with facial recognition technology</b> to retrieve individual details with an <b>accuracy of 95%</b>',
            '<b>Trained a Face Recognition Model using data from over 1000+ images</b>, employing Data Collection and Pre-processing'
          ]
        }
      ]
    },
    positionsOfResponsibility: {
      category: 'DIT University',
      items: [
        {
          title: 'Campus Ambassador, RCPL',
          period: "Aug'18-May'19",
          bullets: [
            'Coordinated <b>10+ informative student webinars</b> providing students with a comprehensive practical insight',
            '<b>Hosted 2+ programming language webinars</b>, significantly enhancing the knowledge of over <b>300+ students</b>'
          ]
        },
        {
          title: 'External Affairs Co-Head, CSI DITU Student Chapter',
          period: "Aug'17-May'18",
          bullets: [
            'Orchestrated <b>5+ successful intra-college events</b> and workshops, encouraging strong community engagement',
            '<b>Managed a budget of INR 50K</b>, ensuring efficient allocation of funds for organising a variety of events and workshops'
          ]
        }
      ]
    },
    extraCurricular: [
      {
        category: 'Social Service',
        bullets: [
          "Delivered interactive lessons to over <b>100+ rural students</b> as part of Cognizant's Virtu(e)al Teacher program initiative",
          'Led a <b>Road Safety Awareness campaign</b>, educating over <b>500+ office employees</b> about the importance of road safety'
        ]
      },
      {
        category: 'Cultural Event',
        bullets: [
          'Organised <b>2 major coding events</b> and supervised various events as <b>Technical Event Coordinator</b> in Youthopia 2016'
        ]
      },
      {
        category: 'Certifications',
        bullets: [
          'Earned the <b>Six Sigma White Belt certification</b> from the C.S.S.C, demonstrating proficiency in methodologies',
          'Acquired a certificate for successfully completing the <b>BCG Introduction to Strategy Consulting Job Simulation</b>',
          'Successfully completed <b>Introduction to Data Analysis using Microsoft Excel</b> course offered through Coursera'
        ]
      },
      {
        category: 'Interests',
        bullets: [
          '<b>Sketching:</b> Enjoy creating detailed pencil sketches, especially exploring advanced hyper-realism techniques'
        ]
      }
    ],
    // Backwards compatibility with modern and minimal templates
    experience: [
      {
        company: 'COGNIZANT TECHNOLOGY SOLUTIONS',
        role: 'Software Engineer',
        location: 'Hyderabad, India',
        period: "Nov'19 - Jun'24",
        description: 'Played a key role in developing 2 applications for a leading pharmaceutical company.\nOrchestrated the design, execution, and upkeep of a scalable backend system.\nDeveloped and seamlessly incorporated 10+ new functionalities using Java technologies.'
      }
    ],
    skills: ['Java', 'Python', 'SPARQL', 'RDF', 'JavaScript', 'SQL', 'System Architecture'],
    certifications: [
      { name: 'Six Sigma White Belt (C.S.S.C)', date: '2023' },
      { name: 'BCG Introduction to Strategy Consulting', date: '2023' },
      { name: 'Data Analysis using Excel (Coursera)', date: '2022' }
    ],
    projects: [
      {
        title: 'DITU Assistant',
        link: "Aug'18 - Apr'19",
        description: 'Centralised platform enabling 50+ faculty members to curate question banks and generate exam papers.'
      },
      {
        title: 'Face Recognition System',
        link: "Aug'17 - Apr'18",
        description: 'Web application with facial recognition technology retrieving details with 95% accuracy using 1000+ images.'
      }
    ],
    achievements: [
      'Earned top 3 grades in 49 out of 57 subjects during undergraduate studies (2019)',
      'Star of the Week award for Exemplary Behaviour and Academic Excellence by RCPL (2017)',
      'Excelled in comprehensive Python training with an A+ grade (2017)',
      'Demonstrated proficiency in Core Java with Advanced Java at RCPL with A+ grade (2017)',
      'Certificate of Merit for Java Programming course with Distinction by Aptech (2016)',
      "1st place in competitive 'Code-A-Thon' event hosted by CSI DITU Student Chapter (2016)"
    ],
    languages: ['English', 'Hindi'],
    interests: ['Sketching (advanced hyper-realism)', 'Reading', 'Coding']
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
  { id: 'personal', title: 'Personal Information & Header', icon: '👤' },
  { id: 'education', title: 'Educational Qualifications', icon: '🎓' },
  { id: 'academicAchievements', title: 'Academic Achievements', icon: '🏆' },
  { id: 'workExperience', title: 'Work Experience', icon: '💼' },
  { id: 'internships', title: 'Internships', icon: '🏢' },
  { id: 'projectsResearch', title: 'Projects & Research Papers', icon: '🚀' },
  { id: 'positionsOfResponsibility', title: 'Positions of Responsibility', icon: '⭐' },
  { id: 'extraCurricular', title: 'Extra-Curricular Activities', icon: '🎨' },
  { id: 'summary', title: 'Professional Summary', icon: '📝' },
  { id: 'skills', title: 'Skills & Languages', icon: '⚡' }
];

async function init() {
  if (templateSelector) {
    templateSelector.value = state.selectedTemplate;
  }
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
    authTitle.textContent = state.authMode === 'signin' ? 'Sign In' : 'Create Account';
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
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: 0,
      filename: `${title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    const blob = await html2pdf().set(opt).from(element).toPdf().get('pdf').output('blob');

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

    const filePath = `${state.user.id}/${resumeId}.pdf`;
    const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, blob, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

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
  state.selectedTemplate = data.template || 'executive';
  state.currentResumeId = data.id;
  
  templateSelector.value = state.selectedTemplate;
  renderEditor();
  updatePreview();
  dashboardModal.classList.remove('active');
};

window.deleteResume = async (id) => {
  if (!confirm('Are you sure you want to delete this resume?')) return;
  
  try {
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);
      if (dbError) throw dbError;

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
  downloadBtn.innerHTML = 'Generating...';
  downloadBtn.disabled = true;
  const element = document.getElementById('resume-preview');
  const opt = {
    margin: 0,
    filename: `${(state.data.personal.name || 'Aditya_Prakash').replace(/\s+/g, '_')}_Resume.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save().then(() => {
    downloadBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download';
    downloadBtn.disabled = false;
  }).catch((err) => {
    console.error(err);
    alert('Failed to generate PDF: ' + err.message);
    downloadBtn.innerHTML = 'Download';
    downloadBtn.disabled = false;
  });
}

function isSectionVisible(id) {
  if (!state.data.sectionVisibility) {
    state.data.sectionVisibility = {};
  }
  return state.data.sectionVisibility[id] !== false;
}

window.toggleSectionVisibility = (id) => {
  if (!state.data.sectionVisibility) {
    state.data.sectionVisibility = {};
  }
  const current = state.data.sectionVisibility[id] !== false;
  state.data.sectionVisibility[id] = !current;
  renderEditor();
  updatePreview();
};

window.addCustomSection = () => {
  if (!state.data.customSections) {
    state.data.customSections = [];
  }
  const newId = 'custom_' + Date.now();
  const newSection = {
    id: newId,
    title: 'Custom Section',
    icon: '🚀',
    category: 'Category Label',
    items: [
      {
        title: '',
        period: '',
        bullets: []
      }
    ]
  };
  state.data.customSections.push(newSection);
  if (!state.data.sectionVisibility) {
    state.data.sectionVisibility = {};
  }
  state.data.sectionVisibility[newId] = true;
  state.activeSection = newId;
  renderEditor();
  updatePreview();
  setTimeout(() => {
    const el = document.getElementById(`accordion-${newId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
};

window.deleteCustomSection = (index) => {
  if (!confirm('Are you sure you want to delete this custom section?')) return;
  const sec = state.data.customSections[index];
  if (sec) {
    if (state.data.sectionVisibility) {
      delete state.data.sectionVisibility[sec.id];
    }
    if (state.activeSection === sec.id) {
      state.activeSection = null;
    }
  }
  state.data.customSections.splice(index, 1);
  renderEditor();
  updatePreview();
};

window.addCustomSectionItem = (secIndex) => {
  if (!state.data.customSections?.[secIndex]?.items) return;
  state.data.customSections[secIndex].items.push({
    title: '',
    period: '',
    bullets: []
  });
  renderEditor();
  updatePreview();
};

window.deleteCustomSectionItem = (secIndex, itemIndex) => {
  if (!state.data.customSections?.[secIndex]?.items) return;
  state.data.customSections[secIndex].items.splice(itemIndex, 1);
  renderEditor();
  updatePreview();
};

function renderCustomSectionForm(cSec, secIndex) {
  const items = cSec.items || [];
  return `
    <div class="input-field" style="margin-bottom: 1rem;">
      <label>Section Title (Displayed on Resume Header)</label>
      <input type="text" data-key="customSections.${secIndex}.title" value="${cSec.title || ''}" placeholder="e.g. Projects & Research Papers">
    </div>

    <div class="input-field" style="margin-bottom: 1rem;">
      <label>Category Label (Left Box)</label>
      <input type="text" data-key="customSections.${secIndex}.category" value="${cSec.category || ''}" placeholder="e.g. Academic Projects">
    </div>

    ${items.map((item, idx) => `
      <div style="background: var(--bg-sidebar); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border: 1px solid rgba(0,0,0,0.05); position: relative;">
        <button type="button" class="btn-ghost" style="position: absolute; top: 0.5rem; right: 0.5rem; color: #ff5252; font-size: 1.1rem; padding: 0.2rem 0.5rem;" onclick="deleteCustomSectionItem(${secIndex}, ${idx})" title="Remove Item">✕</button>
        <div class="field-group" style="margin-bottom: 0.75rem;">
          <div class="input-field">
            <label>Project Title</label>
            <input type="text" data-key="customSections.${secIndex}.items.${idx}.title" value="${item.title || ''}" placeholder="e.g. DITU Assistant">
          </div>
          <div class="input-field">
            <label>Period (e.g. Aug'18-Apr'19)</label>
            <input type="text" data-key="customSections.${secIndex}.items.${idx}.period" value="${item.period || ''}" placeholder="e.g. Aug'18-Apr'19">
          </div>
        </div>
        <div class="input-field">
          <label>Bullets (One per line)</label>
          <textarea rows="3" data-key="customSections.${secIndex}.items.${idx}.bullets" data-type="bullets" placeholder="Enter bullet points, one per line...">${(item.bullets || []).join('\n')}</textarea>
        </div>
      </div>
    `).join('')}

    <button type="button" class="btn btn-outline" style="width: 100%; border-style: dashed; margin-top: 0.5rem;" onclick="addCustomSectionItem(${secIndex})">
      + Add Project / Item
    </button>

    <div style="display: flex; justify-content: flex-end; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px dashed rgba(0,0,0,0.08);">
      <button type="button" class="btn-ghost" style="color: #ff5252; font-size: 0.85rem; display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.75rem;" onclick="deleteCustomSection(${secIndex})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        Delete This Section
      </button>
    </div>
  `;
}

function renderEditor() {
  const customSections = state.data.customSections || [];

  let html = sections.map(section => {
    const isVisible = isSectionVisible(section.id);
    return `
    <div class="accordion-item ${state.activeSection === section.id ? 'active' : ''} ${!isVisible ? 'section-hidden' : ''}" id="accordion-${section.id}">
      <div class="accordion-header" onclick="toggleAccordion('${section.id}')">
        <div class="accordion-title">
          <span style="font-style: normal;">${section.icon}</span>
          <span>${section.title}</span>
        </div>
        <div class="accordion-header-actions" onclick="event.stopPropagation()">
          <button type="button" 
                  class="section-toggle-btn ${isVisible ? 'active' : ''}" 
                  onclick="event.stopPropagation(); toggleSectionVisibility('${section.id}')"
                  title="${isVisible ? 'Hide this section from resume' : 'Show this section on resume'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
              ${isVisible ? `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              ` : `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              `}
            </svg>
            <span>${isVisible ? 'Visible' : 'Hidden'}</span>
          </button>
          <svg class="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
      <div class="accordion-content">
        ${renderSectionForm(section.id)}
      </div>
    </div>
  `;
  }).join('');

  html += customSections.map((cSec, secIndex) => {
    const isVisible = isSectionVisible(cSec.id);
    return `
    <div class="accordion-item ${state.activeSection === cSec.id ? 'active' : ''} ${!isVisible ? 'section-hidden' : ''}" id="accordion-${cSec.id}">
      <div class="accordion-header" onclick="toggleAccordion('${cSec.id}')">
        <div class="accordion-title">
          <span style="font-style: normal;">${cSec.icon || '🚀'}</span>
          <span>${cSec.title || 'Custom Section'}</span>
        </div>
        <div class="accordion-header-actions" onclick="event.stopPropagation()">
          <button type="button" 
                  class="section-toggle-btn ${isVisible ? 'active' : ''}" 
                  onclick="event.stopPropagation(); toggleSectionVisibility('${cSec.id}')"
                  title="${isVisible ? 'Hide this section from resume' : 'Show this section on resume'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
              ${isVisible ? `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              ` : `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              `}
            </svg>
            <span>${isVisible ? 'Visible' : 'Hidden'}</span>
          </button>
          <svg class="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
      <div class="accordion-content">
        ${renderCustomSectionForm(cSec, secIndex)}
      </div>
    </div>
  `;
  }).join('');

  html += `
    <div style="margin-top: 1rem; margin-bottom: 2rem;">
      <button type="button" class="add-custom-section-btn" onclick="addCustomSection()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add Custom Section</span>
      </button>
    </div>
  `;

  accordionEditor.innerHTML = html;
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
  const d = state.data;
  
  if (section === 'personal') {
    html = `
      <div class="field-group">
        <div class="input-field"><label>Full Name</label><input type="text" data-key="personal.name" value="${d.personal.name || ''}"></div>
        <div class="input-field"><label>Gender & Age Subtitle</label><input type="text" data-key="personal.subtitle" value="${d.personal.subtitle || 'Male, 27 Years'}"></div>
      </div>
      <div class="field-group">
        <div class="input-field"><label>Email</label><input type="email" data-key="personal.email" value="${d.personal.email || ''}"></div>
        <div class="input-field"><label>Phone</label><input type="text" data-key="personal.phone" value="${d.personal.phone || ''}"></div>
      </div>
      <div class="field-group">
        <div class="input-field"><label>Location</label><input type="text" data-key="personal.location" value="${d.personal.location || ''}"></div>
        <div class="input-field"><label>LinkedIn</label><input type="text" data-key="personal.linkedin" value="${d.personal.linkedin || ''}"></div>
      </div>
    `;
  } else if (section === 'education') {
    html = (d.education || []).map((item, index) => `
      <div style="background: var(--bg-sidebar); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; position: relative; border: 1px solid rgba(0,0,0,0.05);">
        <button class="btn-ghost" style="position: absolute; top: 0.5rem; right: 0.5rem; color: #ff5252; font-size: 1.1rem;" onclick="removeItem('education', ${index})">✕</button>
        <div class="field-group">
          <div class="input-field"><label>Degree / Class</label><input type="text" data-key="education.${index}.degree" value="${item.degree || ''}"></div>
          <div class="input-field"><label>Institution / School</label><input type="text" data-key="education.${index}.school" value="${item.school || ''}"></div>
        </div>
        <div class="field-group">
          <div class="input-field"><label>Score / Percentage / GPA</label><input type="text" data-key="education.${index}.description" value="${item.description || '-'}"></div>
          <div class="input-field"><label>Year</label><input type="text" data-key="education.${index}.period" value="${item.period || ''}"></div>
        </div>
      </div>
    `).join('');
    html += `<button class="btn btn-outline" style="width: 100%; border-style: dashed; margin-top: 0.5rem;" onclick="addItem('education')">+ Add Education Row</button>`;
  } else if (section === 'academicAchievements') {
    html = (d.academicAchievements || []).map((item, index) => `
      <div style="background: var(--bg-sidebar); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; position: relative; border: 1px solid rgba(0,0,0,0.05);">
        <button class="btn-ghost" style="position: absolute; top: 0.5rem; right: 0.5rem; color: #ff5252; font-size: 1.1rem;" onclick="removeItem('academicAchievements', ${index})">✕</button>
        <div class="input-field">
          <label>Achievement Description (HTML bold supported with &lt;b&gt;keyword&lt;/b&gt;)</label>
          <textarea rows="2" data-key="academicAchievements.${index}.text">${item.text || ''}</textarea>
        </div>
        <div class="input-field" style="max-width: 150px; margin-top: 0.5rem;">
          <label>Year</label>
          <input type="text" data-key="academicAchievements.${index}.year" value="${item.year || ''}">
        </div>
      </div>
    `).join('');
    html += `<button class="btn btn-outline" style="width: 100%; border-style: dashed; margin-top: 0.5rem;" onclick="addItem('academicAchievements')">+ Add Achievement</button>`;
  } else if (section === 'workExperience') {
    const exp = d.experienceSummary || {};
    html = `
      <div class="field-group">
        <div class="input-field"><label>Total Duration Badge</label><input type="text" data-key="experienceSummary.totalMonths" value="${exp.totalMonths || '55 Months'}"></div>
        <div class="input-field"><label>Company Name</label><input type="text" data-key="experienceSummary.company" value="${exp.company || ''}"></div>
      </div>
      <div class="field-group">
        <div class="input-field"><label>Role / Designation</label><input type="text" data-key="experienceSummary.role" value="${exp.role || ''}"></div>
        <div class="input-field"><label>Period (e.g. Nov'19 - Jun'24)</label><input type="text" data-key="experienceSummary.period" value="${exp.period || ''}"></div>
      </div>

      <h4 style="margin: 1rem 0 0.5rem; font-size: 0.9rem; color: var(--primary-dark);">Roles & Responsibilities Projects:</h4>
      ${(exp.projects || []).map((proj, idx) => `
        <div style="background: var(--bg-sidebar); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border: 1px solid rgba(0,0,0,0.05);">
          <div class="input-field">
            <label>Project ${idx + 1} Title</label>
            <input type="text" data-key="experienceSummary.projects.${idx}.title" value="${proj.title || ''}">
          </div>
          <div class="input-field" style="margin-top: 0.5rem;">
            <label>Bullets (One per line, HTML &lt;b&gt; bold tags supported)</label>
            <textarea rows="4" data-key="experienceSummary.projects.${idx}.bullets" data-type="bullets">${(proj.bullets || []).join('\n')}</textarea>
          </div>
        </div>
      `).join('')}

      <h4 style="margin: 1rem 0 0.5rem; font-size: 0.9rem; color: var(--primary-dark);">Company Achievements:</h4>
      <div class="input-field">
        <label>Bullets (One per line)</label>
        <textarea rows="3" data-key="experienceSummary.achievements" data-type="bullets">${(exp.achievements || []).join('\n')}</textarea>
      </div>
    `;
  } else if (section === 'internships') {
    const intern = d.internship || {};
    html = `
      <div class="field-group">
        <div class="input-field"><label>Company & Location</label><textarea rows="2" data-key="internship.company">${intern.company || ''}</textarea></div>
        <div class="input-field"><label>Role / Designation</label><input type="text" data-key="internship.role" value="${intern.role || ''}"></div>
      </div>
      <div class="input-field">
        <label>Period (e.g. Jul'19 - Nov'19)</label>
        <input type="text" data-key="internship.period" value="${intern.period || ''}">
      </div>
      <div class="input-field" style="margin-top: 0.5rem;">
        <label>Bullets (One per line)</label>
        <textarea rows="3" data-key="internship.bullets" data-type="bullets">${(intern.bullets || []).join('\n')}</textarea>
      </div>
    `;
  } else if (section === 'projectsResearch') {
    const pr = d.projectsResearch || {};
    html = `
      <div class="input-field" style="margin-bottom: 1rem;">
        <label>Category Label (Left Box)</label>
        <input type="text" data-key="projectsResearch.category" value="${pr.category || 'Academic Projects'}">
      </div>
      ${(pr.items || []).map((proj, idx) => `
        <div style="background: var(--bg-sidebar); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border: 1px solid rgba(0,0,0,0.05);">
          <div class="field-group">
            <div class="input-field"><label>Project Title</label><input type="text" data-key="projectsResearch.items.${idx}.title" value="${proj.title || ''}"></div>
            <div class="input-field"><label>Period (e.g. Aug'18-Apr'19)</label><input type="text" data-key="projectsResearch.items.${idx}.period" value="${proj.period || ''}"></div>
          </div>
          <div class="input-field">
            <label>Bullets (One per line)</label>
            <textarea rows="3" data-key="projectsResearch.items.${idx}.bullets" data-type="bullets">${(proj.bullets || []).join('\n')}</textarea>
          </div>
        </div>
      `).join('')}
    `;
  } else if (section === 'positionsOfResponsibility') {
    const por = d.positionsOfResponsibility || {};
    html = `
      <div class="input-field" style="margin-bottom: 1rem;">
        <label>Category Label (Left Box)</label>
        <input type="text" data-key="positionsOfResponsibility.category" value="${por.category || 'DIT University'}">
      </div>
      ${(por.items || []).map((item, idx) => `
        <div style="background: var(--bg-sidebar); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border: 1px solid rgba(0,0,0,0.05);">
          <div class="field-group">
            <div class="input-field"><label>Position / Role</label><input type="text" data-key="positionsOfResponsibility.items.${idx}.title" value="${item.title || ''}"></div>
            <div class="input-field"><label>Period (e.g. Aug'18-May'19)</label><input type="text" data-key="positionsOfResponsibility.items.${idx}.period" value="${item.period || ''}"></div>
          </div>
          <div class="input-field">
            <label>Bullets (One per line)</label>
            <textarea rows="3" data-key="positionsOfResponsibility.items.${idx}.bullets" data-type="bullets">${(item.bullets || []).join('\n')}</textarea>
          </div>
        </div>
      `).join('')}
    `;
  } else if (section === 'extraCurricular') {
    html = (d.extraCurricular || []).map((item, idx) => `
      <div style="background: var(--bg-sidebar); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border: 1px solid rgba(0,0,0,0.05);">
        <div class="input-field" style="margin-bottom: 0.5rem;">
          <label>Category (Left Box)</label>
          <input type="text" data-key="extraCurricular.${idx}.category" value="${item.category || ''}">
        </div>
        <div class="input-field">
          <label>Bullets (One per line)</label>
          <textarea rows="3" data-key="extraCurricular.${idx}.bullets" data-type="bullets">${(item.bullets || []).join('\n')}</textarea>
        </div>
      </div>
    `).join('');
  } else if (section === 'summary') {
    html = `<div class="input-field"><label>Professional Summary</label><textarea rows="5" data-key="summary">${d.summary || ''}</textarea></div>`;
  } else if (section === 'skills') {
    html = `
      <div class="input-field" style="margin-bottom: 1rem;">
        <label>Skills (Separate by commas)</label>
        <textarea rows="3" data-key="skills" data-type="list">${(d.skills || []).join(', ')}</textarea>
      </div>
      <div class="input-field">
        <label>Languages (Separate by commas)</label>
        <input type="text" data-key="languages" data-type="list" value="${(d.languages || []).join(', ')}">
      </div>
    `;
  }
  return html;
}

window.addItem = (type) => {
  if (type === 'education') {
    state.data.education.push({ degree: '', school: '', description: '', period: '' });
  } else if (type === 'academicAchievements') {
    state.data.academicAchievements.push({ text: '', year: '' });
  } else if (type === 'certifications') {
    state.data.certifications.push({ name: '', date: '' });
  } else if (type === 'projects') {
    state.data.projects.push({ title: '', link: '', description: '' });
  } else if (type === 'experience') {
    state.data.experience.push({ company: '', role: '', location: '', period: '', description: '' });
  }
  renderEditor();
  updatePreview();
};

window.removeItem = (type, index) => {
  if (state.data[type] && Array.isArray(state.data[type])) {
    state.data[type].splice(index, 1);
    renderEditor();
    updatePreview();
  }
};

function attachInputListeners() {
  accordionEditor.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', (e) => {
      const key = e.target.dataset.key;
      if (!key) return;
      const type = e.target.dataset.type;
      let value = e.target.value;
      if (type === 'list') {
        value = value.split(',').map(s => s.trim()).filter(s => s !== '');
      } else if (type === 'bullets') {
        value = value.split('\n').map(s => s.trim()).filter(s => s !== '');
      }
      updateState(key, value);

      // Live update section title on accordion header
      if (key.includes('customSections') && key.endsWith('.title')) {
        const parts = key.split('.');
        const secIdx = parts[1];
        const secId = state.data.customSections?.[secIdx]?.id;
        if (secId) {
          const titleSpan = document.querySelector(`#accordion-${secId} .accordion-title span:last-child`);
          if (titleSpan) titleSpan.textContent = value || 'Custom Section';
        }
      }

      updatePreview();
    });
    input.addEventListener('click', (e) => e.stopPropagation());
  });
}

function updateState(path, value) {
  const parts = path.split('.');
  let current = state.data;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    if (current[key] === undefined) {
      current[key] = isNaN(Number(nextKey)) ? {} : [];
    }
    current = current[key];
  }
  const lastKey = parts[parts.length - 1];
  current[lastKey] = value;
}

function updatePreview() {
  const d = state.data;
  if (state.selectedTemplate === 'minimal') {
    renderMinimalTemplate(d);
  } else if (state.selectedTemplate === 'modern') {
    renderModernTemplate(d);
  } else {
    renderExecutiveTemplate(d);
  }
}

function renderExecutiveTemplate(d) {
  resumePreview.style.fontFamily = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
  resumePreview.style.padding = "0";
  resumePreview.style.color = "#000";
  resumePreview.style.backgroundColor = "#fff";

  // Education rows
  const eduRows = (d.education || []).map(edu => `
    <tr>
      <td style="width: 23%; text-align: center; font-weight: 500;">${edu.degree || ''}</td>
      <td style="width: 51%; text-align: center;">${edu.school || ''}</td>
      <td style="width: 14%; text-align: center;">${edu.description || '-'}</td>
      <td style="width: 12%; text-align: center;">${edu.period || ''}</td>
    </tr>
  `).join('');

  // Academic Achievements rows
  const achievementsList = d.academicAchievements || (d.achievements || []).map(a => {
    const match = a.match(/\((\d{4})\)$/);
    if (match) {
      return { text: a.replace(/\s*\(\d{4}\)$/, ''), year: match[1] };
    }
    return { text: a, year: '' };
  });

  const achieveRows = achievementsList.map(a => `
    <tr>
      <td class="exec-achieve-text">
        <div style="position: relative; padding-left: 11px; line-height: 1.28;">
          <span style="position: absolute; left: 0; top: 0; font-size: 8.5px;">▪</span>
          <span>${a.text || ''}</span>
        </div>
      </td>
      <td class="exec-achieve-year">${a.year || ''}</td>
    </tr>
  `).join('');

  // Work Experience
  const expSummary = d.experienceSummary || {
    totalMonths: '55 Months',
    company: d.experience?.[0]?.company || 'COGNIZANT TECHNOLOGY SOLUTIONS',
    role: d.experience?.[0]?.role || 'Software Engineer',
    period: d.experience?.[0]?.period || "Nov'19 - Jun'24",
    projects: [
      {
        title: 'Adverse Event Reporting Interface between EDC and Security',
        bullets: (d.experience?.[0]?.description || '').split('\n').filter(Boolean)
      }
    ],
    achievements: []
  };

  const projects = (expSummary.projects && expSummary.projects.length > 0)
    ? expSummary.projects
    : [{ title: '', bullets: [] }];

  const projectRowsHtml = projects.map((proj, idx) => `
    <tr>
      ${idx === 0 ? `<td class="exec-side-cell" rowspan="${projects.length * 2}">Roles &amp;<br>Responsibilities</td>` : ''}
      <td class="exec-project-title-cell">${proj.title || ''}</td>
    </tr>
    <tr>
      <td class="exec-project-bullets-cell">
        <ul class="exec-bullets">
          ${(proj.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </td>
    </tr>
  `).join('');

  const expAchievementsHtml = (expSummary.achievements && expSummary.achievements.length > 0) ? `
    <tr>
      <td class="exec-side-cell">
        Achievements
      </td>
      <td class="exec-main-cell">
        <ul class="exec-bullets">
          ${expSummary.achievements.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </td>
    </tr>
  ` : '';

  // Internships
  const internship = d.internship || {
    company: 'COGNIZANT TECHNOLOGY SOLUTIONS,\nHyderabad',
    role: 'Programmer Analyst Trainee',
    period: "Jul'19 - Nov'19",
    bullets: []
  };

  // Projects & Research Papers
  const pr = d.projectsResearch || {
    category: 'Academic Projects',
    items: []
  };

  const prItems = (pr.items && pr.items.length > 0)
    ? pr.items
    : [{ title: '', period: '', bullets: [] }];

  const prRowsHtml = prItems.map((item, idx) => `
    <tr>
      ${idx === 0 ? `<td class="exec-side-cell" rowspan="${prItems.length * 2}">${pr.category || 'Academic Projects'}</td>` : ''}
      <td class="exec-project-title-cell">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span>${item.title || ''}</span>
          <span style="font-style: italic; font-weight: normal;">${item.period || ''}</span>
        </div>
      </td>
    </tr>
    <tr>
      <td class="exec-project-bullets-cell">
        <ul class="exec-bullets">
          ${(item.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </td>
    </tr>
  `).join('');

  // Positions of Responsibility
  const por = d.positionsOfResponsibility || {
    category: 'DIT University',
    items: []
  };

  const porItems = (por.items && por.items.length > 0)
    ? por.items
    : [{ title: '', period: '', bullets: [] }];

  const porRowsHtml = porItems.map((item, idx) => `
    <tr>
      ${idx === 0 ? `<td class="exec-side-cell" rowspan="${porItems.length * 2}">${por.category || 'DIT University'}</td>` : ''}
      <td class="exec-project-title-cell">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span>${item.title || ''}</span>
          <span style="font-style: italic; font-weight: normal;">${item.period || ''}</span>
        </div>
      </td>
    </tr>
    <tr>
      <td class="exec-project-bullets-cell">
        <ul class="exec-bullets">
          ${(item.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </td>
    </tr>
  `).join('');

  // Extra-curricular
  const extraList = d.extraCurricular || [];
  const extraRowsHtml = extraList.map(ec => `
    <tr>
      <td class="exec-side-cell">${ec.category}</td>
      <td class="exec-main-cell">
        <ul class="exec-bullets">
          ${(ec.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </td>
    </tr>
  `).join('');

  // Custom Sections
  const customSections = d.customSections || [];
  const customSectionsHtml = customSections.map((cSec) => {
    if (!isSectionVisible(cSec.id)) return '';
    const items = (cSec.items && cSec.items.length > 0)
      ? cSec.items
      : [{ title: '', period: '', bullets: [] }];

    const rowsHtml = items.map((item, idx) => `
      <tr>
        ${idx === 0 ? `<td class="exec-side-cell" rowspan="${items.length * 2}">${cSec.category || ''}</td>` : ''}
        <td class="exec-project-title-cell">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span>${item.title || ''}</span>
            <span style="font-style: italic; font-weight: normal;">${item.period || ''}</span>
          </div>
        </td>
      </tr>
      <tr>
        <td class="exec-project-bullets-cell">
          <ul class="exec-bullets">
            ${(item.bullets || []).map(b => `<li>${b}</li>`).join('')}
          </ul>
        </td>
      </tr>
    `).join('');

    return `
      <!-- Custom Section: ${cSec.title} -->
      <div class="exec-section">
        <div class="exec-header">${(cSec.title || 'CUSTOM SECTION').toUpperCase()}</div>
        <table class="exec-table">
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  resumePreview.innerHTML = `
    <div class="exec-container">
      ${isSectionVisible('personal') ? `
      <!-- Top Header -->
      <div class="exec-header-top">
        <div>
          <h1 class="exec-name">${d.personal.name || 'Aditya Prakash'}</h1>
          <div class="exec-subtitle">${d.personal.subtitle || 'Male, 27 Years'}</div>
        </div>
      </div>
      ` : ''}

      ${isSectionVisible('education') ? `
      <!-- 1. EDUCATIONAL QUALIFICATIONS -->
      <div class="exec-section">
        <div class="exec-header">EDUCATIONAL QUALIFICATIONS</div>
        <table class="exec-table exec-edu-table">
          <tbody>
            ${eduRows}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${isSectionVisible('academicAchievements') ? `
      <!-- 2. ACADEMIC & CO-CURRICULAR ACHIEVEMENTS -->
      <div class="exec-section">
        <div class="exec-header">ACADEMIC &amp; CO-CURRICULAR ACHIEVEMENTS</div>
        <table class="exec-table exec-achieve-table">
          <tbody>
            ${achieveRows}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${isSectionVisible('workExperience') ? `
      <!-- 3. WORK EXPERIENCE -->
      <div class="exec-section">
        <div class="exec-header" style="display: flex; justify-content: space-between;">
          <span>WORK EXPERIENCE</span>
          <span>${expSummary.totalMonths || '55 Months'}</span>
        </div>
        <div class="exec-subhdr">
          <span style="font-weight: 700;">${expSummary.company || ''}</span>
          <span style="font-weight: 500;">${expSummary.role || ''}</span>
          <span style="font-style: italic;">${expSummary.period || ''}</span>
        </div>
        <table class="exec-table">
          <tbody>
            ${projectRowsHtml}
            ${expAchievementsHtml}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${isSectionVisible('internships') ? `
      <!-- 4. INTERNSHIPS -->
      <div class="exec-section">
        <div class="exec-header">INTERNSHIPS</div>
        <div class="exec-subhdr">
          <span style="font-weight: 700; line-height: 1.2;">${(internship.company || '').replace(/\n/g, '<br>')}</span>
          <span style="font-weight: 500;">${internship.role || ''}</span>
          <span style="font-style: italic;">${internship.period || ''}</span>
        </div>
        <div style="border: 1px solid #000; border-top: none; padding: 2.5px 6px; background: #fff;">
          <ul class="exec-bullets">
            ${(internship.bullets || []).map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      </div>
      ` : ''}

      ${isSectionVisible('projectsResearch') ? `
      <!-- 5. PROJECTS & RESEARCH PAPERS -->
      <div class="exec-section">
        <div class="exec-header">PROJECTS &amp; RESEARCH PAPERS</div>
        <table class="exec-table">
          <tbody>
            ${prRowsHtml}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${isSectionVisible('positionsOfResponsibility') ? `
      <!-- 6. POSITIONS OF RESPONSIBILITY -->
      <div class="exec-section">
        <div class="exec-header">POSITIONS OF RESPONSIBILITY</div>
        <table class="exec-table">
          <tbody>
            ${porRowsHtml}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${isSectionVisible('extraCurricular') ? `
      <!-- 7. EXTRA-CURRICULAR ACTIVITIES -->
      <div class="exec-section">
        <div class="exec-header">EXTRA-CURRICULAR ACTIVITIES</div>
        <table class="exec-table">
          <tbody>
            ${extraRowsHtml}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${customSectionsHtml}
    </div>
  `;
}

function renderMinimalTemplate(d) {
  resumePreview.style.fontFamily = "'Inter', sans-serif";
  resumePreview.style.padding = "40px";
  resumePreview.style.color = "#000";
  resumePreview.style.backgroundColor = "#fff";
  
  resumePreview.innerHTML = `
    ${isSectionVisible('personal') ? `
    <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 2rem;">
      <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">${(d.personal.name || '').toUpperCase()}</h1>
      <p>${d.personal.email || ''}  |  ${d.personal.phone || ''}  |  ${d.personal.location || ''}</p>
      <p style="font-size: 0.85rem;">${d.personal.linkedin || ''}  •  ${d.personal.portfolio || ''}</p>
    </div>
    ` : ''}

    ${isSectionVisible('summary') ? `
    <section style="margin-bottom: 1.5rem;">
      <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 0.5rem; font-size: 1.1rem;">Summary</h3>
      <p style="text-align: justify; font-size: 0.95rem;">${d.summary || ''}</p>
    </section>
    ` : ''}

    ${isSectionVisible('workExperience') ? `
    <section style="margin-bottom: 1.5rem;">
      <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 1rem; font-size: 1.1rem;">Experience</h3>
      ${(d.experience || []).map(exp => `
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 700;"><span>${(exp.company || '').toUpperCase()}</span><span>${exp.period || ''}</span></div>
          <div style="display: flex; justify-content: space-between; font-style: italic; font-size: 0.9rem;"><span>${exp.role || ''}</span><span>${exp.location || ''}</span></div>
          <p style="font-size: 0.95rem; margin-top: 5px;">${exp.description || ''}</p>
        </div>`).join('')}
    </section>
    ` : ''}

    ${isSectionVisible('education') ? `
    <section style="margin-bottom: 1.5rem;">
      <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 1rem; font-size: 1.1rem;">Education</h3>
      ${(d.education || []).map(edu => `
        <div style="margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 700;"><span>${(edu.school || '').toUpperCase()}</span><span>${edu.period || ''}</span></div>
          <p style="font-size: 0.95rem;">${edu.degree || ''} ${edu.description ? `(${edu.description})` : ''}</p>
        </div>`).join('')}
    </section>
    ` : ''}

    ${(isSectionVisible('skills') || isSectionVisible('academicAchievements')) ? `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      ${isSectionVisible('skills') ? `
      <section>
        <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 0.5rem; font-size: 1.1rem;">Skills</h3>
        <p style="font-size: 0.95rem;">${(d.skills || []).join(', ')}</p>
      </section>
      ` : ''}
      ${isSectionVisible('academicAchievements') ? `
      <section>
        <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 0.5rem; font-size: 1.1rem;">Certifications & Achievements</h3>
        <p style="font-size: 0.95rem;">${(d.certifications || []).map(c => `${c.name} (${c.date})`).join(', ')}</p>
      </section>
      ` : ''}
    </div>
    ` : ''}

    ${(d.customSections || []).map(cSec => {
      if (!isSectionVisible(cSec.id)) return '';
      return `
        <section style="margin-bottom: 1.5rem;">
          <h3 style="text-transform: uppercase; border-bottom: 1.5px solid #000; margin-bottom: 0.5rem; font-size: 1.1rem;">${cSec.title || ''}</h3>
          ${(cSec.items || []).map(item => `
            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <span>${(item.title || '').toUpperCase()}</span>
                <span>${item.period || ''}</span>
              </div>
              <ul style="margin: 4px 0 0 18px; font-size: 0.95rem;">
                ${(item.bullets || []).map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>
      `;
    }).join('')}
  `;
}

function renderModernTemplate(d) {
  resumePreview.style.fontFamily = "'Outfit', sans-serif";
  resumePreview.style.padding = "0";
  resumePreview.style.color = "#2D3436";
  resumePreview.style.backgroundColor = "#fff";
  
  resumePreview.innerHTML = `
    <div style="display: flex; height: 100%; min-height: 1120px;">
      <!-- Sidebar -->
      <div style="width: 33%; background: #F3E5F5; padding: 50px 25px; display: flex; flex-direction: column; gap: 2.5rem;">
        ${isSectionVisible('personal') ? `
        <div>
          <h1 style="font-size: 2rem; color: #4A148C; margin-bottom: 1.5rem; font-weight: 700; line-height: 1.1;">${d.personal.name || ''}</h1>
          <div style="font-size: 0.8rem; color: #6A1B9A; display: flex; flex-direction: column; gap: 0.6rem;">
            <span>📧 ${d.personal.email || ''}</span>
            <span>📞 ${d.personal.phone || ''}</span>
            <span>📍 ${d.personal.location || ''}</span>
            <span style="word-break: break-all;">🔗 ${d.personal.linkedin || ''}</span>
          </div>
        </div>
        ` : ''}

        ${isSectionVisible('skills') ? `
        <section>
          <h3 style="color: #4A148C; border-bottom: 2px solid #BA68C8; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1.25rem; font-weight: 700; letter-spacing: 1px;">Skills</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${(d.skills || []).map(s => `<span style="background: white; padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; color: #7B1FA2; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">${s}</span>`).join('')}
          </div>
        </section>
        ` : ''}

        ${isSectionVisible('education') ? `
        <section>
          <h3 style="color: #4A148C; border-bottom: 2px solid #BA68C8; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1.25rem; font-weight: 700; letter-spacing: 1px;">Education</h3>
          ${(d.education || []).map(edu => `
            <div style="margin-bottom: 1.25rem;">
              <div style="font-weight: 700; font-size: 0.85rem; color: #4A148C;">${edu.school || ''}</div>
              <div style="font-size: 0.75rem; color: #7B1FA2;">${edu.degree || ''}</div>
              <div style="font-size: 0.7rem; color: #9C27B0; font-weight: 600;">${edu.period || ''}</div>
            </div>`).join('')}
        </section>
        ` : ''}

        ${isSectionVisible('skills') ? `
        <section>
          <h3 style="color: #4A148C; border-bottom: 2px solid #BA68C8; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1.25rem; font-weight: 700; letter-spacing: 1px;">Languages</h3>
          <p style="font-size: 0.8rem; color: #6A1B9A;">${(d.languages || []).join(' • ')}</p>
        </section>
        ` : ''}
      </div>

      <!-- Main -->
      <div style="width: 67%; padding: 50px 40px; display: flex; flex-direction: column; gap: 2.5rem; background: white;">
        ${isSectionVisible('summary') ? `
        <section>
          <h3 style="color: #4A148C; font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; border-left: 4px solid #E1BEE7; padding-left: 1rem;">Profile</h3>
          <p style="font-size: 0.95rem; line-height: 1.7; color: #444; text-align: justify;">${d.summary || ''}</p>
        </section>
        ` : ''}

        ${isSectionVisible('workExperience') ? `
        <section>
          <h3 style="color: #4A148C; font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; border-left: 4px solid #BBDEFB; padding-left: 1rem;">Experience</h3>
          ${(d.experience || []).map(exp => `
            <div style="margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                <h4 style="font-size: 1rem; color: #2D3436; font-weight: 700;">${exp.company || ''}</h4>
                <span style="font-size: 0.75rem; color: #4A148C; font-weight: 700; background: #E1BEE7; padding: 2px 8px; border-radius: 4px;">${exp.period || ''}</span>
              </div>
              <div style="color: #6A1B9A; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">${exp.role || ''} | ${exp.location || ''}</div>
              <p style="font-size: 0.9rem; line-height: 1.6; color: #636E72; white-space: pre-line;">${exp.description || ''}</p>
            </div>`).join('')}
        </section>
        ` : ''}

        ${isSectionVisible('projectsResearch') ? `
        <section>
          <h3 style="color: #4A148C; font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; border-left: 4px solid #C8E6C9; padding-left: 1rem;">Key Projects</h3>
          ${(d.projects || []).map(proj => `
            <div style="margin-bottom: 1.5rem;">
              <div style="font-weight: 700; font-size: 0.95rem; display: flex; justify-content: space-between;">
                <span>${proj.title || ''}</span>
                <span style="font-weight: 400; font-size: 0.75rem; color: #7B1FA2;">${proj.link || ''}</span>
              </div>
              <p style="font-size: 0.85rem; color: #636E72; margin-top: 4px;">${proj.description || ''}</p>
            </div>`).join('')}
        </section>
        ` : ''}
        
        ${isSectionVisible('academicAchievements') ? `
        <section>
          <h3 style="color: #4A148C; font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; border-left: 4px solid #FFECB3; padding-left: 1rem;">Achievements</h3>
          <ul style="font-size: 0.9rem; color: #444; line-height: 1.6; padding-left: 1.2rem;">
            ${(d.achievements || []).map(a => `<li>${a}</li>`).join('')}
          </ul>
        </section>
        ` : ''}

        ${(d.customSections || []).map(cSec => {
          if (!isSectionVisible(cSec.id)) return '';
          return `
            <section style="margin-bottom: 1.5rem;">
              <h3 style="color: #4A148C; font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem; border-left: 4px solid #BA68C8; padding-left: 1rem;">${cSec.title || ''}</h3>
              ${(cSec.items || []).map(item => `
                <div style="margin-bottom: 1.25rem;">
                  <div style="font-weight: 700; font-size: 0.95rem; display: flex; justify-content: space-between;">
                    <span>${item.title || ''}</span>
                    <span style="font-weight: 400; font-size: 0.75rem; color: #7B1FA2;">${item.period || ''}</span>
                  </div>
                  <ul style="font-size: 0.9rem; color: #444; line-height: 1.6; padding-left: 1.2rem; margin-top: 4px;">
                    ${(item.bullets || []).map(b => `<li>${b}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </section>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

init();
