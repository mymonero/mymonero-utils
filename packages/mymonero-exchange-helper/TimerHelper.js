function getTimeRemaining (endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date())
    let seconds = Math.floor((total / 1000) % 60)
    let minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))

    if (total < 0) {
      seconds = 0
      minutes = 0
    }

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    }
}

module.exports = { getTimeRemaining }