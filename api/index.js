const express = require('express')
const crypto = require('crypto')
const fs = require('fs')
const axios = require('axios')
const probe = require('probe-image-size')
const uuidv4 = require('uuid/v4')

const api = new express.Router()

api.post('/hs/capture', (req, res) => {
	let url = crypto.randomBytes(16).toString("hex")
	let base64Data = req.body.base64.replace(/^data:image\/png;base64,/, "")
	fs.writeFile(`static/img/hs/${url}.png`, base64Data, 'base64', err => res.json({ url }) )
})

// Photobook

let resourceOwnerId = 'l70fca2623a0f14aa79b8cbb288d59296f'
let applicationKey = 'l70fca2623a0f14aa79b8cbb288d59296f'
let applicationSecret = 'be6c31af456a4afeac2f85bb8d5d947f'
let ppId = '552428374227498'
let pb_price = 1398 

api.post('/gen_payment_qr', async (req, res) => {
	let requestUId = uuidv4()
	let form = req.body
	let amount = form.amount*pb_price
	let ref2 = form.amount.toString()
	let ref3 = 'TBE'

	let {data: {'#': ref1}} = await axios(
	    'https://script.google.com/macros/s/AKfycbxmFw4CVOgy6B5_oLE4K27vkrgk5GthX8RGcG7_V6iE-O74ySQ/exec?path=/pb12to2',
	    {
	        method: 'POST',
	        headers: {
	        	'Content-Type': 'application/json'
	        },
	        data: {...form, paid: 'no'}
	    }
    )
    ref1 = ref1.toUpperCase()

	let {data: {data: {accessToken}}} = await axios(
	    'https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token',
	    {
	        method: 'POST',
	        headers: {
	        	'Content-Type': 'application/json',
				resourceOwnerId,
				requestUId
	        },
	        data: {
				applicationKey,
				applicationSecret
			}
	    }
    )
    let {data: {data: {qrImage}}} = await axios(
	    'https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create',
	    {
	        method: 'POST',
	        headers: {
	        	'Content-Type': 'application/json',
				'authorization': 'Bearer ' + accessToken,
				resourceOwnerId,
				requestUId
	        },
	        data: { 
				"qrType": "PP", 
				"ppType": "BILLERID", 
				ppId, 
				amount, 
				ref1, 
				ref2, 
				ref3
			}
	    }
    )

    res.json({qrImage, ref1})
})

api.post('/payment_confirm', async (req, res) => {
	let ref1 = req.body.billPaymentRef1.toLowerCase()
	let transRef = req.body.transactionId
	let sendingBank = req.body.sendingBankCode
	let requestUId = uuidv4()

	let {data: {data: {accessToken}}} = await axios(
	    'https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token',
	    {
	        method: 'POST',
	        headers: {
	        	'Content-Type': 'application/json',
				resourceOwnerId,
				requestUId
	        },
	        data: {
				applicationKey,
				applicationSecret
			}
	    }
    )

    let {data: {status: {code}}} = await axios(
	    `https://api-sandbox.partners.scb/partners/sandbox/v1/payment/billpayment/transactions/${transRef}`,
	    {
	        method: 'GET',
	        headers: {
				'authorization': 'Bearer ' + accessToken,
				resourceOwnerId,
				requestUId
	        },
	        params: {
	        	sendingBank
	        }
	    }
    )

    console.log(!(code != 1000))
    if(code!=1000){
    	res.json({success: false})
    	return
    }

	let {data: form} = await axios.get(
	    'https://script.google.com/macros/s/AKfycbxmFw4CVOgy6B5_oLE4K27vkrgk5GthX8RGcG7_V6iE-O74ySQ/exec?path=/pb12to2/' + ref1
    )
    form.paid = 'yes'

    let {data: {updated}} = await axios(
	    'https://script.google.com/macros/s/AKfycbxmFw4CVOgy6B5_oLE4K27vkrgk5GthX8RGcG7_V6iE-O74ySQ/exec?path=/pb12to2/' + ref1 + '&method=PUT',
	    {
	        method: 'POST',
	        headers: {
	        	'Content-Type': 'application/json'
	        },
	        data: form
	    }
    )

    console.log(updated)

    req.io.emit(ref1.toUpperCase(), 'OK')
	res.json({success: true})
})

module.exports = api


// const FACE_SUB_KEY = 'b6b25f423b8745c0b518b46bb778facf'
// const MEM_ID = {
// 	'0406f783-518b-4b42-a24a-102a1f9f3d3a': ['Jaa', 'https://www.facebook.com/bnk48official.jaa/photos/a.678375089021984/1099223790270443/'],
// 	'05981335-1d51-489b-9a6c-d4670dd52e5d': ['Stang', 'https://www.facebook.com/bnk48official.stang/photos/a.365777803937856/592740227908278/'],
// 	'0a2e3df6-58f3-472d-87b3-277d9c2df879': ['Mind', 'https://www.facebook.com/bnk48official.mind/photos/a.1485821261477104/2921115617947654/'],
// 	'0b27d534-673b-4570-af0d-2e1e39d334aa': ['Mobile', 'https://www.facebook.com/bnk48official.mobile/photos/a.412145152472508/828374017516284/'],
// 	'0c98dba9-4f13-402d-97f6-a3710b3d2456': ['Izurina', 'https://www.facebook.com/bnk48official.izutarina/photos/a.192097541312070/526486437873177/'],
// 	'0d6f6b86-1ed3-4bbc-ab2e-665872c6877e': ['Niky', 'https://www.facebook.com/bnk48official.niky/photos/a.337342476759489/536370863523315/'],
// 	'0ed3a312-3186-4aee-a2c4-b79bae2e3cd8': ['Namneung', 'https://www.facebook.com/bnk48official.namneung/photos/a.626501747542449/1063808247145128/'],
// 	'0f49078a-aec2-49d1-be5b-dacdb730a511': ['Maira', 'https://www.facebook.com/bnk48official.maira/photos/a.1532700213493895/1982750325155546/'],
// 	'1fb3995c-250b-46de-9d27-42736b9d43af': ['Minmin', 'https://www.facebook.com/bnk48official.minmin/photos/a.429428974164632/612892212484973/'],
// 	'25359dba-c0ee-484b-ac91-dc7c642b044a': ['Khamin', 'https://www.facebook.com/bnk48official.khamin/photos/a.551356721905263/772547946452805/'],
// 	'2a36f077-38cc-4319-9efe-37ddb94bbe96': ['Wee', 'https://www.facebook.com/bnk48official.wee/photos/a.343488636147450/544874732675505/'],
// 	'2dc050f0-08c5-43da-94b4-c7abc3a96b6a': ['Mewnich', 'https://www.facebook.com/bnk48official.mewnich/photos/a.248609235696218/408095393080934/'],
// 	'31823fce-87e3-4445-98e1-b682df3011f8': ['Gygee', 'https://www.facebook.com/bnk48official.gygee/photos/a.167247393932863/314634839194117/'],
// 	'3a620964-a4ae-4142-8664-697b52d2a922': ['Cake', 'https://www.facebook.com/bnk48official.cake/photos/a.160192961352029/304817083556282/'],
// 	'3e1d91a8-353c-4ad2-9b05-733b1bac4ed0': ['Piam', 'https://www.facebook.com/bnk48official.piam/photos/a.602658069923396/964904520365414/'],
// 	'3ef12a86-4d34-4481-b48e-5fe0d4f6b72b': ['Panda', 'https://www.facebook.com/bnk48official.panda/photos/a.749623565227368/966535753536147/'],
// 	'40222722-6447-4a2f-892d-f548f969e9dd': ['Jane', 'https://www.facebook.com/bnk48official.jane/photos/a.1836136056659363/2282784815327816/'],
// 	'41f3ded6-70fb-4490-8319-1140cfcfd466': ['Myyu', 'https://www.facebook.com/bnk48official.myyu/photos/a.192218434728905/339620943321986/'],
// 	'498d8595-98ae-414d-81be-d37bb2f428e9': ['Aom', 'https://www.facebook.com/bnk48official.aom/photos/a.201916567208963/410761879657763/'],
// 	'4fb1deee-a42b-49c2-9c58-85c478d1f949': ['Juné', 'https://www.facebook.com/bnk48official.june/photos/a.986675291490194/1222969001194154/'],
// 	'506801c7-7ee5-40f1-bf16-8cf1893c0eb5': ['Fond', 'https://www.facebook.com/bnk48official.fond/photos/a.575644902804401/811553732546849/'],
// 	'5b0edf4f-2a54-4edf-9312-380e92fdd060': ['Namsai', 'https://www.facebook.com/bnk48official.namsai/photos/a.1916918878529644/2348290908725770/'],
// 	'633a6b93-4782-4747-bf7d-1b80000c9e48': ['Orn', 'https://www.facebook.com/bnk48official.orn/photos/a.737464319750654/1204487029715045/'],
// 	'63cbced5-e5d6-42aa-9d46-16f638257c45': ['Pupe', 'https://www.facebook.com/bnk48official.pupe/photos/a.1784169328569572/2274596572860176/'],
// 	'63edd6c1-9dbd-4e99-a47e-850357d5a730': ['Kate', 'https://www.facebook.com/bnk48official.kate/photos/a.404490209918488/822775734756598/'],
// 	'67e7fc55-6da4-42db-add5-59d11f699440': ['View', 'https://www.facebook.com/bnk48official.view/photos/a.1821298687918994/2350786118303579/'],
// 	'6b3c2b9f-a0f6-4687-87d4-1cdd30305d8f': ['Bamboo', 'https://www.facebook.com/bnk48official.bamboo/photos/a.1821881501437630/2030119790613799/'],
// 	'6c225a82-7054-41b0-bbca-0c610d4ab762': ['Phukkhom', 'https://www.facebook.com/bnk48official.phukkhom/photos/a.1944930295580177/2614880038585196/'],
// 	'6c96b3e9-d16c-4734-9fdc-bb78c3cd6c79': ['Noey', 'https://www.facebook.com/bnk48official.noey/photos/a.302185496851416/664684563934839/'],
// 	'8125fb2b-786d-4628-a305-4584cbd07081': ['Miori', 'https://www.facebook.com/bnk48official.miori/photos/a.1747265275495942/2133450133544119/'],
// 	'82aac6d4-e79d-4660-9ca8-4cc114d98880': ['Nine', 'https://www.facebook.com/bnk48official.nine/photos/a.1688660754505358/2142833679088061/'],
// 	'8aae311c-1651-4bd4-a9e1-e6a2879471aa': ['Tarwaan', 'https://www.facebook.com/bnk48official.tarwaan/photos/a.1853464448270272/2297324073884305/'],
// 	'8c5a3037-77a4-428a-8501-42e83fbea27c': ['Korn', 'https://www.facebook.com/bnk48official.korn/photos/a.1372958329434140/2255166347879996/'],
// 	'907e24a4-7668-4c6b-9726-6daf7fe98a5d': ['Cherprang', 'https://www.facebook.com/bnk48official.cherprang/photos/a.1244472578974134/2135219363232780/'],
// 	'94868b8b-e2f6-48f7-918a-7fd1b8247a75': ['Deenee', 'https://www.facebook.com/bnk48official.deenee/photos/a.363507414130234/568173256996981/'],
// 	'973c064e-a030-44ed-815c-b26eec58452a': ['Satchan', 'https://www.facebook.com/bnk48official.satchan/photos/a.1687653418200384/2114471035518618/'],
// 	'9e8724ba-b01c-4e9d-adf0-52c0d9bc5027': ['Kaimook', 'https://www.facebook.com/bnk48official.kaimook/photos/a.1847063608906409/2278963329049766/'],
// 	'a03c4ea2-225f-4f45-a265-88dec20072c0': ['Faii', 'https://www.facebook.com/bnk48official.faii/photos/a.1778078552252534/2238492839544434/'],
// 	'a134cf89-8a80-4f69-ba7e-fd1a8250b120': ['Kheng', 'https://www.facebook.com/bnk48official.kheng/photos/a.196404187638649/345858409359892/'],
// 	'a7bdc796-3722-4785-a94b-c00a9376a171': ['Ratah', 'https://www.facebook.com/bnk48official.ratah/photos/a.3201286649926564/3647217862000105/'],
// 	'ac7271c9-6106-4e24-b132-78780a86cd4e': ['Kaew', 'https://www.facebook.com/bnk48official.kaew/photos/a.244154872696158/601854746926167/'],
// 	'ad3cc73f-2bb2-4dbd-aa7f-806356aea31f': ['Jib', 'https://www.facebook.com/bnk48official.jib/photos/a.1639663059662301/1976578369304100/'],
// 	'af6d6b8e-7014-4051-ba05-755bb60bb5b3': ['Oom', 'https://www.facebook.com/bnk48official.oom/photos/a.153773061964226/296533834354814/'],
// 	'aff6f924-3b95-4b3d-b298-d5fae22ecf39': ['Jennis', 'https://www.facebook.com/bnk48official.jennis/photos/a.377495429296329/784474588598409/'],
// 	'b7d7d0ea-6970-43e6-b9c4-619e512d5659': ['Pun', 'https://www.facebook.com/bnk48official.pun/photos/a.1766872750297893/2255775814740915/'],
// 	'b8025c52-f39a-471f-b730-15946303f60e': ['Pakwan', 'https://www.facebook.com/pakwan.bnk48official/photos/a.434044657051619/640896126366470/'],
// 	'ce21afd7-cd49-47fc-92c0-35fa08de48cf': ['Nink', 'https://www.facebook.com/bnk48official.nink/photos/a.1155614697870795/1979043195527937/'],
// 	'cff2e0e9-81b0-4c76-803f-ffcd6b5ffdb5': ['Fifa', 'https://www.facebook.com/bnk48official.fifa/photos/a.1783150828659658/1975067972801275/'],
// 	'd42e495c-3f65-40c1-a7e1-4b5971893abe': ['Music', 'https://www.facebook.com/bnk48official.music/photos/a.719144531580971/1182997235195696/'],
// 	'd430da87-7397-4cca-9c13-ec1210530211': ['New', 'https://www.facebook.com/bnk48official.new/photos/a.427462671017082/630960410667306/'],
// 	'e775f923-9c7a-4e96-adcb-218ec8337922': ['Natherine', 'https://www.facebook.com/bnk48official.natherine/photos/a.2066160240374388/2334310110226065/']
// }
// 
// api.post('/who/detect', (req, res) => {
// 	axios.post('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect', req.body, {
// 	    headers: {
// 	      'Content-Type': 'application/octet-stream',
// 	      'Ocp-Apim-Subscription-Key': FACE_SUB_KEY
// 	    }
// 	}).then(({ data }) => {
// 		let personDetect = data
// 		let faceIds = data.map(x => x.faceId)
// 		axios.post('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/identify',
// 		{
// 		    personGroupId: "bnk48",
// 		    faceIds,
// 		    maxNumOfCandidatesReturned: 1,
// 		    confidenceThreshold: 0.5
// 		},
// 		{
// 		    headers: {
// 		      'Content-Type': 'application/json',
// 		      'Ocp-Apim-Subscription-Key': FACE_SUB_KEY
// 		    }
// 		}).then(({ data }) => {
// 			let faces = data.map(face => ({
// 				rect: personDetect.find(x => x.faceId == face.faceId).faceRectangle,
// 				mem: face.candidates[0] ? MEM_ID[face.candidates[0].personId] : null
// 			}))
// 			res.json({ faces })
// 		}).catch(()=> res.json({ faces: [] }))
// 	}).catch(()=> res.json({ faces: [] }))
	
// })

// api.get('/l_krathong', (req, res) => {
// 	axios.get(`https://graph.facebook.com/debug_token?input_token=${req.query.access_token}&access_token=2043330669254065|c447961cdc92b7e1f47cf94ef610a060`)
// 		 .then(({ data }) => {
// 		 	let user_id = data.data.user_id
// 		 	res.json({ user_id })
// 		 	// axios.get(`https://graph.facebook.com/${user_id}?fields=id,name,picture.type(large),full_picture&access_token=${req.query.access_token}`)
// 		 	//      .then(({ data }) => {
// 		 	//      	res.json({ data })
// 		 	//      })
// 		 	//      .catch(x=> res.json({ success: x }))
// 		 })
// 		 .catch(x=> res.json({ success: x }))
// })

// api.post('/krathong/detect', (req, res) => {
// 	let property = probe.sync(req.body)
// 	axios.post('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect', req.body, {
// 	    headers: {
// 	      'Content-Type': 'application/octet-stream',
// 	      'Ocp-Apim-Subscription-Key': FACE_SUB_KEY
// 	    }
// 	}).then(({ data }) => {
// 		res.json({ data, property })
// 	}).catch(()=> res.json({ data: [] }))
	
// })

// api.post('/krathong/detectjson', (req, res) => {
// 	axios.post('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect', {url: req.body.url}, {
// 	    headers: {
// 	      'Content-Type': 'application/json',
// 	      'Ocp-Apim-Subscription-Key': FACE_SUB_KEY
// 	    }
// 	}).then(({ data }) => {
// 		res.json({ data })
// 	}).catch(()=> res.json({ data: [] }))
	
// })