const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
    res.send("Server alive");
});

app.post("/api/download", (req, res) => {

    const { url } = req.body;

    if (!url) {

        return res.status(400).json({
            success: false,
            error: "URL required"
        });
    }

    const valid =
        url.includes("x.com") ||
        url.includes("twitter.com") ||
        url.includes("instagram.com");

    if (!valid) {

        return res.status(400).json({
            success: false,
            error: "Unsupported URL"
        });
    }

    const ytDlp = spawn(
        "python3",
        [
            "-m",
            "yt_dlp",
            "-J",
            url
        ]
    );

    let data = "";
    let errorData = "";

    ytDlp.stdout.on("data", chunk => {
        data += chunk.toString();
    });

    ytDlp.stderr.on("data", chunk => {
        errorData += chunk.toString();
    });

    ytDlp.on("close", () => {

        if (errorData) {

            console.log(errorData);

            return res.status(500).json({
                success: false,
                error:
                    "Instagram may require login or rate limit exceeded"
            });
        }

        try {

            const json = JSON.parse(data);

            const formats =
                json.formats
                    .filter(f =>
                        f.ext === "mp4" &&
                        f.height &&
                        f.url
                    )
                    .reduce((acc, current) => {

                        const quality =
                            `${current.height}p`;

                        const exists =
                            acc.find(
                                item =>
                                    item.quality === quality
                            );

                        if (!exists) {

                            acc.push({
                                quality,
                                url: current.url
                            });
                        }

                        return acc;

                    }, []);

            res.json({
                success: true,
                title: json.title,
                thumbnail: json.thumbnail,
                duration: json.duration,
                formats
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                success: false,
                error: "Parsing failed"
            });
        }
    });
});

app.get("/api/file", (req, res) => {

    const url = req.query.url;

    if (!url) {

        return res.status(400).send(
            "Missing URL"
        );
    }

    const ytDlp = spawn(
        "python3",
        [
            "-m",
            "yt_dlp",
            "-f",
            "best",
            "-g",
            url
        ]
    );

    let videoUrl = "";

    ytDlp.stdout.on("data", chunk => {
        videoUrl += chunk.toString();
    });

    ytDlp.on("close", () => {

        const finalUrl =
            videoUrl.trim();

        res.redirect(finalUrl);
    });
});

// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});