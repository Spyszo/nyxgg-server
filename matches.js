const axios = require("axios");
const MatchHistory = require("mongoose").model("MatchHistory");
const Summoner = require("mongoose").model("Summoner");
const RiotApi = require("./RiotApi")

exports.getMatches = async (req, res) => {
    try {

        const summonerInDb = await Summoner.findOne({ name: req.params.summoner.toLowerCase() });

        let matchesIds = [];
        let matches = [];

        if (!summonerInDb) return res.send(null);

        if (summonerInDb.matchHistoryIds.length > 0) {
            matchesIds = summonerInDb.matchHistoryIds;

            for (i in matchesIds) {

                let matchObj = null

                const matchObjectInDb = await MatchHistory.findOne({
                    matchId: matchesIds[i],
                });

                if (!matchObjectInDb) {
                    matchObj = await RiotApi.match(matchesIds[i]);

                    const newMatch = new MatchHistory({
                        matchId: matchObj.metadata.matchId,
                        data: matchObj,
                    });
    
                    await newMatch.save();
                } else {
                    matchObj = matchObjectInDb
                }

                matches.push(matchObj.data);
            }

            console.log("Matches fetched from DB");

        } else {

            const matchesIds = await RiotApi.matches(summonerInDb.puuid)

            summonerInDb.matchHistoryIds = matchesIds;
            await summonerInDb.save();

            for (x in matchesIds) {
                const matchObj = await RiotApi.match(matchesIds[x]);

                if (!matchObj) continue;

                matches.push(matchObj);

                const ifMatchExistsInDb = await MatchHistory.findOne({ matchId: matchObj.metadata.matchId });
                if (ifMatchExistsInDb) continue;


                const newMatch = new MatchHistory({
                    matchId: matchObj.metadata.matchId,
                    data: matchObj,
                });

                await newMatch.save();
            }
        }

        const count = req.query.count || 10

        res.send(matches.slice(0, count));

    } catch (err) {
        console.log(err);
        res.send("error");
        return;
    }
};