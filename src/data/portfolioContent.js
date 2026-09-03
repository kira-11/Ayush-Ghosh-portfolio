/**
 * =============================================================================
 * CENTRAL PORTFOLIO CV CONTENT ARCHIVE
 * =============================================================================
 * Edit this file to update any resume, bio, work experience, projects, skills,
 * or contact links across the entire site without touching 3D/animation logic!
 * Both the interactive 3D scene and the Reduced Motion fallback consume this.
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// SECTOR 01 // ABOUT ME: PILOT PROFILE & ACADEMIC DOSSIER
// -----------------------------------------------------------------------------
export const PILOT_PROFILE = {
  name: 'Ayush Ghosh',
  callsign: 'KIRA-11',
  role: 'AI / ML Engineer in Training • Cloud & Automation',
  location: 'Kolkata, India',
  status: 'FLIGHT READY // OPEN FOR ROLES',
  coordinates: '22.5726° N, 88.3639° E',
  bio: 'AI/ML engineer in training with hands-on experience building and evaluating deep learning models for medical imaging and computer vision, plus applied exposure to cloud infrastructure (AWS), Python automation, and DevOps/CI-CD from two enterprise training programs. Skilled in TensorFlow, PyTorch, and scikit-learn, with a track record of translating research papers and datasets into working, measurable models.',
  skillTags: [
    'TensorFlow',
    'PyTorch',
    'scikit-learn',
    'Computer Vision',
    'Medical Imaging',
    'AWS & CI/CD',
  ],
  education: [
    {
      degree: 'Bachelor of Technology, Computer Science',
      specialization: 'Artificial Intelligence and Machine Learning',
      institution: 'Narula Institute of Technology, Kolkata',
      period: '2021–2025',
    },
    {
      degree: 'ICSE (Class X) & ISC (Class XII)',
      specialization: 'Science & Computer Applications',
      institution: 'St. Thomas Church School, Howrah',
      period: '2009–2021',
    },
  ],
  certifications: [
    {
      name: 'Supervised Machine Learning: Regression and Classification',
      issuer: 'Coursera — Stanford University',
      instructor: 'Andrew Ng',
    },
  ],
};

// -----------------------------------------------------------------------------
// SECTOR 02 // WORK EXPERIENCE: PLANETARY SURFACE OUTPOSTS
// -----------------------------------------------------------------------------
export const OUTPOST_DATA = {
  A: {
    id: 'A',
    code: 'OUTPOST ALPHA',
    name: 'Cognizant Technology Solutions',
    role: 'Programmer Analyst Trainee',
    period: 'Feb – Jul 2026',
    themeColor: 'cyan',
    badgeClass: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
    logs: [
      'Completed Cloud Infrastructure Services (CIS) training: Windows Server, Active Directory, Linux, networking, virtualization, AWS, Python, Generative AI, DevOps',
      'Administered Windows Server/AD/DNS/DHCP and provisioned AWS resources (EC2, S3, IAM, VPC) through hands-on labs',
      'Built Python automation scripts for infrastructure tasks; practiced Git-based version control and CI/CD workflows',
    ],
  },
  B: {
    id: 'B',
    code: 'OUTPOST BETA',
    name: 'Accenture',
    role: 'Packaged App Development Associate',
    period: 'Jun – Oct 2025',
    themeColor: 'purple',
    badgeClass: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
    logs: [
      'Completed training in software fundamentals, web technologies, and Python programming',
      'Applied Agile, DevOps, and DevSecOps methodologies with a focus on CI/CD, automation, and secure software delivery',
      'Studied Generative AI and prompt engineering in the context of Application/Infrastructure Management Services (AMS/IMS)',
    ],
  },
};

// -----------------------------------------------------------------------------
// SECTOR 03 // PROJECTS: PLANETARY RESEARCH BEACONS
// -----------------------------------------------------------------------------
export const PROJECTS_DATA = {
  'brain-tumor': {
    id: 'brain-tumor',
    tag: 'PROJECT 01 // DEEP LEARNING',
    title: 'Brain Tumor Classification Using Radiomics & Radiogenomics',
    dates: 'Nov 2024 – Jan 2025',
    themeColor: 'cyan',
    description:
      'Built a VGG16-based deep learning model to detect glioblastoma from MRI scans, fusing medical imaging features (radiomics) with genetic data (radiogenomics) to improve diagnostic accuracy. Trained and validated on 8,000 MRI scans from the BRaTS 2021 dataset, predicting MGMT methylation status.',
    visualType: 'gauge',
    metricScore: 'AUC: 0.737',
    techTags: ['VGG16', 'TensorFlow / PyTorch', 'Radiomics', 'Feature Fusion', 'BRaTS 2021'],
    githubUrl: 'https://github.com/kira-11',
  },
  'motion-tracking': {
    id: 'motion-tracking',
    tag: 'PROJECT 02 // COMPUTER VISION',
    title: 'Human Movement Tracking System',
    dates: 'Aug – Sep 2024',
    themeColor: 'purple',
    description:
      'Engineered a real-time computer vision system using MediaPipe and OpenCV to track human joint kinematics, calculate movement angles, and count workout repetitions across exercises with instant visual telemetry feedback.',
    visualType: 'skeleton',
    metricScore: '33 Landmarks / 30 FPS',
    techTags: ['MediaPipe', 'OpenCV', 'Python', 'Pose Estimation', 'Real-Time CV'],
    githubUrl: 'https://github.com/kira-11',
  },
};

// -----------------------------------------------------------------------------
// SECTOR 04 // SKILLS: CELESTIAL CONSTELLATION NODES
// -----------------------------------------------------------------------------
export const SKILL_CLUSTERS = [
  {
    id: 'languages',
    name: 'Languages',
    color: '#fbbf24', // Warm Gold/Amber
    emissive: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBorder: 'border-amber-400/50',
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-300',
    nodes: [
      { id: 'python', label: 'Python', pos: [9.8, 31.4, -118.5] },
      { id: 'java', label: 'Java', pos: [11.2, 32.2, -119.2] },
      { id: 'c', label: 'C', pos: [10.2, 29.8, -119.6] },
      { id: 'javascript', label: 'JavaScript', pos: [12.2, 30.6, -118.6] },
      { id: 'sql', label: 'SQL', pos: [8.8, 30.2, -118.2] },
    ],
  },
  {
    id: 'mldl',
    name: 'ML / Deep Learning',
    color: '#22d3ee', // Electric Cyan
    emissive: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badgeBorder: 'border-cyan-400/50',
    badgeBg: 'bg-cyan-950/80',
    badgeText: 'text-cyan-300',
    nodes: [
      { id: 'tensorflow', label: 'TensorFlow', pos: [12.4, 34.0, -120.4] },
      { id: 'pytorch', label: 'PyTorch', pos: [14.6, 34.2, -121.2] },
      { id: 'scikitlearn', label: 'scikit-learn', pos: [13.2, 32.6, -121.8] },
      { id: 'opencv', label: 'OpenCV', pos: [14.8, 32.8, -120.0] },
    ],
  },
  {
    id: 'datascience',
    name: 'Data Science',
    color: '#38bdf8', // Royal Sky Blue
    emissive: '#0284c7',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    badgeBorder: 'border-sky-400/50',
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300',
    nodes: [
      { id: 'numpy', label: 'NumPy', pos: [15.2, 32.2, -122.6] },
      { id: 'pandas', label: 'Pandas', pos: [17.2, 32.5, -123.0] },
      { id: 'matplotlib', label: 'Matplotlib', pos: [15.4, 31.4, -123.6] },
      { id: 'feature-engineering', label: 'Feature Engineering', pos: [17.4, 31.2, -122.2] },
      { id: 'model-eval', label: 'Model Evaluation (AUC/ROC)', pos: [16.2, 33.2, -123.8] },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & Infrastructure',
    color: '#c084fc', // Violet / Purple
    emissive: '#a855f7',
    glowColor: 'rgba(192, 132, 252, 0.4)',
    badgeBorder: 'border-purple-400/50',
    badgeBg: 'bg-purple-950/80',
    badgeText: 'text-purple-300',
    nodes: [
      { id: 'aws', label: 'AWS (EC2, S3, IAM, VPC)', pos: [17.6, 34.2, -120.4] },
      { id: 'winserver', label: 'Windows Server', pos: [19.8, 33.8, -121.2] },
      { id: 'activedir', label: 'Active Directory', pos: [18.2, 32.6, -121.8] },
      { id: 'dnsdhcp', label: 'DNS / DHCP', pos: [20.2, 32.4, -120.4] },
      { id: 'linux', label: 'Linux Administration', pos: [19.2, 31.4, -122.2] },
      { id: 'virtualization', label: 'Virtualization', pos: [17.4, 32.2, -120.0] },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & Tools',
    color: '#fb7185', // Rose / Coral
    emissive: '#f43f5e',
    glowColor: 'rgba(251, 113, 133, 0.4)',
    badgeBorder: 'border-rose-400/50',
    badgeBg: 'bg-rose-950/80',
    badgeText: 'text-rose-300',
    nodes: [
      { id: 'git', label: 'Git', pos: [20.8, 31.4, -118.6] },
      { id: 'cicd', label: 'CI / CD', pos: [22.4, 32.0, -119.4] },
      { id: 'docker', label: 'Docker', pos: [21.2, 29.8, -119.6] },
      { id: 'restapis', label: 'REST APIs', pos: [23.2, 30.6, -118.8] },
      { id: 'genai', label: 'Generative AI & Prompt Engineering', pos: [22.2, 32.6, -120.2] },
    ],
  },
];

// -----------------------------------------------------------------------------
// SECTOR 05 // CONTACT & DOCKING STATION CREDENTIALS
// -----------------------------------------------------------------------------
export const CONTACT_DATA = {
  email: 'ayushghosh04@gmail.com',
  emailSubject: 'Mission Inquiry // Portfolio Contact',
  linkedin: 'https://www.linkedin.com/in/ayushghosh04',
  github: 'https://github.com/kira-11',
  resumePath: '/resume.pdf',
  resumeFilename: 'Ayush_Ghosh_Resume.pdf',
  headline: 'Initiate Contact Transmission',
  message:
    'Expedition successfully completed across 5 planetary sectors. Open for software engineering, machine learning research, and cloud infrastructure opportunities. Reach out via encrypted comms or inspect source archives below.',
};
