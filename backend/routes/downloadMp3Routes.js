

const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const fs = require('fs');

router.get('/downloadAudio', async (req, res) => {
    const { audioURL } = req.query;

    try {
        if (!audioURL) {
            throw new Error('Audio URL is required.');
        }

        const audioInfo = await ytdl.getInfo(audioURL);

        // Download audio stream
        const audioStream = ytdl(audioURL, { quality: 'highestaudio' });

        // Set headers for download
        res.set({
            'Content-Disposition': `attachment; filename="${audioInfo.videoDetails.title}.mp3"`,
            'Content-Type': 'audio/mpeg'
        });

        // Pipe the audio stream directly to the response
        audioStream.pipe(res);
    } catch (error) {
        console.error('Error downloading audio:', error.message);
        res.status(500).json({ error: 'Error downloading audio', message: error.message });
    }
});



module.exports = router;

