import { useState } from 'react'

const STUDENTS_KEY = 'reboot-code-academy-students'
const SESSION_KEY = 'reboot-code-academy-student-session'

function StudentLogin({ onNavigate }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function getStudents() {
    try {
      const stored = JSON.parse(
        localStorage.getItem(STUDENTS_KEY) || '[]'
      )

      return Array.isArray(stored) ? stored : []
    } catch {
      return []
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const value = identifier.trim().toLowerCase()

    if (!value) {
      setError('Please enter your Student ID or email.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    const students = getStudents()

    const student = students.find((item) => {
      const id = String(item.id || '').trim().toLowerCase()
      const email = String(item.email || '').trim().toLowerCase()

      return id === value || email === value
    })

    if (!student) {
      setError(
        'Student account not found. Please check your Student ID or email.'
      )
      return
    }

    if (student.status === 'Inactive') {
      setError(
        'This student account is inactive. Please contact the academy.'
      )
      return
    }

    /*
      TEMPORARY DEVELOPMENT LOGIN

      Password authentication will be connected to
      Supabase Auth later.

      For now, any non-empty password allows an
      existing active student record to enter the portal.

      The password is NOT stored in localStorage.
    */

    const session = {
      studentId: student.id,
      loginAt: new Date().toISOString(),
    }

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    )

    if (onNavigate) {
      onNavigate('/student-dashboard')
    }
  }

  function handleContactClick(event) {
    event.preventDefault()

    if (onNavigate) {
      onNavigate('/contact')
    }
  }

  return (
    <div className="student-login-page">
      <div className="student-login-shell">

        {/* Left branding / learning panel */}
        <aside className="student-login-showcase">
          <div className="student-showcase-brand">
            <div className="student-login-logo">RC</div>

            <div>
              <strong>Reboot Code Academy</strong>
              <span>Student Portal</span>
            </div>
          </div>

          <div className="student-showcase-content">
            <span className="eyebrow">YOUR LEARNING SPACE</span>

            <h1>Learn. Practice. Build. Grow.</h1>

            <p>
              Access your course, learning materials, announcements, and
              academy information from one place.
            </p>

            <div className="student-feature-list">
              <div>
                <span className="student-feature-icon">&lt;/&gt;</span>
                <div>
                  <strong>My Course</strong>
                  <small>View your enrolled course</small>
                </div>
              </div>

              <div>
                <span className="student-feature-icon">◆</span>
                <div>
                  <strong>Course Materials</strong>
                  <small>Access your learning resources</small>
                </div>
              </div>

              <div>
                <span className="student-feature-icon">↗</span>
                <div>
                  <strong>Academy Updates</strong>
                  <small>Stay informed about announcements</small>
                </div>
              </div>
            </div>
          </div>

          <div className="student-showcase-code" aria-hidden="true">
            <span>student</span>
            <b>.learn()</b>
            <small>→ build something useful</small>
          </div>
        </aside>

        {/* Login panel */}
        <main className="student-login-card">

          <div className="student-login-brand mobile-brand">
            <div className="student-login-logo">RC</div>

            <div>
              <strong>Reboot Code Academy</strong>
              <span>Student Portal</span>
            </div>
          </div>

          <div className="student-login-heading">
            <span className="eyebrow">STUDENT PORTAL</span>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue your learning journey.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="student-login-form"
          >
            <label>
              Student ID or Email

              <input
                type="text"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value)
                  if (error) setError('')
                }}
                placeholder="RCA1001 or your email"
                autoComplete="username"
              />
            </label>

            <label>
              Password

              <div className="student-password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (error) setError('')
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="student-password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  title={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 2l20 20" />
                      <path d="M6.71 6.71C4.68 8.14 3.2 10.08 2 12c2.5 4 6 6 10 6 1.27 0 2.47-.22 3.57-.63" />
                      <path d="M10.73 5.08A9.97 9.97 0 0 1 12 5c4 0 7.5 2 10 7-1.01 1.62-2.19 3.02-3.5 4.14" />
                      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {error && (
              <div className="student-login-error" role="alert">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="student-login-submit"
            >
              Sign In
              <span>→</span>
            </button>
          </form>

          <div className="student-login-help">
            <span>Need help accessing your account?</span>

            <a
              href="/contact"
              onClick={handleContactClick}
            >
              Contact Academy
            </a>
          </div>

          <div className="student-login-note">
            <span>✓</span>
            <p>
              Use the Student ID or email provided by the academy.
            </p>
          </div>

        </main>
      </div>
    </div>
  )
}

export default StudentLogin
