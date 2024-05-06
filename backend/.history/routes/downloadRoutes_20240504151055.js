

const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const sanitize = require('sanitize-filename');
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
        const errorMessage = error.message === 'Video information not available or no suitable formats found.'
            ? 'Video unavailable or format not supported.'
            : error.message;
        res.status(500).send({ error: errorMessage });
    }
});


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
router.post('/downloadvideomp4', async (req, res) => {
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
  
      const title = sanitize(info.videoDetails.title); // Sanitize filename
  
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
      res.setHeader('Content-Type', 'video/mp4');
  
      const videoStream = ytdl(videoURL, { format, quality: 'highestaudio' }); // Get highest quality audio stream
      const size = format.contentLength; // Get the content length of the video
  
      // Set Content-Length header for better progress tracking
      res.setHeader('Content-Length', size);
  
      // Pipe the video stream to the response in chunks for streaming and progress tracking
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


