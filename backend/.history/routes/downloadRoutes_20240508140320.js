

const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
function sanitizeTitle(title) {
    return title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
}
router.post('/downloadshortmp4', async (req, res) => {
    const videoURL = decodeURIComponent(req.body.videoURL);
    try {
        if (!ytdl.validateURL(videoURL)) {
            throw new Error('Invalid YouTube URL');
        }
        const info = await ytdl.getInfo(videoURL);
        if (!info || !info.videoDetails || !info.formats || info.formats.length === 0) {
            throw new Error('Video information not available or no suitable formats found.');
        }
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        if (!format) {
            throw new Error('No suitable format found.');
        }
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizeTitle(info.videoDetails.title)}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');
        const videoStream = ytdl(videoURL, { format });
        let totalBytes = 0;
        videoStream.on('response', (response) => {
            totalBytes = parseInt(response.headers['content-length'], 10);           
            let downloadedBytes = 0;
            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const progress = Math.round((downloadedBytes / totalBytes) * 100);
            });
            videoStream.pipe(res);
        });
        videoStream.on('error', (error) => {
            console.error('Error while streaming video:', error.message);
            res.status(500).send({ error: 'An error occurred while streaming the video.' });
        });
        videoStream.on('end', () => {
            console.log('Video download completed successfully.');
        });
    } catch (error) {
        console.error('Error while processing the request:', error.message);
        const errorMessage = error.message === 'Video information not available or no suitable formats found.'
            ? 'Video unavailable or format not supported.'
            : error.message;
        res.status(500).send({ error: errorMessage });
    }
});
router.post('/downloadvideomp4', async (req, res) => {
    const videoURL = decodeURIComponent(req.body.videoURL);
    const itag = req.body.itag;
    try {
        if (!ytdl.validateURL(videoURL)) {
            throw new Error('Invalid YouTube URL');
        }
        const info = await ytdl.getInfo(videoURL);
        const lengthSeconds = parseInt(info.videoDetails.lengthSeconds);
        const format = info.formats.find(f => f.itag == itag);
        if (!format) {
            throw new Error('Requested format not available.');
        }
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizeTitle(info.videoDetails.title)}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');
        const videoStream = ytdl(videoURL, { format });
        let totalBytes = 0;
        videoStream.on('response', (response) => {
            totalBytes = parseInt(response.headers['content-length'], 10);            
            let downloadedBytes = 0;
            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const progress = Math.round((downloadedBytes / totalBytes) * 100);
                // console.log(`Download Progress: ${progress}%`);
            });
            videoStream.pipe(res);
        });
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
router.post('/getByte', async (req, res) => {
    const videoURL = req.body.videoURL;
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
        const videoStream = ytdl(videoURL ,{format});
        let totalBytes = 0;
        videoStream.on('response', (response) => {
            totalBytes = parseInt(response.headers['content-length'], 10);
            res.json(totalBytes)
        });
    } catch (error) {
        console.error('Error while processing the request:', error.message);
        res.status(500).send({ error: error.message });
    }
});


router.post('/getByteforshorts', async (req, res) => {
    const videoURL = req.body.videoURL;
    
    try {
        if (!ytdl.validateURL(videoURL)) {
            throw new Error('Invalid YouTube URL');
        }
        const info = await ytdl.getInfo(videoURL);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

        if (!format) {
            throw new Error('No suitable format found.');
        }
        const videoStream = ytdl(videoURL, { format });

        let totalBytesforshorts = 0;
        videoStream.on('response', (response) => {
            totalBytesforshorts = parseInt(response.headers['content-length'], 10);
            res.json(totalBytesforshorts)
        });
    } catch (error) {
        console.error('Error while processing the request:', error.message);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;


