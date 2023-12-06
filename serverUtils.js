import * as cheerio from "cheerio";
import AdmZip from "adm-zip";

const fetchSubsUrlPage = async (subUrl) => {
    try {
        const data = await fetch(subUrl);
        const html = await data.text();
    
        return html;
    } catch (err) {
        console.error("Failed to fetch Subscene subtitle page.");
    }
};

const getDownloadUrl = (html) => {
    try {
        const $ = cheerio.load(html);

        const path = $("div.download").find("a").attr("href");
        const downloadUrl = `https://subscene.com${path}`;

        return downloadUrl;
    } catch (err) {
        console.error("Failed to fetch download url for subtitles");
    }
};

const downloadSub = async (dUrl) => {
    try {
        const data = await fetch(dUrl);
        const zipBuffer = await data.arrayBuffer();

        return zipBuffer;
    } catch (err) {
        console.error("Failed to fetch subtitle zip.");
    }
};

const unzipSub = (arrBuffer) => {
    try {
        const buffer = Buffer.from(new Uint8Array(arrBuffer));

        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();

        const srtEntry = zipEntries.find(entry => entry.entryName.endsWith(".srt"));

        if (srtEntry) {
            const srtContent = zip.readAsText(srtEntry);
            return srtContent;

        } else {
            throw new Error("No \".srt\" files found in the ZIP archive");
        }
    } catch (err) {
        console.error("An error occurred:", err.message);
    }
};

const srtToVtt = (srt) => {
    try {
        const vttContent = srt.replace(/\d{2}:\d{2}:\d{2},\d{3}/g, match => {
            const [hh, mm, ss] = match.split(":");
            const milliseconds = parseInt(ss.slice(3), 10);
            return `${hh}:${mm}:${ss.slice(0, 2)}.${milliseconds}`;
        });

        return `WEBVTT\n\n${vttContent}`;
    } catch (err) {
        console.log("Invalid srt file. Can't convert it");
    }
};

export { fetchSubsUrlPage, getDownloadUrl, downloadSub, unzipSub, srtToVtt };
