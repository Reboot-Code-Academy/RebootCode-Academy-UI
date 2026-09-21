import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'reboot-code-academy-gallery'

const defaultGallery = [
  {
    id: 1,
    title: 'Coding Classroom',
    category: 'Classroom',
    description: 'Students learning and working on coding projects.',
    image: '',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 2,
    title: 'Student Workshop',
    category: 'Workshops',
    description: 'Hands-on technical workshop conducted at the academy.',
    image: '',
    videoUrl: '',
    isActive: true,
  },
]

const emptyForm = {
  title: '',
  category: 'Classroom',
  description: '',
  image: '',
  videoUrl: '',
}

function GalleryManager() {
  const [gallery, setGallery] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const imageInputRef = useRef(null)

  useEffect(() => {
    const savedGallery = localStorage.getItem(STORAGE_KEY)

    if (savedGallery) {
      try {
        setGallery(JSON.parse(savedGallery))
      } catch {
        setGallery(defaultGallery)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGallery))
      }
    } else {
      setGallery(defaultGallery)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGallery))
    }
  }, [])

  function saveGallery(updatedGallery) {
    setGallery(updatedGallery)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGallery))
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        image: reader.result,
      }))
    }

    reader.readAsDataURL(file)
  }

  function handleAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)

    setTimeout(() => {
      document
        .querySelector('.gallery-manager')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function handleEdit(item) {
    setEditingId(item.id)

    setForm({
      title: item.title || '',
      category: item.category || 'Classroom',
      description: item.description || '',
      image: item.image || '',
      videoUrl: item.videoUrl || '',
    })

    setShowForm(true)

    setTimeout(() => {
      document
        .querySelector('.gallery-manager')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function handleCancel() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(false)

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      alert('Please enter a gallery title.')
      return
    }

    if (!form.description.trim()) {
      alert('Please enter a description.')
      return
    }

    if (!form.image) {
      alert('Please select an image.')
      return
    }

    if (editingId) {
      const updatedGallery = gallery.map((item) =>
        item.id === editingId
          ? {
              ...item,
              ...form,
            }
          : item
      )

      saveGallery(updatedGallery)
    } else {
      const newItem = {
        id: Date.now(),
        ...form,
        isActive: true,
      }

      saveGallery([newItem, ...gallery])
    }

    handleCancel()
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this gallery item?'
    )

    if (!confirmed) return

    const updatedGallery = gallery.filter((item) => item.id !== id)
    saveGallery(updatedGallery)

    if (editingId === id) {
      handleCancel()
    }
  }

  function handleToggleStatus(id) {
    const updatedGallery = gallery.map((item) =>
      item.id === id
        ? {
            ...item,
            isActive: !item.isActive,
          }
        : item
    )

    saveGallery(updatedGallery)
  }

  return (
    <section className="gallery-manager admin-module">
      <div className="gallery-manager-header admin-module-header">
        <div>
          <span className="admin-section-eyebrow">Content Management</span>

          <h1>Gallery</h1>

          <p>
            Manage images, events, workshops and other visual content displayed
            on the academy website.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="admin-primary-button"
            onClick={handleAdd}
          >
            + Add Gallery Item
          </button>
        )}
      </div>

      {showForm && (
        <form className="gallery-form admin-form-card" onSubmit={handleSubmit}>
          <div className="gallery-form-header admin-form-header">
            <div>
              <span className="admin-section-eyebrow">
                {editingId ? 'Edit Content' : 'New Content'}
              </span>

              <h2>{editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2>
            </div>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          <div className="gallery-form-section admin-form-section">
            <h3 className="admin-form-section-title">
              Basic Information
            </h3>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="gallery-title">Title</label>

                <input
                  id="gallery-title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Coding Classroom"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="gallery-category">Category</label>

                <select
                  id="gallery-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Classroom">Classroom</option>
                  <option value="Events">Events</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Students">Students</option>
                  <option value="Projects">Projects</option>
                  <option value="Campus">Campus</option>
                </select>
              </div>

              <div className="admin-field admin-field-full">
                <label htmlFor="gallery-description">Description</label>

                <textarea
                  id="gallery-description"
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter a short description..."
                />
              </div>
            </div>
          </div>

          <div className="gallery-form-section admin-form-section">
            <h3 className="admin-form-section-title">
              Media
            </h3>

            <div className="gallery-media-editor">
              <div className="admin-field">
                <label htmlFor="gallery-image">Gallery Image</label>

                <input
                  ref={imageInputRef}
                  id="gallery-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <span className="admin-form-help">
                  Recommended: JPG, PNG or WebP image.
                </span>
              </div>

              {form.image && (
                <div className="gallery-image-preview">
                  <img
                    src={form.image}
                    alt="Gallery preview"
                  />
                </div>
              )}

              <div className="admin-field">
                <label htmlFor="gallery-video-url">
                  Video URL <span>(Optional)</span>
                </label>

                <input
                  id="gallery-video-url"
                  name="videoUrl"
                  type="url"
                  value={form.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                />

                <span className="admin-form-help">
                  Add a YouTube or other video URL if this gallery item has a
                  related video.
                </span>
              </div>
            </div>
          </div>

          <div className="gallery-form-actions admin-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
            >
              {editingId ? 'Update Gallery Item' : 'Save Gallery Item'}
            </button>
          </div>
        </form>
      )}

      <div className="gallery-list-section">
        <div className="gallery-list-header admin-list-header">
          <div>
            <h2>Gallery Items</h2>
            <span className="admin-count">
              {gallery.length} {gallery.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {gallery.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No gallery items yet</h3>
            <p>
              Add your first image to start building the academy gallery.
            </p>
          </div>
        ) : (
          <div className="gallery-admin-grid">
            {gallery.map((item) => (
              <article
                key={item.id}
                className="gallery-admin-card"
              >
                <div className="gallery-admin-media">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="gallery-admin-image"
                    />
                  ) : (
                    <div className="gallery-admin-image-placeholder">
                      No Image
                    </div>
                  )}

                  <span
                    className={
                      item.isActive
                        ? 'admin-status active'
                        : 'admin-status inactive'
                    }
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="gallery-admin-content">
                  <div className="gallery-admin-title-row">
                    <div>
                      <span className="gallery-category">
                        {item.category}
                      </span>

                      <h3>{item.title}</h3>
                    </div>
                  </div>

                  <p className="gallery-admin-description">
                    {item.description}
                  </p>

                  {item.videoUrl && (
                    <div className="gallery-video-link">
                      🎬 Video available
                    </div>
                  )}

                  <div className="gallery-admin-actions">
                    <button
                      type="button"
                      className="admin-action-button edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-action-button status"
                      onClick={() => handleToggleStatus(item.id)}
                    >
                      {item.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      type="button"
                      className="admin-action-button delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default GalleryManager