const axios = require('axios')

exports.numberOfGames = async (req, res) => {
    const summoner = await axios.get(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.summoner}?api_key=${process.env.RIOT_API}`).then(res => res.data)
    const puuid = summoner.puuid


    const draftGames = []
    for (i = 0; i < 3000; i += 100) {
        let draft = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=400&count=100&start=${i}&api_key=${process.env.RIOT_API}`).then(res => res.data)
        if (draft.length == 0) break
        else draftGames.push(...draft)
    }


    const soloDuoGames = []
    for (i = 0; i < 3000; i += 100) {
        let soloDuo = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&count=100&start=${i}&api_key=${process.env.RIOT_API}`).then(res => res.data)
        if (soloDuo.length == 0) break
        else soloDuoGames.push(...soloDuo)
    }

    const flexGames = []
    for (i = 0; i < 3000; i += 100) {
        let flex = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=440&count=100&start=${i}&api_key=${process.env.RIOT_API}`).then(res => res.data)
        if (flex.length == 0) break
        else flexGames.push(...flex)
    }

    const aramGames = []
    for (i = 0; i < 3000; i += 100) {
        let aram = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=450&count=100&start=${i}&api_key=${process.env.RIOT_API}`).then(res => res.data)
        if (aram.length == 0) break
        else aramGames.push(...aram)
    }

    const clashGames = []
    for (i = 0; i < 3000; i += 100) {
        let clash = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=700&count=100&start=${i}&api_key=${process.env.RIOT_API}`).then(res => res.data)
        if (clash.length == 0) break
        else clashGames.push(...clash)
    }

    const blindGames = []
    for (i = 0; i < 3000; i += 100) {
        let blind = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=430&count=100&start=${i}&api_key=${process.env.RIOT_API}`).then(res => res.data)
        if (blind.length == 0) break
        else blindGames.push(...blind)
    }


    res.send({
        drafts: draftGames.length,
        soloDuo: soloDuoGames.length,
        flex: flexGames.length,
        aram: aramGames.length,
        blind: blindGames.length,
        clash: clashGames.length
    })
}