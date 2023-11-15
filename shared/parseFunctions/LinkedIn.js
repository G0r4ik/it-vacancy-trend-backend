import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'
import isFixedOrNotFound from './isFixedOrNotFound.js'

export default async function getLinkedIn(url, nodeContainCount, emptyWords) {
  await new Promise(resolve => setTimeout(resolve, 5000))
  const agent = new HttpsProxyAgent(process.env.PROXY)

  const resp = await fetch(url, { agent })
  const data = await resp.text()

  const index = data.indexOf(nodeContainCount)

  if (
    !data.includes('results-context-header__job-count') &&
    !isFixedOrNotFound(data, emptyWords)
  ) {
    console.log('ни результата, ни исправления')
    throw new Error('Ошибка при парсинге')
  }
  if (isFixedOrNotFound(data, emptyWords)) return 0

  let res = ''
  for (let i = index; data[i] !== ' '; i++) res += data[i]
  return res.split('>').at(-1).trim().replaceAll(/[+,]/g, '')
}
