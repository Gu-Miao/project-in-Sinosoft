const http = require("http");
const fs = require("fs");

const host = "localhost";
const port = 8000;

const server = http.createServer(function (req, res) {

    res.statusCode = 200;

    if (req.url === "/") {
        req.url = "/index.html";
    }

    if (req.url.substr(-3) === "css") {
        res.setHeader("Content-Type", "text/css");
    }

    if (req.url.split("?").length >= 2) {
        req.url = req.url.split("?")[0];
    }

    var fileName = __dirname + req.url;

    if (req.url !== "/undefined") {
        fs.createReadStream(fileName).pipe(res);
    }
});

server.listen(port, host, function () {
    console.log(`server is running on http://${host}:${port}`);
});