require("dotenv").config();
const axios = require("axios");

const ScoreAPI = axios.create({
  baseURL: process.env.RAPID_SCORE_BASE_URL,
  headers: {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  },
});

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

  return {
    fetchLeagues,
    getLiveFixtures,
    fixtureHead2Head,
    fixtureStatistics,
    fixtureLineups,
    standings,
  };
};
