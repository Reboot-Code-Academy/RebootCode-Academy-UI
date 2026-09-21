import { contactInfo, navLinks } from '../data/siteData.js'

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div>
        <a
          className="brand footer-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('/')
          }}
        >
          <span className="brand-mark">RC</span>
          <span>
            <strong>Reboot Code Academy</strong>
            <small>Learn. Build. Grow.</small>
          </span>
        </a>
        <p>
          Practical programming training for students who want real projects,
          strong fundamentals, and career-ready confidence.
        </p>
      </div>

      <div className="footer-links">
        {navLinks.slice(0, 5).map((link) => (
          <a
            href={link.path}
            key={link.path}
            onClick={(event) => {
              event.preventDefault()
              onNavigate(link.path)
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="footer-contact">
        <strong>Contact</strong>
        <span>{contactInfo.phone}</span>
        <span>{contactInfo.email}</span>
        <span>{contactInfo.address}</span>
      </div>
    </footer>
  )
}

export default Footer
