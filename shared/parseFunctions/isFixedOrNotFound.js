export default function isFixedOrNotFound(parsedString, emptyWords) {
  for (const string of emptyWords) {
    if (parsedString.includes(string)) return true
  }
  return false
}
