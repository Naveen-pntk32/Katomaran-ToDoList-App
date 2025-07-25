export const formatDate = (date: Date): string => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (inputDate.getTime() === today.getTime()) {
    return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  } else if (inputDate.getTime() === tomorrow.getTime()) {
    return `Tomorrow, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}

export const isOverdue = (date: Date): boolean => {
  return date < new Date()
}
