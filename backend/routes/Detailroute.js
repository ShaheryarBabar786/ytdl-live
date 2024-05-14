const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');
const { Readable } = require('stream');
const router = express.Router();

router.get('/fullDetails', async (req, res) => {
  const { videoURL } = req.query;

  try {
    if (!ytdl.validateURL(videoURL)) {
      throw new Error('Invalid YouTube URL');
    }

    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
        const duration = info.videoDetails.lengthSeconds;
    const description = info.videoDetails.description;
    const bufferStream = new Readable();
    bufferStream.push(JSON.stringify({ title, thumbnail,duration,description }));
    bufferStream.push(null);

    res.setHeader('Content-Type', 'application/json');
    bufferStream.pipe(res);

  } catch (error) {
    console.error('Error fetching video details:', error.message);
    res.status(500).json({ error: 'Error fetching video details', message: error.message });
  }
});

router.get('/details', async (req, res) => {
  console.log("detail router called")
  const { videoURL } = req.query;

  try {
    if (!ytdl.validateURL(videoURL)) {
      throw new Error('Invalid YouTube URL');
    }
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
    const bufferStream = new Readable();
    bufferStream.push(JSON.stringify({ title, thumbnail }));
    bufferStream.push(null); // End the stream

    res.setHeader('Content-Type', 'application/json');
    bufferStream.pipe(res);

  } catch (error) {
    console.error('Error fetching video details:', error.message);
    if (error.code === 'ETIMEDOUT') {
      res.status(504).json({ error: 'Gateway Timeout', message: 'The request timed out' });
    } else {
      res.status(500).json({ error: 'Error fetching video details', message: error.message });
    }
  }
});

router.get('/resolutions', async (req, res) => {
  const videoURL = req.query.videoURL;
  try {
      if (!ytdl.validateURL(videoURL)) {
          throw new Error('Invalid YouTube URL');
      }
      const info = await ytdl.getInfo(videoURL);
      const formatsWithAudioAndVideo = info.formats.filter(format => format.hasAudio && format.hasVideo);
      const resolutionsWithAudioAndVideo = formatsWithAudioAndVideo.map(format => ({
          itag: format.itag,
          resolution: format.qualityLabel || format.resolution,
      }));
      res.status(200).json({ resolutionsWithAudioAndVideo });
  } catch (error) {
      console.error('Error while fetching audio and video resolutions:', error.message);
      res.status(500).json({ error: error.message });
  }
});
module.exports = router;
