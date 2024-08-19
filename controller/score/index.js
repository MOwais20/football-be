require("dotenv").config();
const axios = require("axios");
const DB = require("../../config/database");

const ScoreAPI = axios.create({
  baseURL: `https://${process.env.RAPID_SCORE_BASE_URL}`,
  headers: {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": `api-football-v1.p.rapidapi.com`,
  },
});

const flashScoreNewsTable = DB.collection("scoreLeagues");
const flashScoreNewsDetailsTable = DB.collection("scoreLiveFixtures");
const flashScoreLiveListTable = DB.collection("scoreFixtureHead2Head");
const flashScoreEventsCountTable = DB.collection("scoreFixtureStatistics");
const flashScoreStandingsTable = DB.collection("scoreFixtureLineups");
const flashScoreTopAssistsTable = DB.collection("scoreStandings");
const flashScoreTopScorersTable = DB.collection("scoreTopAssists");
const flashScoreTopRedCardsTable = DB.collection("scoreTopScorers");
const flashScoreTopYellowCardsTable = DB.collection("scoreTopRedCards");
const flashScoreInjuriesByPlayerIdTable = DB.collection("scoreTopYellowCards");
const flashScoreInjuriesByLeagueIdTable = DB.collection("scoreInjuriesByPlayerId");
const fetchLeaguesTable = DB.collection("fetchLeagues");

const currentTime = new Date();
const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

module.exports = function (lib, db) {
  const fetchLeagues = async (params) => {
    try {

      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await fetchLeaguesTable.findOne({
        timestamp: { $gte: oneDayAgo },
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/leagues");
      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await fetchLeaguesTable.insertOne({ data, timestamp: currentTime });


      console.log("\nData fetched from external API\n");


      return {
        ...response.data,
        dbRetrieved: false,
      };
    } catch (error) {
      throw error;
    }
  };

  const getLiveFixtures = async (params) => {
    try {

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreNewsDetailsTable.findOne({
        timestamp: { $gte: oneDayAgo },
        live: params?.live,
        next: params?.next,
        last: params?.last,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/fixtures", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreNewsDetailsTable.insertOne({ data, timestamp: currentTime, ...params });

      console.log("\nData fetched from external API\n");

      return {
        ...data,
        dbRetrieved: false,
      };

    } catch (error) {
      console.log("🚀 ~ getLiveFixtures ~ error:", error)
      throw error;
    }
  };

  const fixtureHead2Head = async (params) => {
    try {


      //  Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreLiveListTable.findOne({
        timestamp: { $gte: oneDayAgo },
        h2h: params?.h2h,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/fixtures/headtohead", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreLiveListTable.insertOne({ data, timestamp: currentTime, ...params });

      return {
        ...response.data,
        dbRetrieved: false,
      };
    } catch (error) {
      throw error;
    }
  };

  const fixtureStatistics = async (params) => {
    try {

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreEventsCountTable.findOne({
        timestamp: { $gte: oneDayAgo },
        fixture: params?.fixture,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }


      const response = await ScoreAPI.get("/fixtures/statistics", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreEventsCountTable.insertOne({ data, timestamp: currentTime, ...params });

      return {
        ...response.data,
        dbRetrieved: false,
      };
    } catch (error) {
      throw error;
    }
  };

  const fixtureLineups = async (params) => {
    try {

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreStandingsTable.findOne({
        timestamp: { $gte: oneDayAgo },
        fixture: params?.fixture,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/fixtures/lineups", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreStandingsTable.insertOne({ data, timestamp: currentTime, ...params });


      return {
        ...response.data,
        dbRetrieved: false,
      }
    } catch (error) {
      throw error;
    }
  }

  const standings = async (params) => {
    try {

      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreStandingsTable.findOne({
        timestamp: { $gte: oneDayAgo },
        season: params?.season,
        league: params?.league,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/standings", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreStandingsTable.insertOne({ data, timestamp: currentTime, ...params });

      console.log("\nData fetched from external API\n");

      return { ...response.data, dbRetrieved: false };
    } catch (error) {
      throw error;
    }
  }

  const getTopAssists = async (params) => {
    try {

      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreTopAssistsTable.findOne({
        timestamp: { $gte: oneDayAgo },
        season: params?.season,
        league: params?.league,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/players/topassists", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreTopAssistsTable.insertOne({ data, timestamp: currentTime, ...params });

      console.log("\nData fetched from external API\n");

      return { ...response.data, dbRetrieved: false };
    } catch (error) {
      throw error;
    }
  }

  const getTopScorers = async (params) => {
    try {

      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreTopScorersTable.findOne({
        timestamp: { $gte: oneDayAgo },
        season: params?.season,
        league: params?.league,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/players/topscorers", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreTopScorersTable.insertOne({ data, timestamp: currentTime, ...params });

      console.log("\nData fetched from external API\n");



      return { ...response.data, dbRetrieved: false };
    } catch (error) {
      throw error;
    }
  }

  const getTopRedCards = async (params) => {
    try {

      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreTopRedCardsTable.findOne({
        timestamp: { $gte: oneDayAgo },
        season: params?.season,
        league: params?.league,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/players/topredcards", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreTopRedCardsTable.insertOne({ data, timestamp: currentTime, ...params });

      return {
        ...response.data,
        dbRetrieved: false,
      };
    } catch (error) {
      throw error;
    }
  }

  const getTopYellowCards = async (params) => {
    try {

      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreTopYellowCardsTable.findOne({
        timestamp: { $gte: oneDayAgo },
        season: params?.season,
        league: params?.league,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/players/topyellowcards", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreTopYellowCardsTable.insertOne({ data, timestamp: currentTime, ...params });


      return {
        ...response.data,
        dbRetrieved: false,
      };

    } catch (error) {
      throw error;
    }
  }

  const getInjuriesByPlayerId = async (params) => {
    try {

      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreInjuriesByPlayerIdTable.findOne({
        timestamp: { $gte: oneDayAgo },
        player: params?.player,
        season: params?.season,
      });

      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          ...params,
          ...cachedData.data,
        };
      }

      const response = await ScoreAPI.get("/injuries", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;
      await flashScoreInjuriesByPlayerIdTable.insertOne({ data, timestamp: currentTime, ...params });


      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const getInjuriesByLeagueId = async (params) => {
    try {
      const response = await ScoreAPI.get("/injuries", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  return {
    fetchLeagues,
    getLiveFixtures,
    fixtureHead2Head,
    fixtureStatistics,
    fixtureLineups,
    standings,
    getTopAssists,
    getTopScorers,
    getTopRedCards,
    getTopYellowCards,
    getInjuriesByPlayerId,
  };
};
