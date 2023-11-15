import queries from './sql.js'

class Services {
  async getRegions() {
    return queries.getRegions()
  }

  async getRankedJobBoardOfRegion(idRegion) {
    const lastDate = await queries.getLastDate()
    const allCounts = await queries.getCounts(lastDate)
    const jobBoards = await queries.getJobBoards(idRegion)
    const keywords = await queries.getKeywordsForRanked()
    const keywordsItems = keywords.map(i => i.tool)
    for (const item of jobBoards) {
      const count = allCounts.find(i => +i.id_jobboard_regions === +item.id)
      item.counts = {}
      item.counts[keywordsItems[0]] = count?.tool1 || 0
      item.counts[keywordsItems[1]] = count?.tool2 || 0
      item.counts[keywordsItems[2]] = count?.tool3 || 0
      item.counts.total =
        (count?.tool1 ?? 0) + (count?.tool2 ?? 0) + (count?.tool3 ?? 0)
    }

    const sortedJobBoards = jobBoards.sort((a, b) => b.total - a.total)
    console.log(sortedJobBoards)
    return sortedJobBoards
    // return queries.getRankedJobBoardOfRegion(idRegion)
  }
}

export default new Services()
