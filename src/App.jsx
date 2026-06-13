import React, { useState, useEffect } from 'react';

const SkillBar = ({ name, percentage, delay = 0 }) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentage), delay);
    return () => clearTimeout(timer);
  }, [delay, percentage]);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
          {name}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          {Math.round(animatedWidth)}%
        </span>
      </div>
      <div style={{
        height: '8px',
        background: 'var(--color-background-tertiary)',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${animatedWidth}%`,
          background: 'linear-gradient(90deg, var(--color-accent-blue) 0%, var(--color-accent-purple) 100%)',
          borderRadius: '10px',
          transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
        }} />
      </div>
    </div>
  );
};

const AnimatedCounter = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return `${count}${suffix}`;
};

const TypingText = ({ texts, speed = 80, pause = 1500 }) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (!isDeleting && displayText.length < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, speed);
    } else if (!isDeleting && displayText.length === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length - 1));
      }, speed / 2);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setTextIndex((textIndex + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, speed, pause]);

  return (
    <span>
      {displayText}
      <span style={{ borderRight: '2px solid var(--color-accent-blue)', marginLeft: '2px', animation: 'pulse 0.8s infinite' }}>&nbsp;</span>
    </span>
  );
};

const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
    >
      {children}
    </div>
  );
};

// ====== CERTIFICATE MODAL ======
const CertificateModal = ({ cert, onClose }) => {
  if (!cert) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.5rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-background-primary)',
          borderRadius: 'var(--border-radius-xl)',
          padding: '1.5rem',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {cert.completed ? (
          <>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
              {cert.title}
            </h3>
            <iframe
              src={cert.image}
              title={cert.title}
              style={{ width: '100%', height: '70vh', border: '1px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)' }}
            />
            <a
              href={cert.image}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: '0.75rem', fontSize: '13px', color: 'var(--color-accent-blue)', fontWeight: '500' }}
            >
              Open in new tab ?
            </a>
          </>
        ) : (
          <div style={{ padding: '3rem 1rem' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🚧</div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
              {cert.title}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              Coming Soon — this certificate is currently in progress.
            </p>
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: '1.5rem',
            padding: '0.6rem 1.5rem',
            background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ====== PROJECTS (with expanded Cyber Defense System) ======
  const projects = [
    {
      title: 'Cyber Defense System v3.0',
      semester: '6th Semester',
      description: 'Full-stack cybersecurity platform with real-time threat monitoring',
      details: 'A complete cybersecurity command center combining AI threat detection, blockchain-based logging, real-time SOC dashboard, and a Super Admin control panel.',
      tags: ['FastAPI', 'React', 'SQLite', 'Blockchain', 'AI', 'Face Recognition'],
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      expandable: true,
      features: [
        {
          name: 'Secure Login System',
          desc: '256-bit encrypted, Face ID protected, blockchain-logged authentication for Super Admin access.'
        },
        {
          name: 'Super Admin Console',
          desc: 'Full system control showing total users, admins, threats, blocked IPs, and live AI accuracy (94.2%).'
        },
        {
          name: 'Real-Time Threat Map',
          desc: 'Interactive world map plotting live attack origins (DDoS, XSS, Port Scans, Brute Force) with zoom and reset.'
        },
        {
          name: 'Attack Logs & Analytics',
          desc: 'Detailed logs with IP address, attack type, confidence score, location, and block status — tracked DDoS, SQL Injection, Port Scan, Brute Force, XSS, and Path Traversal attempts.'
        },
        {
          name: 'AI Performance Metrics',
          desc: 'Live model metrics — 94.1% accuracy, 0.99 F1 score, 0% false positive rate, 1.8ms average latency.'
        },
        {
          name: 'AI File Vault Scanner',
          desc: 'Upload, download, and share files with AI malware scanning before encryption (AES-256), entropy analysis, and threat scoring.'
        },
        {
          name: 'Encrypted Admin Messaging',
          desc: 'AES-256 encrypted messaging between Super Admin and other admins for secure internal communication.'
        },
        {
          name: 'Admin Invite System',
          desc: 'Super Admin can create and manage invites for new admin accounts with pending-invite tracking.'
        }
      ]
    },
    {
      title: 'Decentralized Exam Result System (DERS)',
      semester: 'Group Project — UE23CS3603',
      description: 'Blockchain-based exam result management with tamper-proof records',
      details: 'A decentralized platform for storing and verifying exam results using Solidity smart contracts, with MetaMask wallet integration for secure access.',
      tags: ['Solidity', 'Flask', 'Web3.js', 'Smart Contracts', 'MetaMask'],
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      expandable: false
    },
    {
      title: 'Remote Patient Monitoring (RPM)',
      semester: '5th Semester',
      description: 'AR/VR-based patient monitoring for healthcare applications',
      details: 'An immersive AR/VR system that allows healthcare providers to remotely monitor patient vitals and status in real time.',
      tags: ['AR/VR', 'Unity', 'Healthcare'],
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      expandable: false
    },
    {
      title: 'Spam Email Classification',
      semester: '4th Semester',
      description: 'Machine learning model for classifying spam and legitimate emails',
      details: 'A scikit-learn based ML pipeline using NLP preprocessing and classification algorithms to detect spam emails with high accuracy.',
      tags: ['Python', 'ML', 'NLP', 'scikit-learn'],
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      expandable: false
    }
  ];

  const skills = [
    { category: 'Programming', items: ['C', 'C++', 'Python', 'JavaScript'], proficiency: [85, 80, 90, 85] },
    { category: 'Web Development', items: ['React', 'Node.js', 'Express.js', 'HTML/CSS'], proficiency: [88, 82, 80, 90] },
    { category: 'Specializations', items: ['Cybersecurity', 'Blockchain', 'Machine Learning', 'Data Science'], proficiency: [92, 88, 85, 80] }
  ];

  // ====== CERTIFICATIONS (clickable) ======
  const certifications = [
    {
      title: 'Embracing Data Structures & Algorithms for Project Development',
      icon: '📊',
      completed: true,
      image: '/certificates/dsa-cert.pdf'
    },
    {
      title: 'Fundamentals of Cybersecurity (Stage 1)',
      icon: '🔐',
      completed: true,
      image: '/certificates/cybersec-stage1.pdf'
    },
    {
      title: 'Cybersecurity Essentials – Ethical Hacking (Stage 2)',
      icon: '🎯',
      completed: true,
      image: '/certificates/cybersec-stage2.pdf'
    },
    {
      title: 'Ethical Hacking (Udemy)',
      icon: '🛡️',
      completed: false
    },
    {
      title: 'Power BI Workshop',
      icon: '📈',
      completed: false
    },
    {
      title: 'Certificate in Mobile App Development (Beginner)',
      icon: '📱',
      completed: false
    }
  ];

  const achievements = [
    { title: '2nd Place', event: 'Data Hunt Competition', icon: '🥈' },
    { title: '3rd Place', event: 'Jnana Yuddha GK Competition', icon: '🥉' },
    { title: 'Attendee', event: 'Google DevFest', icon: '🚀' }
  ];

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  const stats = [
    { label: 'Projects Completed', value: 4 },
    { label: 'Certifications', value: 3 },
    { label: 'GitHub Contributions', value: 150 },
    { label: 'CGPA', value: '7.18' }
  ];

  return (
    <div style={{ background: 'var(--color-background-primary)', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--color-background-primary)',
        backdropFilter: 'blur(10px)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        padding: '1rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all var(--transition-smooth)',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '600', background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            BCS
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  background: activeSection === item.id ? 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))' : 'transparent',
                  color: activeSection === item.id ? 'white' : 'var(--color-text-secondary)',
                  border: activeSection === item.id ? 'none' : '1px solid var(--color-border-tertiary)',
                  fontSize: '14px',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--border-radius-md)',
                  transition: 'all var(--transition-fast)',
                  fontWeight: activeSection === item.id ? '500' : '400'
                }}
              >
                {item.label}
              </button>
            ))}
            {/* RESUME DOWNLOAD BUTTON */}
            <a
              href="/resume/Srikanth_CV_Final.pdf"
              download
              style={{
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                color: 'white',
                fontSize: '14px',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius-md)',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              📄 Resume
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {activeSection === 'home' && (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Circuit/Grid Background */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            opacity: 0.08,
            zIndex: 0,
            backgroundImage: `linear-gradient(var(--color-accent-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent-blue) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            animation: 'gridMove 20s linear infinite'
          }} />
          <div style={{
            maxWidth: '1200px',
            position: 'relative',
            zIndex: 1,
            margin: '0 auto',
            padding: '5rem 1.5rem',
            textAlign: 'center',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 2rem',
              background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
              animation: 'float 3s ease-in-out infinite'
            }}>
              💻
            </div>
            <h1 style={{ fontSize: '48px', marginBottom: '1rem', color: 'var(--color-text-primary)', fontWeight: '700' }}>
              B C Srikanth
            </h1>
            <p style={{ fontSize: '20px', color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
              <TypingText texts={["Computer Science Student", "Cybersecurity & Data Science Enthusiast", "Full-Stack Developer", "Blockchain Developer"]} />
            </p>

            {/* RESUME DOWNLOAD - prominent button */}
            <div style={{ marginBottom: '2rem' }}>
              <a
                href="/resume/Srikanth_CV_Final.pdf"
                download
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 2.2rem',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  color: 'white',
                  borderRadius: 'var(--border-radius-lg)',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                📄 Download Resume
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {stats.map((stat, idx) => (
                <div key={idx} style={{
                  background: 'var(--color-background-secondary)',
                  padding: '1.5rem',
                  borderRadius: 'var(--border-radius-lg)',
                  border: '1px solid var(--color-border-tertiary)',
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {typeof stat.value === 'number' ? <AnimatedCounter target={stat.value} /> : stat.value}
                    {typeof stat.value === 'number' && stat.label.includes('GitHub') ? '+' : ''}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://github.com/Myselfsrikanth1481" target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))',
                  color: 'white',
                  borderRadius: 'var(--border-radius-lg)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/b-c-srikanth-71b451299" target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '0.75rem 2rem',
                  background: 'var(--color-background-secondary)',
                  color: 'var(--color-accent-blue)',
                  border: '2px solid var(--color-accent-blue)',
                  borderRadius: 'var(--border-radius-lg)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = 'var(--color-accent-blue)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'var(--color-background-secondary)';
                  e.currentTarget.style.color = 'var(--color-accent-blue)';
                }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '2rem', color: 'var(--color-text-primary)', fontWeight: '700' }}>About Me</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
              padding: '2rem',
              borderRadius: 'var(--border-radius-xl)',
              border: '1px solid var(--color-border-secondary)',
              lineHeight: '1.8'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '1rem', color: 'var(--color-accent-blue)', fontWeight: '600' }}>Background</h3>
              <p>I'm a B.Tech Computer Science student at GM University, Davangere, currently in my 6th semester with a focus on cybersecurity, blockchain, and data science. I'm passionate about building secure, scalable applications.</p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
              padding: '2rem',
              borderRadius: 'var(--border-radius-xl)',
              border: '1px solid var(--color-border-secondary)',
              lineHeight: '1.8'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '1rem', color: 'var(--color-accent-purple)', fontWeight: '600' }}>Experience</h3>
              <p>With hands-on experience in full-stack development, machine learning, and cybersecurity, I've worked on various projects combining theory with practical implementation. I actively contribute to open-source projects.</p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))',
              padding: '2rem',
              borderRadius: 'var(--border-radius-xl)',
              border: '1px solid var(--color-border-secondary)',
              lineHeight: '1.8'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '1rem', color: 'var(--color-accent-pink)', fontWeight: '600' }}>Learning</h3>
              <p>I'm continuously upskilling through certifications and workshops. When not coding, I explore emerging technologies, contribute to communities, and work on innovative projects that solve real-world problems.</p>
            </div>
          </div>
        </div>
      )}

      {/* Projects Section */}
      {activeSection === 'projects' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '3rem', color: 'var(--color-text-primary)', fontWeight: '700' }}>Featured Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {projects.map((project, idx) => (
              <div key={idx} style={{
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-xl)',
                overflow: 'hidden',
                border: '1px solid var(--color-border-tertiary)',
                transition: 'all var(--transition-smooth)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
              }}>
                <div style={{ height: '160px', background: project.color, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    animation: 'float 20s ease-in-out infinite'
                  }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '16px', margin: 0, color: 'var(--color-text-primary)', fontWeight: '600' }}>
                      {project.title}
                    </h3>
                    <span style={{
                      fontSize: '11px', color: 'var(--color-text-secondary)',
                      background: 'var(--color-background-tertiary)', padding: '0.25rem 0.75rem',
                      borderRadius: '20px', whiteSpace: 'nowrap'
                    }}>
                      {project.semester}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0.5rem 0 1rem', minHeight: '40px' }}>
                    {project.description}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', margin: '0.75rem 0', fontStyle: 'italic' }}>
                    {project.details}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', marginBottom: project.expandable ? '1rem' : 0 }}>
                    {project.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} style={{
                        fontSize: '11px', background: 'var(--color-background-tertiary)',
                        color: 'var(--color-accent-blue)', padding: '0.35rem 0.75rem',
                        borderRadius: '20px', fontWeight: '500'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* EXPANDABLE DETAILS FOR CYBER DEFENSE SYSTEM */}
                  {project.expandable && (
                    <>
                      <button
                        onClick={() => setExpandedProject(expandedProject === idx ? null : idx)}
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--border-radius-md)',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {expandedProject === idx ? 'Hide Details ▲' : 'View Module Breakdown ▼'}
                      </button>

                      {expandedProject === idx && (
                        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
                          {project.features.map((feature, fIdx) => (
                            <div key={fIdx} style={{
                              background: 'var(--color-background-primary)',
                              border: '1px solid var(--color-border-tertiary)',
                              borderRadius: 'var(--border-radius-md)',
                              padding: '0.85rem 1rem'
                            }}>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                                {feature.name}
                              </p>
                              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0.35rem 0 0', lineHeight: '1.5' }}>
                                {feature.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {activeSection === 'skills' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '3rem', color: 'var(--color-text-primary)', fontWeight: '700' }}>Skills & Expertise</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {skills.map((skillGroup, groupIdx) => (
              <div key={groupIdx} style={{
                background: 'var(--color-background-secondary)',
                padding: '2rem',
                borderRadius: 'var(--border-radius-xl)',
                border: '1px solid var(--color-border-tertiary)',
                animation: `fadeInUp 0.6s ease-out ${groupIdx * 0.15}s both`
              }}>
                <h3 style={{
                  fontSize: '18px', marginBottom: '1.5rem', color: 'var(--color-text-primary)',
                  fontWeight: '600', paddingBottom: '1rem', borderBottom: '2px solid var(--color-border-secondary)'
                }}>
                  {skillGroup.category}
                </h3>
                {skillGroup.items.map((skill, idx) => (
                  <SkillBar key={idx} name={skill} percentage={skillGroup.proficiency[idx]} delay={groupIdx * 150 + idx * 100} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {activeSection === 'education' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '3rem', color: 'var(--color-text-primary)', fontWeight: '700' }}>Education & Certifications</h2>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '1.5rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>Education</h3>
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
              padding: '2rem',
              borderRadius: 'var(--border-radius-xl)',
              border: '2px solid var(--color-accent-blue)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--color-text-primary)', fontWeight: '600' }}>B.Tech in Computer Science</h4>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>GM University, Davangere</p>
                </div>
                <span style={{
                  fontSize: '13px', background: 'var(--color-accent-blue)', color: 'white',
                  padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '500'
                }}>
                  2023 – Present
                </span>
              </div>
              <p style={{ margin: '1rem 0 0', fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: '500' }}>
                CGPA (till 5th Semester): <span style={{ background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '16px' }}>7.18</span>
              </p>
            </div>
          </div>

          {/* CLICKABLE CERTIFICATIONS */}
          <div>
            <h3 style={{ fontSize: '22px', marginBottom: '0.5rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>Certifications</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Click any certificate to view it. Items marked "Upcoming" are in progress.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCert(cert)}
                  style={{
                    background: 'var(--color-background-secondary)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius-lg)',
                    border: cert.completed ? '1px solid var(--color-border-tertiary)' : '1px dashed var(--color-text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-smooth)',
                    animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                    opacity: cert.completed ? 1 : 0.75
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '32px' }}>{cert.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', margin: 0, fontWeight: '500' }}>
                      {cert.title}
                    </p>
                    <span style={{
                      fontSize: '11px',
                      color: cert.completed ? '#10b981' : 'var(--color-text-tertiary)',
                      fontWeight: '600'
                    }}>
                      {cert.completed ? '✓ View Certificate' : '⏳ Upcoming'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '1.5rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>Achievements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {achievements.map((achievement, idx) => (
                <div key={idx} style={{
                  background: `linear-gradient(135deg, rgba(59, 130, 246, ${0.1 + idx * 0.05}), rgba(139, 92, 246, ${0.1 + idx * 0.05}))`,
                  padding: '1.5rem',
                  borderRadius: 'var(--border-radius-lg)',
                  border: '1px solid var(--color-border-secondary)',
                  borderLeft: '4px solid var(--color-accent-blue)',
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '28px' }}>{achievement.icon}</span>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {achievement.title}
                    </p>
                  </div>
                  <p style={{ margin: '0.5rem 0 0 3.5rem', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {achievement.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      {activeSection === 'contact' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '2rem', textAlign: 'center', color: 'var(--color-text-primary)', fontWeight: '700' }}>Get in Touch</h2>
          <div style={{
            maxWidth: '500px', margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
            padding: '2.5rem', borderRadius: 'var(--border-radius-xl)',
            border: '1px solid var(--color-border-secondary)', textAlign: 'center'
          }}>
            <p style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '2rem', lineHeight: '1.8' }}>
              I'm always interested in new projects and opportunities. Let's connect and create something amazing together!
            </p>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-lg)' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', fontWeight: '500', textTransform: 'uppercase' }}>Email</p>
                <a href="mailto:bcsrikanth901@gmail.com" style={{ fontSize: '16px', color: 'var(--color-accent-blue)', fontWeight: '500' }}>
                  bcsrikanth901@gmail.com
                </a>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-lg)' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', fontWeight: '500', textTransform: 'uppercase' }}>Phone</p>
                <p style={{ fontSize: '16px', color: 'var(--color-text-primary)', margin: 0, fontWeight: '500' }}>+91 64648300</p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-lg)' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 1rem', fontWeight: '500', textTransform: 'uppercase' }}>Connect</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <a href="https://github.com/Myselfsrikanth1481" target="_blank" rel="noopener noreferrer"
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))',
                      color: 'white', borderRadius: 'var(--border-radius-md)',
                      fontSize: '13px', fontWeight: '600'
                    }}>
                    GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/b-c-srikanth-71b451299" target="_blank" rel="noopener noreferrer"
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink))',
                      color: 'white', borderRadius: 'var(--border-radius-md)',
                      fontSize: '13px', fontWeight: '600'
                    }}>
                    LinkedIn
                  </a>
                  <a href="/resume/Srikanth_CV_Final.pdf" download
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      color: 'white', borderRadius: 'var(--border-radius-md)',
                      fontSize: '13px', fontWeight: '600'
                    }}>
                    📄 Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: 'var(--color-background-secondary)',
        borderTop: '1px solid var(--color-border-tertiary)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        marginTop: '4rem'
      }}>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Designed & Developed by B C Srikanth © 2024 | All rights reserved
        </p>
      </footer>

      {/* Certificate Modal */}
      <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
    </div>
  );
};

export default Portfolio;





