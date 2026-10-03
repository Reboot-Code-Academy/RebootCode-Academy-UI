import { useEffect, useRef, useState } from 'react'
import Section from '../../components/Section.jsx'
import { api } from '../../services/api.js'

const emptyForm = {
  label: '',
  text: '',
  actionPath: '',
  startDate: '',
  endDate: '',
}

function formatAnnouncement(announcement) {
  return {
    id: announcement.id,
    label: announcement.label || '',
    text: announcement.text || '',
    actionPath: announcement.action_path || '',
    startDate: announcement.start_date || '',
    endDate: announcement.end_date || '',
    isActive: announcement.is_active,
  }
}

function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const formRef = useRef(null)

  // =========================================
  // LOAD ANNOUNCEMENTS
  // =========================================

  async function loadAnnouncements() {
    try {
      setLoading(true)
      setError('')

      const data = await api.get('/announcements')

      setAnnouncements(
        data.map(formatAnnouncement)
      )
    } catch (error) {
      console.error(
        'Could not load announcements:',
        error
      )

      setError(
        error.message ||
          'Could not load announcements from the server.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnnouncements()
  }, [])

  // =========================================
  // FORM CHANGE
  // =========================================

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  // =========================================
  // SUBMIT
  // =========================================

  async function handleSubmit(event) {
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

    try {
      setSaving(true)
      setError('')

      const data = {
        label: form.label.trim(),
        text: form.text.trim(),
        action_path: form.actionPath.trim() || null,
        start_date: form.startDate || null,
        end_date: form.endDate || null,
      }

      // =========================================
      // UPDATE
      // =========================================

      if (editingId !== null) {
        await api.put(
          `/announcements/${editingId}`,
          data
        )

        alert('Announcement updated successfully.')
      }

      // =========================================
      // CREATE
      // =========================================

      else {
        await api.post(
          '/announcements',
          {
            ...data,
            is_active: true,
          }
        )

        alert('Announcement created successfully.')
      }

      // Reload from database
      await loadAnnouncements()

      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
    } catch (error) {
      console.error(
        'Announcement save error:',
        error
      )

      setError(
        error.message ||
          'Could not save the announcement.'
      )

      alert(
        error.message ||
          'Could not save the announcement.'
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================================
  // ADD
  // =========================================

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

  // =========================================
  // EDIT
  // =========================================

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

  // =========================================
  // DELETE
  // =========================================

  async function handleDelete(id) {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this announcement?'
    )

    if (!shouldDelete) {
      return
    }

    try {
      setError('')

      await api.delete(
        `/announcements/${id}`
      )

      await loadAnnouncements()

      if (editingId === id) {
        setEditingId(null)
        setForm(emptyForm)
        setShowForm(false)
      }

      alert('Announcement deleted successfully.')
    } catch (error) {
      console.error(
        'Announcement delete error:',
        error
      )

      setError(
        error.message ||
          'Could not delete the announcement.'
      )

      alert(
        error.message ||
          'Could not delete the announcement.'
      )
    }
  }

  // =========================================
  // TOGGLE STATUS
  // =========================================

  async function handleToggleStatus(announcement) {
    try {
      setError('')

      await api.put(
        `/announcements/${announcement.id}`,
        {
          is_active: !announcement.isActive,
        }
      )

      await loadAnnouncements()
    } catch (error) {
      console.error(
        'Announcement status update error:',
        error
      )

      setError(
        error.message ||
          'Could not update announcement status.'
      )

      alert(
        error.message ||
          'Could not update announcement status.'
      )
    }
  }

  // =========================================
  // CANCEL
  // =========================================

  function handleCancel() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(false)
  }

  // =========================================
  // UI
  // =========================================

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

        {/* ERROR */}

        {error && (
          <div className="announcement-empty">
            <p>{error}</p>

            <button
              type="button"
              className="button button-secondary"
              onClick={loadAnnouncements}
            >
              Try Again
            </button>
          </div>
        )}

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
                disabled={saving}
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
                      disabled={saving}
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
                      disabled={saving}
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
                      disabled={saving}
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
                      disabled={saving}
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
                      disabled={saving}
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
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                    ? 'Update Announcement'
                    : 'Create Announcement'}
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleCancel}
                  disabled={saving}
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

          {loading ? (
            <div className="announcement-empty">
              <p>Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
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
                      disabled={saving}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() =>
                        handleToggleStatus(announcement)
                      }
                      disabled={saving}
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
                      disabled={saving}
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