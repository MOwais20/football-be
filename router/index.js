module.exports = function (express, app) {
  app.use("/api/football", require("./score")(express, app));
//   app.get("/", (req, res) => res.send("Hello World!"));
};
