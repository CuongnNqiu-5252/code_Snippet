import { useState, useRef } from 'react'
import './CodeBlock.css'

export default function CodeBlock({ code, language, maxHeight = 400 }) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const lines = code?.split('\n') || []

  return (
    <div className="code-block" style={{ maxHeight }}>
      <div className="code-block__header">
        <span className="code-block__lang">{language}</span>
        <button className="code-block__copy" onClick={handleCopy}>
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied ✓
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="code-block__pre" ref={preRef}>
        <code className="code-block__code">
          {lines.map((line, i) => (
            <div key={i} className="code-block__line">
              <span className="code-block__line-number">{i + 1}</span>
              <span className="code-block__line-content">{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
