import express from "express"
import * as path from "path"
import * as fs from "fs"


const app = express();
const PORT = 3000;
const __dirname = import.meta.dirname

import { createClient } from 'redis';
const redis = createClient({ url: "redis://default:7Zu7u2E8Z3FVGVTH9owUbnqi3iyU63zp@redis-12054.c10.us-east-1-2.ec2.cloud.redislabs.com:12054" });
await redis.connect();

/*
// Add a user
await client.hSet("users", userId, JSON.stringify(userData));

// Get one user
const user = JSON.parse(await client.hGet("users", userId));

// Get all users
const allUsers = await client.hGetAll("users"); 
// returns { userId1: '{"name":...}', userId2: '{"name":...}', ... }
*/

async function redify(obj,param,data){
	await redis.hSet(obj,param,JSON.stringify(data))
}
async function deredify(obj,param = null){
	if(param == null){
		const raw = await redis.hGetAll(obj);
		return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, JSON.parse(v)]));
	}
	return JSON.parse(await redis.hGet(obj,param))
}




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Serve frontend from public/
app.use(express.static("./public"));
//app.use(express.static("./images"))
//app.use(express.static(path.join(__dirname, "favicon.ico")))
//app.use('/images',express.static('images'))

/*
let sessions = {
/*	0.12345:{			*\
		u:"sampleUser",
		p:"0.12345"
\*	}					 /
	"-1":{
		u:"Robocittykat",
		p:"-0.9067791778486455"
	}
}
*/

async function getUsers(){
	return await deredify("users")
    //return JSON.parse(fs.readFileSync("./users.json"))
}
async function getGames(){
	return await deredify("games")
}
async function getSessions(){
	return await deredify("sessions")
}



app.get("/test", async (req,res) => {
  res.send("Test successful!")
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})


app.get('/blobTest',async (req,res) => {
	await redify("test","testParam","It's blobbin time")
	const blobData = await deredify("test")
	res.json(blobData)
})



/*
app.get('/', async (req,res) => {
  res.sendFile('./public/index.html');
});
*/

app.get('/cardimg', async (req,res) => {
	
	// root/cardimg?name=<name>
	let name = req.query.name;
	

	res.sendFile(path.join(__dirname,"images",name))

});


app.get('/accountdetails', async (req,res) => {
	let username = req.query.u
    let userData = await getUsers()	
	if(username in userData){res.send(true)}else{res.send(false)}
})

app.get('/signup',async (req,res) => {
	let username = req.query.u
	let pass = sineEncrypt(req.query.p)
    
	//fs.writeFileSync('./users.json', JSON.stringify(userData))
	await redify('users',username,{
		"pass":pass,
		"accountCreated":{"year":new Date().getFullYear(), "month":new Date().getMonth() + 1, "day":new Date().getDate()},
	})
	res.json(await deredify('users',username))
	return
})

app.get('/login',async (req,res) => {
	let username = req.query.u
	let pass = sineEncrypt(req.query.p)
    let userData = await getUsers()
	if(userData[username].pass == pass){
		res.send(true)
	}else{
		res.send(false)
	}
})

app.get('/initSession',async (req,res) => {
	let username = req.query.u
	let pass = sineEncrypt(req.query.p)
	
	let sessions = await getSessions()
	
	
	let sessionID = Math.random()+""
	while(sessionID in sessions){
		sessionID = Math.random()+""
	}
	
	await redify('sessions',sineEncrypt(sessionID+""),{
		u:username,
		p:pass,
		dateCreated:new Date().getTime()
	})
	res.json(sessionID)
})



app.get('/users', async (req,res) => {
    let usernames = await getUsers()
	res.json(usernames);
});
app.get('/deleteUser', async (req,res) => {
	await redis.hDel('users',req.query.callingItThisToPreventTerrorism)
	res.send("Wow. You killed them. Just wow. " + req.query.callingItThisToPreventTerrorism + " is dead all because of you. Are you happy with yourself?")
})
app.get('/deleteAllUsers', async (req,res) => {
	await redis.del('users')
	res.send("You Frankenstein's Monster")//listening to the audiobook while writing this
})

app.get('/sessionIDs',async (req,res) => {
    res.send(await getSessions())
})
app.get('/sessionData',async (req,res) => {
    let s = sineEncrypt(req.query.s)
	let sessions = await getSessions()
	
	res.json(sessions[s])
})
app.get('/sessionExists',async (req,res) => {
	let s = sineEncrypt(req.query.s)
	let sessions = await getSessions()
	if(s in sessions){
		res.json(true)
	}else{
		res.json(false)
	}
})
app.get('/endSession',async (req,res) => {
    let s = sineEncrypt(req.query.s)+""
	//await redis.hDel('sessions',s)
	res.send("session "+s+" has been terminated.<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><sub>you monster</sub>")
})
app.get('/deleteAllSessions',async (req,res) => {
	await redis.del('sessions')
	res.send('You moster again')
})


app.get('/cardnames', async (req,res) => {
	let cardnames = fs.readdirSync("./images");
	res.json(cardnames);
});
app.get('/games',async (req,res)=>{
    res.json(await getGames())
})


app.get('/createRPSGame',async (req,res)=>{
	let n = req.query.n
	let p = sineEncrypt(req.query.p)
	
	
	let game = {
		pass: p,
		gameCreated: new Date().getTime(),
		isPublic: p == '',
		players: [],
		gameType: "RPS",
		gameData: {
			p1Choice: null,
			p2Choice: null,
			winner: null
		}
	}
	
	await redify('games',n,game)
	
	
	res.json(true)
	
})
app.get('/createCOWGame',async (req,res) => {
	
	let n = req.query.n
	let p = sineEncrypt(req.query.p)
	
	
	let game = {
		pass: p,
		gameCreated: new Date().getTime(),
		isPublic: p == '',
		players: [],
		gameType: "COW",
		gameData: {
			
		}
	}
	
	await redify('games',n,game)
	
	res.json(true)
})
app.get('/createMARIOGame',async (req,res) => {
    let n = req.query.n
    let p = sineEncrypt(req.query.p)

    let game = {
		pass: p,
		gameCreated: new Date().getTime(),
		isPublic: p == '',
		players: [],
		gameType: "MARIO",
		gameData: {

		}
    }
    await redify('games',n,game)
    res.json(true)
})
app.get('/deleteAllGames',async (req,res)=>{
	await redis.del('games')
	res.send("You monster.")
})
app.get('/joinGame',async (req,res)=>{
    let gameName = req.query.n
    let gamePass = sineEncrypt(req.query.p)
    let userSess = sineEncrypt(req.query.s)
	//console.log(gameName,gamePass,userSess)

    let userData = await getUsers()
	let game = await deredify('games',gameName)
	let sessions = await getSessions()
	
    if(game.pass != gamePass){
		res.json(false)
		console.log("join failed; invalid password")
		return
    }
	
	if(game.players.includes(sessions[userSess].u)){
		res.json(game)
		return
	}
	
    if(game.players.length < 2){
		game.players = game.players.concat(sessions[userSess].u)
		switch(game.gameType){
			case "COW":
				game.gameData[sessions[userSess].u] = {
					bullets: 0,
					submitted: false,
					choice: -1,
					lastChoice: -1,
				}
				break
			case "MARIO":
				game.gameData[sessions[userSess].u] = {
				    queue: [CARD("brick_block_smb1"),CARD("bottomless_pit_smb1")],
				    deck: [],
				    hand: [CARD("little_goomba_smb1"),CARD("question_block_smb1"),CARD("koopa_troopa_smb1"),CARD("bullet_bill_cannon_smb1")],
					items: [CARD("coin_smb1")]
				}
		                break
		}
		
		await redify('games',gameName,game)
		res.json(game)
    }else{
		res.json(false)
		console.log("join failed; game is full")
    }
})
app.get('/getGame',async (req,res) => {
	let gameName = req.query.g
	res.json(await deredify('games',gameName))
})


app.get('/rpsSubmit',async (req,res)=>{
	let choice = req.query.choice
	let s = sineEncrypt(req.query.s)
	let g = req.query.g
	
	let game = await deredify('games',g)
	let sessions = await getSessions()
	
	let user = sessions[s]
	
	
	
	let playerNumber = game.players.indexOf(user.u)
	switch(playerNumber){
		case -1:
			res.json("You aren't in this game!")
			return
			break
		case 0:
			game.gameData.p1Choice = choice
			break
		case 1:
			game.gameData.p2Choice = choice
			break
	}
	
	let p1Choice = game.gameData.p1Choice
	let p2Choice = game.gameData.p2Choice
	
	if((p1Choice != null) && (p2Choice != null)){
		if(p1Choice == 0 && p2Choice == 2){
			game.gameData.winner = game.players[0]
		}else if(p1Choice == 2 && p2Choice == 0){
			game.gameData.winner = game.players[1]
		}else if(p1Choice > p2Choice){
			game.gameData.winner = game.players[0]
		}else if(p1Choice < p2Choice){
			game.gameData.winner = game.players[1]
		}else if(p1Choice == p2Choice){
			game.gameData.winner = "tie"
		}
	}
	await redify('games',g,game)
	
	res.json(true)
})
app.get('/cowSubmit',async (req,res) => {
	let choice = req.query.choice
	let s = sineEncrypt(req.query.s)
	let g = req.query.g
	
	let game = await deredify('games',g)
	let sessions = await getSessions()
	
	let user = sessions[s]
	
	
	
	game.gameData[user.u].choice = choice
	game.gameData[user.u].submitted = true
	
	let p1 = game.gameData[game.players[0]]
	let p2 = game.gameData[game.players[1]]
	
	if((p1.submitted == true) && (p2.submitted == true)){
		if(p1.choice == 1 && p2.choice == 0){
			game.gameData.winner = game.players[0]
		}else if(p1.choice == 0 && p2.choice == 1){
			game.gameData.winner = game.players[1]
		}else if(p1.choice == 1 && p2.choice == 1){
			game.gameData.winner = "tie"
		}else{
			if(p1.choice == 0){
				p1.bullets ++
			}if(p1.choice == 1){
				p1.bullets --
			}if(p2.choice == 0){
				p2.bullets ++
			}if(p2.choice == 1){
				p2.bullets --
			}
		}
		p1.lastChoice = p1.choice
		p1.choice = -1
		p1.submitted = false
		p2.lastChoice = p2.choice
		p2.choice = -1
		p2.submitted = false
	}
	
	if(game.gameData.winner != null){
		setTimeout(async ()=>{await redis.hDel('games',g)},60000)
	}
	
	await redify('games',g,game)
	
	res.json(true)
})


/*





function newPlayerObject(user){
	return {name:user,
			gameCoins:0,
			deck:[],
			discard:[],
			hand:[],
			lives:3,
			queue:[],
			powerUp:"none",
			hasStar:false}
}




function newDeck(){
	return [
		"hidden_block",
		"bullet_bill_cannon",
		"bullet_bill_cannon",
		"koopa_troopa",
		"koopa_troopa",
		"koopa_troopa",
		"koopa_troopa",
		"buzzy_beetle",
		"red_koopa",
		"red_koopa",
		"parakoopa",
		"piranha_plant",
		"pipe",
		"pipe",
		"pipe",
		"pipe",
		"goomba",
		"goomba",
		"goomba",
		"goomba",
		"goomba",
		"goomba",
		"goomba",
		"goomba",
		"question_block",
		"question_block",
		"question_block",
		"question_block",
		"question_block",
		"brick_block",
		"brick_block",
		"brick_block",
		"brick_block",
		"brick_block",
		"brick_block",
		"brick_block",
		"bottomless_pit",
		"bottomless_pit",
		"bottomless_pit",
		"bottomless_pit",

	]
}




*/


function CARD(name){
	let card = defaultCARD()
	
	switch(name){
		//prototypes (base types, ignoring renames or variants)
		case "goomba":
			card.proto = "goomba"
			card.type = "e"
			break
		case "koopa_troopa":
			card.proto = "koopa_troopa"
			card.type = "e"
			card.traits.grabbable = true
			card.onThrow = 1 //kill consecutive enemies, become enemy at start of queue
			break
		case "red_koopa":
			card.proto = "red_koopa"
			card.type = "e"
			card.traits.grabbable = true
			card.onJump = 0 //replace at end of queue
			card.onThrow = 1 //kill consecutive enemies, become enemy at start of queue
			break
		case "parakoopa":
			card.proto = "parakoopa"
			card.type = "e"
			card.traits.easily_avoidable = true
			card.onStomp = 100 //spawn koopa in place
			break
		case "buzzy_beetle":
			card.proto = "buzzy_beetle"
			card.type = "e"
			card.traits.fireproof = true
			card.traits.grabbable = true
			card.onThrow = 1 //kill consecutive enemies, become enemy at start of queue
			break
		case "piranha_plant":
			card.proto = "piranha_plant"
			card.type = "e"
			card.allowedParents = ["pipe"]
			card.traits.unstompable = true
			break
		case "bullet_bill":
			card.proto = "bullet_bill"
			card.type = "e"
			card.isAux = true
			card.traits.easily_avoidable = true
			card.traits.fireproof = true
			card.passive.turnStart = 0 //move forward
			break
		case "bullet_bill_cannon":
			card.proto = "bullet_bill_cannon"
			card.type = "o"
			card.passive.turnStart = 101 //spawn bullet bill
			break
		case "pipe":
			card.proto = "pipe"
			card.type = "o"
			card.onEncounter = 103 //pipe stuff
			break
		case "question_block":
			card.proto = "question_block"
			card.type = "o"
			card.onEncounter = 104 //? block stuff
			break
		case "brick_block":
			card.proto = "brick_block"
			card.type = "o"
			card.onEncounter = 105 //brick block stuff
			break
		case "hidden_block":
			card.proto = "hidden_block"
			card.type = "o"
			card.onEncounter = 106 //hidden block stuff
			break
		case "bottomless_pit":
			card.proto = "bottomless_pit"
			card.type = "o"
			card.onEncounter = 107 //bottomless pit stuff
			break
		case "checkpoint":
			card.proto = "checkpoint"
			card.type = "s"
			card.onEncounter = 0 //checkpoint
			break
		case "flagpole":
			card.proto = "flagpole"
			card.type = "s"
			card.onEncounter = 1 //you win!
			break
		case "1-up":
			card.proto = "1-up"
			card.type = "i"
			break
		case "super_mushroom":
			card.proto = "super_mushroom"
			card.type = "i"
			break
		case "fire_flower":
			card.proto = "fire_flower"
			card.type = "i"
			card.passive.encounter = 0 //fire flower stuff
			break
		case "super_star":
			card.proto = "super_star"
			card.type = "i"
			card.passive.encounter = 108 //instakill enemies
			card.passive.endTurn = 99 //remove at end of turn
			break
		case "coin":
			card.proto = "coin"
			card.type = "i"
			break
			
		//smb1 cards
		case "little_goomba_smb1":
			card = CARD("goomba")
			break
		case "koopa_troopa_smb1":
			card = CARD("koopa_troopa")
			break
		case "red_koopa_smb1":
			card = CARD("red_koopa")
			break
		case "parakoopa_smb1":
			card = CARD("parakoopa")
			break
		case "buzzy_beetle_smb1":
			card = CARD("buzzy_beetle")
			break
		case "piranha_plant_smb1":
			card = CARD("piranha_plant")
			break
		case "bullet_bill_smb1":
			card = CARD("bullet_bill")
			break
		case "bullet_bill_cannon_smb1":
			card = CARD("bullet_bill_cannon")
			break
		case "pipe_smb1":
			card = CARD("pipe")
			break
		case "question_block_smb1":
			card = CARD("question_block")
			break
		case "brick_block_smb1":
			card = CARD("brick_block")
			break
		case "hidden_block_smb1":
			card = CARD("hidden_block")
			break
		case "bottomless_pit_smb1":
			card = CARD("bottomless_pit")
			break
		case "checkpoint_smb1":
			card = CARD("checkpoint")
			break
		case "flagpole_smb1":
			card = CARD("flagpole")
			break
		case "1-up_smb1":
			card = CARD("1-up")
			break
		case "super_mushroom_smb1":
			card = CARD("super_mushroom")
			break
		case "fire_flower_smb1":
			card = CARD("fire_flower")
			break
		case "starman_smb1":
			card = CARD("super_star")
			break
		case "coin_smb1":
			card = CARD("coin")
			break
	}
	card.name = name
	card.img = "/cardimg?name=" + name + ".png"
	return card
}CARD("little_goomba_smb1")
function defaultCARD(){
	return {
		name: "",
		proto: "",
		img: "/cardimg?name=",
		pile: [],
		allowedParents: [""],
		altPlaceRestriction: null,
		type: null,
		grabbed: false,
		traits: {
			unstompable: false,
			easily_avoidable: false,
			difficult: false,
			fireproof: false,
			grabbable: false,
			boss: false,
			miniboss: false,
		},
		rollMod: 0,
		onStomp: null,
		onJump: null,
		onHurt: null,
		onEncounter: null, //applies before battle
		passive:{
			turnStart: null,
			stomp: null,
			encounter: null,
			ten_coins: null,
			jump: null,
			damage: null,
			resolvePhase: null,
			endTurn: null,
		},
		onThrow: 0, //kill first enemy
		isAux: false,
	}
}



app.get("/deckify", (req,res) => {
	let username = req.query.u
	let user = (await getUsers())[username]
	user.deck = [
		"question_block_smb1",
		"question_block_smb1",
		"question_block_smb1",
		"question_block_smb1",
		"question_block_smb1",
		"brick_block_smb1",
		"brick_block_smb1",
		"brick_block_smb1",
		"brick_block_smb1",
		"brick_block_smb1",
		"brick_block_smb1",
		"brick_block_smb1",
		"hidden_block_smb1",
		"pipe_smb1",
		"pipe_smb1",
		"pipe_smb1",
		"pipe_smb1",
		"bottomless_pit_smb1",
		"bottomless_pit_smb1",
		"bottomless_pit_smb1",
		"bottomless_pit_smb1",
		"bullet_bill_cannon_smb1",
		"little_goomba_smb1",
		"little_goomba_smb1",
		"little_goomba_smb1",
		"little_goomba_smb1",
		"little_goomba_smb1",
		"little_goomba_smb1",
		"little_goomba_smb1",
		"little_goomba_smb1",
		"koopa_troopa_smb1",
		"koopa_troopa_smb1",
		"koopa_troopa_smb1",
		"koopa_troopa_smb1",
		"red_koopa_smb1",
		"red_koopa_smb1",
		"parakoopa_smb1",
		"piranha_plant_smb1",
		"piranha_plant_smb1",
		"buzzy_beetle_smb1",
	]
	await redify("users","req.query.u",)






function sineEncrypt(input){ //I have no clue if this is a good way to do this
	let values = {"0":0.2648849389096455,"1":0.48445246803627073,"2":0.6079695596071263,"3":0.4347102087625656,"4":0.7497362247741212,"5":0.379626356779714,"6":0.8030344337789945,"7":0.5840142039764469,"8":0.7945428581249087,"9":0.3838033958563928,"`":0.6566532206217444,"-":0.1391123542912388,"=":0.860287038799161,"q":0.08829401863666875,"w":0.8284398460335591,"e":0.26496082607415594,"r":0.6352589378962296,"t":0.6008716191406978,"y":0.4419788468357493,"u":0.5492310991633274,"i":0.6222973330612859,"o":0.7400855639184457,"p":0.5537403449291386,"[":0.15952612104864472,"]":0.11719867358568048,"a":0.6926922237077174,"s":0.10818859417955606,"d":0.4152933064442874,"f":0.5252826174733366,"g":0.7324790170742613,"h":0.9614996667362165,"j":0.4976839063737777,"k":0.8908284219250047,"l":0.7989998273231975,";":0.5401491684628414,"\'":0.8304253306024914,"z":0.15819054408159028,"x":0.138686880195394,"c":0.6200710038013678,"v":0.250931499994009,"b":0.5206280182000939,"n":0.3970973048465294,"m":0.34591719153420475,",":0.6549225573238822,".":0.33704622529297035,"/":0.8942722180196843,"~":0.6080143642632425,"!":0.9499357400474144,"@":0.18870906195503423,"#":0.009410113578408486,"$":0.03809323716254431,"%":0.14072348907706445,"^":0.31001202883437895,"&":0.4537004379072094,"*":0.21379221126391634,"(":0.31069470061482807,")":0.2636747633562989,"_":0.6016543610303652,"+":0.10654255875856378,"Q":0.13224168149927562,"W":0.3804576825231806,"E":0.299628620988057,"R":0.6779138447492367,"T":0.9910729064307701,"Y":0.5991212603670143,"U":0.42656889425471345,"I":0.7643025182091131,"O":0.8521472759254003,"P":0.28976253589447376,"{":0.215941745460548,"}":0.2567045972051514,"|":0.8830614783236929,"A":0.6641495272684825,"S":0.21698158960836544,"D":0.16612824381173596,"F":0.08244347947846398,"G":0.68073315259424,"H":0.13693900048691543,"J":0.9729881828524066,"K":0.24514578508772278,"L":0.4513171559046446,":":0.4151600781180088,"\"":0.5529331659261127,"Z":0.5068645952478222,"X":0.9228973239917062,"C":0.6094198159440088,"V":0.025732334161693737,"B":0.21036251602088707,"N":0.7871282076468441,"M":0.9991663711012584,"<":0.14040673790768743,">":0.7785947450492902,"?":0.9472721918142661}
	let total = 0
	for(let i = 0; i<input.length; i++){
		if(!(input[i] in values)){
			throw new Error("Invalid Character!")
		}else{
			total += values[input[i]]*(1.1**i)
		}
	}
	return Math.sin(total)
}


async function deleteOldSessions(){

	let currTime = new Date().getTime()
	let sessions = await getSessions()
	
	
	for(let i of Object.keys(sessions)){
		if(currTime - sessions[i].dateCreated > 86400000){//sessions last for a day
			delete sessions[i]
			await redis.hDel('sessions',i)
		}
	}
	
	
}setInterval(deleteOldSessions,60000)//clear check every minute
