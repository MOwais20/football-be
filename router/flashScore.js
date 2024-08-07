const flashScoreController = require("../controller/score/flashScore");

module.exports = function (express, app, lib, db) {
  const router = express.Router();

  router.get("/news-list", async (req, res) => {
    try {
      const news = await flashScoreController(lib, db).fetchNewsList();
      res.json({
        data: news,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
    
  });

  return router;

};