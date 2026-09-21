function AnnouncementTicker({ announcements = [], onNavigate }) {
  if (!announcements.length) {
    return null
  }

  // Duplicate the announcements so the ticker can continuously scroll.
  const tickerItems = announcements

  function handleActionClick(event, path) {
    event.preventDefault()

    if (onNavigate && path) {
      onNavigate(path)
    }
  }

  return (
    <div
      className="announcement-ticker"
      aria-label="Academy announcements"
    >
      

      <div className="ticker-window">
        <div className="ticker-track">
          {tickerItems.map((announcement) => (
            <span
              className="ticker-item"
              key={announcement.id}
            >
              {announcement.actionPath ? (
                <a
                  className="ticker-action"
                  href={announcement.actionPath}
                  onClick={(event) =>
                    handleActionClick(
                      event,
                      announcement.actionPath
                    )
                  }
                >
                  {announcement.label}
                </a>
              ) : (
                <strong>{announcement.label}</strong>
              )}

              {' '}

              {announcement.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnnouncementTicker