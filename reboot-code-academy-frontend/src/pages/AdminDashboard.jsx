import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from './admin/AdminSidebar.jsx'
import AnnouncementsManager from './admin/AnnouncementsManager.jsx'
import CoursesManager from './admin/CoursesManager.jsx'
import GalleryManager from './admin/GalleryManager.jsx'
import TestimonialsManager from './admin/TestimonialsManager.jsx'
import StudentsManager from './admin/StudentsManager.jsx'
import DemoBookingsManager from './admin/DemoBookingsManager.jsx'
import CourseMaterialsManager from './admin/CourseMaterialsManager.jsx'
import ContactInformationManager from './admin/ContactInformationManager.jsx'

const STORAGE_KEYS = {
  announcements: 'reboot-code-academy-announcements',
  courses: 'reboot-code-academy-courses',
  gallery: 'reboot-code-academy-gallery',
  testimonials: 'reboot-code-academy-testimonials',
  students: 'reboot-code-academy-students',
  bookings: 'reboot-code-academy-demo-bookings',
  materials: 'reboot-code-academy-course-materials',
}

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function AdminDashboard() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [stats, setStats] = useState({
    announcements: 0,
    courses: 0,
    gallery: 0,
    testimonials: 0,
    students: 0,
    bookings: 0,
    materials: 0,
  })

  function loadStats() {
    setStats({
      announcements: readList(STORAGE_KEYS.announcements).filter(
        (item) => item.isActive !== false
      ).length,
      courses: readList(STORAGE_KEYS.courses).filter(
        (item) => item.isActive !== false
      ).length,
      gallery: readList(STORAGE_KEYS.gallery).filter(
        (item) => item.isActive !== false
      ).length,
      testimonials: readList(STORAGE_KEYS.testimonials).filter(
        (item) => item.isActive !== false
      ).length,
      students: readList(STORAGE_KEYS.students).filter(
        (item) => item.status !== 'Inactive'
      ).length,
      bookings: readList(STORAGE_KEYS.bookings).filter(
        (item) => item.status !== 'Cancelled'
      ).length,
      materials: readList(STORAGE_KEYS.materials).filter(
        (item) => item.isActive !== false
      ).length,
    })
  }

  useEffect(() => {
    loadStats()

    const handleStorage = () => loadStats()
    const handleFocus = () => loadStats()

    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const dashboardCards = useMemo(
    () => [
      {
        id: 'announcements',
        icon: 'AN',
        title: 'Announcements',
        description: 'Manage website announcements and schedules.',
        count: stats.announcements,
      },
      {
        id: 'courses',
        icon: 'CO',
        title: 'Courses',
        description: 'Manage courses, topics, levels, and images.',
        count: stats.courses,
      },
      {
        id: 'gallery',
        icon: 'GA',
        title: 'Gallery',
        description: 'Manage academy images, events, and videos.',
        count: stats.gallery,
      },
      {
        id: 'testimonials',
        icon: 'TE',
        title: 'Testimonials',
        description: 'Manage student reviews and ratings.',
        count: stats.testimonials,
      },
      {
        id: 'students',
        icon: 'ST',
        title: 'Students',
        description: 'Manage student records and enrolments.',
        count: stats.students,
      },
      {
        id: 'bookings',
        icon: 'DB',
        title: 'Demo Bookings',
        description: 'Review enquiries and convert leads to students.',
        count: stats.bookings,
      },
      {
        id: 'materials',
        icon: 'CM',
        title: 'Course Materials',
        description: 'Manage resources for enrolled students.',
        count: stats.materials,
      },
      {
        id: 'contact',
        icon: 'CT',
        title: 'Contact Information',
        description: 'Update academy contact and social details.',
        count: null,
      },
    ],
    [stats]
  )

  function renderModule() {
    switch (activeModule) {
      case 'announcements':
        return <AnnouncementsManager />

      case 'courses':
        return <CoursesManager />

      case 'gallery':
        return <GalleryManager />

      case 'testimonials':
        return <TestimonialsManager />

      case 'students':
        return <StudentsManager />

      case 'bookings':
        return <DemoBookingsManager />

      case 'materials':
        return <CourseMaterialsManager />

      case 'contact':
        return <ContactInformationManager />

      case 'dashboard':
      default:
        return (
          <div className="admin-dashboard-home">
            <section className="admin-dashboard-hero">
              <div>
                <span className="eyebrow">ADMINISTRATION</span>
                <h1>Welcome to Reboot Code Academy</h1>
                <p>
                  Manage your academy website, students, courses, learning
                  resources, enquiries, and content from one place.
                </p>
              </div>

              <div className="admin-hero-mark">
                <span>&lt;/&gt;</span>
                <small>manage → publish → grow</small>
              </div>
            </section>

            <section className="admin-overview-section">
              <div className="admin-section-heading">
                <div>
                  <span className="eyebrow">OVERVIEW</span>
                  <h2>Academy at a glance</h2>
                </div>
                <span className="admin-live-badge">
                  <i />
                  Live data
                </span>
              </div>

              <div className="admin-stat-grid">
                <button
                  type="button"
                  onClick={() => setActiveModule('students')}
                >
                  <span className="admin-stat-icon students">ST</span>
                  <div>
                    <small>Active Students</small>
                    <strong>{stats.students}</strong>
                  </div>
                  <b>→</b>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule('courses')}
                >
                  <span className="admin-stat-icon courses">CO</span>
                  <div>
                    <small>Active Courses</small>
                    <strong>{stats.courses}</strong>
                  </div>
                  <b>→</b>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule('bookings')}
                >
                  <span className="admin-stat-icon bookings">DB</span>
                  <div>
                    <small>Demo Bookings</small>
                    <strong>{stats.bookings}</strong>
                  </div>
                  <b>→</b>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule('materials')}
                >
                  <span className="admin-stat-icon materials">CM</span>
                  <div>
                    <small>Learning Resources</small>
                    <strong>{stats.materials}</strong>
                  </div>
                  <b>→</b>
                </button>
              </div>
            </section>

            <section className="admin-modules-section">
              <div className="admin-section-heading">
                <div>
                  <span className="eyebrow">MANAGEMENT</span>
                  <h2>Manage your academy</h2>
                </div>
                <p>Select a module to continue.</p>
              </div>

              <div className="admin-module-grid">
                {dashboardCards.map((card) => (
                  <button
                    type="button"
                    key={card.id}
                    className="admin-module-card"
                    onClick={() => setActiveModule(card.id)}
                  >
                    <div className="admin-module-top">
                      <span className="admin-module-icon">{card.icon}</span>
                      {card.count !== null && (
                        <span className="admin-module-count">
                          {card.count}
                        </span>
                      )}
                    </div>

                    <div className="admin-module-body">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>

                    <span className="admin-module-link">
                      Manage <b>→</b>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="admin-quick-actions">
              <div>
                <span className="eyebrow">QUICK ACTIONS</span>
                <h2>Common tasks</h2>
              </div>

              <div className="admin-quick-action-list">
                <button
                  type="button"
                  onClick={() => setActiveModule('students')}
                >
                  <span>+</span>
                  Add / Manage Students
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule('courses')}
                >
                  <span>+</span>
                  Manage Courses
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule('bookings')}
                >
                  <span>+</span>
                  Review Demo Bookings
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule('materials')}
                >
                  <span>+</span>
                  Add Course Materials
                </button>
              </div>
            </section>
          </div>
        )
    }
  }

  const currentTitle =
    activeModule === 'dashboard'
      ? 'Dashboard'
      : activeModule === 'bookings'
        ? 'Demo Bookings'
        : activeModule === 'materials'
          ? 'Course Materials'
          : activeModule === 'contact'
            ? 'Contact Information'
            : activeModule.charAt(0).toUpperCase() + activeModule.slice(1)

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeModule={activeModule}
        onSelectModule={(module) => {
          setActiveModule(module)
          loadStats()
        }}
      />

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span className="admin-topbar-label">ADMINISTRATION</span>
            <strong>{currentTitle}</strong>
          </div>

          <div className="admin-topbar-actions">
            {activeModule !== 'dashboard' && (
              <button
                type="button"
                className="admin-back-dashboard"
                onClick={() => setActiveModule('dashboard')}
              >
                <span>←</span>
                Dashboard
              </button>
            )}

            <span className="admin-topbar-status">
              <i />
              Academy Admin
            </span>
          </div>
        </header>

        <div className="admin-content">
          {renderModule()}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
