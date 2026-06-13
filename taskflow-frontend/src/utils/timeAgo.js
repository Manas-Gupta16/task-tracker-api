function timeAgo(date) {

    const seconds =
        Math.floor(
            (Date.now() - new Date(date)) / 1000
        )

    const minutes =
        Math.floor(seconds / 60)

    const hours =
        Math.floor(minutes / 60)

    const days =
        Math.floor(hours / 24)

    if (minutes < 1)
        return "Just now"

    if (minutes < 60)
        return `${minutes} mins ago`

    if (hours < 24)
        return `${hours} hours ago`

    return `${days} days ago`

}

export default timeAgo