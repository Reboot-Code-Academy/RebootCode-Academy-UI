import { useEffect, useMemo, useState } from 'react'

const MATERIALS_KEY = 'reboot-code-academy-course-materials'
const COURSES_KEY = 'reboot-code-academy-courses'

const MATERIAL_TYPES = [
  'PDF',
  'Video',
  'Document',
  'Link',
  'Notes',
  'Other',
]

const emptyForm = {
  course: '',
  title: '',
  type: 'PDF',
  description: '',
  resourceUrl: '',
  order: 1,
  isActive: true,
}

function CourseMaterialsManager() {
  const [materials, setMaterials] = useState([])
  const [courses, setCourses] = useState([])

  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('All Courses')
  const [typeFilter, setTypeFilter] = useState('All Types')

  const [showForm, setShowForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [viewingMaterial, setViewingMaterial] = useState(null)

  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    loadMaterials()
    loadCourses()

    const refresh = () => {
      loadMaterials()
      loadCourses()
    }

    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)

    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  function loadMaterials() {
    try {
      const stored = JSON.parse(
        localStorage.getItem(MATERIALS_KEY) || '[]'
      )
      setMaterials(Array.isArray(stored) ? stored : [])
    } catch {
      setMaterials([])
    }
  }

  function loadCourses() {
    try {
      const stored = JSON.parse(
        localStorage.getItem(COURSES_KEY) || '[]'
      )

      setCourses(
        Array.isArray(stored)
          ? stored.filter((course) => course.isActive !== false)
          : []
      )
    } catch {
      setCourses([])
    }
  }

  function saveMaterials(nextMaterials) {
    setMaterials(nextMaterials)
    localStorage.setItem(
      MATERIALS_KEY,
      JSON.stringify(nextMaterials)
    )
  }

  const courseNames = useMemo(
    () =>
      [...new Set(
        courses
          .map((course) => course.name)
          .filter(Boolean)
      )],
    [courses]
  )

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase()

    return materials
      .filter((material) => {
        const matchesSearch =
          !query ||
          material.title?.toLowerCase().includes(query) ||
          material.description?.toLowerCase().includes(query) ||
          material.course?.toLowerCase().includes(query)

        const matchesCourse =
          courseFilter === 'All Courses' ||
          material.course === courseFilter

        const matchesType =
          typeFilter === 'All Types' ||
          material.type === typeFilter

        return matchesSearch && matchesCourse && matchesType
      })
      .sort(
        (a, b) =>
          Number(a.order || 0) - Number(b.order || 0)
      )
  }, [materials, search, courseFilter, typeFilter])

  const stats = useMemo(
    () => ({
      total: materials.length,
      active: materials.filter(
        (material) => material.isActive !== false
      ).length,
      inactive: materials.filter(
        (material) => material.isActive === false
      ).length,
      courses: new Set(
        materials
          .map((material) => material.course)
          .filter(Boolean)
      ).size,
    }),
    [materials]
  )

  function resetForm() {
    setForm({
      ...emptyForm,
      course: courseNames[0] || '',
    })
    setEditingMaterial(null)
  }

  function openAddMaterial() {
    resetForm()
    setShowForm(true)
  }

  function openEditMaterial(material) {
    setEditingMaterial(material)
    setForm({
      course: material.course || '',
      title: material.title || '',
      type: material.type || 'PDF',
      description: material.description || '',
      resourceUrl: material.resourceUrl || '',
      order: material.order || 1,
      isActive: material.isActive !== false,
    })
    setShowForm(true)
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function saveMaterial(event) {
    event.preventDefault()

    if (!form.course) {
      alert('Please select a course.')
      return
    }

    if (!form.title.trim()) {
      alert('Please enter material title.')
      return
    }

    if (!form.resourceUrl.trim()) {
      alert('Please enter the resource URL.')
      return
    }

    const now = new Date().toISOString()

    if (editingMaterial) {
      const updated = materials.map((material) =>
        material.id === editingMaterial.id
          ? {
              ...material,
              ...form,
              title: form.title.trim(),
              description: form.description.trim(),
              resourceUrl: form.resourceUrl.trim(),
              order: Number(form.order) || 1,
              updatedAt: now,
            }
          : material
      )

      saveMaterials(updated)
    } else {
      const newMaterial = {
        id:
          typeof crypto !== 'undefined' &&
          crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(),
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        resourceUrl: form.resourceUrl.trim(),
        order: Number(form.order) || 1,
        createdAt: now,
        updatedAt: now,
      }

      saveMaterials([newMaterial, ...materials])
    }

    setShowForm(false)
    resetForm()
  }

  function toggleStatus(material) {
    const updated = materials.map((item) =>
      item.id === material.id
        ? {
            ...item,
            isActive: item.isActive === false,
            updatedAt: new Date().toISOString(),
          }
        : item
    )

    saveMaterials(updated)
  }

  function deleteMaterial(material) {
    if (
      !window.confirm(
        `Delete "${material.title}" from ${material.course}?`
      )
    ) {
      return
    }

    saveMaterials(
      materials.filter((item) => item.id !== material.id)
    )
  }

  function formatDate(date) {
    if (!date) return '-'

    const value = new Date(date)

    if (Number.isNaN(value.getTime())) return date

    return value.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <section className="demo-bookings-page">
      <div className="students-page-header">
        <div>
          <span className="students-page-eyebrow">
            ACADEMY
          </span>

          <h1>Course Materials</h1>

          <p>
            Manage learning resources for each course.
          </p>
        </div>

        <button
          className="students-primary-btn"
          onClick={openAddMaterial}
        >
          + Add Material
        </button>
      </div>

      <div className="demo-booking-stats">
        <div className="demo-stat-card">
          <span>Total Materials</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="demo-stat-card">
          <span>Active</span>
          <strong>{stats.active}</strong>
        </div>

        <div className="demo-stat-card">
          <span>Inactive</span>
          <strong>{stats.inactive}</strong>
        </div>

        <div className="demo-stat-card">
          <span>Courses Covered</span>
          <strong>{stats.courses}</strong>
        </div>
      </div>

      <div className="demo-booking-filters">
        <div className="students-search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={courseFilter}
          onChange={(event) =>
            setCourseFilter(event.target.value)
          }
        >
          <option>All Courses</option>

          {courseNames.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
        >
          <option>All Types</option>

          {MATERIAL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="students-table-card">
        <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Course</th>
                <th>Type</th>
                <th>Order</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="students-empty-state"
                  >
                    <div>
                      <strong>
                        No course materials found
                      </strong>

                      <p>
                        Add your first learning resource
                        using the button above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((material) => (
                  <tr key={material.id}>
                    <td>
                      <div className="demo-booking-person">
                        <div className="demo-booking-avatar">
                          {material.title
                            ?.charAt(0)
                            ?.toUpperCase() || 'M'}
                        </div>

                        <div>
                          <strong>{material.title}</strong>

                          {material.description && (
                            <small>
                              {material.description}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{material.course || '-'}</td>

                    <td>{material.type || '-'}</td>

                    <td>{material.order || 1}</td>

                    <td>
                      <button
                        type="button"
                        className={`demo-status-select ${
                          material.isActive === false
                            ? 'material-status-inactive'
                            : 'material-status-active'
                        }`}
                        onClick={() =>
                          toggleStatus(material)
                        }
                      >
                        {material.isActive === false
                          ? 'Inactive'
                          : 'Active'}
                      </button>
                    </td>

                    <td>
                      {formatDate(material.createdAt)}
                    </td>

                    <td>
                      <div className="students-action-buttons">
                        <button
                          className="students-action-btn"
                          onClick={() =>
                            setViewingMaterial(material)
                          }
                        >
                          View
                        </button>

                        <button
                          className="students-action-btn"
                          onClick={() =>
                            openEditMaterial(material)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="students-action-btn"
                          onClick={() =>
                            window.open(
                              material.resourceUrl,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }
                        >
                          Open
                        </button>

                        <button
                          className="students-action-btn students-delete-btn"
                          onClick={() =>
                            deleteMaterial(material)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="demo-booking-footer">
          Showing {filteredMaterials.length} of{' '}
          {materials.length} materials
        </div>
      </div>

      {showForm && (
        <div
          className="students-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false)
            }
          }}
        >
          <div className="students-modal">
            <div className="students-modal-header">
              <div>
                <span className="students-page-eyebrow">
                  COURSE MATERIAL
                </span>

                <h2>
                  {editingMaterial
                    ? 'Edit Material'
                    : 'Add Course Material'}
                </h2>

                <p>
                  Add a learning resource to a course.
                </p>
              </div>

              <button
                className="students-modal-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form
              className="students-form"
              onSubmit={saveMaterial}
            >
              <div className="students-form-grid">
                <div className="students-form-field">
                  <label>Course *</label>

                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select course
                    </option>

                    {courseNames.map((course) => (
                      <option
                        key={course}
                        value={course}
                      >
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="students-form-field">
                  <label>Material Title *</label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Python Functions"
                  />
                </div>

                <div className="students-form-field">
                  <label>Material Type *</label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    {MATERIAL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="students-form-field">
                  <label>Display Order</label>

                  <input
                    type="number"
                    min="1"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                  />
                </div>

                <div className="students-form-field students-full-width">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief description of this material..."
                  />
                </div>

                <div className="students-form-field students-full-width">
                  <label>Resource URL *</label>

                  <input
                    type="url"
                    name="resourceUrl"
                    value={form.resourceUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                  <small>
                    For now, paste a Google Drive, YouTube,
                    PDF, website, or other resource URL.
                  </small>
                </div>

                <div className="students-form-field">
                  <label className="demo-checkbox-field">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="students-modal-actions">
                <button
                  type="button"
                  className="students-secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="students-primary-btn"
                >
                  {editingMaterial
                    ? 'Update Material'
                    : 'Save Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingMaterial && (
        <div
          className="students-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewingMaterial(null)
            }
          }}
        >
          <div className="students-modal demo-view-modal">
            <div className="students-modal-header">
              <div>
                <span className="students-page-eyebrow">
                  COURSE MATERIAL
                </span>

                <h2>{viewingMaterial.title}</h2>
              </div>

              <button
                className="students-modal-close"
                onClick={() =>
                  setViewingMaterial(null)
                }
              >
                ×
              </button>
            </div>

            <div className="demo-booking-details">
              <div>
                <span>Course</span>
                <strong>
                  {viewingMaterial.course || '-'}
                </strong>
              </div>

              <div>
                <span>Type</span>
                <strong>
                  {viewingMaterial.type || '-'}
                </strong>
              </div>

              <div>
                <span>Display Order</span>
                <strong>
                  {viewingMaterial.order || 1}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {viewingMaterial.isActive === false
                    ? 'Inactive'
                    : 'Active'}
                </strong>
              </div>

              <div className="demo-detail-full">
                <span>Description</span>

                <p>
                  {viewingMaterial.description ||
                    'No description provided.'}
                </p>
              </div>

              <div className="demo-detail-full">
                <span>Resource URL</span>

                <p>
                  {viewingMaterial.resourceUrl || '-'}
                </p>
              </div>
            </div>

            <div className="students-modal-actions">
              <button
                className="students-secondary-btn"
                onClick={() =>
                  setViewingMaterial(null)
                }
              >
                Close
              </button>

              <button
                className="students-primary-btn"
                onClick={() =>
                  window.open(
                    viewingMaterial.resourceUrl,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                Open Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CourseMaterialsManager
