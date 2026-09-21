import { useEffect, useRef, useState } from 'react'
import Section from '../../components/Section.jsx'

const STORAGE_KEY = 'reboot-code-academy-announcements'

const defaultAnnouncements = [
  {
    id: 1,
    label: 'New Batch',
    text: 'New Python batch starts from 15 October.',
    actionPath: '/courses',
    startDate: '2026-09-21',
    endDate: '2026-10-15',
    isActive: true,
  },
  {
    id: 2,
    label: 'Book Free Demo',
    text: 'Book a 3-day free demo class for Web Development.',
    actionPath: '/contact',
    startDate: '2026-09-21',
    endDate: '2026-12-31',
    isActive: true,
  },
]

const emptyForm = {
  label: '',
  text: '',
  actionPath: '',
  startDate: '',
  endDate: '',
}

function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const formRef = useRef(null)

  useEffect(() => {
    const savedAnnouncements = localStorage.getItem(STORAGE_KEY)

    if (savedAnnouncements) {
      try {
        setAnnouncements(JSON.parse(savedAnnouncements))
      } catch (error) {
        console.error('Could not read announcements:', error)
        setAnnouncements(defaultAnnouncements)
      }
    } else {
      setAnnouncements(defaultAnnouncements)

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultAnnouncements)
      )
    }
  }, [])

  function saveAnnouncements(updatedAnnouncements) {
    setAnnouncements(updatedAnnouncements)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedAnnouncements)
    )
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.label.trim()) {
      alert('Please enter an announcement label.')
      return
    }

    if (!form.text.trim()) {
      alert('Please enter an announcement message.')
      return
    }

    if (
      form.startDate &&
      form.endDate &&
      form.startDate > form.endDate
    ) {
      alert('End date cannot be before start date.')
      return
    }

    if (editingId !== null) {
      const updatedAnnouncements = announcements.map(
        (announcement) =>
          announcement.id === editingId
            ? {
                ...announcement,
                label: form.label.trim(),
                text: form.text.trim(),
                actionPath: form.actionPath.trim(),
                startDate: form.startDate,
                endDate: form.endDate,
              }
            : announcement
      )

      saveAnnouncements(updatedAnnouncements)
    } else {
      const newAnnouncement = {
        id: Date.now(),
        label: form.label.trim(),
        text: form.text.trim(),
        actionPath: form.actionPath.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: true,
      }

      saveAnnouncements([
        ...announcements,
        newAnnouncement,
      ])
    }

    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  function handleAddAnnouncement() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  function handleEdit(announcement) {
    setEditingId(announcement.id)

    setForm({
      label: announcement.label || '',
      text: announcement.text || '',
      actionPath: announcement.actionPath || '',
      startDate: announcement.startDate || '',
      endDate: announcement.endDate || '',
    })

    setShowForm(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  function handleDelete(id) {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this announcement?'
    )

    if (!shouldDelete) {
      return
    }

    const updatedAnnouncements = announcements.filter(
      (announcement) => announcement.id !== id
    )

    saveAnnouncements(updatedAnnouncements)

    if (editingId === id) {
      setEditingId(null)
      setForm(emptyForm)
      setShowForm(false)
    }
  }

  function handleToggleStatus(id) {
    const updatedAnnouncements = announcements.map(
      (announcement) =>
        announcement.id === id
          ? {
              ...announcement,
              isActive: !announcement.isActive,
            }
          : announcement
    )

    saveAnnouncements(updatedAnnouncements)
  }

  function handleCancel() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(false)
  }

  return (
    <Section
      description="Create and schedule announcements that appear on the public website."
      eyebrow="Content Management"
      title="Announcements"
    >
      <div className="announcement-admin">

        {/* HEADER */}

        <div className="announcement-manager-header">
          <div>
            <h3>Announcement Management</h3>

            <p>
              Create announcements, schedule when they appear,
              and control their visibility on the website.
            </p>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={handleAddAnnouncement}
          >
            + Add Announcement
          </button>
        </div>

        {/* CREATE / EDIT FORM */}

        {showForm && (
          <div
            className="announcement-admin-form"
            ref={formRef}
          >
            <div className="announcement-form-header">
              <div>
                <span className="eyebrow">
                  {editingId !== null
                    ? 'Edit Announcement'
                    : 'New Announcement'}
                </span>

                <h3>
                  {editingId !== null
                    ? 'Update Announcement'
                    : 'Create Announcement'}
                </h3>
              </div>

              <button
                type="button"
                className="button button-secondary"
                onClick={handleCancel}
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              {/* BASIC INFORMATION */}

              <div className="announcement-form-section">

                <div className="announcement-form-section-title">
                  <strong>Basic Information</strong>

                  <span>
                    Content displayed in the announcement ticker
                  </span>
                </div>

                <div className="form-grid">

                  <label>
                    Label

                    <input
                      type="text"
                      name="label"
                      value={form.label}
                      onChange={handleChange}
                      placeholder="Admissions Open"
                    />

                    <small className="form-help">
                      Short heading for the announcement.
                    </small>
                  </label>

                  <label>
                    Message

                    <input
                      type="text"
                      name="text"
                      value={form.text}
                      onChange={handleChange}
                      placeholder="Admissions are now open for 2026 batch"
                    />

                    <small className="form-help">
                      Main announcement message.
                    </small>
                  </label>

                  <label className="form-field-full">
                    Action Path

                    <input
                      type="text"
                      name="actionPath"
                      value={form.actionPath}
                      onChange={handleChange}
                      placeholder="/courses"
                    />

                    <small className="form-help">
                      Optional website path such as /courses or /contact.
                    </small>
                  </label>

                </div>

              </div>

              {/* SCHEDULE */}

              <div className="announcement-form-section">

                <div className="announcement-form-section-title">
                  <strong>Schedule</strong>

                  <span>
                    Choose when this announcement should be visible
                  </span>
                </div>

                <div className="form-grid">

                  <label>
                    Start Date

                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                    />

                    <small className="form-help">
                      Announcement starts from this date.
                    </small>
                  </label>

                  <label>
                    End Date

                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                    />

                    <small className="form-help">
                      Announcement ends after this date.
                    </small>
                  </label>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="announcement-form-actions">

                <button
                  type="submit"
                  className="button button-primary"
                >
                  {editingId !== null
                    ? 'Update Announcement'
                    : 'Create Announcement'}
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* EXISTING ANNOUNCEMENTS */}

        <div className="announcement-admin-list">

          <div className="announcement-list-header">

            <div>
              <h3>Existing Announcements</h3>

              <p>
                Manage announcements currently stored in the system.
              </p>
            </div>

            <span className="announcement-count">
              {announcements.length}
            </span>

          </div>

          {announcements.length === 0 ? (
            <div className="announcement-empty">

              <p>
                No announcements created yet.
              </p>

              <button
                type="button"
                className="button button-primary"
                onClick={handleAddAnnouncement}
              >
                Add First Announcement
              </button>

            </div>
          ) : (
            <div className="announcement-list">

              {announcements.map((announcement) => (

                <article
                  className="announcement-admin-card"
                  key={announcement.id}
                >

                  {/* CONTENT */}

                  <div className="announcement-card-content">

                    <div className="announcement-card-heading">

                      <strong>
                        {announcement.label}
                      </strong>

                      <span
                        className={
                          announcement.isActive
                            ? 'status-active'
                            : 'status-inactive'
                        }
                      >
                        {announcement.isActive
                          ? 'Active'
                          : 'Inactive'}
                      </span>

                    </div>

                    <p>
                      {announcement.text}
                    </p>

                    <div className="announcement-meta">

                      <span>
                        <strong>Start:</strong>{' '}
                        {announcement.startDate || 'No date'}
                      </span>

                      <span>
                        <strong>End:</strong>{' '}
                        {announcement.endDate || 'No date'}
                      </span>

                      {announcement.actionPath && (
                        <span>
                          <strong>Link:</strong>{' '}
                          {announcement.actionPath}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="announcement-card-actions">

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() =>
                        handleEdit(announcement)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() =>
                        handleToggleStatus(announcement.id)
                      }
                    >
                      {announcement.isActive
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>

                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() =>
                        handleDelete(announcement.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>
          )}

        </div>

      </div>
    </Section>
  )
}

export default AnnouncementsManager