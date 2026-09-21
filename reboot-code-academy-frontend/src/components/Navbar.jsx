import { useState } from 'react'
import { navLinks } from '../data/siteData.js'

function Navbar({ activePath, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleNavigate(event, path) {
    event.preventDefault()
    setIsMenuOpen(false)
    onNavigate(path)
  }

  return (
    <header className={`site-header ${isMenuOpen ? 'menu-open' : ''}`}>
      <a
        className="brand"
        href="/"
        onClick={(event) => handleNavigate(event, '/')}
      >
        <span className="brand-mark">RC</span>
        <span>
          <strong>Reboot Code Academy</strong>
          <small>Programming Courses</small>
        </span>
      </a>

      <button
        aria-controls="primary-navigation"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="menu-toggle"
        type="button"
        onClick={() => {
          setIsMenuOpen((currentValue) => !currentValue)
        }}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        aria-label="Main navigation"
        className={isMenuOpen ? 'show-menu' : ''}
        id="primary-navigation"
      >
        {navLinks.map((link) => (
          <a
            className={activePath === link.path ? 'active' : ''}
            href={link.path}
            key={link.path}
            onClick={(event) => handleNavigate(event, link.path)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
