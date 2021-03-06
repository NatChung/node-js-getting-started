const express = require('express')
const path = require('path')
const ytdl = require('ytdl-core')
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/', (req, res) => {
    ytdl.getInfo(req.body.videoId,  (err, info) => {
      if (err) throw err
      var format = ytdl.filterFormats(info.formats, (format) => (format.container === 'mp4' && format.audioEncoding!=null))
      
      res.json({
        vid: info.video_id,
        title: info.title,
        author: info.author.name,
        thumbnail: info.thumbnail_url.replace('default.jpg', 'hqdefault.jpg'),
        lengthSeconds: info.length_seconds,
        url: format[0].url
      })
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
