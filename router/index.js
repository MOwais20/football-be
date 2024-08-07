module.exports = function (express, app) {
  app.use("/api/auth", require("./auth")(express, app));
  app.use("/api/football", require("./score")(express, app));
  app.use("/api/flash", require("./flashScore")(express, app));
  app.get("/", (req, res) => res.send({
    message: "Welcome to the Football API",
    version: "07.8.2024",
  }));
};
