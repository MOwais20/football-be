const scoreController = require("../controller/score/index");

module.exports = function (express, app, lib, db) {
  const router = express.Router();

  router.get("/leagues", async (req, res) => {
    try {
      const leagues = await scoreController(lib, db).fetchLeagues();
      res.json({
        data: leagues,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  router.get("/fixtures", async (req, res) => {
    try {
      const fixtures = await scoreController(lib, db).getLiveFixtures(
        req.query
      );
      res.json({
        data: fixtures,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  router.get("/head2head", async (req, res) => {
    try {
      const head2head = await scoreController(lib, db).fixtureHead2Head(
        req.query
      );
      res.json({
        data: head2head,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  router.get("/statistics", async (req, res) => {
    try {
      const statistics = await scoreController(lib, db).fixtureStatistics(
        req.query
      );
      res.json({
        data: statistics,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  router.get("/fixtures-lineups", async (req, res) => {
    try {
      const lineups = await scoreController(lib, db).fixtureLineups(req.query);
      res.json({
        data: lineups,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  router.get("/standings", async (req, res) => {
    try {
      const standings = await scoreController(lib, db).standings(req.query);
      res.json({
        data: standings,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  return router;
};
