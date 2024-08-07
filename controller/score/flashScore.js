require("dotenv").config();

const DB = require("../../config/database");
const axios = require("axios");

const FlashScoreAPI = axios.create({
    baseURL: process.env.RAPID_FLASHSCORE_BASE_URL,
    headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
    },
});

const flashScoreNewsTable = DB.collection("flashScoreNews");


module.exports = function (lib, db) {

    const fetchNewsList = async (params) => {
        try {
            const currentTime = new Date();
            const oneDayAgo = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000));

            // Check if data is already in the DB and is not older than a day
            const cachedData = await flashScoreNewsTable.findOne({ timestamp: { $gte: oneDayAgo } });
            if (cachedData) {
                console.log("\nData fetched from cache\n");
                return {
                    ...cachedData,
                    dbRetrieved: true,
                };

            }

            // Fetch new data from external API
            const response = await FlashScoreAPI.get('/v1/news/list', {
                params,
            });

            if (!response.data) {
                throw new Error("No data found");
            }

            const data = response.data;

            // Store new data in the DB with a timestamp
            await flashScoreNewsTable.insertOne({ dummyData, timestamp: currentTime });

            console.log("\nData fetched from external API\n");

            return {
                ...data,
                dbRetrieved: false,
            };
        } catch (error) {
            console.log("🚀 ~ getLiveFixtures ~ error:", error)
            throw error;
        }

    }

    return {
        fetchNewsList,
    }

}

