import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { register as apiRegister } from '../lib/api'
import { useAuthStore } from '../lib/store'
import Button from '../components/ui/Button'
import './Auth.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiRegister({ email, password })
      setToken(res.data.access_token)
      setUser({ email })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__blob auth-page__blob--cyan" />
      <div className="auth-page__blob auth-page__blob--violet" />
      <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="auth-card__brand">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#rg)"/><path d="M10 12h12M10 16h8M10 20h10" stroke="#080810" strokeWidth="2" strokeLinecap="round"/><defs><linearGradient id="rg" x1="2" y1="2" x2="30" y2="30"><stop stopColor="#00D4FF"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient></defs></svg>
          <span className="auth-card__wordmark">SnipVault</span>
        </div>
        <h2 className="auth-card__title">Create account</h2>
        <form className="auth-card__form" onSubmit={handleSubmit}>
          {error && <motion.div className="auth-card__error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}
          <div className="auth-card__field">
            <input type="email" className="input-glass" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ fontFamily: 'var(--font-code)' }} />
          </div>
          <div className="auth-card__field auth-card__field--pw">
            <input type={showPw ? 'text' : 'password'} className="input-glass" placeholder="Choose a password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" className="auth-card__pw-toggle" onClick={() => setShowPw(!showPw)}>
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>Create account</Button>
        </form>
        <p className="auth-card__switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </motion.div>
    </div>
  )
}
