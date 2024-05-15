module.exports = function (express, app, lib) {
    app.get("/", (req, res) => {
        res.send({
            message: "Hello, you're in the backyard!"
        });
    });
}