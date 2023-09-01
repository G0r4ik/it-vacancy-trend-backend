import { HttpsProxyAgent } from 'https-proxy-agent'
// import puppeteer from 'puppeteer-extra'
// import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import fetch from 'node-fetch'
import queries from './sql.js'
import { getCurrentDate } from '../../shared/helpers.js'
import { sendMail } from '../../shared/mail.js'
import chalk from '../../shared/chalkColors.js'
import config, { isProduction } from '../../shared/consts.js'
import ListMapper from './mapping.js'

export async function getNumberOfVacancies() {
  const jobBoardsRegions = ListMapper.jobBoardsRegions(
    await queries.getJobBoardsRegions()
  )
  console.log(chalk.log('Start getNumberOfVacancies'))
  const dateStart = new Date()
  const [previousDate] = await queries.getLastDate()

  const dateId = await createAndGetDateOfNewParsing()
  const tools = ListMapper.tools(await queries.getTools())
  for (const jobBoardRegions of jobBoardsRegions) {
    const options = [previousDate.iddate, jobBoardRegions.id]
    const previousCounts = ListMapper.getOneCountOfAllTechnology(
      await queries.getOneCountOfAllTechnology(...options)
    )
    for (const tool of tools) {
      const previousItem = previousCounts.find(t => t.idTool === tool.idTool)
      // FIXME hardcode
      const params = [jobBoardRegions, tool, previousItem, dateId]
      if (+jobBoardRegions.id === 1) {
        await wrapper(getHeadHunter, ...params)
      }
      if (+jobBoardRegions.id === 2) {
        await wrapper(getLinkedIn, ...params)
      }
    }
  }

  await queries.changeStatusOfDate(dateId)
  const dateEnd = ((Date.now() - dateStart) / 60_000).toFixed(2)
  console.log(chalk.log(`Потрачено минут: ${dateEnd}`))
}

async function wrapper(
  function_,
  jobBoardRegions,
  tool,
  previousCounts,
  date,
  i = 0
) {
  if (i === config.NUMBER_OF_FAILED_ATTEMPTS) {
    console.log(`Слишком много неудачных запросов (${tool.nameTool})`)
    sendMail({
      subject: `Слишком много неудачных запросов (${tool.nameTool})`,
    })
    return null
  }
  try {
    const previousCount = previousCounts.countOfItem ?? null
    const count = await function_(tool)
    if (!isNormalCount(count, previousCount) && isProduction) {
      console.log(chalk.log('Сильно отличающиеся числа'))
      sendMail({
        subject: 'Отличающиеся данные',
        text: `Слишком отличающиеся числа у ${tool.nameTool}: прошлое: ${previousCount} текущее: ${count}`,
      })
    }
    console.log(chalk.log(tool.nameTool, 'c:', count, 'p:', previousCount))
    await queries.setCountsItem(tool.idTool, date, count, jobBoardRegions.id)
    return count
  } catch (error) {
    console.log(chalk.error(error))
    return wrapper(
      function_,
      jobBoardRegions,
      tool,
      previousCounts,
      date,
      i + 1
    )
  }
}

async function getHeadHunter(tool) {
  // FIX добавить hash table с tools где в качестве ключа будет id, проверить скорость
  // FIX исправить на Promise.all() (в прошлые разы слишком быстро поступали запросы к HH, поэтому ошибка появлялась)

  const encodedTool = encodeURIComponent(tool.search_query)
  const resp = await fetch(`${config.HH_QUERY_SEARCH}${encodedTool}`)
  const html = await resp.text()

  const indexOfStart = html.indexOf(config.HH_HTML_NODE_CONTAINNING_COUNT)
  const parsedString = html.slice(indexOfStart + 45, indexOfStart + 300)

  if (!parsedString.includes('аканс') && !isFixedOrNotFound(parsedString)) {
    throw new Error(`1`)
  }
  if (isFixedOrNotFound(parsedString)) return 0

  let currentCount = ''
  for (const char of parsedString) {
    if (!isNaN(char) && !isNaN(Number.parseFloat(char))) currentCount += char
    if (char === '<') break
  }
  return Number(currentCount)
}

async function getLinkedIn(tool) {
  // const proxyHost = '80.66.87.66'
  // const proxyPort = 10_000
  // const proxyUsername = 'DRVkEbipFO'
  // const proxyPassword = 'eGyPGUqxZQ'
  // const proxyURL = `https://${proxyUsername}:${proxyPassword}@${proxyHost}:${proxyPort}`
  const encodedTool = encodeURIComponent(tool.search_query)
  const targetUrl = `https://www.linkedin.com/jobs/search?keywords=${encodedTool}`

  const agent = new HttpsProxyAgent(
    'http://DRVkEbipFO:eGyPGUqxZQ@80.66.87.66:10000'
  )

  const resp = await fetch(targetUrl, { agent })
  const data = await resp.text()
  const index = data.indexOf('<title>')
  if (index === -1) return 0
  let res = ''
  for (let i = index; data[i] !== ' '; i++) res += data[i]
  return res.split('>').at(-1).trim().replaceAll(/[+,]/g, '')
}

// async function getIndeed(tool) {
//   const args = [
//     '--no-sandbox',
//     '--disable-setuid-sandbox',
//     '--disable-infobars',
//     '--window-position=0,0',
//     '--ignore-certifcate-errors',
//     '--ignore-certifcate-errors-spki-list',
//     '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"',
//   ]

//   const options = {
//     // args,
//     headless: false,
//     ignoreHTTPSErrors: true,
//     userDataDir: './tmp',
//   }

//   puppeteer.use(StealthPlugin())
//   // https://app.impact.com/
//   // puppeteer usage as normal
//   await puppeteer
//     .launch(options)
//     .then(async browser => {
//       const page = await browser.newPage()
//       await page.goto('https://www.indeed.com/jobs?q=javascript')
//       await page.waitForTimeout(5000)
//       await page.keyboard.press('Tab')
//       await page.waitForTimeout(100)
//       await page.keyboard.press('Space')
//       await page.waitForTimeout(200)
//       await page.waitForTimeout(250000)

//       await page.screenshot({ path: 'testresult.png', fullPage: true })
//       await browser.close()
//       return 1
//     })
//     .catch(e => console.log(e))
//   // const encodedTool = encodeURIComponent(tool.search_query)
//   // const resp = await fetch(`https://www.indeed.com/jobs?q=${encodedTool}`)
//   // fetch('https://www.indeed.com/jobs?q=javascript&vjk=f987180e50415756', {})
//   // const html = await resp.text()
//   // console.log(html)
//   // const indexOfStart = html.indexOf('jobsearch-JobCountAndSortPane-jobCount')
//   // const parsedString = html.slice(indexOfStart + 45, indexOfStart + 300)
//   // console.log(parsedString)
//   //   cloudscraper
//   //     .get('https://www.indeed.com/jobs?q=javascript')
//   //     .then(console.log, console.error)
// }

async function createAndGetDateOfNewParsing() {
  const [lastDate] = await queries.createNewDate(getCurrentDate())
  return lastDate.idDate
}

function isFixedOrNotFound(parsedString) {
  for (const string of config.fixedOrNotFound.HeadHunter) {
    if (parsedString.includes(string)) return true
  }
  return false
}

function isNormalCount(currentCount, previousCount) {
  const maxValue = Math.max(currentCount, previousCount)
  const minValue = Math.min(currentCount, previousCount)

  const c = maxValue / 2 < minValue
  return maxValue < config.MIN_VALUE_CHECKING_DIFFERENCES || c
}

export async function canParsing() {
  const now = new Date()
  if (now.getHours() === config.HOURS_OF_START_PARSING) {
    const [lastDate] = await queries.getLastDate()
    return !isSameDay(new Date(lastDate.date_of_completion), now)
  }
  return false
}

function isSameDay(date, date2) {
  const isDay = date.getDay() === date2.getDay()
  const isMonth = date.getMonth() === date2.getMonth()
  const isYear = date.getFullYear() === date2.getFullYear()
  return isDay && isMonth && isYear
}
