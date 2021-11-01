exports.calculateScore = async (matchObj) => {

    let scores = {}

    let teamScores = {
        "win": {
            kills: 0,
            objectives: 0,
            totalDamageDealt: 0,
            averageLevel: 0,

        },
        "lose": {
            kills: 0,
            objectives: 0,
            totalDamageDealt: 0,
            averageLevel: 0,
        }
    }

    const getKillsPoints = (summoner) =>  {
        const kills = summoner.assists + summoner.kills

        const participation = kills / teamScores[summoner.win? "win": "lose"].kills;

        console.log(participation)



        return participation
    }


    for (x in matchObj.info.participants) {
        const summoner = matchObj.info.participants[x]

        teamScores[summoner.win? "win": "lose"].kills += summoner.kills
        teamScores[summoner.win? "win": "lose"].objectives += summoner.dragonKills + summoner.baronKills + summoner.inhibitorKills + summoner.nexusKills + summoner.turretKills
        teamScores[summoner.win? "win": "lose"].totalDamageDealt += summoner.totalDamageDealt
        teamScores[summoner.win? "win": "lose"].averageLevel += summoner.champLevel
    }

    teamScores["win"].averageLevel /= 5
    teamScores["lose"].averageLevel /= 5


    for (x in matchObj.info.participants) {
        const summoner = matchObj.info.participants[x]
        let score = 0

        score += getKillsPoints(summoner)

        scores[summoner.summonerName] = score
    }


    return {
        scores,
        teamScores
    }
}