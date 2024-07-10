const Notification = ({ message, clr }) => {
    if (message === null) {
      return null
    }
    return (
      <div className="notif" style={ {color: clr} }>
        {message}
      </div>
    )
  }
  export default Notification