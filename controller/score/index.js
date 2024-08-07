require("dotenv").config();
const axios = require("axios");
const DB = require("../../config/database");

const ScoreAPI = axios.create({
  baseURL: `https://${process.env.RAPID_SCORE_BASE_URL}`,
  headers: {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_HOST,
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


module.exports = function (lib, db) {
  const fetchLeagues = async (params) => {
    try {
      const response = await ScoreAPI.get("/leagues");
      if (!response.data) {
        throw new Error("No data found");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getLiveFixtures = async (params) => {
    try {
      const response = await ScoreAPI.get("/fixtures", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      return response.data;
    } catch (error) {
      console.log("🚀 ~ getLiveFixtures ~ error:", error)
      throw error;
    }
  };

  const fixtureHead2Head = async (params) => {
    try {
      const response = await ScoreAPI.get("/fixtures/headtohead", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const fixtureStatistics = async (params) => {
    try {
      const response = await ScoreAPI.get("/fixtures/statistics", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const fixtureLineups = async (params) => {
    try {
      const response = await ScoreAPI.get("/fixtures/lineups", {
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

  const standings = async (params) => {
    try {
      const response = await ScoreAPI.get("/standings", {
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

  const getTopAssists = async (params) => {
    try {
      const response = await ScoreAPI.get("/players/topassists", {
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

  const getTopScorers = async (params) => {
    try {
      const response = await ScoreAPI.get("/players/topscorers", {
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

  const getTopRedCards = async (params) => {
    try {
      const response = await ScoreAPI.get("/players/topredcards", {
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

  const getTopYellowCards = async (params) => {
    try {
      const response = await ScoreAPI.get("/players/topyellowcards", {
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

  const getInjuriesByPlayerId = async (params) => {
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
