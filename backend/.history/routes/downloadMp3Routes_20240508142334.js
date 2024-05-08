const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
function sanitizeTitle(title) {
    return title.replace(/[^\w\s]/gi, ''); 
}
// router.get('/downloadAudio', async (req, res) => {
//     const { videoURL } = req.query;
//     try {
//         if (!videoURL) {
//             throw new Error('Video URL is required.');
//         }
//         const videoInfo = await ytdl.getInfo(videoURL);
//         if (!videoInfo.videoDetails) {
//             throw new Error('Invalid video URL or video not available.');
//         }
//         const sanitizedTitle = sanitizeTitle(videoInfo.videoDetails.title);
//         res.set({
//             'Content-Disposition': `attachment; filename="${sanitizedTitle}.mp3"`,
//             'Content-Type': 'audio/mpeg'
//         });
//         const audioStream = ytdl(videoURL, { filter: 'audioonly', format: 'mp3' });
//         audioStream.pipe(res);
//     } catch (error) {
//         console.error('Error downloading audio:', error.message);
//         res.status(500).json({ error: 'Error downloading audio', message: error.message });
//     }
// });

router.get('/downloadAudio', async (req, res) => {
    const { videoURL } = req.query;
    try {
        if (!videoURL) {
            throw new Error('Video URL is required.');
        }
        const videoInfo = await ytdl.getInfo(videoURL);
        if (!videoInfo.videoDetails) {
            throw new Error('Invalid video URL or video not available.');
        }
        const sanitizedTitle = sanitizeTitle(videoInfo.videoDetails.title);
        res.set({
            'Content-Disposition': `attachment; filename="${sanitizedTitle}.mp3"`,
            'Content-Type': 'audio/mpeg'
        });
        const audioStream = ytdl(videoURL, { filter: 'audioonly', format: 'mp3' });
        let totalBytes = 0;
        audioStream.on('response', (response) => {
            totalBytes = parseInt(response.headers['content-length'], 10);
            let downloadedBytes = 0;
            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const progress = Math.round((downloadedBytes / totalBytes) * 100);
                console.log(`Download progress: ${progress}%`);
                // You can send progress updates to the client or use them as needed
            });
            audioStream.pipe(res);
        });
        audioStream.on('error', (error) => {
            console.error('Error while streaming audio:', error.message);
            res.status(500).send({ error: 'An error occurred while streaming the audio.' });
        });
        audioStream.on('end', () => {
            console.log('Audio download completed successfully.');
        });
    } catch (error) {
        console.error('Error downloading audio:', error.message);
        res.status(500).json({ error: 'Error downloading audio', message: error.message });
    }
});

module.exports = router;



