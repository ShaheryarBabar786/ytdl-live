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
    // Simulate buffering by creating a readable stream for basic details
    const bufferStream = new Readable();
    bufferStream.push(JSON.stringify({ title, thumbnail,duration,description }));
    bufferStream.push(null); // End the stream

    res.setHeader('Content-Type', 'application/json');
    bufferStream.pipe(res);

  } catch (error) {
    console.error('Error fetching video details:', error.message);
    res.status(500).json({ error: 'Error fetching video details', message: error.message });
  }
});
// router.get('/fullDetails', async (req, res) => {
//   const { videoURL } = req.query;

//   try {
//     if (!ytdl.validateURL(videoURL)) {
//       throw new Error('Invalid YouTube URL');
//     }

//     const info = await ytdl.getInfo(videoURL);
//     const title = info.videoDetails.title;
//     const thumbnail = info.videoDetails.thumbnails[0].url;
//     const duration = info.videoDetails.lengthSeconds;
//     const description = info.videoDetails.description;

//     // Send the title, thumbnail, duration, and description in the response
//     res.status(200).json({ title, thumbnail, duration, description });
//   } catch (error) {
//     console.error('Error fetching video details:', error.message);
//     res.status(500).json({ error: 'Error fetching video details', message: error.message });
//   }
// });



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

    // Simulate buffering by creating a readable stream for basic details
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




  // Route for fetching resolutions
  router.get('/resolutions', async (req, res) => {
    const { videoURL } = req.query;
  
    try {
        if (!ytdl.validateURL(videoURL)) {
            throw new Error('Invalid YouTube URL');
        }
  
        const info = await ytdl.getInfo(videoURL);
  
        // Filter formats based on ITAGs 22 and 18, and audio availability
        const resolutions = info.formats
            .filter(format => (format.itag === 22 || format.itag === 18) && format.audioBitrate !== null)
            .map(format => ({
                resolution: format.qualityLabel || `${format.width}x${format.height}`,
                itag: format.itag,
            }));
  
        res.status(200).json(resolutions);
    } catch (error) {
        console.error('Error fetching resolutions:', error.message);
        res.status(500).json({ error: 'Error fetching resolutions', message: error.message });
    }
});


router.get('/videoSize', async (req, res) => {
  const { videoURL } = req.query;

  try {
    if (!ytdl.validateURL(videoURL)) {
      throw new Error('Invalid YouTube URL');
    }

    const info = await ytdl.getInfo(videoURL);
    console.log("information",info)
    

    res.status(200).json({ info }); // Limit to 2 decimal places
  } catch (error) {
    console.error('Error fetching video size:', error.message);
    res.status(500).json({ error: 'Error fetching video size', message: error.message });
  }
});



  router.get('/audio-qualities', async (req, res) => {
    const { videoURL } = req.query;
  
    try {
      if (!ytdl.validateURL(videoURL)) {
        throw new Error('Invalid YouTube URL');
      }
  
      const info = await ytdl.getInfo(videoURL);
  
      // Filter formats based on audioBitrate and include audio qualities
      const audioQualities = info.formats
        .filter(format => format.audioBitrate !== null)
        .map(format => ({
          audioQuality: `${format.audioBitrate}kbps`,
          itag: format.itag,
        }));
  
      res.status(200).json(audioQualities);
    } catch (error) {
      console.error('Error fetching audio qualities:', error.message);
      res.status(500).json({ error: 'Error fetching audio qualities', message: error.message });
    }
  });
  
  
  
  
  

module.exports = router;
