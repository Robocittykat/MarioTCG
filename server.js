const http = require('http');

const users = [
  { name: 'Mario' },
  { name: 'Luigi' },
  { name: 'Peach' },
];

http.createServer((req, res) => {
  if (req.url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
}).listen(8080);

console.log('Backend running at http://localhost:8080');




/*//carded jumping man

import express from 'express';

const app = express();

const router = express.Router();
import path from 'path';
import cors from 'cors';
import fs from 'fs';
app.use(cors());

app.use('/', router);

router.get('/', (req, res) => {
  res.send('Hello World!');
});


router.get('/cardimg', function(req, res){
	// root/cardimg?name=<name>
	let name = req.query["name"];

	res.sendFile("/images/" + name + ".png", {root:'.'})
});


router.get('/users', (req, res) => {
	let usernames = fs.readdirSync('./users/');
	res.json(usernames);
});


router.get('/cardnames', (req, res) => {
	let cardnames = fs.readdirSync('./images/');
	res.json(cardnames);
});


router.get('/delete-games', (req, res) => {
	res.send("You have deleted all the games on the server. Are you happy with your decision?<br><button>yes</button>")
	let games = fs.readdirSync('./games/');
	for (let g of games){
		fs.unlinkSync("./games/"+g);
	}
});


router.get('/create-account', function(req,res){
	// root/create-account?name=<name>
	let name = req.query["name"];
	let user_json = JSON.stringify({"deck":newDeck()})
	fs.writeFileSync("users/"+name+".json",user_json);
	res.send("success");
});


router.get('/create-game', function(req,res){
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


router.get('/join', function(req,res){
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












app.listen(3000, () => {
  console.log('Express server initialized');
});*/