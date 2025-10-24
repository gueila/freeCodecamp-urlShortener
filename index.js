require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const URL = require('url').URL;
const mongoose = require("mongoose")

let bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const url = new mongoose.Schema({
  original_url: String,
  short_url: String
})
const Url = mongoose.model("Url", url)

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function (req, res) {
  const originalURL = req.body.url;
  const hostname = new URL(originalURL).hostname; // ✅ "freecodecamp.org"

  dns.lookup(hostname, async (err, address, family) => {
    if (err) {
      // console.log(err);
      return res.json({ error: 'invalid url' });
    } else {
      var shortenedURL = Math.floor(Math.random() * 100000).toString();

      item = {
        original_url: originalURL,
        short_url: shortenedURL
      }
      var data = new Url(item);

      const d = await data.save();

      res.json(item)
    };
  });

});

app.get('/api/shorturl/:short', async function (req, res) {
  const param = req.params.short;
  const response = await Url.findOne({ short_url: param })
  if (!response) {
    return res.json({ error: 'invalid url' })
  }
  res.redirect(response.original_url)
})
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
