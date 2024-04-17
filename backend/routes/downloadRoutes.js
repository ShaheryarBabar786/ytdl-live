

// const express = require('express');
// const router = express.Router();
// const ytdl = require('ytdl-core');
// const fs = require('fs');
// const path = require('path');

// function sanitizeTitle(title) {
//     return title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// }



// router.get('/', async (req, res) => {
//     const videoURL = decodeURIComponent(req.query.videoURL);
//     const itag = req.query.itag;

//     try {
//         if (!ytdl.validateURL(videoURL)) {
//             throw new Error('Invalid YouTube URL');
//         }
//         const info = await ytdl.getInfo(videoURL);

//         console.log('Available Formats:', info.formats.map(f => ({ itag: f.itag, resolution: f.qualityLabel, codec: f.audioEncoding })));

//         const format = info.formats.find(f => f.itag == itag);
//         if (!format) {
//             console.log('Selected Itag:', itag);
//             throw new Error('Requested format not available.');
//         }

//         if (format.contentLength) {
//             res.setHeader('Content-Length', format.contentLength);
//         }

//         res.setHeader('Content-Disposition', `attachment; filename="${sanitizeTitle(info.videoDetails.title)}.mp4"`);
//         res.setHeader('Content-Type', 'video/mp4');

//         const videoStream = ytdl(videoURL, { format });
//         videoStream.pipe(res);

//         videoStream.on('error', (error) => {
//             console.error('Error while streaming video:', error.message);
//             res.status(500).send({ error: 'An error occurred while streaming the video.' });
//         });

//         // Log successful download
//         videoStream.on('end', () => {
//             console.log('Video download completed successfully.');
//         });

//     } catch (error) {
//         console.error('Error while processing the request:', error.message);
//         res.status(500).send({ error: error.message });
//     }
// });



// module.exports = router;

const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

function sanitizeTitle(title) {
    return title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
}

router.post('/', async (req, res) => {
    const videoURL = decodeURIComponent(req.body.videoURL);
    const itag = req.body.itag;

    try {
        if (!ytdl.validateURL(videoURL)) {
            throw new Error('Invalid YouTube URL');
        }
        const info = await ytdl.getInfo(videoURL);

        const format = info.formats.find(f => f.itag == itag);
        if (!format) {
            throw new Error('Requested format not available.');
        }

        res.setHeader('Content-Disposition', `attachment; filename="${sanitizeTitle(info.videoDetails.title)}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        const videoStream = ytdl(videoURL, { format });
        videoStream.pipe(res);

        videoStream.on('error', (error) => {
            console.error('Error while streaming video:', error.message);
            res.status(500).send({ error: 'An error occurred while streaming the video.' });
        });

        videoStream.on('end', () => {
            console.log('Video download completed successfully.');
        });

    } catch (error) {
        console.error('Error while processing the request:', error.message);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;