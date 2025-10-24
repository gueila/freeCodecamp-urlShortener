require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

let bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function (req, res) {
  const originalURL = req.body.url;
  dns.lookup(originalURL, (err, address, family) => {
    if (err) {
      console.log(err);
      
      res.json({
        originalURL: originalURL,
        shortenedURL: "Invalid URL"
      });
    } else {
      var shortenedURL = Math.floor(Math.random() * 100000).toString();

      var data = new Model({
        originalURL: originalURL,
        shortenedURL: shortenedURL
      });

      data.save(function (err, data) {
        if (err) {
          return console.error(err);
        }
      });

      res.json({
        originalURL: originalURL,
        shortenedURL: shortenedURL
      })
    };
  });
  // res.json({ original_url: req.body.url, short_url: 1 });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
