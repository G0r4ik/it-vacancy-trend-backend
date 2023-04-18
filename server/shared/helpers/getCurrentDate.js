module.exports = function () {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = String(now.getFullYear()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
