import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Enhanced Landing Page Component
 * 
 * Features:
 * - Animated hero section with gradient background
 * - Real-time statistics counter
 * - Feature cards with icons
 * - Customer testimonials
 * - Pricing comparison
 * - Trust badges and social proof
 * - Call-to-action sections
 * - Responsive design with mobile optimization
 * 
 * @component
 */
const LandingPage = () => {
  const navigate = useNavigate();
  
  // Animated counter for statistics
  const [stats, setStats] = useState({
    users: 0,
    tasks: 0,
    uptime: 0,
    countries: 0
  });

  // Counter animation effect
  useEffect(() => {
    const targetStats = {
      users: 50000,
      tasks: 2500000,
      uptime: 99.9,
      countries: 150
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        users: Math.floor(targetStats.users * progress),
        tasks: Math.floor(targetStats.tasks * progress),
        uptime: (targetStats.uptime * progress).toFixed(1),
        countries: Math.floor(targetStats.countries * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Task Management',
      description: 'Create, assign, and track tasks with ease. Drag and drop to move tasks between columns with real-time updates.',
      color: '#0079bf'
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly. Assign tasks, add comments, and get instant notifications when things change.',
      color: '#5aac44'
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Multiple Views',
      description: 'Visualize your work in Kanban, List, Calendar, or Gantt chart views. Choose what works best for your team.',
      color: '#eb5a46'
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Time Tracking',
      description: 'Track time spent on tasks automatically. Generate detailed reports and gain insights into productivity.',
        color: '#f2d600'
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Workflow Automation',
      description: 'Automate repetitive tasks and workflows. Set triggers and actions to save time and reduce manual work.',
      color: '#c377e0'
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Analytics & Insights',
      description: 'Get deep insights into team performance. Track progress with comprehensive charts and dashboards.',
      color: '#61bd4f'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager at TechCorp',
      avatar: 'SJ',
      text: 'KanbanFlow transformed how our team works. Real-time updates and intuitive interface made collaboration seamless.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Engineering Lead at StartupXYZ',
      avatar: 'MC',
      text: 'Best project management tool we\'ve used. The automation features alone saved us 10 hours per week.',
      rating: 5
    },
    {
      name: 'Emma Williams',
      role: 'Marketing Director at GrowthCo',
      avatar: 'EW',
      text: 'Simple, powerful, and affordable. Our team adopted it in minutes. The analytics helped us improve our workflow by 40%.',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 10 team members',
        'Unlimited tasks',
        'Basic integrations',
        'Mobile apps',
        'Community support'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per user/month',
      features: [
        'Unlimited team members',
        'Advanced automations',
        'Priority support',
        'Custom fields',
        'Time tracking',
        'Advanced reporting'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      features: [
        'Everything in Pro',
        'SSO & SAML',
        'Advanced security',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  const trustBadges = [
    { name: 'SOC 2 Type II Certified', icon: '🔒' },
    { name: 'GDPR Compliant', icon: '🇪🇺' },
    { name: '99.9% Uptime SLA', icon: '⚡' },
    { name: '24/7 Support', icon: '💬' }
  ];

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content container">
          <div className="hero-text">
            <h1 className="hero-title">
              Manage Projects with
              <span className="gradient-text"> Real-Time Collaboration</span>
            </h1>
            <p className="hero-description">
              Save time and get more done. KanbanFlow brings all your tasks, docs, goals,
              and team communication into one powerful workspace.
            </p>
            <div className="hero-features">
              <span className="hero-feature">
                <svg className="checkmark" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free forever
              </span>
              <span className="hero-feature">
                <svg className="checkmark" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="hero-feature">
                <svg className="checkmark" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Setup in 2 minutes
              </span>
            </div>
            <div className="hero-cta">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/signup')}
                aria-label="Sign up for free account"
              >
                Get Started Free
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => {
                  document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="Watch product demo"
              >
                Watch Demo
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-preview">
              <div className="dashboard-header">
                <div className="dashboard-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
              </div>
              <div className="dashboard-body">
                {/* Animated Kanban board preview */}
                <div className="preview-columns">
                  <div className="preview-column">
                    <div className="preview-card"></div>
                    <div className="preview-card"></div>
                  </div>
                  <div className="preview-column">
                    <div className="preview-card"></div>
                    <div className="preview-card"></div>
                    <div className="preview-card"></div>
                  </div>
                  <div className="preview-column">
                    <div className="preview-card"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-badges">
            {trustBadges.map((badge, index) => (
              <div key={index} className="trust-badge">
                <span className="trust-icon">{badge.icon}</span>
                <span className="trust-text">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Trusted by teams worldwide</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.users.toLocaleString()}+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.tasks.toLocaleString()}+</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.uptime}%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.countries}+</div>
              <div className="stat-label">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful features to boost productivity</h2>
            <p className="section-subtitle">
              Everything you need to manage projects efficiently and collaborate with your team
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ '--accent-color': feature.color }}>
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="demo-section">
        <div className="container">
          <div className="demo-content">
            <div className="demo-text">
              <h2 className="section-title">See KanbanFlow in action</h2>
              <p className="section-subtitle">
                Watch how teams use KanbanFlow to streamline their workflow and boost productivity
              </p>
              <ul className="demo-features">
                <li>
                  <svg className="checkmark-lg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Drag-and-drop task management
                </li>
                <li>
                  <svg className="checkmark-lg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time team collaboration
                </li>
                <li>
                  <svg className="checkmark-lg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Powerful filtering and search
                </li>
              </ul>
            </div>
            <div className="demo-video">
              <div className="video-placeholder">
                <svg className="play-icon" viewBox="0 0 84 84" fill="none">
                  <circle cx="42" cy="42" r="42" fill="rgba(0, 121, 191, 0.1)" />
                  <circle cx="42" cy="42" r="36" fill="rgba(0, 121, 191, 0.9)" />
                  <path d="M36 30L54 42L36 54V30Z" fill="white" />
                </svg>
                <p className="video-text">2 min demo video</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Loved by teams everywhere</h2>
          <p className="section-subtitle">
            See what our customers have to say about KanbanFlow
          </p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="star-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple, transparent pricing</h2>
            <p className="section-subtitle">
              Choose the plan that's right for your team. No hidden fees.
            </p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.highlighted ? 'pricing-card-highlighted' : ''}`}
              >
                {plan.highlighted && <div className="pricing-badge">Most Popular</div>}
                <div className="pricing-header">
                  <h3 className="pricing-name">{plan.name}</h3>
                  <div className="pricing-price">
                    <span className="price-amount">{plan.price}</span>
                    <span className="price-period">{plan.period}</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <svg className="checkmark-sm" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'} btn-full`}
                  onClick={() => navigate('/signup')}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to boost your productivity?</h2>
            <p className="cta-subtitle">
              Join thousands of teams already using KanbanFlow to manage their projects
            </p>
            <div className="cta-buttons">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/signup')}
              >
                Start Free Trial
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => navigate('/contact')}
              >
                Contact Sales
              </button>
            </div>
            <p className="cta-note">No credit card required • Free forever plan available</p>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        /* Hero Section Styles */
        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0.95;
        }

        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          color: white;
          margin-bottom: 1.5rem;
        }

        .gradient-text {
          background: linear-gradient(90deg, #fff 0%, #a8edea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-features {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-size: 0.95rem;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          color: #61bd4f;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
          margin-left: 0.5rem;
        }

        .hero-image {
          perspective: 1000px;
        }

        .dashboard-preview {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          transform: rotateY(-10deg) rotateX(5deg);
          transition: transform 0.3s ease;
        }

        .dashboard-preview:hover {
          transform: rotateY(-5deg) rotateX(2deg);
        }

        .dashboard-header {
          background: #f5f5f5;
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .dashboard-dots {
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot-red { background: #ff5f56; }
        .dot-yellow { background: #ffbd2e; }
        .dot-green { background: #27c93f; }

        .dashboard-body {
          padding: 2rem;
          min-height: 300px;
        }

        .preview-columns {
          display: flex;
          gap: 1rem;
        }

        .preview-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .preview-card {
          background: #f0f0f0;
          border-radius: 6px;
          height: 60px;
          animation: pulse 2s ease-in-out infinite;
        }

        .preview-card:nth-child(1) { animation-delay: 0s; }
        .preview-card:nth-child(2) { animation-delay: 0.2s; }
        .preview-card:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Trust Section */
        .trust-section {
          background: white;
          padding: 2rem 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .trust-badges {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #5e6c84;
          font-size: 0.9rem;
        }

        .trust-icon {
          font-size: 1.5rem;
        }

        /* Stats Section */
        .stats-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .stat-card {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          color: #0079bf;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1rem;
          color: #5e6c84;
        }

        /* Features Section */
        .features-section {
          padding: 6rem 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #172b4d;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: #5e6c84;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-top: 4px solid var(--accent-color);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .feature-icon-wrapper {
          width: 60px;
          height: 60px;
          background: var(--accent-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .feature-icon {
          width: 32px;
          height: 32px;
          color: white;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #172b4d;
          margin-bottom: 1rem;
        }

        .feature-description {
          font-size: 1rem;
          color: #5e6c84;
          line-height: 1.6;
        }

        /* Demo Section */
        .demo-section {
          padding: 6rem 0;
          background: #f5f7fa;
        }

        .demo-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .demo-features {
          list-style: none;
          padding: 0;
          margin-top: 2rem;
        }

        .demo-features li {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          font-size: 1.1rem;
          color: #172b4d;
        }

        .checkmark-lg {
          width: 24px;
          height: 24px;
          color: #61bd4f;
        }

        .demo-video {
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          overflow: hidden;
        }

        .video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .video-placeholder:hover {
          transform: scale(1.05);
        }

        .play-icon {
          width: 84px;
          height: 84px;
          margin-bottom: 1rem;
        }

        .video-text {
          color: white;
          font-size: 1rem;
        }

        /* Testimonials Section */
        .testimonials-section {
          padding: 6rem 0;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .testimonial-card {
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .testimonial-rating {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .star-icon {
          width: 20px;
          height: 20px;
          color: #f2d600;
        }

        .testimonial-text {
          font-size: 1rem;
          color: #5e6c84;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .author-name {
          font-weight: 600;
          color: #172b4d;
        }

        .author-role {
          font-size: 0.9rem;
          color: #5e6c84;
        }

        /* Pricing Section */
        .pricing-section {
          padding: 6rem 0;
          background: #f5f7fa;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .pricing-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .pricing-card-highlighted {
          border: 2px solid #0079bf;
          transform: scale(1.05);
        }

        .pricing-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #0079bf;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .pricing-header {
          text-align: center;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 2rem;
        }

        .pricing-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #172b4d;
          margin-bottom: 1rem;
        }

        .price-amount {
          font-size: 3rem;
          font-weight: 800;
          color: #0079bf;
        }

        .price-period {
          display: block;
          font-size: 0.9rem;
          color: #5e6c84;
          margin-top: 0.5rem;
        }

        .pricing-features {
          list-style: none;
          padding: 0;
          margin-bottom: 2rem;
        }

        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          color: #172b4d;
        }

        .checkmark-sm {
          width: 20px;
          height: 20px;
          color: #61bd4f;
          flex-shrink: 0;
        }

        .btn-full {
          width: 100%;
        }

        /* CTA Section */
        .cta-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          text-align: center;
        }

        .cta-title {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .cta-note {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .demo-content {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 2rem;
          }

          .cta-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
