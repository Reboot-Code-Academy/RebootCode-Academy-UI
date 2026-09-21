import { useEffect, useState } from 'react'

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

function getSavedContact() {
  try {
    const saved = localStorage.getItem(CONTACT_KEY)
    return saved ? { ...defaultContact, ...JSON.parse(saved) } : defaultContact
  } catch {
    return defaultContact
  }
}

function ContactInformationManager() {
  const [form, setForm] = useState(getSavedContact)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const handleStorage = () => setForm(getSavedContact())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    setSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    localStorage.setItem(CONTACT_KEY, JSON.stringify(form))
    setSaved(true)
  }

  function handleReset() {
    const confirmed = window.confirm(
      'Reset contact information to the default values?'
    )

    if (!confirmed) return

    localStorage.setItem(CONTACT_KEY, JSON.stringify(defaultContact))
    setForm(defaultContact)
    setSaved(true)
  }

  function renderInput(label, field, type = 'text', placeholder = '') {
    return (
      <label className="contact-info-field">
        <span>{label}</span>
        <input
          type={type}
          value={form[field]}
          placeholder={placeholder}
          onChange={(event) => updateField(field, event.target.value)}
        />
      </label>
    )
  }

  return (
    <section className="admin-contact-information">
      <div className="admin-page-heading">
        <div>
          <span className="admin-page-eyebrow">SETTINGS</span>
          <h1>Contact Information</h1>
          <p>
            Manage the academy contact details displayed across the public
            website.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="contact-info-card">
          <div className="contact-info-card-heading">
            <div>
              <h2>Contact Details</h2>
              <p>Phone numbers and email addresses.</p>
            </div>
          </div>

          <div className="contact-info-grid">
            {renderInput('Phone Number', 'phone', 'tel', '+91 XXXXX XXXXX')}
            {renderInput('WhatsApp Number', 'whatsapp', 'tel', '+91 XXXXX XXXXX')}
            {renderInput('Email Address', 'email', 'email', 'info@example.com')}
            {renderInput(
              'Support Email',
              'supportEmail',
              'email',
              'support@example.com'
            )}
          </div>
        </div>

        <div className="contact-info-card">
          <div className="contact-info-card-heading">
            <div>
              <h2>Academy Address</h2>
              <p>Address information shown on the Contact page and Footer.</p>
            </div>
          </div>

          <div className="contact-info-grid">
            {renderInput('Address Line 1', 'addressLine1', 'text', 'Street / Building')}
            {renderInput('Address Line 2', 'addressLine2', 'text', 'Area / Landmark')}
            {renderInput('City', 'city', 'text', 'Bangalore')}
            {renderInput('State', 'state', 'text', 'Karnataka')}
            {renderInput('Pincode', 'pincode', 'text', '560037')}
          </div>
        </div>

        <div className="contact-info-card">
          <div className="contact-info-card-heading">
            <div>
              <h2>Social Media</h2>
              <p>Paste the public profile URLs for each platform.</p>
            </div>
          </div>

          <div className="contact-info-grid">
            {renderInput('Instagram', 'instagram', 'url', 'https://instagram.com/...')}
            {renderInput('Facebook', 'facebook', 'url', 'https://facebook.com/...')}
            {renderInput('LinkedIn', 'linkedin', 'url', 'https://linkedin.com/...')}
            {renderInput('YouTube', 'youtube', 'url', 'https://youtube.com/...')}
            {renderInput('Telegram', 'telegram', 'url', 'https://t.me/...')}
          </div>
        </div>

        <div className="contact-info-card">
          <div className="contact-info-card-heading">
            <div>
              <h2>Working Hours</h2>
              <p>Displayed wherever academy timings are shown.</p>
            </div>
          </div>

          <div className="contact-info-grid">
            {renderInput('Monday - Friday', 'mondayFriday', 'text', '09:00 AM - 07:00 PM')}
            {renderInput('Saturday', 'saturday', 'text', '09:00 AM - 05:00 PM')}
            {renderInput('Sunday', 'sunday', 'text', 'Closed')}
          </div>
        </div>

        <div className="contact-info-card">
          <div className="contact-info-card-heading">
            <div>
              <h2>Google Maps</h2>
              <p>Optional map link for the academy location.</p>
            </div>
          </div>

          <div className="contact-info-grid contact-info-grid-single">
            {renderInput(
              'Google Maps URL',
              'googleMapsUrl',
              'url',
              'https://maps.google.com/...'
            )}
          </div>
        </div>

        <div className="contact-info-actions">
          {saved && <span className="contact-info-saved">Saved successfully.</span>}

          <button
            type="button"
            className="admin-secondary-button"
            onClick={handleReset}
          >
            Reset
          </button>

          <button type="submit" className="admin-primary-button">
            Save Changes
          </button>
        </div>
      </form>
    </section>
  )
}

export default ContactInformationManager
