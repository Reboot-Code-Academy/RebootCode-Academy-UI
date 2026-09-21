import { useEffect, useState } from 'react'
import { navLinks } from '../data/siteData.js'

const CONTACT_KEY = 'reboot-code-academy-contact-information'

const defaultContact = {
  phone: '',
  whatsapp: '',
  email: '',
  supportEmail: '',
  addressLine1: '',
  addressLine2: '',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  telegram: '',
  mondayFriday: '09:00 AM - 07:00 PM',
  saturday: '09:00 AM - 05:00 PM',
  sunday: 'Closed',
  googleMapsUrl: '',
}

function Footer({ onNavigate }) {
  const [contact, setContact] = useState(defaultContact)

  useEffect(() => {
    const loadContact = () => {
      try {
        const savedContact = localStorage.getItem(CONTACT_KEY)

        if (!savedContact) {
          setContact(defaultContact)
          return
        }

        const parsedContact = JSON.parse(savedContact)

        setContact({
          ...defaultContact,
          ...parsedContact,
        })
      } catch (error) {
        console.error('Could not load contact information:', error)
        setContact(defaultContact)
      }
    }

    loadContact()

    window.addEventListener('storage', loadContact)
    window.addEventListener('focus', loadContact)

    return () => {
      window.removeEventListener('storage', loadContact)
      window.removeEventListener('focus', loadContact)
    }
  }, [])

  const fullAddress = [
    contact.addressLine1,
    contact.addressLine2,
    [contact.city, contact.state].filter(Boolean).join(', '),
    contact.pincode,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <footer className="site-footer">

      {/* BRAND */}
      <div className="footer-brand-column">
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

      {/* NAVIGATION */}
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

      {/* CONTACT */}
      <div className="footer-contact">

        <strong>Contact</strong>

        {contact.phone && (
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
          >
            {contact.phone}
          </a>
        )}

        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </a>
        )}

        {fullAddress && (
          <span>{fullAddress}</span>
        )}

        {contact.googleMapsUrl && (
          <a
            href={contact.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on Google Maps
          </a>
        )}

        {/* SOCIAL MEDIA */}
        {(contact.instagram ||
          contact.facebook ||
          contact.linkedin ||
          contact.youtube ||
          contact.telegram) && (

          <div className="footer-social-links">

            {/* Instagram */}
            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1.2"
                    fill="currentColor"
                  />
                </svg>
              </a>
            )}

            {/* Facebook */}
            {contact.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            )}

            {/* LinkedIn */}
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M6 8.5A2 2 0 1 0 6 4.5a2 2 0 0 0 0 4ZM4.5 10H7.5V20H4.5V10ZM10 10h2.9v1.4h.1c.4-.8 1.4-1.7 3.2-1.7 3.4 0 4 2.2 4 5.1V20h-3v-4.6c0-1.1 0-2.5-1.6-2.5s-1.8 1.2-1.8 2.4V20H10V10Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            )}

            {/* YouTube */}
            {contact.youtube && (
              <a
                href={contact.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                title="YouTube"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M21 8.2a2.8 2.8 0 0 0-2-2C17.2 5.7 12 5.7 12 5.7s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2C2.5 10 2.5 12 2.5 12s0 2 .5 3.8a2.8 2.8 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.8 2.8 0 0 0 2-2c.5-1.8.5-3.8.5-3.8s0-2-.5-3.8Z"
                    fill="currentColor"
                  />

                  <path
                    d="m10 9 5 3-5 3V9Z"
                    fill="white"
                  />
                </svg>
              </a>
            )}

            {/* Telegram */}
            {contact.telegram && (
              <a
                href={contact.telegram}
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                title="Telegram"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M21.5 4.5 18.3 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.7 13.7l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.2 4c.9-.3 1.7.2 1.3.5Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            )}

          </div>
        )}

      </div>
    </footer>
  )
}

export default Footer