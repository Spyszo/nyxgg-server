/* eslint-disable func-names */
const mongoose = require("mongoose");

const summonerSchema = new mongoose.Schema({
  _id: { type: String },
  accountId: { type: String },
  name: { type: String },
  displayName: { type: String },
  lastUpdate: { type: Number },
  puuid: { type: String },
  level: { type: Number },
  iconId: { type: Number },
  stats: { type: Object },
  matchHistoryIds: { type: Array },
});

mongoose.model("Summoner", summonerSchema);
