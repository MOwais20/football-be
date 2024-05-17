const authController = require("../controller/auth/index");

module.exports = function (express, app, lib, db) {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    try {
      const user = await authController(lib, db).register(req.body);
      res.json({
        data: user,
        status: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  });

    router.post("/login", async (req, res) => {
        try {
        const user = await authController(lib, db).login(req.body);
        res.json({
            data: user,
            status: 200,
            success: true,
        });
        } catch (error) {
        res.status(500).json({ error: error.message, success: false });
        }
    });

    return router;
    
};
