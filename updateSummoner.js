const MatchHistory = require("mongoose").model("MatchHistory");
const Summoner = require("mongoose").model("Summoner");
const axios = require("axios");
const cheerio = require("cheerio")



exports.updateSummoner = (summonerName) => {
    const summonerObj = Summoner.findOne({name: summonerName.toLowerCase()})
    if (!summonerObj) {

    }
} 