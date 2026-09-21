function AnnouncementTicker({ announcements, onNavigate }) {
  const tickerItems = [...announcements, ...announcements]

  function handleActionClick(event, path) {
    event.preventDefault()
    onNavigate(path)
  }

  return (
    <div className="announcement-ticker" aria-label="Academy announcements">
      <span className="celebration-icon moving-celebration-icon" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>

      <div className="ticker-window">
        <div className="ticker-track">
          {tickerItems.map((announcement, index) => (
            <span className="ticker-item" key={`${announcement.id}-${index}`}>
              {announcement.actionPath ? (
                <a
                  className="ticker-action"
                  href={announcement.actionPath}
                  onClick={(event) => handleActionClick(event, announcement.actionPath)}
                >
                  {announcement.label}
                </a>
              ) : (
                <strong>{announcement.label}</strong>
              )}
              {announcement.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnnouncementTicker
