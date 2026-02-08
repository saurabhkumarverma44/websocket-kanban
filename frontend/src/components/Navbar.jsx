import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-landing">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            KanbanFlow
          </Link>

          <div className="navbar-links">
            <div 
              className="navbar-dropdown"
              onMouseEnter={() => toggleDropdown('product')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <button className="navbar-link">
                Product
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {activeDropdown === 'product' && (
                <div className="dropdown-menu">
                  <Link to="/product" className="dropdown-item">
                    <div className="dropdown-icon">📋</div>
                    <div>
                      <div className="dropdown-title">Tasks</div>
                      <div className="dropdown-desc">Manage your work efficiently</div>
                    </div>
                  </Link>
                  <Link to="/product" className="dropdown-item">
                    <div className="dropdown-icon">📊</div>
                    <div>
                      <div className="dropdown-title">Dashboards</div>
                      <div className="dropdown-desc">Visualize progress</div>
                    </div>
                  </Link>
                  <Link to="/product" className="dropdown-item">
                    <div className="dropdown-icon">🤖</div>
                    <div>
                      <div className="dropdown-title">Automations</div>
                      <div className="dropdown-desc">Save time with workflows</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <div 
              className="navbar-dropdown"
              onMouseEnter={() => toggleDropdown('solutions')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <button className="navbar-link">
                Solutions
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {activeDropdown === 'solutions' && (
                <div className="dropdown-menu">
                  <Link to="/solutions" className="dropdown-item">
                    <div className="dropdown-icon">💼</div>
                    <div>
                      <div className="dropdown-title">Project Management</div>
                      <div className="dropdown-desc">For project teams</div>
                    </div>
                  </Link>
                  <Link to="/solutions" className="dropdown-item">
                    <div className="dropdown-icon">💻</div>
                    <div>
                      <div className="dropdown-title">Software Development</div>
                      <div className="dropdown-desc">For engineering teams</div>
                    </div>
                  </Link>
                  <Link to="/solutions" className="dropdown-item">
                    <div className="dropdown-icon">📈</div>
                    <div>
                      <div className="dropdown-title">Marketing</div>
                      <div className="dropdown-desc">For marketing campaigns</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link to="/pricing" className="navbar-link">Pricing</Link>
            
            <div 
              className="navbar-dropdown"
              onMouseEnter={() => toggleDropdown('learn')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <button className="navbar-link">
                Learn
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {activeDropdown === 'learn' && (
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">
                    <div className="dropdown-icon">📚</div>
                    <div>
                      <div className="dropdown-title">Documentation</div>
                      <div className="dropdown-desc">Learn the basics</div>
                    </div>
                  </a>
                  <a href="#" className="dropdown-item">
                    <div className="dropdown-icon">🎓</div>
                    <div>
                      <div className="dropdown-title">Tutorials</div>
                      <div className="dropdown-desc">Step-by-step guides</div>
                    </div>
                  </a>
                  <a href="#" className="dropdown-item">
                    <div className="dropdown-icon">💬</div>
                    <div>
                      <div className="dropdown-title">Community</div>
                      <div className="dropdown-desc">Connect with users</div>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="navbar-right">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-navbar-secondary">Dashboard</Link>
              <button onClick={handleLogout} className="btn-navbar-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-navbar-secondary">Sign In</Link>
              <Link to="/signup" className="btn-navbar-primary">Get Started Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
