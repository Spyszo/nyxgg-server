const cheerio = require("cheerio")
const axios = require("axios")

exports.stats = async (summonerName) => {
    const document = await axios.get("https://eune.op.gg/summoner/userName=" + encodeURI(summonerName)).then(res => res.data)

    const $ = cheerio.load(document)


    const currentSeason = {
        soloDuo: {
            tier: $(".SoloRank .Tier").text().trim().slice(0, -2),
            rank: $(".SoloRank .Tier").text().trim().slice(-1),
            points: $(".SoloRank .LP").text().trim().slice(0, -3),
            wins: $(".SoloRank .Wins").text().trim().slice(0, -1),
            losses: $(".SoloRank .Losses").text().trim().slice(0, -1),
            winRatio: $(".SoloRank .Ratio").text().trim().slice(0, -1)
        },
        flex: {
            tier: $(".LeaguesContainer .Cell:nth-child(2) .Tier").text().trim().slice(0, -2),
            rank: $(".LeaguesContainer .Cell:nth-child(2) .Tier").text().trim().slice(-1),
            points: $(".LeaguesContainer .Cell:nth-child(2) .LP").text().trim().slice(0, -3),
            wins: $(".LeaguesContainer .Cell:nth-child(2) .Wins").text().trim().slice(0, -1),
            losses: $(".LeaguesContainer .Cell:nth-child(2) .Losses").text().trim().slice(0, -1),
            winRatio: $(".LeaguesContainer .Cell:nth-child(2) .Ratio").text().trim().slice(0, -1)
        }
    }

    const pastSeasons = Object.values($(".PastRank .Item")).map((item) => {
        if (!item.type) return
        let season = parseInt(item.children[0].children[0].data.slice(1))
        if (season === 2020) season = 10

        const tier = item.children[1].data.trim()

        return { season, tier }

    }).filter((item) => item !== undefined)

    const name = $(".Information .SummonerName").text().trim()
    const ranking = $(".ranking").text().trim()
    const level = $(".ProfileIcon .Level").text().trim()



    const topChampions = Object.values($(".MostChampionContent .ChampionBox")).map((item) => {
        if (!item.type) return

        const name = item.children[1].attribs.title

        let formattedName = ""

        switch (name) {
            case "Kai'Sa": formattedName = "Kaisa"; break;
            case "Cho'Gath": formattedName = "Chogath"; break;
            case "Jarvan IV": formattedName = "JarvanIV"; break;
            case "Kha'Zix": formattedName = "Khazix"; break;
            case "LeBlanc": formattedName = "Leblanc"; break;
            case "Lee Sin": formattedName = "LeeSin"; break;
            case "Nunu & Willump": formattedName = "Nunu"; break;
            case "Rek'Sai": formattedName = "RekSai"; break;
            case "Tahm Kench": formattedName = "TahmKench"; break;
            case "Twisted Fate": formattedName = "TwistedFate"; break;
            case "Vel'koz": formattedName = "Velkoz"; break;
            case "Xin Zhao": formattedName = "XinZhao"; break;
            case "Miss Fortune": formattedName = "MissFortune"; break;
            case "Kog'Maw": formattedName = "KogMaw"; break;
            case "Dr. Mundo": formattedName = "DrMundo"; break;
            default: formattedName = name
        }


        const minions = item.children[3].children[3].children[0].data.trim()
        const firstBracket = minions.search(/\(/)

        const csPerSecond = minions.slice(firstBracket + 1, -1)


        const kda = item.children[5].children[1].children[1].children[0].data.slice(0, -2)

        const winRatio = item.children[7].children[1].children[0].data.trim().slice(0, -1)

        const games = item.children[7].children[3].children[0].data.slice(0, -7)

        return {
            name, formattedName, csPerSecond, kda, winRatio, games
        }

    }).filter((item) => item !== undefined)


    return { currentSeason, pastSeasons, topChampions, name, level, ranking }
}