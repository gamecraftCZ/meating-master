import express = require("express")

const app = express();
app.use(express.json())

const appId = process.env.APPID
const appSecret = process.env.APPSECRET

app.options("/**", (req,res)=>{
	res.set("Access-Control-Allow-Origin","*")
	res.set("Access-Control-Allow-Headers","*")
	res.status(200)
	res.send("")
})

app.post("/webhooks/recordone", (req, res)=>{
	res.set("Access-Control-Allow-Origin", "*")
	res.set("Access-Control-Allow-Headers","Content-Type")
	console.log("Request coming!")
	console.log(req)
	console.log(req.body)
	const rqBody: ZoomMediaWebHookData = req.body;
	console.log(rqBody)

	res.status(418)
	res.send(req.body)
})

app.options("/getRecord/:meetId", (req, res)=>{
	res.set("Access-Control-Allow-Origin", "*")
	res.set("Access-Control-Allow-Headers","*")
	res.status(200)
	res.send("")
})

app.get("/getRecord/:meetId",async (req,res)=>{
	res.set("Access-Control-Allow-Origin", "*")
	res.set("Access-Control-Allow-Headers","*")
	let auth =""
	try{
		auth = res.get("authentication")
	}catch(e){
		res.status(401)
		res.send(JSON.stringify({
			code: 401,
			message: "[Unauthorized] You haven't supplied authentication token"
		}))
	}

	await fetch(`https://api.zoom.us/v2/meetings/${req.params.meetId}/recordings`,{
		method: "GET",
		headers:{
			authentication: auth,
		}
	}).then(result=>{
		if(result.status == 401) {
			res.status(401)
			res.send(JSON.stringify({
				code: 401,
				message: "Zoom API returned that your supplied token is invalid"
			}))
		} //TODO Dan: process output
	})
})


app.get("/getToken", (req, res)=>{
	res.set("Access-Control-Allow")
	try{
		const code = req.query.code;

		fetch(`https://api.zoom.us/oauth/token?grant_type=authorization&code=${code}&redirect_uri=${escape("localhost:3000")}`,{
			method: "POST",
			headers: {
				authentication: `Base ${new Buffer(`${appId}:${appSecret}`).toString('base64')}`
			}
		}).then(async rez=>{
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			//@ts-ignore
			const responseBody: string = await parseResponseStream(rez.body)
			const responseJSON = JSON.parse(responseBody)
			if(rez.status == 200 && responseJSON.access_token){
				res.status(200).send(JSON.stringify({
					token: responseJSON.access_code
				}))
			}else{
				res.status(rez.status)
				res.send(responseJSON)
			}
		})
	}catch(e){
		res.status(500).send(e.message)
	}
})

export class ZoomMediaWebHookData{
	event: string
	payload: {
		account_id: string;
		uuid: string;
		host_id: string;
		topic: string;
		type: number;
		start_time: string;
		duration: number;
		share_url: string;
		total_size: string;
		recording_count: number;
		recording_files: [
			{
				id: string;
				meeting_id: string;
				recording_start: string;
				recording_end: string;
				file_type: string;
				file_size: number;
				play_url: string;
				download_url: string;
				status: string;
				recording_type: string;
			}
		];
	}
}
