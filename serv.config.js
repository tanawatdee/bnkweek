module.exports = {
	"ssl": {
		"cert": "/etc/letsencrypt/live/bnkweek.com/fullchain.pem",
		"key": "/etc/letsencrypt/live/bnkweek.com/privkey.pem"
	},
	"session": {
		"secret": "bnkweek-nuxt-session",
		"maxAge": 60000 //ms
	}
}