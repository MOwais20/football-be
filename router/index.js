module.exports = function (express, app) {
  app.use("/api/auth", require("./auth")(express, app));
  app.use("/api/football", require("./score")(express, app));
  app.get("/", (req, res) => res.send({
    message: "Welcome to the Football API",
    version: "18.5.24",

  }));
};
