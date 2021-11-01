const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json())


const summonersToFollow = ["Agresywny Adam", "Spyszo v2", "Agresywny Maury", "Agresywny Marcel", "Mietex", "Weridowski", "ΛKΛLI"]

require('dotenv').config()
require('./config/database');
require('./models/matchHistoryModel');
require('./models/summonerModel');

const opgg = require("./OPGGApi")

app.use(cors())


const { getStats, updateStats, updateFollowedStats } = require("./stats")
const { getMatches } = require("./matches.js")
const { numberOfGames } = require("./numberOfGames.js")

const { calculateScore } = require("./calculateScore")

app.get("/", (req,res) => {
    res.send("Hello world")
})

app.get("/api/v1/stats/:summoner", getStats)
app.get("/api/v1/matches/:summoner", getMatches)
app.get("/api/v1/numberOfGames/:summoner", numberOfGames)
app.get("/api/v1/update/:summoner", updateStats)

app.get("/test/:summoner", async (req,res) => {
    res.send(await calculateScore(req.body.matchObj))
})


setInterval(async ()=>{
    for (x in summonersToFollow) {
        await updateFollowedStats(summonersToFollow[x])
    }
}, 1800000)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Serwer uruchomiony na porcie", PORT)
})