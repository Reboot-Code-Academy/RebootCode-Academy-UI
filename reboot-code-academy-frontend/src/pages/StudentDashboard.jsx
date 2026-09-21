import { useEffect, useMemo, useState } from 'react'

const MATERIALS_KEY = 'reboot-code-academy-course-materials'
const ANNOUNCEMENTS_KEY = 'reboot-code-academy-announcements'
const SESSION_KEY = 'reboot-code-academy-student-session'
const STUDENTS_KEY = 'reboot-code-academy-students'

function readStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function StudentDashboard({ onNavigate }) {
  const [student, setStudent] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    function loadStudent() {
      try {
        const session = JSON.parse(
          sessionStorage.getItem(SESSION_KEY) || 'null'
        )

        if (!session?.studentId) {
          onNavigate?.('/student-login')
          return
        }

        const students = readStorage(STUDENTS_KEY)

        const currentStudent = students.find(
          (item) => item.id === session.studentId
        )

        if (!currentStudent || currentStudent.status === 'Inactive') {
          sessionStorage.removeItem(SESSION_KEY)
          onNavigate?.('/student-login')
          return
        }

        setStudent(currentStudent)
      } catch {
        sessionStorage.removeItem(SESSION_KEY)
        onNavigate?.('/student-login')
      }
    }

    loadStudent()

    function handleStorageChange(event) {
      if (
        event.key === STUDENTS_KEY ||
        event.key === MATERIALS_KEY ||
        event.key === ANNOUNCEMENTS_KEY
      ) {
        loadStudent()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', loadStudent)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', loadStudent)
    }
  }, [onNavigate])

  const materials = useMemo(() => {
    if (!student?.course) return []

    return readStorage(MATERIALS_KEY)
      .filter(
        (material) =>
          material.course === student.course &&
          material.isActive !== false
      )
      .sort(
        (a, b) =>
          Number(a.order || 0) - Number(b.order || 0)
      )
  }, [student])

  const announcements = useMemo(() => {
    const now = new Date()

    return readStorage(ANNOUNCEMENTS_KEY).filter((item) => {
      if (item.isActive === false) return false

      if (item.startDate) {
        const start = new Date(item.startDate)
        if (now < start) return false
      }

      if (item.endDate) {
        const end = new Date(item.endDate)
        if (now > end) return false
      }

      return true
    })
  }, [student])

  const initials =
    student?.name
      ?.split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST'

  const joinDate = student?.joinDate
    ? new Date(student.joinDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-'

  function openTab(tab) {
    setActiveTab(tab)
    setMobileNavOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    onNavigate?.('/student-login')
  }

  function openMaterial(material) {
    if (!material?.resourceUrl) return

    window.open(
      material.resourceUrl,
      '_blank',
      'noopener,noreferrer'
    )
  }

  if (!student) {
    return (
      <div className="student-dashboard-loading">
        <div className="student-dashboard-loading-card">
          <div className="student-dashboard-loading-logo">RC</div>
          <span className="eyebrow">STUDENT PORTAL</span>
          <h1>Loading your dashboard...</h1>
          <p>Preparing your course and learning resources.</p>
        </div>
      </div>
    )
  }

  const navigation = [
    { id: 'overview', label: 'Dashboard', icon: '⌂' },
    { id: 'course', label: 'My Course', icon: '◆' },
    { id: 'materials', label: 'Course Materials', icon: '</>' },
    { id: 'announcements', label: 'Announcements', icon: '!' },
    { id: 'profile', label: 'My Profile', icon: '◯' },
  ]

  return (
    <div className="student-dashboard">
      <aside
        className={
          mobileNavOpen
            ? 'student-dashboard-sidebar mobile-open'
            : 'student-dashboard-sidebar'
        }
      >
        <div className="student-sidebar-brand">
          <div className="student-sidebar-logo">RC</div>
          <div>
            <strong>Reboot Code Academy</strong>
            <span>Student Portal</span>
          </div>
        </div>

        <div className="student-sidebar-profile">
          <div className="student-sidebar-avatar">
            {student.photo ? (
              <img src={student.photo} alt={student.name} />
            ) : (
              initials
            )}
          </div>
          <div>
            <strong>{student.name}</strong>
            <span>{student.id}</span>
          </div>
        </div>

        <nav className="student-dashboard-nav">
          <small>MENU</small>

          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                activeTab === item.id
                  ? 'student-nav-item active'
                  : 'student-nav-item'
              }
              onClick={() => openTab(item.id)}
            >
              <span>{item.icon}</span>
              <strong>{item.label}</strong>
              {item.id === 'announcements' &&
                announcements.length > 0 && (
                  <em>{announcements.length}</em>
                )}
            </button>
          ))}
        </nav>

        <div className="student-sidebar-course">
          <span className="eyebrow">CURRENT COURSE</span>
          <strong>{student.course || 'No course assigned'}</strong>
          <small>
            {materials.length} active learning{' '}
            {materials.length === 1 ? 'resource' : 'resources'}
          </small>
        </div>

        <button
          type="button"
          className="student-dashboard-logout"
          onClick={logout}
        >
          <span>↪</span>
          Logout
        </button>
      </aside>

      {mobileNavOpen && (
        <button
          type="button"
          className="student-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main className="student-dashboard-main">
        <header className="student-dashboard-topbar">
          <div className="student-topbar-left">
            <button
              type="button"
              className="student-mobile-menu"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              ☰
            </button>

            <div>
              <span>STUDENT PORTAL</span>
              <strong>
                {activeTab === 'overview'
                  ? 'Dashboard'
                  : navigation.find((item) => item.id === activeTab)?.label}
              </strong>
            </div>
          </div>

          <div className="student-topbar-user">
            <div className="student-topbar-avatar">
              {student.photo ? (
                <img src={student.photo} alt={student.name} />
              ) : (
                initials
              )}
            </div>

            <div>
              <strong>{student.name}</strong>
              <small>{student.id}</small>
            </div>
          </div>
        </header>

        <div className="student-dashboard-content">
          {activeTab === 'overview' && (
            <>
              <section className="student-welcome-banner">
                <div>
                  <span className="eyebrow">YOUR LEARNING SPACE</span>
                  <h1>Welcome back, {student.name.split(' ')[0]}!</h1>
                  <p>
                    Continue your learning journey and access your course
                    resources from one place.
                  </p>
                </div>

                <div className="student-welcome-mark">
                  <span>&lt;/&gt;</span>
                  <small>learn → build → grow</small>
                </div>
              </section>

              <div className="student-dashboard-stats">
                <article>
                  <span className="student-stat-icon">ID</span>
                  <div>
                    <small>Student ID</small>
                    <strong>{student.id}</strong>
                  </div>
                </article>

                <article>
                  <span className="student-stat-icon course">◆</span>
                  <div>
                    <small>My Course</small>
                    <strong>{student.course || '-'}</strong>
                  </div>
                </article>

                <article>
                  <span className="student-stat-icon materials">&lt;/&gt;</span>
                  <div>
                    <small>Materials</small>
                    <strong>{materials.length}</strong>
                  </div>
                </article>

                <article>
                  <span className="student-stat-icon updates">!</span>
                  <div>
                    <small>Updates</small>
                    <strong>{announcements.length}</strong>
                  </div>
                </article>
              </div>

              <div className="student-dashboard-two-column">
                <section className="student-dashboard-section">
                  <div className="student-section-heading">
                    <div>
                      <span className="eyebrow">LEARNING</span>
                      <h2>Course Materials</h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => openTab('materials')}
                    >
                      View All →
                    </button>
                  </div>

                  {materials.length === 0 ? (
                    <div className="student-empty-state">
                      <span>&lt;/&gt;</span>
                      <strong>No course materials yet</strong>
                      <p>
                        Your learning resources will appear here when they are
                        added by the academy.
                      </p>
                    </div>
                  ) : (
                    <div className="student-material-list">
                      {materials.slice(0, 4).map((material) => (
                        <article
                          key={material.id}
                          className="student-material-item"
                        >
                          <div className="student-material-icon">
                            {material.type === 'Video'
                              ? '▶'
                              : material.type === 'PDF'
                                ? 'PDF'
                                : '</>'}
                          </div>

                          <div className="student-material-info">
                            <span>{material.type}</span>
                            <h3>{material.title}</h3>
                            <p>
                              {material.description ||
                                'Learning resource'}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={!material.resourceUrl}
                            onClick={() => openMaterial(material)}
                          >
                            Open
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                <section className="student-dashboard-section">
                  <div className="student-section-heading">
                    <div>
                      <span className="eyebrow">ACADEMY UPDATES</span>
                      <h2>Announcements</h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => openTab('announcements')}
                    >
                      View All →
                    </button>
                  </div>

                  {announcements.length === 0 ? (
                    <div className="student-empty-state compact">
                      <span>✓</span>
                      <strong>You're all caught up</strong>
                      <p>No active announcements right now.</p>
                    </div>
                  ) : (
                    <div className="student-announcement-list">
                      {announcements.slice(0, 4).map((item) => (
                        <article
                          key={item.id}
                          className="student-announcement-item"
                        >
                          <div className="student-announcement-dot">!</div>
                          <div>
                            <span>
                              {item.label || 'Announcement'}
                            </span>
                            <h3>{item.text}</h3>
                            {item.actionPath && (
                              <a href={item.actionPath}>
                                View Details →
                              </a>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <section className="student-progress-card">
                <div>
                  <span className="eyebrow">KEEP GOING</span>
                  <h2>Make your next step count.</h2>
                  <p>
                    Use your course materials regularly and keep building
                    practical skills through consistent practice.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openTab('materials')}
                >
                  Open Learning Materials →
                </button>
              </section>
            </>
          )}

          {activeTab === 'course' && (
            <section className="student-page-section">
              <span className="eyebrow">MY COURSE</span>
              <h1>{student.course || 'No Course Assigned'}</h1>
              <p className="student-page-description">
                Your enrolled course information.
              </p>

              <div className="student-course-hero">
                <div className="student-course-icon">◆</div>
                <div>
                  <span>ENROLLED COURSE</span>
                  <h2>{student.course || 'No Course Assigned'}</h2>
                  <p>
                    Continue using the resources provided by the academy for
                    your course.
                  </p>
                </div>
              </div>

              <div className="student-course-details">
                <article>
                  <span>Student ID</span>
                  <strong>{student.id}</strong>
                </article>

                <article>
                  <span>Course</span>
                  <strong>{student.course || '-'}</strong>
                </article>

                <article>
                  <span>Join Date</span>
                  <strong>{joinDate}</strong>
                </article>

                <article>
                  <span>Status</span>
                  <strong>{student.status || '-'}</strong>
                </article>
              </div>

              <div className="student-course-next">
                <div>
                  <span className="eyebrow">NEXT STEP</span>
                  <h3>Continue with your course materials</h3>
                  <p>
                    Open the learning resources assigned to your course.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openTab('materials')}
                >
                  View Materials →
                </button>
              </div>
            </section>
          )}

          {activeTab === 'materials' && (
            <section className="student-page-section">
              <span className="eyebrow">LEARNING MATERIALS</span>
              <h1>Course Materials</h1>
              <p className="student-page-description">
                Resources available for{' '}
                <strong>{student.course || 'your course'}</strong>.
              </p>

              {materials.length === 0 ? (
                <div className="student-empty-state large">
                  <span>&lt;/&gt;</span>
                  <h3>No materials are available yet.</h3>
                  <p>
                    Your academy team will add course resources here when they
                    are ready.
                  </p>
                </div>
              ) : (
                <div className="student-material-grid-large">
                  {materials.map((material) => (
                    <article
                      key={material.id}
                      className="student-material-large-card"
                    >
                      <div className="student-material-large-top">
                        <div className="student-material-icon">
                          {material.type === 'Video'
                            ? '▶'
                            : material.type === 'PDF'
                              ? 'PDF'
                              : '</>'}
                        </div>
                        <span>{material.type}</span>
                      </div>

                      <h3>{material.title}</h3>

                      <p>
                        {material.description || 'Learning resource'}
                      </p>

                      <div className="student-material-card-footer">
                        <small>
                          {material.isActive !== false
                            ? 'Available'
                            : 'Unavailable'}
                        </small>

                        <button
                          type="button"
                          disabled={!material.resourceUrl}
                          onClick={() => openMaterial(material)}
                        >
                          Open Material →
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'announcements' && (
            <section className="student-page-section">
              <span className="eyebrow">ACADEMY UPDATES</span>
              <h1>Announcements</h1>
              <p className="student-page-description">
                Stay updated with the latest information from Reboot Code
                Academy.
              </p>

              {announcements.length === 0 ? (
                <div className="student-empty-state large">
                  <span>✓</span>
                  <h3>No active announcements.</h3>
                  <p>There are no current academy updates to show.</p>
                </div>
              ) : (
                <div className="student-announcement-page-list">
                  {announcements.map((item) => (
                    <article
                      key={item.id}
                      className="student-announcement-page-card"
                    >
                      <div className="student-announcement-page-icon">
                        !
                      </div>

                      <div>
                        <span>{item.label || 'Announcement'}</span>
                        <h3>{item.text}</h3>

                        {item.actionPath && (
                          <a href={item.actionPath}>
                            View Details →
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'profile' && (
            <section className="student-page-section">
              <span className="eyebrow">MY PROFILE</span>
              <h1>Profile</h1>
              <p className="student-page-description">
                Your academy student information.
              </p>

              <div className="student-profile-layout">
                <div className="student-profile-main">
                  <div className="student-profile-avatar-large">
                    {student.photo ? (
                      <img src={student.photo} alt={student.name} />
                    ) : (
                      initials
                    )}
                  </div>

                  <div>
                    <span className="eyebrow">STUDENT</span>
                    <h2>{student.name}</h2>
                    <p>Student ID: {student.id}</p>
                  </div>
                </div>

                <div className="student-profile-details">
                  <article>
                    <span>Email</span>
                    <strong>{student.email || '-'}</strong>
                  </article>

                  <article>
                    <span>Phone</span>
                    <strong>{student.phone || '-'}</strong>
                  </article>

                  <article>
                    <span>Course</span>
                    <strong>{student.course || '-'}</strong>
                  </article>

                  <article>
                    <span>Join Date</span>
                    <strong>{joinDate}</strong>
                  </article>

                  <article>
                    <span>Status</span>
                    <strong>{student.status || '-'}</strong>
                  </article>
                </div>
              </div>

              <div className="student-profile-note">
                <span>i</span>
                <p>
                  Profile information is managed by the academy. Contact the
                  academy if any of your details need to be updated.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
