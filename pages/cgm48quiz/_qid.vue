<template>
	<div v-if="!isFinish" class="main_container">
		<div style="width: 100%;padding-top: 15%; background-color: #f9f9f9;">
			<div style="margin-top: -10%;text-align: center;">
				<h2 style="margin:0; background-color: #f9f9f9;">{{ quiz_no }}. เม็มเบอร์คนนี้ชื่ออะไร?</h2>
			</div>
		</div>
		<div id="mem_pic" style="width: 100%;padding-top: 100%;" :style="{'background-image': 'url(\'https://cdn.bnkweek.com/cgm/' + cur_mem + '.jpg\')'}"></div>
		<div style="background-color: pink;width: 100%;">
			<div style="float:left; width: 50%;">
				<div style="padding-top: 40%;">
					<div style="margin-top: -32%;text-align: center;">
						<b-btn variant="outline-primary" style="font-size: 1.2em; width: 70%;" class="btn_choice" @click="answer(0)">
							{{ choice[0] }}<br>
							<span style="font-size: 0.8em;">{{ name_list_th[choice[0]] }}</span>
						</b-btn>
					</div>
				</div>
			</div>
			<div style="float:right; width: 50%;">
				<div style="padding-top: 40%;">
					<div style="margin-top: -32%;text-align: center;">
						<b-btn variant="outline-primary" style="font-size: 1.2em; width: 70%;" class="btn_choice" @click="answer(1)">
							{{ choice[1] }}<br>
							<span style="font-size: 0.8em;">{{ name_list_th[choice[1]] }}</span>
						</b-btn>
					</div>
				</div>
			</div>
		</div>
		<div style="background-color: pink;width: 100%;">
			<div style="float:left; width: 50%;">
				<div style="padding-top: 40%;">
					<div style="margin-top: -32%;text-align: center;">
						<b-btn variant="outline-primary" style="font-size: 1.2em; width: 70%;" class="btn_choice" @click="answer(2)">
							{{ choice[2] }}<br>
							<span style="font-size: 0.8em;">{{ name_list_th[choice[2]] }}</span>
						</b-btn>
					</div>
				</div>
			</div>
			<div style="float:right; width: 50%;">
				<div style="padding-top: 40%;">
					<div style="margin-top: -32%;text-align: center;">
						<b-btn variant="outline-primary" style="font-size: 1.2em; width: 70%;" class="btn_choice" @click="answer(3)">
							{{ choice[3] }}<br>
							<span style="font-size: 0.8em;">{{ name_list_th[choice[3]] }}</span>
						</b-btn>
					</div>
				</div>
			</div>
		</div>
		<div style="background-color: #f9f9f9;width: 100%;padding-top: 50%;"></div>
		<div style="background-color: #85d2ca;width: 100%;height: 65px; text-align: center;">
			<img src="https://cdn.bnkweek.com/icon/white_128.png" height="64">
		</div>
	</div>
	<div v-else class="main_container">
		<div style="width: 100%;padding-top: 40%;">
			<div style="margin-top: -20%;text-align: center;">
				<h2 style="margin:0;">ครบแล้ว! คุณจำเม็มเบอร์ CGM48 ได้</h2>
			</div>
		</div>
		<div style="width: 100%;">
			<div style="text-align: center;">
				<div id="div_score">
					<h2 style="margin:0; font-size: 10em;">{{ score }}</h2>
					<h2 style="margin:0;">คน</h2>
					<h2 style="margin:0; font-size: 1.2em;">ใช้เวลา {{ diffMinute }} นาที {{ diffSec }} วินาที</h2>
				</div>
			</div>
		</div>
		<div style="width: 100%;height: 70px; text-align: center; margin-top: 30px;">
			<b-btn id="btn_fb" @click="fbShare"><img src="~/assets/img/facebook_48.png" height="24" style="vertical-align: top;"> แชร์บน Facebook&nbsp;&nbsp;</b-btn>
		</div>
		<div style="width: 100%;height: 70px; text-align: center; margin-top: 30px;">
			<b-btn variant="success" @click="restartQuiz">เริ่มเล่นใหม่</b-btn>
		</div>
		<div style="width: 100%;height: 180px; text-align: center;">
			<h4>© 2019 สร้างสรรค์โดย <div class="d-inline-block">เช้าเย็น</div></h4>
			<a target="_blank" href="//fb.me/days.till.nights">
				<img src="https://cdn.bnkweek.com/icon/color_128.jpg" height="80" class="rounded-circle"><br>
				fb.me/days.till.nights
			</a>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import atob from 'atob'

	let name_list = ["angel","aom","champoo","fahsai","fortune","jayda","jjae","kaiwan","kaning","kyla","latin","marmink","meen","mei","milk","nena","nenie","nicha","parima","pepo","pim","ping","punch","sita","izurina"]
	let name_list_th = {
		"angel"		: "แองเจิ้ล",
		"aom"		: "ออม",
		"champoo"	: "แชมพู",
		"fahsai"	: "ฟ้าใส",
		"fortune"	: "ฟอร์จูน",
		"jayda"		: "เจย์ดา",
		"jjae"		: "เจเจ",
		"kaiwan"	: "ไข่หวาน",
		"kaning"	: "คนิ้ง",
		"kyla"		: "เคียล่า",
		"latin"		: "ลาติน",
		"marmink"	: "มามิ้งค์",
		"meen"		: "มีน",
		"mei"		: "เหมย",
		"milk"		: "มิลค์",
		"nena"		: "นีน่า",
		"nenie"		: "นีนี่",
		"nicha"		: "ณิชา",
		"parima"	: "ปะริมะ",
		"pepo"		: "ปีโป้",
		"pim"		: "พิม",
		"ping"		: "ปิ๊ง",
		"punch"		: "พั้นซ์",
		"sita"		: "สิตา",
		"izurina"	: "อิซึรินะ"
	}

	export default {
	    data () {
	        return {
	        	mem_space: [],
	        	cur_mem: '',
	        	choice: [],
	        	btn_color: [],
	        	quiz_no: 0,
	        	score: 0,
	        	isReady: false,
	        	start_time: null,
	        	end_time: null,
	        	isFinish: false,
	        	diffMinute: 0,
	        	diffSec: 0,
	        	name_list_th: name_list_th
	        }
	    },
	    asyncData ({ params }) {
	    	if(!params.qid){
	    		return {
	    			suff_url: '',
	    			isScore: false
	    		}
	    	}
	    	let score_info = JSON.parse(atob(params.qid))
	    	return {
	    		suff_url: params.qid,
	    		isScore: true,
	    		url_score: score_info['score'],
	    		url_min: score_info['min'],
	    		url_sec: score_info['sec']
	    	}
	    },
	    mounted () {
	    	if(this.isScore){
	    		window.location.replace('https://bnkweek.com/cgm48quiz')
	    	}
	    	this.mem_space = [...name_list]
	    	this.startQuiz()
	    },
	    updated () {
	    },
	    methods: {
	    	startQuiz(){
	    		this.start_time = new Date()
	    		this.randNewMem()
	    	},
	    	randNewMem(){
	    		if(this.quiz_no == 25){
	    			this.finishQuiz()
	    			return
	    		}
	    		this.isReady = true

	    		for(let elm of document.querySelectorAll('.correct_choice')){
	    			elm.classList.remove('correct_choice')
	    		}
	    		for(let elm of document.querySelectorAll('.wrong_choice')){
	    			elm.classList.remove('wrong_choice')
	    		}
	    		this.quiz_no++

	    		let cur_pos = Math.floor(Math.random()*this.mem_space.length)
	    		this.cur_mem = this.mem_space[cur_pos]
	    		this.mem_space.splice(cur_pos,1)
	    		name_list.splice(name_list.indexOf(this.cur_mem),1)
	    		name_list.sort(() => Math.random() - 0.5)
	    		this.choice = [this.cur_mem, ...name_list.slice(0,3)].sort(() => Math.random() - 0.5)
	    		name_list.push(this.cur_mem)
	    	},
	    	answer(iChoice){
	    		if(!this.isReady) return
	    		this.isReady = false

	    		let correct_choice = this.choice.indexOf(this.cur_mem)

	    		document.querySelectorAll('.btn_choice')[correct_choice].classList.add('correct_choice')
				if(correct_choice != iChoice){
		    		document.querySelectorAll('.btn_choice')[iChoice].classList.add('wrong_choice')
				}
				else{
					this.score++
				}
	    		setTimeout(this.randNewMem, 1500)
	    	},
	    	finishQuiz(){
	    		this.end_time = new Date()
	    		let diffMillisec = this.end_time.getTime() - this.start_time.getTime() - 37500
	    		this.diffMinute = Math.floor(diffMillisec/60000)
	    		this.diffSec = Math.floor((diffMillisec - this.diffMinute*60000)/1000)

	    		this.isFinish = true
	    	},
	    	restartQuiz(){
	    		window.location.replace('https://bnkweek.com/cgm48quiz')
	    	},
	    	fbShare(){
	    		let link_url = 'https://bnkweek.com/cgm48quiz/' + btoa(JSON.stringify({
	    			score:this.score,
	    			min:  this.diffMinute,
	    			sec:  this.diffSec
	    		}))
	    		window.location.replace(`https://www.facebook.com/dialog/feed?app_id=2181135172212753&display=page&hashtag=%23CGM48&redirect_uri=${window.location.href}&link=${link_url}`)
	    	}
	    },
	    head() {
	    	return {
		    	title: 'CGM48 Quiz',
		    	meta: [
		    		{ property: 'og:url', content: 'https://bnkweek.com/cgm48quiz/' + this.suff_url},
		    		{ property: 'og:type', content: 'article' },
		    		{ property: 'og:description', content: 'มาจำชื่อเม็มเบอร์ CGM48 กันเถอะ' },
		    		{ 
		    			property: 'og:title',
		    			content: !this.isScore ? 'คุณใช้เวลาเท่าไหร่ในการตอบชื่อเม็มเบอร์ทั้ง 25 คนนี้' :
		    						`ฉันจำได้แล้ว ${this.url_score} คน ตอบได้ใน ${this.url_min} นาที ${this.url_sec} วินาที`
		    		},
		    		{ property: 'og:image', content: 'https://cdn.bnkweek.com/cgm/cgm-quiz_og.png' },
		    		{ property: 'og:image:width', content: '1080' },
		    		{ property: 'og:image:height', content: '536' },
		    		{ property: 'fb:app_id', content: '2181135172212753'}
		    	],
		    	script: [
		    		{ src: 'https://www.googletagmanager.com/gtag/js?id=UA-131759764-1', async: undefined }
		    	]
		    }
	    }
	}
</script>

<style>
	html,body{
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		background-color: #292929;
	}
	.main_container{
		width: 100%;
		max-width: 576px;
		min-height: 100vh;
		margin: auto;
		background-color: #85d2ca;
	}
	#mem_pic{
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
	}

	.btn-outline-primary, .btn-outline-primary:hover, .btn-outline-primary:active, .btn-outline-primary:not(:disabled):not(.disabled):active{
		text-transform: capitalize;
	    color: #2fd2da;
	    border-color: #2fd2da;
	    background-color: #f9f9f9;
	}

	.correct_choice,.correct_choice:hover,.correct_choice:active,.correct_choice:not(:disabled):not(.disabled):active{
		background-color: #28a7459e;
		border-color: #28a7459e;
		color: white;
	}
	.wrong_choice,.wrong_choice:hover,.wrong_choice:active,.wrong_choice:not(:disabled):not(.disabled):active{
		background-color: #dc3545ad;
		border-color: #dc3545ad;
		color: white;
	}

	#btn_fb{
		line-height: 1.8;
		background-color: #38569e;
		border: none;
	}
	#btn_fb:hover{
		background-color: #345199;
	}

	#div_score{
		padding-bottom: 30px;
		background-image: url('https://cdn.bnkweek.com/cgm/bg_quiz.jpg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>