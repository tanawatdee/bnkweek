const express = require('express')
const crypto = require('crypto')
const fs = require('fs')
const axios = require('axios')

const mix = new express.Router()

mix.get('/', (req, res) => {
	res.writeHead(307, { 'Location': 'https://bnkweek.sgp1.digitaloceanspaces.com/mix.pdf' })
	res.end()
})

module.exports = mix