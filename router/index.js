

module.exports = function (express, app) {
  // app.use("/api/auth", require("./auth")(express, app));
  app.use("/api/news", require("./news")(express, app));
  // app.get("/", (req, res) => res.send({
  //   message: "Welcome to the Football API",
  //   version: "19.8.2024",
  // }));
};
