import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar'
import TopBar from '../../components/layout/TopBar'
import SnippetForm from '../../components/snippet/SnippetForm'
import './Dashboard.css'

const TITLES = {
  '/dashboard': 'All Snippets',
  '/dashboard/bookmarks': 'Bookmarks',
  '/dashboard/search': 'Search',
  '/dashboard/recommendations': 'For You',
}

export default function Dashboard() {
  const location = useLocation()
  const [showForm, setShowForm] = useState(false)
  const [langFilter, setLangFilter] = useState(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const title = TITLES[location.pathname] || 'Dashboard'

  return (
    <div className="dashboard">
      <Sidebar
        activeLanguage={langFilter}
        onLanguageFilter={setLangFilter}
        mobileOpen={mobileMenu}
        onMobileClose={() => setMobileMenu(false)}
      />
      <main className="dashboard__main">
        <TopBar
          title={title}
          onNewSnippet={() => setShowForm(true)}
          onMobileMenu={() => setMobileMenu(true)}
        />
        <div className="dashboard__content">
          <Outlet context={{ langFilter }} />
        </div>
      </main>
      {showForm && <SnippetForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
