import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Landing.css'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

export default function Landing() {
  return (
    <div className="landing">
      {/* Background blobs */}
      <div className="landing__blob landing__blob--cyan" />
      <div className="landing__blob landing__blob--violet" />

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <motion.div className="hero__content" variants={stagger} initial="hidden" animate="show">
          <motion.div className="hero__pill" variants={fadeUp}>
            <span className="hero__pill-icon">✦</span> AI-Powered · Open Source
          </motion.div>
          <motion.h1 className="hero__headline" variants={fadeUp}>
            Code once.<br />
            <span className="hero__headline-accent">Find it always.</span>
          </motion.h1>
          <motion.p className="hero__body" variants={fadeUp}>
            SnipVault uses AI to summarize your code, generate semantic embeddings, and surface the right snippet exactly when you need it.
          </motion.p>
          <motion.div className="hero__buttons" variants={fadeUp}>
            <Link to="/register" className="hero__cta-primary">
              Start for free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener" className="hero__cta-ghost">View on GitHub</a>
          </motion.div>
          <motion.p className="hero__proof" variants={fadeUp}>Built on FastAPI · MongoDB · OpenAI</motion.p>
        </motion.div>

        <motion.div className="hero__mockup" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
          <div className="hero__glow" />
          <div className="hero__card">
            <div className="hero__card-header">
              <span className="hero__card-badge">Python</span>
              <span className="hero__card-title">Binary Search</span>
            </div>
            <pre className="hero__card-code"><code>{`def binary_search(arr, x):
    lo, hi = 0, len(arr)-1
    while lo <= hi:`}</code></pre>
            <div className="hero__card-summary">
              <p>Efficient O(log n) search algorithm for sorted arrays using divide and conquer...</p>
            </div>
            <div className="hero__card-status"><span className="hero__status-dot" />AI Analyzed</div>
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="features">
        <motion.h2 className="features__title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Everything you need to manage code
        </motion.h2>
        <motion.div className="features__grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {[
            { icon: '⚡', title: 'Instant AI Analysis', desc: 'Paste code and get summaries, tags, and embeddings in seconds.' },
            { icon: '🔍', title: 'Semantic Search', desc: 'Find snippets by concept, not keyword. "fast sort" finds quicksort.' },
            { icon: '📌', title: 'Smart Organization', desc: 'Language filters, tag system, and bookmarks keep your vault tidy.' },
          ].map(f => (
            <motion.div key={f.title} className="features__card" variants={fadeUp}>
              <span className="features__icon">{f.icon}</span>
              <h3 className="features__card-title">{f.title}</h3>
              <p className="features__card-desc">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="steps">
        <motion.h2 className="steps__title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>How it works</motion.h2>
        <div className="steps__flow">
          {[
            { num: '1', title: 'Paste Code', desc: 'Drop your snippet into SnipVault.' },
            { num: '2', title: 'AI Processes', desc: 'GPT summarizes, tags, and embeds.' },
            { num: '3', title: 'Search & Reuse', desc: 'Find it instantly, anytime.' },
          ].map((step, i) => (
            <div key={step.num} className="steps__item">
              {i > 0 && <div className="steps__line" />}
              <div className="steps__circle">{step.num}</div>
              <h4 className="steps__step-title">{step.title}</h4>
              <p className="steps__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="cta">
        <div className="cta__wrapper">
          <div className="cta__inner">
            <h2 className="cta__headline">Your snippets deserve better.</h2>
            <p className="cta__sub">Start organizing your code with AI today.</p>
            <Link to="/register" className="hero__cta-primary">
              Create your vault
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="landing-footer__left">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#fg)"/><path d="M10 12h12M10 16h8M10 20h10" stroke="#080810" strokeWidth="2" strokeLinecap="round"/><defs><linearGradient id="fg" x1="2" y1="2" x2="30" y2="30"><stop stopColor="#00D4FF"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient></defs></svg>
          <span>SnipVault</span>
        </div>
        <span className="landing-footer__right">Built with FastAPI + OpenAI</span>
      </footer>
    </div>
  )
}
