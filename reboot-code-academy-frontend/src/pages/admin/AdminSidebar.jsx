const adminMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'DB',
  },
  
  {
    id: 'announcements',
    label: 'Announcements',
    icon: 'AN',
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: 'CO',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: 'GA',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: 'TE',
  },
  {
    id: 'students',
    label: 'Students',
    icon: 'ST',
  },
  {
    id: 'bookings',
    label: 'Demo Bookings',
    icon: 'DB',
  },
  {
    id: 'materials',
    label: 'Course Materials',
    icon: 'CM',
  },
  {
    id: 'contact',
    label: 'Contact Information',
    icon: 'CT',
  },
]

function AdminSidebar({ activeModule, onSelectModule }) {
  return (
    <aside className="admin-sidebar">

      <div className="admin-sidebar-brand">
        <div className="admin-brand-icon">
          RC
        </div>

        <div>
          <strong>Reboot Code Academy</strong>
          <span>Admin Panel</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        {adminMenu.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              activeModule === item.id
                ? 'admin-nav-item active'
                : 'admin-nav-item'
            }
            onClick={() => onSelectModule(item.id)}
          >
            <span className="admin-nav-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

    </aside>
  )
}

export default AdminSidebar