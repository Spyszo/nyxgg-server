/* eslint-disable func-names */
const mongoose = require("mongoose");

const matchHistorySchema = new mongoose.Schema({
  matchId: { type: String, unique: true, required: true },
  data: { type: Object },
});

mongoose.model("MatchHistory", matchHistorySchema);
