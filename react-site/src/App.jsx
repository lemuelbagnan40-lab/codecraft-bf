import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const skillsRef = useRef(null);
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.querySelectorAll(".skill-bar").forEach((bar) => {
            const w = bar.getAttribute("data-width");
            bar.style.width = "0%";
            setTimeout(() => (bar.style.width = w), 100);
          });
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const projects = [
    { icon: "📁", title: "Projet 1", desc: "Description du projet.", tags: ["React", "CSS"] },
    { icon: "🚀", title: "Projet 2", desc: "Description du projet.", tags: ["JS", "HTML"] },
  ];
  const skills = [
    { icon: "⚛️", name: "React", desc: "Interfaces", level: "80%" },
    { icon: "🟨", name: "JavaScript", desc: "Logique", level: "85%" },
    { icon: "🎨", name: "CSS", desc: "Styles", level: "90%" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="logo">Mon Portfolio</div>
          <ul className="nav-links">
            <li><a href="#accueil">Accueil</a></li>
            <li><a href="#projets">Projets</a></li>
            <li><a href="#competences">Compétences</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <button className="theme-toggle" onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <section className="hero" id="accueil">
        <div className="hero-content container fade-in">
          <h1>Hello <span className="highlight">Lemuel</span></h1>
          <p className="subtitle">Développeur web</p>
          <p className="description">Bienvenue sur mon portfolio.</p>
          <div className="cta-buttons">
            <a href="#projets" className="btn btn-primary">Voir mes projets</a>
            <a href="#contact" className="btn btn-secondary">Me contacter</a>
          </div>
        </div>
      </section>

      <section id="projets" className="projects">
        <div className="container">
          <h2 className="section-title">Projets</h2>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div className="project-card" key={i}>
                <div className="project-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p className="project-description">{p.desc}</p>
                <div className="project-tags">{p.tags.map((t, j) => <span className="tag" key={j}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="competences" ref={skillsRef} className="skills">
        <div className="container">
          <h2 className="section-title">Compétences</h2>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <div className="skill-card" key={i}>
                <div className="skill-icon">{s.icon}</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <div className="skill-level"><div className="skill-bar" data-width={s.level} style={{ width: "0%" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Contact</h2>
          <p className="contact-intro">N'hésitez pas à me contacter.</p>
          <div className="contact-info">
            <div className="contact-item"><span className="contact-icon">📧</span><a href="mailto:contact@example.com">contact@example.com</a></div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Mon Portfolio</p>
        </div>
      </footer>
    </>
  );
}
