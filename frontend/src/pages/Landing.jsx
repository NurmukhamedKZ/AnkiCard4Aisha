import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/register'); // Redirect to register or login
    };

    return (
        <div className="landing-page">
            <div className="container">
                {/* Navbar */}
                <nav className="landing-nav fade-in">
                    <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Story<span style={{ color: 'var(--accent)' }}>.io</span>
                    </div>
                    <div className="nav-links desktop-only">
                        <Link to="/" className="nav-link">Home</Link>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#solutions" className="nav-link">Solutions</a>
                    </div>
                    <div className="nav-auth flex gap-2">
                        <Link to="/login" className="btn btn-secondary btn-sm">Log in</Link>
                        <button onClick={handleGetStarted} className="btn btn-primary btn-sm">Get Started</button>
                    </div>
                </nav>

                {/* Hero Section */}
                {/* Hero Section */}
                <header className="hero-section fade-in">
                    {/* Floating Cards Layer - Background */}
                    <div className="hero-cards-container">

                        {/* Anatomy Card - Top Left */}
                        <div className="specific-card anatomy-card floating" style={{ '--delay': '0s' }}>
                            <div className="card-header">
                                <div className="card-badge blue-badge">
                                    <span className="badge-icon">🦴</span> Anatomy
                                </div>
                            </div>
                            <div className="card-image-area">
                                {/* SVG Skeleton Hand Placeholder */}
                                <svg viewBox="0 0 100 100" className="skeleton-svg">
                                    <path d="M45,80 L45,60 M55,80 L55,60 M40,50 L40,30 M50,50 L50,20 M60,50 L60,30" stroke="#ddd" strokeWidth="4" strokeLinecap="round" />
                                    <circle cx="50" cy="90" r="8" fill="#eee" />
                                    {/* Occlusion Box */}
                                    <rect x="52" y="35" width="20" height="10" rx="4" fill="#3b82f6" className="occlusion-box" />
                                </svg>
                                <div className="occlusion-label">Name the highlighted bone.</div>
                            </div>
                        </div>

                        {/* Japanese Card - Bottom Left */}
                        <div className="specific-card japanese-card floating" style={{ '--delay': '2s' }}>
                            <div className="card-header">
                                <div className="card-badge purple-badge">
                                    <span className="badge-icon">🎌</span> Japanese
                                </div>
                            </div>
                            <div className="card-content-area text-center">
                                <div className="sushi-icon" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🍙</div>
                                <h3 style={{ margin: 0 }}>おにぎり</h3>
                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>|Onigiri|</p>
                            </div>
                        </div>

                        {/* English Card - Top Right */}
                        <div className="specific-card english-card floating" style={{ '--delay': '1s' }}>
                            <div className="card-header">
                                <div className="card-badge red-badge">
                                    <span className="badge-icon">🅰️</span> English words
                                </div>
                            </div>
                            <div className="card-content-area">
                                <div className="handshake-icon" style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>🤝</div>
                                <h4 style={{ margin: '0 0 0.2rem', textAlign: 'center' }}>Altruistic</h4>
                                <div className="text-muted text-center" style={{ fontSize: '0.8rem' }}>/ˌæl.truˈɪs.tɪk/</div>
                            </div>
                        </div>

                        {/* Physics/Cloze Card - Bottom Right */}
                        <div className="specific-card physics-card floating" style={{ '--delay': '3s' }}>
                            <div className="card-header">
                                <div className="card-badge orange-badge">
                                    <span className="badge-icon">📝</span> Physics
                                </div>
                            </div>
                            <div className="card-content-area">
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Resultant force calculation</h4>
                                <div className="cloze-content" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    <div>m = 5 kg</div>
                                    <div>a = 0.69 m/c²</div>
                                    <br />
                                    <div>F = ?</div>
                                    <div className="handwritten-note" style={{ color: '#ef4444', transform: 'rotate(-5deg)', marginTop: '0.5rem' }}>
                                        F = 5 * 0.69 <br />
                                        F = 3.45 N
                                    </div>
                                    <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                                        Newton's second law<br />
                                        of motion is F= <span className="cloze-box"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Main Text Content - Centered */}
                    <div className="hero-center-content">
                        <h1 className="hero-title">
                            Satory Flashcards:<br />
                            Learn More, Stress Less
                        </h1>
                        <p className="hero-subtitle">
                            Crush exams, master languages, and more, with the science-backed
                            magic of spaced repetition. Join our community of 6M+ users!
                        </p>
                        <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                            Sign up for free
                        </button>
                        <p className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                            More than 50,000 pre-made decks. Try now!
                        </p>
                    </div>
                </header>

                {/* How it Works Section */}
                <section id="how-it-works" className="how-it-works-section">
                    <div className="text-center mb-2">
                        <div className="badge white-badge">
                            <span style={{ marginRight: '0.5rem' }}>🔧</span> How it works
                        </div>
                    </div>

                    <div className="steps-container">
                        {[
                            {
                                id: 1,
                                title: "Upload your study materials",
                                desc: "No matter what format you study, just upload it and start a new study journey.",
                                imgPlaceholder: "📚",
                                align: "left"
                            },
                            {
                                id: 2,
                                title: "Generate quality flashcards",
                                desc: "Generate flashcards and image occlusions from a simple highlight.",
                                imgPlaceholder: "✨",
                                align: "right"
                            },
                            {
                                id: 3,
                                title: "Study with Spaced Repetition",
                                desc: "Our spaced repetition algorithm will manage your flashcard review maximizing memorization and minimizing effort!",
                                imgPlaceholder: "🧠",
                                align: "left"
                            },
                            {
                                id: 4,
                                title: "Test your knowledge with quizzes",
                                desc: "Build confidence with hundreds of quizzes. We will give you explanations for each mistake.",
                                imgPlaceholder: "📝",
                                align: "right"
                            }
                        ].map((step) => (
                            <div key={step.id} className={`step-card ${step.align === 'right' ? 'reverse' : ''} scroll-reveal`}>
                                <div className="step-content">
                                    <div className="step-number">{step.id}</div>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-desc">{step.desc}</p>
                                    <button className="btn btn-secondary btn-sm mt-2">Learn More</button>
                                </div>
                                <div className="step-visual">
                                    <div className="visual-placeholder">
                                        <span style={{ fontSize: '4rem' }}>{step.imgPlaceholder}</span>
                                        {/* In a real app, <img> would go here */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Use Cases Section */}
                <section id="solutions" className="use-cases-section">
                    <div className="text-center mb-2">
                        <h2 className="section-title">Designed for everyone</h2>
                        <p className="section-subtitle" style={{ marginBottom: '3rem' }}>Tailored tools for every learning journey</p>
                    </div>

                    <div className="use-cases-grid">
                        <div className="use-case-card">
                            <span className="use-case-badge">Students</span>
                            <h3>Ace Your Exams</h3>
                            <p className="text-muted mt-2">
                                Stop cramming. Use spaced repetition to retain medical, legal, or engineering concepts forever.
                            </p>
                        </div>
                        <div className="use-case-card">
                            <span className="use-case-badge">Language Learners</span>
                            <h3>Fluent Faster</h3>
                            <p className="text-muted mt-2">
                                Master vocabulary and grammar patterns with audio-supported flashcards and context.
                            </p>
                        </div>
                        <div className="use-case-card">
                            <span className="use-case-badge">Professionals</span>
                            <h3>Continuous Growth</h3>
                            <p className="text-muted mt-2">
                                Stay sharp with industry certifications and keep up with new technologies efficiently.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="landing-footer">
                    <div>© 2026 Satory. All rights reserved.</div>
                    <div className="flex gap-2">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Contact</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Landing;
