const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const session = require('express-session')
const filestore = require('session-file-store')(session)
const app = require('express')()
const http = require('http')
const fs = require('fs-extra')
const csrf = require('csurf')
const axios = require('axios')

const api = require('./api')
const mix = require('./api/mix')
const nuxtConfig = require('./nuxt.config.js')
const servConfig = require('./serv.config.js')

const nuxt = new Nuxt(nuxtConfig)

const https = require('https').createServer({
  cert: fs.readFileSync( servConfig.ssl.cert ),
  key: fs.readFileSync( servConfig.ssl.key )
}, app)
const io = require('socket.io')(https)

if (nuxtConfig.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

io.on('connection', socket => {
  socket.emit('init', '')
  socket.on('check', async msg => {
    let {data: form} = await axios.get(
      'https://script.google.com/macros/s/AKfycbxmFw4CVOgy6B5_oLE4K27vkrgk5GthX8RGcG7_V6iE-O74ySQ/exec?path=/pb12to2/' + msg.toLowerCase()
    )
    form.paid == 'yes' ? socket.emit(msg, 'OK') : ''
  })
})

app.use(session({
  secret: servConfig.session.secret,
  resave: true,
  saveUninitialized: true,
  store: new filestore(),
  cookie: { maxAge: servConfig.session.maxAge }
}))

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '50mb'}))

app.use('/api', (req, res, next) => {
	req.io = io
	next()
}, api)
app.use('/mix.pdf', mix)

app.use(nuxt.render)

https.listen(8083, '0.0.0.0')



console.log('listening...')

// http.createServer(function (req, res) {
//     res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url })
//     res.end()
// }).listen(80, '0.0.0.0')