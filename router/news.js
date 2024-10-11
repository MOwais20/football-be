const newsController = require("../controller/news/index");

module.exports = function (express, app, lib, db) {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const news = await newsController(lib, db).fetchNews(req.query);
            res.json({
                data: news,
                status: 200,
                success: true,
            });
        } catch (error) {
            // console.log("🚀 ~ router.get ~ error:", error)
            res.status(500).json({ error: error.message, success: false });
        }
    });

    router.get("/symbols", async (req, res) => {
        try {
            const news = await newsController(lib, db).fetchSymbols(req.query);
            res.json({
                data: news,
                status: 200,
                success: true,
            });
        } catch (error) {
            // console.log("🚀 ~ router.get ~ error:", error)
            res.status(500).json({ error: error.message, success: false });
        }
    });

    return router;
}