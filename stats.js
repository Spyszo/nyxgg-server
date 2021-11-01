const Summoner = require('mongoose').model('Summoner');
const OPGGApi = require('./OPGGApi');
const RiotApi = require('./RiotApi');

exports.getStats = async (req, res) => {
    const summonerInDb = await Summoner.findOne({ name: req.params.summoner.toLowerCase() })

    if (summonerInDb) {
        console.log("Stats fetched from DB")
        return res.send(summonerInDb)
    }

    const OPGGData = await OPGGApi.stats(req.params.summoner)
    const RiotData = await RiotApi.summoner(req.params.summoner)

    const summonerData = {
        _id: RiotData.id,
        accountId: RiotData.accountId,
        name: RiotData.name.toLowerCase(),
        displayName: RiotData.name,
        puuid: RiotData.puuid,
        level: RiotData.summonerLevel,
        lastUpdate: Date.now(),
        iconId: RiotData.profileIconId,
        stats: { 
            ranking: OPGGData.ranking, 
            topChampions: OPGGData.topChampions, 
            currentSeason: OPGGData.currentSeason, 
            pastSeasons: OPGGData.pastSeasons 
        },
        matchHistoryIds: []
    }

    const newSummonerInDb = new Summoner(summonerData)
    await newSummonerInDb.save()

    res.send(summonerData)
}

exports.updateStats = async (req, res) => {
    const summonerInDb = await Summoner.findOne({ name: req.params.summoner.toLowerCase() })

    if (!summonerInDb) {
        return await this.getStats(req, res) 
    }

    const OPGGData = await OPGGApi.stats(req.params.summoner)
    const RiotData = await RiotApi.summoner(req.params.summoner)

    summonerInDb.level = RiotData.summonerLevel
    summonerInDb.iconId = RiotData.profileIconId
    summonerInDb.stats.ranking = OPGGData.ranking
    summonerInDb.stats.topChampions = OPGGData.topChampions, 
    summonerInDb.stats.currentSeason = OPGGData.currentSeason
    summonerInDb.lastUpdate = Date.now()


    const latestMatches = await RiotApi.matches(RiotData.puuid, 40)

    
    const matches = summonerInDb.matchHistoryIds

    let indexOfLastMatch = -1

    latestMatches.map((matchId, i) => {
        if (matchId == matches[0]) {
            indexOfLastMatch = i
        }
    })

    console.log(latestMatches)
    console.log(summonerInDb.matchHistoryIds)

    if (indexOfLastMatch > 0) {
        summonerInDb.matchHistoryIds.unshift(...latestMatches.slice(0, indexOfLastMatch))
    }

    await Summoner.findOneAndUpdate({ name: req.params.summoner.toLowerCase()}, summonerInDb)

    res.send(summonerInDb)
}

exports.updateFollowedStats = async (summonerName) => {
    const summonerInDb = await Summoner.findOne({ name: summonerName.toLowerCase() })

    const OPGGData = await OPGGApi.stats(summonerName)
    const RiotData = await RiotApi.summoner(summonerName)

    summonerInDb.level = RiotData.summonerLevel
    summonerInDb.iconId = RiotData.profileIconId
    summonerInDb.stats.ranking = OPGGData.ranking
    summonerInDb.stats.topChampions = OPGGData.topChampions, 
    summonerInDb.stats.currentSeason = OPGGData.currentSeason
    summonerInDb.lastUpdate = Date.now()


    const latestMatches = await RiotApi.matches(RiotData.puuid)

    
    const matches = summonerInDb.matchHistoryIds

    let indexOfLastMatch = -1

    latestMatches.map((matchId, i) => {
        if (matchId == matches[0]) {
            indexOfLastMatch = i
        }
    })

    if (indexOfLastMatch > 0) {
        summonerInDb.matchHistoryIds.unshift(...latestMatches.slice(0, indexOfLastMatch))
    }

    await Summoner.findOneAndUpdate({ name: summonerName.toLowerCase()}, summonerInDb)
}