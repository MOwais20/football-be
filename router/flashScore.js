const flashScoreController = require("../controller/score/flashScore");

module.exports = function (express, app, lib, db) {
  const router = express.Router();

  router.get("/news-list", async (req, res) => {
    try {
      const news = await flashScoreController(lib, db).fetchNewsList(req.query);
      res.json({
        data: news,
        status: 200,
        success: true,
      });
    } catch (error) {
      console.log("🚀 ~ router.get ~ error:", error)
      res.status(500).json({ error: error.message, success: false });
    }
  });

  router.get("/news-details", async (req, res) => {
    try {
      const news = await flashScoreController(lib, db).fetchNewsDetails(
        req.query
      );
      res.json({
        data: news,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });
  
  router.get("/events/live-list", async (req, res) => {
    try {
      const liveList = await flashScoreController(lib, db).fetchLiveList(
        req.query
      );
      res.json({
        data: liveList,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  router.get("/sports/events-count", async (req, res) => {
    try {
      const eventsCount = await flashScoreController(lib, db).fetchEventsCount(
        req.query
      );
      res.json({
        data: eventsCount,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  return router;
};
