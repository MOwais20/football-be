const axios = require("axios");
module.exports = function (lib, db) {
    const translate = async (obj) => {
        if (!obj.content) {
            return;
        }

        let result = await axios
            .post("http://localhost:5000/translate", {
                q: obj.content,
                source: "en",
                target: obj.targetLanguage,
            })
            .then((response) => response.data)
            .catch((error) => {
                // console.log("🚀 ~ translate ~ error", error?.response?.data?.error);
                throw new Error(error?.message || "Error translating the content");
            });

        return result?.translatedText;
    };

    const fetchNews = async (params) => {
        try {
            const news = await axios
                .get("https://apis.soccernetnews.com/crypto/news?v=v1")
                .then((response) => response?.data)
                .catch((error) => {
                    throw new Error(error?.message || "Error fetching news");
                });


            if (params.targetLanguage === "en") {
                return news.data;
            } else {
                // create a for loop to iterate over the news array
                for (let i = 0; i < news.data.length; i++) {
                    news.data[i].title = await translate({
                        content: news.data[i].title,
                        targetLanguage: params.targetLanguage,
                    });

                    news.data[i].createtime = await translate({
                        content: news.data[i].createtime,
                        targetLanguage: params.targetLanguage,
                    });

                    news.data[i].content = await translate({
                        content: news.data[i].content,
                        targetLanguage: params.targetLanguage,
                    });
                }

                return news.data;
            }


        } catch (error) {
            throw new Error(error.message);
        }
    };

    return {
        fetchNews,
    };
};
