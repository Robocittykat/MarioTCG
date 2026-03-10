const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Serve frontend from public/
app.use(express.static(path.join(__dirname, "public")));
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
let sessions = require("./sessions.json")

app.get("/test", (req, res) => {
  res.send("Test successful!")
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})




//carded jumping man



app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/cardimg', function(req, res){
	
	// root/cardimg?name=<name>
	let name = req.query["name"];
	

	res.sendFile(path.join(__dirname, "images/"+name))

});


app.get('/accountdetails', function(req, res){
	let username = req.query["u"]
	let userData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'),"utf-8"))
	
	if(username in userData){res.send(true)}else{res.send(false)}
})

app.get('/signup',function(req, res){
	let username = req.query["u"]
	let pass = req.query["p"]
	let userData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'),"utf-8"))
	
	const jsonData = require('./users.json')
	jsonData[username] = {
		"pass":pass,
		"accountCreated":{"year":new Date().getFullYear(), "month":new Date().getMonth() + 1, "day":new Date().getDate()},
	}
	fs.writeFileSync('./users.json', JSON.stringify(jsonData,null,4))
	res.json(jsonData[username])
	return
})

app.get('/login',function(req, res){
	let username = req.query["u"]
	let pass = req.query["p"]
	let userData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'),"utf-8"))
	if(userData[username].pass == pass){
		res.send(true)
	}else{
		res.send(false)
	}
})

app.get('/initSession',function(req,res){
	let username = req.query["u"]
	let pass = req.query["p"]
	
	let sessionID = Math.random()
	while(sessionID in sessions){
		sessionID = Math.random()
	}
	
	sessions[sineEncrypt(sessionID+"")] = {u:username,p:pass,dateCreated:new Date().getTime()}
	fs.writeFileSync('./sessions.json',JSON.stringify(sessions))
	
	
	res.send(sessionID)
})



app.get('/users', (req, res) => {
	let usernames = Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname,'users.json'),"utf-8")))
	res.json(usernames);
});

app.get('/sessionIDs',(req,res) => {
	res.send(sessions)
})
app.get('/sessionData',(req,res) => {
	let s = req.query["s"]
	res.json(sessions[s])
})
app.get('/endSession',(req,res) => {
	let s = req.query["s"]
	delete sessions["s"]
	fs.writeFileSync('./sessions.json',JSON.stringify(sessions))
	res.send("session "+s+" has been terminated.<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><sub>you monster</sub>")
})


app.get('/cardnames', (req, res) => {
	let cardnames = fs.readdirSync(path.join(__dirname, 'images'),"utf-8");
	res.json(cardnames);
});
app.get('/games',(req,res)=>{
	res.send(require("./games.json"))
})


app.get('/createGame',(req,res)=>{
	let n = req.query.n
	let p = req.query.p
	
	let gameData = require("./games.json")
	
	let game = {
		pass: p,
		gameCreated: new Date().getTime(),
		isPublic: p == '',
		players: [],
		playerData: {
			p1Choice: null,
			p2Choice: null,
			winner: null
		}
	}
	
	gameData[n] = game
	
	fs.writeFileSync('./games.json', JSON.stringify(gameData,null,4))
	
	res.json(true)
	
})
app.get('/deleteAllGames',(req,res)=>{
	fs.writeFileSync('./games.json','{}')
	res.send("You monster.")
})
app.get('/joinGame',(req,res)=>{
    let gameName = req.query.n
    let gamePass = req.query.p
    let userSess = req.query.s
	//console.log(gameName,gamePass,userSess)

    let userData = require("./users.json")
    let gameData = require("./games.json")

    if(gameData[gameName].pass != gamePass){
		res.json(false)
		console.log("join failed; invalid password")
		return
    }
	
	if(gameData[gameName].players.includes(sessions[userSess].u)){
		res.json(true)
		return
	}
	
    if(gameData[gameName].players.length < 2){
		gameData[gameName].players = gameData[gameName].players.concat(sessions[userSess].u)
		fs.writeFileSync('./games.json',JSON.stringify(gameData))
		res.json(true)
    }else{
		res.json(false)
		console.log("join failed; game is full")
    }
})


app.get('/rpsSubmit',(req,res)=>{
	let choice = req.query.choice
	let s = req.query.s
	let g = req.query.g
	
	const games = require("./games.json")
	
	let user = sessions[s]
	
	let playerNumber = games[g].players.indexOf(user.u)
	switch(playerNumber){
		case -1:
			res.json("You aren't in this game!")
			return
			break
		case 0:
			games[g].playerData.p1Choice = choice
			break
		case 1:
			games[g].playerData.p2Choice = choice
			break
	}
	
	let p1Choice = games[g].playerData.p1Choice
	let p2Choice = games[g].playerData.p2Choice
	
	if((p1Choice != null) && (p2Choice != null)){
		if(p1Choice == 0 && p2Choice == 2){
			games[g].playerData.winner = games[g].players[0]
		}else if(p1Choice == 2 && p2Choice == 0){
			games[g].playerData.winner = games[g].players[1]
		}else if(p1Choice > p2Choice){
			games[g].playerData.winner = games[g].players[0]
		}else if(p1Choice < p2Choice){
			games[g].playerData.winner = games[g].players[1]
		}else if(p1Choice == p2Choice){
			games[g].playerData.winner = "tie"
		}
	}
	
	res.json(true)
})

/*
app.get('/create-game', function(req,res){
	// root/create-game?u=<account>
	const user = req.query["u"];
	const d = new Date(); //current date
	
	const date_code = d.getMonth() * 31 + d.getDate();
	let id_code = 1;
	while (true){
		let game_code = date_code + "-" + id_code
			
		if (fs.existsSync("games/" + game_code + ".json")){
			id_code++;
		} else {
			let gameData = {time:d.getTime(),
						   p1:newPlayerObject(user),
						   p2:{}}
			
			fs.writeFileSync("games/" + game_code + ".json",
				JSON.stringify(gameData)
			);
			res.send(game_code);
			return;
		}
	}
	
});


app.get('/join', function(req,res){
	// root/join?game=<game_code>&u=<account>
	const user = req.query["u"];
	const game_code = req.query["game"];
	const filename = "games/"+game_code+".json"
	
	if(!fs.existsSync(filename)){
		res.send("failure - game does not exist");
		return
	}

	fs.readFile(filename, 'utf8', (err,data) => {
		let gameData;
		try {
			gameData = JSON.parse(data);
		} catch (parseError) {
			console.log(parseError);
			res.send("failure - game data was corrupted");
			return;
		}

		if (user == gameData.p1.name || user == gameData.p2.name){
			res.send("rejoin");
			return;
		} else if (gameData.p2.name) {
			res.send("failure - game is already full");
			return;
		}
		
		gameData.p2 = newPlayerObject(user);
		fs.writeFileSync(filename, JSON.stringify(gameData));
		res.send(game_code)
		
	});
	
});















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


function deleteOldSessions(){

	let currTime = new Date().getTime()
	
	let sessionsRemoved = false
	for(let i of Object.keys(sessions)){
		if(currTime - sessions[i].dateCreated > 86400000){//sessions last for a day
			delete sessions[i]
			sessionsRemoved = true
		}
	}if(sessionsRemoved){
		fs.writeFileSync("./sessions.json",JSON.stringify(sessions))
	}
}setInterval(deleteOldSessions,60000)//clear check every minute