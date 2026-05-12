import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../lib/store'
import { useState } from 'react'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/dashboard',                icon: '⊞', label: 'All Snippets', end: true },
  { to: '/dashboard/bookmarks',      icon: '⭐', label: 'Bookmarks' },
  { to: '/dashboard/search',         icon: '🔍', label: 'Search' },
  { to: '/dashboard/recommendations', icon: '✨', label: 'For You' },
]

const LANGUAGES = ['python', 'javascript', 'typescript', 'rust', 'go', 'sql', 'bash']

export default function Sidebar({ onLanguageFilter, activeLanguage, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [langOpen, setLangOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onMobileClose} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logo-grad)" />
              <path d="M10 12h12M10 16h8M10 20h10" stroke="#080810" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="logo-grad" x1="2" y1="2" x2="30" y2="30">
                  <stop stopColor="#00D4FF" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="sidebar__wordmark">SnipVault</span>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              onClick={onMobileClose}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <span className="sidebar__link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__section">
          <button
            className="sidebar__section-toggle"
            onClick={() => setLangOpen(!langOpen)}
          >
            <span>Languages</span>
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {langOpen && (
            <div className="sidebar__langs">
              <button
                className={`sidebar__lang-pill ${!activeLanguage ? 'sidebar__lang-pill--active' : ''}`}
                onClick={() => onLanguageFilter?.(null)}
              >
                All
              </button>
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  className={`sidebar__lang-pill ${activeLanguage === lang ? 'sidebar__lang-pill--active' : ''}`}
                  onClick={() => onLanguageFilter?.(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {(user?.email || 'U')[0].toUpperCase()}
            </div>
            <span className="sidebar__email">{user?.email || 'User'}</span>
          </div>
          <button className="sidebar__logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
