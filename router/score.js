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
      const { live } = req.query;
      const fixtures = await scoreController(lib, db).getLiveFixtures({
        live: live,
      });
      res.json({
        data: fixtures,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

  return router;
};
