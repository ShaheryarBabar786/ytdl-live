

// const express = require('express');
// const router = express.Router();
// const ytdl = require('ytdl-core');
// const fs = require('fs');
// const path = require('path');

// function sanitizeTitle(title) {
//     return title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// }

// router.post('/downloadshortmp4', async (req, res) => {
//     const videoURL = decodeURIComponent(req.body.videoURL);

//     try {
//         if (!ytdl.validateURL(videoURL)) {
//             throw new Error('Invalid YouTube URL');
//         }
//         const info = await ytdl.getInfo(videoURL);

//         if (!info || !info.videoDetails || !info.formats || info.formats.length === 0) {
//             throw new Error('Video information not available or no suitable formats found.');
//         }

//         const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

//         if (!format) {
//             throw new Error('No suitable format found.');
//         }

//         res.setHeader('Content-Disposition', `attachment; filename="${sanitizeTitle(info.videoDetails.title)}.mp4"`);
//         res.setHeader('Content-Type', 'video/mp4');

//         const videoStream = ytdl(videoURL, { format });
//         videoStream.pipe(res);

//         videoStream.on('error', (error) => {
//             console.error('Error while streaming video:', error.message);
//             res.status(500).send({ error: 'An error occurred while streaming the video.' });
//         });

//         videoStream.on('end', () => {
//             console.log('Video download completed successfully.');
//         });

//     } catch (error) {
//         console.error('Error while processing the request:', error.message);
//         const errorMessage = error.message === 'Video information not available or no suitable formats found.'
//             ? 'Video unavailable or format not supported.'
//             : error.message;
//         res.status(500).send({ error: errorMessage });
//     }
// });


// router.post('/downloadvideomp4', async (req, res) => {
//     const videoURL = decodeURIComponent(req.body.videoURL);
//     const itag = req.body.itag;

//     try {
//         if (!ytdl.validateURL(videoURL)) {
//             throw new Error('Invalid YouTube URL');
//         }
//         const info = await ytdl.getInfo(videoURL);

//         const format = info.formats.find(f => f.itag == itag);
//         if (!format) {
//             throw new Error('Requested format not available.');
//         }

//         res.setHeader('Content-Disposition', `attachment; filename="${sanitizeTitle(info.videoDetails.title)}.mp4"`);
//         res.setHeader('Content-Type', 'video/mp4');

//         const videoStream = ytdl(videoURL, { format });
//         videoStream.pipe(res);

//         videoStream.on('error', (error) => {
//             console.error('Error while streaming video:', error.message);
//             res.status(500).send({ error: 'An error occurred while streaming the video.' });
//         });

//         videoStream.on('end', () => {
//             console.log('Video download completed successfully.');
//         });

//     } catch (error) {
//         console.error('Error while processing the request:', error.message);
//         res.status(500).send({ error: error.message });
//     }
// });




// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const ytdl = require('ytdl-core');

// // Function to sanitize the video title
// function sanitizeTitle(title) {
//     return title.replace(/[^\w\s]/gi, ''); // Removes non-alphanumeric characters
// }

// router.get('/downloadAudio', async (req, res) => {
//     const { videoURL } = req.query;

//     try {
//         if (!videoURL) {
//             throw new Error('Video URL is required.');
//         }

//         // Get video info
//         const videoInfo = await ytdl.getInfo(videoURL);

//         if (!videoInfo.videoDetails) {
//             throw new Error('Invalid video URL or video not available.');
//         }

//         // Sanitize the video title for use in Content-Disposition header
//         const sanitizedTitle = sanitizeTitle(videoInfo.videoDetails.title);

//         // Set headers for download
//         res.set({
//             'Content-Disposition': `attachment; filename="${sanitizedTitle}.mp3"`,
//             'Content-Type': 'audio/mpeg'
//         });

//         // Download MP3 audio stream with specific format and quality
//         const audioStream = ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' });

//         // Pipe the audio stream directly to the response
//         audioStream.pipe(res);
//     } catch (error) {
//         console.error('Error downloading audio:', error.message);
//         res.status(500).json({ error: 'Error downloading audio', message: error.message });
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');

// Function to sanitize the video title
function sanitizeTitle(title) {
    return title.replace(/[^\w\s]/gi, ''); // Removes non-alphanumeric characters
}

router.get('/downloadAudio', async (req, res) => {
    const { videoURL } = req.query;

    try {
        if (!videoURL) {
            throw new Error('Video URL is required.');
        }

        // Get video info
        const videoInfo = await ytdl.getInfo(videoURL);

        if (!videoInfo.videoDetails) {
            throw new Error('Invalid video URL or video not available.');
        }

        // Sanitize the video title for use in Content-Disposition header
        const sanitizedTitle = sanitizeTitle(videoInfo.videoDetails.title);

        // Set headers for download
        res.set({
            'Content-Disposition': `attachment; filename="${sanitizedTitle}.mp3"`,
            'Content-Type': 'audio/mpeg'
        });

        // Download MP3 audio stream with MP3 format explicitly set
        const audioStream = ytdl(videoURL, { filter: 'audioonly', format: 'mp3' });

        // Pipe the audio stream directly to the response
        audioStream.pipe(res);
    } catch (error) {
        console.error('Error downloading audio:', error.message);
        res.status(500).json({ error: 'Error downloading audio', message: error.message });
    }
});

module.exports = router;
