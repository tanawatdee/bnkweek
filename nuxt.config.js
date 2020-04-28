const isProd = process.env.NODE_ENV === 'production'

module.exports = {
	dev: !isProd,
	modules: [
    	'bootstrap-vue/nuxt'
    ],
    plugins: [
	    { src: '~/plugins/vue-qrcode-reader', ssr: false }
	],
	head: {
	    titleTemplate: '%s - เช้าเย็น BNK48',
	    meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=360,initial-scale=1,shrink-to-fit=no' }
	    ],
	    link: [
	    	{ rel: 'stylesheet', href: '/js/font.css' },
	    	{ rel: 'shortcut icon', type: 'image/png', href: 'https://cdn.bnkweek.com/icon/logo_64.jpg' }
	    ]
	},
    css: [
    	'@/assets/style.css'
    ]
}