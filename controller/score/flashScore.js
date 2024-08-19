require("dotenv").config();

const DB = require("../../config/database");
const axios = require("axios");

const FlashScoreAPI = axios.create({
  baseURL: `https://${process.env.RAPID_FLASHSCORE_BASE_URL}`,
  headers: {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  },
});

const flashScoreNewsTable = DB.collection("flashScoreNews");
const flashScoreNewsDetailsTable = DB.collection("flashScoreNewsDetails");
const flashScoreLiveListTable = DB.collection("flashScoreLiveList");
const flashScoreEventsCountTable = DB.collection("flashScoreEventsCount");
module.exports = function (lib, db) {
  const fetchNewsList = async (params) => {
    try {
      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreNewsTable.findOne({
        timestamp: { $gte: oneDayAgo },
        entity_id: params?.entity_id,
        category_id: params?.category_id,
        locale: params?.locale,
      });
      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          entity_id: params?.entity_id,
          category_id: params?.category_id,
          locale: params?.locale,
          ...cachedData.data,
        };
      }

      // Fetch new data from external API
      const response = await FlashScoreAPI.get("/v1/news/list", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;

      // Store new data in the DB with a timestamp
      await flashScoreNewsTable.insertOne({ data, ...params, timestamp: currentTime });

      console.log("\nData fetched from external API\n");

      return {
        ...data,
        dbRetrieved: false,
      };
    } catch (error) {
      console.log("🚀 ~ getLiveFixtures ~ error:", error?.response?.data);
      throw error;
    }
  };

  const fetchNewsDetails = async (params) => {
    console.log("🚀 ~ fetchNewsDetails ~ params:", params)
    try {
      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreNewsDetailsTable.findOne({
        timestamp: { $gte: oneDayAgo },
        article_id: params?.article_id,
        locale: params?.locale,
      });
      if (cachedData) {
        console.log("\nData fetched from cache\n");
        return {
          _id: cachedData._id,
          timestamp: cachedData.timestamp,
          dbRetrieved: true,
          article_id: params?.article_id,
          locale: params?.locale,
          ...cachedData.data,
        };
      }

      // Fetch new data from external API
      const response = await FlashScoreAPI.get("/v1/news/details", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;

      // Store new data in the DB with a timestamp
      await flashScoreNewsDetailsTable.insertOne({
        data,
        timestamp: currentTime,
        article_id: params?.article_id,
        locale: params?.locale,
      });

      console.log("\nData fetched from external API\n");

      return {
        ...data,
        dbRetrieved: false,
      };
    } catch (error) {
      console.log("🚀 ~ getLiveFixtures ~ error:", error?.response?.data);
      throw error;
    }
  };

  const fetchLiveList = async (params) => {
    try {
      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreLiveListTable.findOne({
        timestamp: { $gte: oneDayAgo },
        locale: params?.locale,
        sport_id: params?.sport_id,
        timezone: params?.timezone,
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

      // Fetch new data from external API
      const response = await FlashScoreAPI.get("/v1/events/live-list", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;

      // Store new data in the DB with a timestamp
      await flashScoreLiveListTable.insertOne({ data, ...params, timestamp: currentTime });

      console.log("\nData fetched from external API\n");

      return {
        ...data,
        dbRetrieved: false,
      };
    } catch (error) {
      console.log("🚀 ~ getLiveFixtures ~ error:", error?.response?.data);
      throw error;
    }
  };

  const fetchEventsCount = async (params) => {
    try {
      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

      // Check if data is already in the DB and is not older than a day
      const cachedData = await flashScoreEventsCountTable.findOne({
        timestamp: { $gte: oneDayAgo },
        timezone: params?.timezone,
        locale: params?.locale,
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

      // Fetch new data from external API
      const response = await FlashScoreAPI.get("/v1/sports/events-count", {
        params,
      });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = response.data;

      // Store new data in the DB with a timestamp
      await flashScoreEventsCountTable.insertOne({
        data,
        timestamp: currentTime,
        ...params,
      });

      console.log("\nData fetched from external API\n");

      return {
        ...data,
        dbRetrieved: false,
      };
    } catch (error) {
      console.log("🚀 ~ getLiveFixtures ~ error:", error?.response?.data);
      throw error;
    }
  };

  return {
    fetchNewsList,
    fetchNewsDetails,
    fetchLiveList,
    fetchEventsCount,
  };
};
