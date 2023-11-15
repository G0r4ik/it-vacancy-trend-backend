import isFixedOrNotFound from './isFixedOrNotFound.js'

export default async function getHeadHunter(url, nodeContainCount, emptyWords) {
  const resp = await fetch(url)
  const html = await resp.text()

  const indexOfStart = html.indexOf(nodeContainCount)
  const parsedString = html.slice(indexOfStart + 45, indexOfStart + 300)

  if (
    !parsedString.includes('аканс') &&
    !isFixedOrNotFound(parsedString, emptyWords)
  ) {
    throw new Error('какая то ошибка')
  }
  if (isFixedOrNotFound(parsedString, emptyWords)) return 0

  let currentCount = ''
  for (const char of parsedString) {
    if (!Number.isNaN(+char) && !Number.isNaN(Number.parseFloat(char)))
      currentCount += char
    if (char === '<') break
  }
  return Number(currentCount)
}
