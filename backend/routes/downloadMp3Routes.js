const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');

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

        // Set headers for download
        res.set({
            'Content-Disposition': `attachment; filename="${videoInfo.videoDetails.title}.mp3"`,
            'Content-Type': 'audio/mpeg'
        });

        // Download MP3 audio stream
        const audioStream = ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' });

        // Pipe the audio stream directly to the response
        audioStream.pipe(res);
    } catch (error) {
        console.error('Error downloading audio:', error.message);
        res.status(500).json({ error: 'Error downloading audio', message: error.message });
    }
});

module.exports = router;


