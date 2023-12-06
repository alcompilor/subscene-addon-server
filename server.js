import express from "express";
import cors from "cors";
import * as Utils from "./serverUtils.js";

const server = express();

server.use(cors());

server.get("/subtitles.vtt", async (req, res) => {
    const reqUrl = req.query.from;
    const downloadUrl = Utils.getDownloadUrl(await Utils.fetchSubsUrlPage(reqUrl));

    const srtFile = Utils.unzipSub(await Utils.downloadSub(downloadUrl));
    const vttFile = Utils.srtToVtt(srtFile);

    res.header("Content-Type", "text/vtt");
    res.send(vttFile);
});

server.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
});