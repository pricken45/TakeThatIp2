#!/usr/bin/env node

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const requestIp = require("request-ip");
const localtunnel = require("localtunnel");
const fetch = require("node-fetch");


app.use(requestIp.mw());

const randomURL = async ()=> {
    let mening = "";
    for (let i = 0; i < 3; i++) {
        const req = await fetch.default("https://random-word-api.herokuapp.com/word");
        const res = await req.json();
        mening += res[0];
        
    }
    return mening;
}


const startTunnel = async () => {
    let sub = await randomURL()
    const tunnel = await localtunnel({port: 3000, subdomain: sub});
    console.log("Send this to friends: " + tunnel.url);
};

startTunnel();

let latestIP = "";

app.set('trust proxy', true);

app.get("/", (req, res)=> {
    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Error</title>

</head>
<body>
    404 Error
    <script>
        fetch('/info');
    </script>
</body>
</html>
    `);
})

app.get('/ip', (req, res) => {
    res.json({ ip: latestIP });
});

app.get('/info', (req, res) => {
    latestIP = req.clientIp;
    console.log("New IP address recieved: " + latestIP);
})

server.listen(3000);