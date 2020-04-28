<template>
	<div>
		<b-alert show variant="danger" role="alert" class="py-5">
			<h1>ตารางจับมือ 15-16 กุมภาพันธ์ 2020</h1>
			<h2>BNK48 @BITEC EH106</h2>
		</b-alert>
		<hr>
		<div class="bg_wh_op py-3">
			<h3>1. เลือกเมมเบอร์</h3>
			<div  v-for="(mem_gen, gen) in mem_list" class="div_sel_mem pb-3">
				<h6>&emsp;รุ่นที่ {{ gen + 1 }}</h6>
				<b-btn v-for="(mem_name, name) in mem_gen" :key="mem_name" :pressed.sync="btn_mem[gen][name]" variant="warning" class="btn_sel_mem rounded">{{ mem_name }}</b-btn>
			</div>
		</div>
		<hr>
		<div class="bg_wh_op py-3">
			<h3>2. เสร็จแล้ว! แชร์ให้เพื่อนดูเลย</h3>
			<p>
				<b-btn v-if="!is_fb_load" id="btn_fb" @click="fbShare"><img src="~/assets/img/facebook_48.png" height="24" style="vertical-align: top;"> แชร์รูปลง Facebook&nbsp;&nbsp;</b-btn>
				<iframe v-else src="/loading" height="250" width="250" frameborder="0"></iframe>
			</p>
			<div id="div_cap" class="d-inline-block pl-1">
				<div class="d-inline-block align-middle">
					<h5>ตารางจับมือ BNK48 กุมภาพันธ์ 2020</h5>
				</div>
				<br>
				<table>
					<tbody>
						<tr>
							<th></th>
							<th colspan="7">เสาร์ 15 กุมภาพันธ์</th>
							<th colspan="7">อาทิตย์ 16 กุมภาพันธ์</th>
						</tr>
						<tr>
							<th>ฉันไปงาน</th>
							<th v-for="(round, iround) in round_list" :key="iround" @click="reBu(iround)">
								{{ is_bu[iround] ? '✓' : '-' }}
							</th>
						</tr>
						<tr>
							<th>รอบเวลา</th>
							<th v-for="(round, iround) in round_list" :key="iround" @click="reBu(iround)" v-html="round"></th>
						</tr>
						<tr v-for="(mem, imem) in tbl_sel" :key="imem">
							<td>{{ mem.name }}</td>
							<td v-for="(round, iround) in mem.round" :key="iround" :class="{'bg_bu': is_bu[iround]&round, 'bg_sp': mem.lane[iround]=='SP', 'bg_s5': mem.lane[iround][0]=='*'}">
								{{ is_bu[iround]&round ? mem.lane[iround].toString().replace(/\*/g, '') : '' }}
							</td>
						</tr>
					</tbody>
				</table>
				<br>
				<div class="d-inline-block align-middle">
					<div class="d-block text-left text-white">
						&ensp;<div class="rect_color bg_green"></div> = 1-5 ใบได้จับมือ เพิ่มเวลาตามจำนวนใบ
					</div>
					<div class="d-block text-left text-white">
						&ensp;<div class="rect_color bg_blue"></div> = 1 ใบได้จับมือ, 2 ใบได้เป่ายิ้งฉุบ
					</div>
					<div class="d-block text-left text-white">
						&ensp;<div class="rect_color bg_red"></div> = 2-50 ใบได้จับมือ เพิ่มเวลาตามจำนวนใบ
					</div>
				</div>
				<br>
				<div class="d-inline-block align-middle">
					<span style="color: #000066;">ทำเองได้ที่</span>
				</div>
				&ensp;
				<div class="d-inline-block align-middle text-left">
					&#x1F449; <a href="//fb.me/days.till.nights"><img src="~/assets/img/facebook_48.png" height="24"> เช้าเย็น </a><br>
					&#x1F449; <a href="#btn_fb">bnkweek.com/hs</a>
				</div>
				&emsp;
				<a href="//fb.me/days.till.nights">
					<img src="~/assets/img/logo_128.jpg" height="64" class="rounded-circle border">
				</a>
				<br>
				<div style="visibility: hidden;">...........</div>
			</div>
		</div>
		<hr>
		<div class="bg_wh_op py-3">
			<h3>2*. ทำอะไรได้อีก</h3>
			<div class="d-inline-block text-left" style="width: 350px;">
				<h5>&#x1F449; เลือกเวลาเข้างานได้ (ติ๊กถูก) ดูข้างบน</h5>
			</div>
			<br>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th colspan="7">เสาร์ 15 กุมภาพันธ์</th>
						<th colspan="7">อาทิตย์ 16 กุมภาพันธ์</th>
					</tr>
					<tr>
						<th>ฉันไปงาน</th>
						<th v-for="(round, iround) in round_list" :key="iround" @click="reBu(iround)">
							{{ is_bu[iround] ? '✓' : '-' }}
						</th>
					</tr>
					<tr>
						<th>รอบเวลา</th>
						<th v-for="(round, iround) in round_list" :key="iround" @click="reBu(iround)" v-html="round"></th>
					</tr>
				</tbody>
			</table>
			<br>
			<div class="d-inline-block text-left" style="width: 350px;">
				<h5>&#x1F449; เซฟรูปลงเครื่อง</h5>
			</div>
			<p>
				<b-btn variant="success" @click="saveImg">
					เซฟรูปลงเครื่อง
				</b-btn>
			</p>
			<div class="d-inline-block text-left" style="width: 350px;">
				<h5>&#x1F449; เก็บลิงก์นี้ไว้ก็ได้</h5>
			</div>
			<br>
			<div class="d-inline-block rounded bg-white pb-3">
				<canvas id="qr_hs" style="margin-bottom: -8px;"></canvas><br>
				&nbsp;<a :href="'https://bnkweek.com'+url_hs" class="text-dark">bnkweek.com{{ url_hs }}</a>&nbsp;
			</div>
		</div>
		<hr>
		<b-alert show variant="danger" role="alert" class="mb-0 py-5">
			<h4>© 2020 สร้างสรรค์โดย <div class="d-inline-block">เช้าเย็น</div></h4>
			<a target="_blank" href="//fb.me/days.till.nights">
				<img src="~/assets/img/logo_128.jpg" height="80" class="rounded-circle"><br>
				fb.me/days.till.nights
			</a>
		</b-alert>
	</div>
</template>

<script>
	import axios from 'axios'

	const init_obj = {
		mem_list: [
			["Cherprang", "Jaa", "Jane", "Jennis", "Jib", "Kaew", "Kaimook", "Kate", "Korn", "Mind", "Miori", "Mobile", "Music", "Namneung", "Namsai", "Nink", "Noey", "Orn", "Piam", "Pun", "Pupe", "Satchan", "Tarwaan"],
			["Bamboo", "Faii", "Fifa", "Fond", "Gygee", "Juné", "Khamin", "Kheng", "Mewnich", "Minmin", "Myyu", "Natherine", "New", "Niky", "Nine", "Oom", "Pakwan", "Panda", "Phukkhom", "Ratah", "Stang", "View", "Wee"]
		],
		round_list: ["09<br>00","10<br>30","12<br>00","13<br>30","15<br>00","16<br>30","<span style=\"color:#ff7588;\">18<br>30</span>","09<br>00","10<br>30","12<br>00","13<br>30","15<br>00","16<br>30","<span style=\"color:#ff7588;\">18<br>30</span>"],
		mem_round: {
			Bamboo:[1,0,0,1,1,0,1,1,0,0,1,1,0,0],
			Cherprang:[0,1,1,0,1,1,0,1,1,0,1,1,0,1],
			Faii:[0,0,0,0,0,0,0,0,0,1,0,0,1,1],
			Fifa:[0,0,1,0,0,1,1,0,0,0,0,0,0,0],
			Fond:[0,1,1,0,0,1,0,0,1,1,0,0,1,1],
			Gygee:[0,1,1,0,0,1,0,0,1,1,0,0,1,1],
			Jaa:[1,0,0,1,0,0,0,1,0,0,1,0,0,1],
			Jane:[1,0,0,1,1,0,1,1,0,0,1,1,0,0],
			Jennis:[0,1,1,0,1,1,0,1,1,0,1,1,0,1],
			Jib:[0,0,0,0,0,0,0,0,0,1,0,0,1,1],
			Juné:[0,1,1,0,0,1,0,0,1,1,0,0,1,1],
			Kaew:[0,1,1,0,1,1,0,1,1,0,1,1,0,1],
			Kaimook:[1,0,0,1,1,0,1,1,0,0,1,1,0,0],
			Kate:[0,0,1,0,0,1,1,0,0,0,0,0,0,0],
			Khamin:[0,1,0,0,1,0,1,0,1,0,0,1,0,0],
			Kheng:[0,0,0,0,0,0,0,0,0,1,0,0,1,1],
			Korn:[0,0,1,0,0,1,1,0,0,0,0,0,0,0],
			Mewnich:[1,0,0,1,1,0,1,1,0,0,1,1,0,0],
			Mind:[1,0,0,1,0,0,1,1,0,0,1,0,0,0],
			Minmin:[0,1,1,0,0,1,0,0,1,1,0,0,1,1],
			Miori:[0,0,0,0,0,0,0,0,0,1,0,0,1,1],
			Mobile:[0,1,1,0,1,1,0,1,1,0,1,1,0,1],
			Music:[1,1,0,1,1,0,1,0,1,1,0,1,1,0],
			Myyu:[0,0,1,0,0,1,1,0,0,0,0,0,0,0],
			Namneung:[1,1,0,1,1,0,1,0,1,1,0,1,1,0],
			Namsai:[0,1,0,0,1,0,1,0,1,0,0,1,0,0],
			Natherine:[0,0,0,0,0,0,0,1,0,0,1,1,0,1],
			New:[1,0,0,1,0,0,0,1,0,0,1,0,0,1],
			Niky:[0,0,0,0,0,0,0,0,0,1,0,0,1,1],
			Nine:[0,0,1,0,0,1,1,0,0,0,0,0,0,0],
			Nink:[0,0,0,0,0,0,0,0,0,1,0,0,1,1],
			Noey:[1,1,0,1,1,0,1,0,1,1,0,1,1,0],
			Oom:[0,0,0,0,0,0,0,1,0,0,1,0,0,1],
			Orn:[0,1,1,0,1,1,0,1,1,0,1,1,0,1],
			Pakwan:[0,0,1,0,0,1,1,0,0,0,0,0,0,0],
			Panda:[0,0,1,0,0,1,1,0,0,0,0,0,0,0],
			Phukkhom:[1,0,0,1,1,0,1,1,0,0,1,1,0,0],
			Piam:[0,0,0,0,0,0,0,0,0,1,0,0,1,1],
			Pun:[1,1,0,1,1,0,1,0,1,1,0,1,1,0],
			Pupe:[0,1,1,0,0,1,0,0,1,1,0,0,1,1],
			Ratah:[0,1,0,0,1,0,1,0,0,0,0,0,0,0],
			Satchan:[1,0,0,1,0,0,1,1,0,0,1,0,0,0],
			Stang:[1,0,0,1,0,0,0,1,0,0,1,0,0,1],
			Tarwaan:[1,1,0,1,1,0,1,0,1,1,0,1,1,0],
			View:[0,1,0,0,1,0,0,0,1,0,0,1,0,1],
			Wee:[0,1,1,0,0,1,0,0,1,1,0,0,1,1]
		},
		mem_lane: {
			Bamboo:['*13','0','0','13','13','0','SP','*13','0','0','13','13','0','0'],
			Cherprang:['0','*1','*1','0','1','1','0','*1','*1','0','1','1','0','SP'],
			Faii:['0','0','0','0','0','0','0','0','0','*2','0','0','2','SP'],
			Fifa:['0','0','*8','0','0','8','SP','0','0','0','0','0','0','0'],
			Fond:['0','*15','15','0','0','15','0','0','*15','15','0','0','15','SP'],
			Gygee:['0','*16','16','0','0','16','0','0','*16','16','0','0','16','SP'],
			Jaa:['*3','0','0','3','0','0','0','*8','0','0','8','0','0','SP'],
			Jane:['*14','0','0','14','14','0','SP','*14','0','0','14','14','0','0'],
			Jennis:['0','*3','*3','0','3','3','0','*3','*3','0','3','3','0','SP'],
			Jib:['0','0','0','0','0','0','0','0','0','*3','0','0','3','SP'],
			Juné:['0','*11','11','0','0','11','0','0','*11','11','0','0','11','SP'],
			Kaew:['0','*2','*2','0','2','2','0','*2','*2','0','2','2','0','SP'],
			Kaimook:['*15','0','0','15','15','0','SP','*15','0','0','15','15','0','0'],
			Kate:['0','0','*9','0','0','9','SP','0','0','0','0','0','0','0'],
			Khamin:['0','*18','0','0','18','0','SP','0','*18','0','0','18','0','0'],
			Kheng:['0','0','0','0','0','0','0','0','0','*4','0','0','4','SP'],
			Korn:['0','0','*10','0','0','10','SP','0','0','0','0','0','0','0'],
			Mewnich:['*11','0','0','11','11','0','SP','*11','0','0','11','11','0','0'],
			Mind:['*20','0','0','20','0','0','SP','*20','0','0','20','0','0','0'],
			Minmin:['0','*14','14','0','0','14','0','0','*14','14','0','0','14','SP'],
			Miori:['0','0','0','0','0','0','0','0','0','*5','0','0','5','SP'],
			Mobile:['0','*5','*5','0','5','5','0','*5','*5','0','5','5','0','SP'],
			Music:['*6','*6','0','6','6','0','SP','0','*6','*6','0','6','6','0'],
			Myyu:['0','0','*17','0','0','17','SP','0','0','0','0','0','0','0'],
			Namneung:['*8','*8','0','8','8','0','SP','0','*8','*8','0','8','8','0'],
			Namsai:['0','*17','0','0','17','0','SP','0','*17','0','0','17','0','0'],
			Natherine:['0','0','0','0','0','0','0','*16','0','0','16','16','0','SP'],
			New:['*19','0','0','19','0','0','0','*19','0','0','19','0','0','SP'],
			Niky:['0','0','0','0','0','0','0','0','0','*20','0','0','20','SP'],
			Nine:['0','0','*18','0','0','18','SP','0','0','0','0','0','0','0'],
			Nink:['0','0','0','0','0','0','0','0','0','*18','0','0','18','SP'],
			Noey:['*7','*7','0','7','7','0','SP','0','*7','*7','0','7','7','0'],
			Oom:['0','0','0','0','0','0','0','*9','0','0','9','0','0','SP'],
			Orn:['0','*4','*4','0','4','4','0','*4','*4','0','4','4','0','SP'],
			Pakwan:['0','0','*19','0','0','19','SP','0','0','0','0','0','0','0'],
			Panda:['0','0','*20','0','0','20','SP','0','0','0','0','0','0','0'],
			Phukkhom:['*12','0','0','12','12','0','SP','*12','0','0','12','12','0','0'],
			Piam:['0','0','0','0','0','0','0','0','0','*19','0','0','19','SP'],
			Pun:['*9','*9','0','9','9','0','SP','0','*9','*9','0','9','9','0'],
			Pupe:['0','*12','12','0','0','12','0','0','*12','12','0','0','12','SP'],
			Ratah:['0','*20','0','0','20','0','SP','0','0','0','0','0','0','0'],
			Satchan:['*5','0','0','5','0','0','SP','*10','0','0','10','0','0','0'],
			Stang:['*17','0','0','17','0','0','0','*17','0','0','17','0','0','SP'],
			Tarwaan:['*10','*10','0','10','10','0','SP','0','*10','*10','0','10','10','0'],
			View:['0','*19','0','0','19','0','0','0','*19','0','0','19','0','SP'],
			Wee:['0','*13','13','0','0','13','0','0','*13','13','0','0','13','SP']
		}
	}

	export default {
	    data () {
	        return {
	        	round_list: init_obj.round_list,
	        	mem_list: 	init_obj.mem_list,
			  	mem_round: 	init_obj.mem_round,
			  	mem_lane: 	init_obj.mem_lane,
	        	btn_mem: 	[],
	        	is_bu: 		[],
	        	tbl_sel: 	[],
	        	url_hs: 	'/hs/',
	        	is_fb_load: false
	        }
	    },
	    asyncData ({ params }) {
	    	let qid = params.qid ? params.qid : ''
			let btn_mem = []
			let is_bu = []
			let iQid = 0

	    	qid = qid.split('').map(x=>x.charCodeAt(0)).map(x=>('000000'+(x>96?x-71:(x>64?x-65:(x>63?62:(x>47?x+4:63)))).toString(2)).slice(-6)).join('')

			iQid = 0
			for (let iGen in init_obj.mem_list){
				btn_mem.push([])
				for(let iName in init_obj.mem_list[iGen]){
					btn_mem[btn_mem.length - 1].push(qid[iQid++] == '1')
				}
			}

			iQid = Math.ceil(init_obj.mem_list.reduce((a,b)=>a+b.length, 0)/6)*6
			for (let iRound in init_obj.round_list){
				is_bu.push(!(qid[iQid++] == '1'))
			}

	    	return { btn_mem, is_bu }
	    },
	    watch: {
	    	btn_mem () {
	    		this.render()
	    	},
	    	is_bu () {
	    		this.render()
	    	}
	    },
	    methods: {
	    	render () {
	    		let sel_mem = []

		  		this.mem_list.map((mem_gen, gen) => mem_gen.map((mem_name, name) => {
					if(this.btn_mem[gen][name]){
						sel_mem.push({
	  						name:  mem_name,
	  						round: this.mem_round[mem_name],
	  						lane:  this.mem_lane[mem_name]
	  					})
					}
				}))
				this.tbl_sel = this.sortMem(sel_mem)

	    		this.url_hs = (
	    			'/hs/' +

	    			this.btn_mem.reduce((s,v)=>s+v.reduce((s,v)=>s+(v?'1':'0'),''),'').match(/.{1,6}/g).map(x=>parseInt((x+'000000').slice(0,6),2)).map(
						x=> x<26?x+65:(x<52?x+71:(x<62?x-4:(x<63?64:38)))
					).map(x=>String.fromCharCode(x)).join('') +
					
					this.is_bu.reduce((s,v)=>s+(v?'0':'1'),'').match(/.{1,6}/g).map(x=>parseInt((x+'000000').slice(0,6),2)).map(
						x=> x<26?x+65:(x<52?x+71:(x<62?x-4:(x<63?64:38)))
					).map(x=>String.fromCharCode(x)).join('')
				).replace(/^|A+$/g, '')

	    		history.replaceState({}, null, this.url_hs)

	    		QRCode.toCanvas(document.getElementById('qr_hs'), 'https://bnkweek.com' + this.url_hs, function () {})
	    	},
		  	sortMem (mem_sort) {
		  		let l = mem_sort.length;
				for(let j=l;j>0;j--){
					for(let k=1;k<j;k++){
						if(this.compareRound(mem_sort[k-1], mem_sort[k])){
							let tmem = mem_sort[k-1];
							mem_sort[k-1] = mem_sort[k];
							mem_sort[k] = tmem;
						}
					}
				}
				return mem_sort
		  	},
		  	compareRound (a, b) {
		  		for(let i = 0; i < this.is_bu.length; i++){
					if(!this.is_bu[i])
						continue;
					if(!a.round[i]&&!b.round[i])
						continue;
					if(a.round[i]!=b.round[i])
						return a.round[i] < b.round[i];
					if(a.round.reduce(this.bu_sort,0) == b.round.reduce(this.bu_sort,0))
						continue;
					return a.round.reduce(this.bu_sort,0) > b.round.reduce(this.bu_sort,0)
				}
				return a.round.reduce(this.bu_sort,0) < b.round.reduce(this.bu_sort,0)
		  	},
		  	bu_sort (s,v,i) {
				return s + this.is_bu[i]*v
		  	},
		  	reBu (i) {
		  		let is_bu = this.is_bu
		  		this.is_bu = is_bu.map(a => true)
		  		is_bu[i] = !is_bu[i]
		  		this.is_bu = is_bu
		  	},
		  	captureImg () {
		  		let elm = document.getElementById('div_cap')
		  		return domtoimage.toPng(elm, {
					height: elm.offsetHeight * 2,
					style: {
						transform: `scale(${2}) translate(-${elm.offsetWidth / 2 / 2}px, ${elm.offsetHeight / 2 / 2}px)`
					},
					width: elm.offsetWidth * 2,
					bgcolor: '#9F97C0'
				})
		  	},
		  	saveImg () {
		  		this.captureImg().then(dataUrl => {
					    let lnk = document.createElement('a')
					    lnk.setAttribute('href', dataUrl)
					    lnk.setAttribute('download', 'BNK48handshake.png')
					    lnk.click()
					}
				)
		  	},
		  	fbShare () {
		  		this.is_fb_load = true
		  		this.captureImg().then(dataUrl => {
			  		axios.post('/api/hs/capture', { base64: dataUrl }).then(({ data }) => {
						window.location.replace(`https://www.facebook.com/dialog/feed?app_id=2181135172212753&display=page&hashtag=%23เช้าเย็น&redirect_uri=${window.location.href}&link=https://bnkweek.com/img/hs/${data.url}.png`)
						this.is_fb_load = false
					})
			  	})
		  	}
	    },
		mounted () {
			this.render()
			window.dataLayer = window.dataLayer || []
			function gtag(){dataLayer.push(arguments)}
			gtag('js', new Date())
			gtag('config', 'UA-131759764-1')
		},
	    head: {
	    	title: 'Handshake - February',
	    	script: [
	    		{ src: '/js/qr.js' },
	    		{ src: '/js/dom-to-image.js' },
	    		{ src: 'https://www.googletagmanager.com/gtag/js?id=UA-131759764-1', async: undefined }
	    	],
	    	meta: [
	    		{ property: 'og:url', content: 'https://bnkweek.com/hs/' },
	    		{ property: 'og:type', content: 'article' },
	    		{ property: 'og:title', content: 'ตารางจับมือ BNK48 15-16 กุมภาพันธ์ 2020 @BITEC EH106' },
	    		{ property: 'og:description', content: '1. เลือกเมมเบอร์ 2. เสร็จแล้ว! แชร์ให้เพื่อนดูเลย สร้างสรรค์โดย เช้าเย็น - fb.me/days.till.nights' },
	    		{ property: 'og:image', content: 'https://bnkweek.sgp1.digitaloceanspaces.com/hs_og_feb.png' },
	    		{ property: 'og:image:width', content: '1080' },
	    		{ property: 'og:image:height', content: '536' },
	    		{ property: 'fb:app_id', content: '2181135172212753'}
	    	]
	    }
	}
</script>

<style>
	body{
		text-align: center;
		background-color: #7166A2;
		/*background-image: url("https://bnkweek.sgp1.digitaloceanspaces.com/hs_bg_july.jpg");
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-position: center;
		background-size: cover;*/
	}
	h1, h2, h4{
		color: #000066;
	}
	h5{
		color: #000066;
    	font-weight: bold;
    	margin-top: 15px;
	}
	table{
		display: inline-block;
		color: #1D68A1;
		background-color: white;
	}
	th{
		border: solid #1D68A1 1px;
		border-top: 0;
		border-left: 0;
		border-right: 0;
	}
	th:first-child{
		width: 82px;
	}
	th:not(:first-child){
		line-height: 0.9;
		font-size: 12px;
		width: 20px;
		text-align: center;
	}
	tr:not(:first-child) > th:not(:first-child){
		cursor: pointer;
	}
	th:nth-child(8){
		border-right: solid #1D68A1 2px;
	}
	tr:nth-child(2) > th:not(:first-child) {
		color: green;
	}
	tr:last-child{
		border-bottom: solid #1D68A1 2px;
	}
	td{
		border: solid white 1px;
	}
	td:first-child{
		text-align: left;
	}
	td:not(:first-child) {
		text-align: center;
		font-size: 0.8em;
		color: white;
	}
	.btn_sel_mem{
		width: 110px;
		/*text-align: left;*/
		color: #ffffff;
		border: none;
		background-color: #8f86b9;
	}
	.btn_sel_mem:hover{
		color: #ffffff;
		background-color: #8f86b9;
	}
	.btn_sel_mem.btn-warning:not(:disabled):not(.disabled).active, .btn_sel_mem.btn-warning:not(:disabled):not(.disabled):active{
		background-color: white;
		border-color: white;
	}
	.btn_sel_mem, .btn-warning:focus, .btn-warning.focus, .btn-warning:not(:disabled):not(.disabled):active:focus, .btn-warning:not(:disabled):not(.disabled).active:focus, .show > .btn-warning.dropdown-toggle:focus {
	    box-shadow: 0 0 0 0.2rem white;
	}
	.bg_bu{
		background-color: #5B9BD5;
	}
	.bg_bu.bg_sp{
		background-color: #DA244B;
	}
	.bg_bu.bg_s5{
		background-color: #83C160;
	}
	/*.bg_bu:nth-child(9),.bg_bu:nth-child(10),.bg_bu:nth-child(11),.bg_bu:nth-child(12),.bg_bu:nth-child(13),.bg_bu:nth-child(14),.bg_bu:nth-child(15){
		background-color: #5B9BD5;
	}*/
	.alert-danger{
		background-color: #FFDAE7;
		border-color: #FFDAE7;
	}

	.div_sel_mem{
		max-width: 450px;
		display: inline-block;
		vertical-align: top;
		text-align: left;
	}
	@media screen and (max-width: 457px) {
	  	.div_sel_mem{
			width: 335px;
	  	}
	}

	.bg_wh_op{
		background-color: #ffffff52;
	}
	.rect_color{
		width: 20px;
		height: 20px;
		border: solid white 1px;
		vertical-align: middle;
		display: inline-block;
	}
	.rect_color.bg_green{
		background-color: #83C160;
	}
	.rect_color.bg_blue{
		background-color: #5B9BD5;
	}
	.rect_color.bg_red{
		background-color: #DA244B;
	}

	#btn_fb{
		line-height: 1.8;
		background-color: #38569e;
		border: none;
	}
	#btn_fb:hover{
		background-color: #345199;
	}
</style>