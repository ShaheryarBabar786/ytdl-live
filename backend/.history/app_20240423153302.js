const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const ytdl = require('ytdl-core');
const { Readable } = require('stream');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from this origin
    credentials: true, // Allow credentials like cookies, if needed
}));
app.use(morgan('dev'));

// Increase timeout
app.use(function (req, res, next) {
    res.setTimeout(60000, function () {
        console.log('Request has timed out.');
        res.status(408).send('Request Timeout');
    });
    next();
});

const downloadRoutes = require('./routes/downloadRoutes');
const downloadMp3Routes = require('./routes/downloadMp3Routes');
const videoDetailsRoutes = require('./routes/Detailroute');

app.use('/download', downloadRoutes);
app.use('/mp3', downloadMp3Routes);
app.use('/videoDetail', videoDetailsRoutes);

const publicAudiosFolder = path.join(__dirname, 'public', 'audios');
app.use('/getvideo', express.static('public/videos'));
app.use('/getaudio', express.static(publicAudiosFolder));

const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
