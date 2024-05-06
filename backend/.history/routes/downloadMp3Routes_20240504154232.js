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



