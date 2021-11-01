const axios = require("axios")

exports.summoner = async (summonerName) => {
    return await axios.get(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURI(summonerName)}?api_key=${process.env.RIOT_API}`).then(res => res.data).catch(err=>{})
} 

exports.matches = async (puuid, count = 10) => {
    return await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}&api_key=${process.env.RIOT_API}`).then(res=>res.data).catch(err=>{})
}

exports.match = async (matchId) => {
    return await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_API}`).then(res=>res.data).catch(err=>{})
}