const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Serve frontend from public/
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, "favicon.ico")))
//app.use('/images',express.static('images'))

let sessions = {
/*	0.12345:{			*\
		u:"sampleUser",
		p:"0.12345"
\*	}					*/
	"-1":{
		u:"Robocittykat",
		p:"-0.9067791778486455"
	}
}

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
	console.log(fs.readFileSync(path.join(__dirname, 'users.json'),"utf-8"))
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
	while(sessionID in Object.keys(sessions)){
		sessionID = Math.random()
	}
	
	sessions[sessionID] = {u:username,p:pass}
	
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
})


app.get('/cardnames', (req, res) => {
	let cardnames = fs.readdirSync(path.join(__dirname, 'images'),"utf-8");
	res.json(cardnames);
});
app.get('/games',(req,res)=>{
	res.send(Object.keys(require("./games.json")))
})


app.get('/createGame',(req,res)=>{
	let n = req.query.n
	let p = req.query.p
	
	let gameData = require("./games.json")
	
	let game = {
		pass: p,
		gameCreated: new Date().getTime(),
		isPublic: p == '',
		players: []
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

    let userData = require("./users.json")
    let gameData = require("./games.json")

    if(gameData[gameName].pass != gamePass){
	res.json(false)
	return
    }

    if(gameData[gameName].players < 2){
	gameData[gameName].players = gameData[gameName].players.concat(sessions[userSess].u)
	fs.writeFileSync('./games.json',JSON.stringify(gameData))
	res.json(true)
    }else{
	res.json(false)
    }
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







