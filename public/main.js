const ROOT = "http://localhost:3000/"



async function showCard(){
	const res = await fetch(ROOT + "cardimg?name=10_coins.png");
	//let data = await res.file()
	console.log(data)
	//demoCard = data
}

async function newCard(){
	const CardList = await (await fetch(ROOT + "cardnames")).json()
	let cardName = CardList[Math.floor(Math.random()*CardList.length)]
	demoCard.src = ROOT+"cardimg?name="+cardName
	console.log(cardName)
}

async function logIn(){
	let username = prompt("Please enter your username")
	let pass = sineEncrypt(prompt("Please enter your password"))
	
	
	let userExists = await fetch(ROOT+"accountdetails?u=" + username)
	userExists = await userExists.text()
	
	if(userExists != "true"){
		if(confirm("No account exists under this username. Would you like to make a new account?")){
			let res = await fetch(ROOT+"signup?u="+username+"&p="+pass)
			console.log(await res.json())
		}
	}else{
		let res = await fetch(ROOT+"login?u="+username+"&p="+pass)
		let success = await res.text()
		if(success == "false"){
			alert("username or password is incorrect")
		}
	}
	
	
	
}




/*
let account;
let game;

async function get_usernames(){
	const url = server_root + "users";
	let response = await fetch(url);
	let data = await response.json();
	return data;
}console.log(get_usernames())




















//button functions

async function logIn(){
	let username = prompt("Please enter your username");
	username = username.toLowerCase()
	
	let username_list = await get_usernames()
	if(username_list.includes(username + ".json")){
		console.log(username+" is signing in")
		account = username;
		signedOut.hidden = true;
		signedIn.hidden = false;
	}else{
		let creating = confirm("There is no account with that username. Would you like to create a new account?")
		if(creating){
			const url = server_root + "create-account?name="+username;
			let response = await fetch(url);
			let data = await response.text();
			if (data == "success"){
				console.log(username+" has successfully signed up")
				account = username;
				signedOut.hidden = true;
				signedIn.hidden = false;
			}else{
				console.log("signup failed")
			}
		}
	}
	
}


async function createGame(){
	const url = server_root + "create-game?u="+account;
	let response = await fetch(url);
	let data = await response.text();
	game = await data;
	await alert("Your game code is "+data);
	signedIn.hidden = true;
	gameDiv.hidden = false;
}

async function joinGame(){
	let code = prompt("Please enter a game code.")
	const url = server_root + "join?game="+code+"&u="+account;
	let response = await fetch(url);
	let data = await response.text();
	if(data.startsWith("failure")){
		alert(data)
	} else {
		game = data
		console.log(data)
		signedIn.hidden = true;
		gameDiv.hidden = false;
	}
}

async function signOut(){
	account = undefined;
	signedOut.hidden = false;
	signedIn.hidden = true;
}





function newCard(){
	let cards = ["1-up","10_coins","30_coins","50_coins","bloober","bottomless_pit","bowser","brick_block","bullet_bill_cannon","bullet_bill","buzzy_beetle_shell","buzzy_beetle","checkpoint","cheep-cheep","coin","fire_bar","fire_flower","fireball","flagpole","floating_platform","hammer_brother","hidden_block","jumping_board","koopa_shell_red","koopa_shell","koopa_troopa","lakitu","little_goomba","magic_mushroom","parakoopa","pipe","piranha_plant","podoboo","poison_mushroom","question_block_lost_levels","question_block","red_koopa","red_parakoopa","spiny","starman","super_jumping_board","vine","water","wind"]
	demoCard.src = "https://mario-backend.robocittykat.repl.co/cardimg?name="+cards[Math.floor(Math.random()*cards.length)]
}

function loadDecks(player){
	
}*/

function sineEncrypt(input){ //I have no clue if this is a good way to do this
	let values = {"0":21.51022050274092,"1":1.3591409142295225,"2":1.8472640247326624,"3":2.510692115398458,"4":3.4123843770715143,"5":4.637911221955518,"6":6.303574898323984,"7":8.56744655022233,"8":11.644367136881746,"9":15.826335796045663,"`":1,"-":29.235420759373916,"=":39.73505649878023,"q":54.00554101671389,"w":73.4011403909165,"e":99.76249305639978,"r":135.5912860184916,"t":184.28766444072934,"y":250.47290472919636,"u":340.427972723364,"i":462.68958607653593,"o":628.8603470245424,"p":854.7098269776315,"[":1161.671095639335,"]":1578.8747149612568,"a":2145.9132235463194,"s":2916.5984605079666,"d":3964.0682980552156,"f":5387.727410687033,"g":7322.680758580633,"h":9952.555020828215,"j":13526.924729928085,"k":18384.996844148394,"l":24987.801418862735,";":33961.94326501886,"\'":46159.066618228906,"z":62736.67600348107,"x":85267.98317909261,"c":115891.20461253948,"v":157512.47778824758,"b":214081.65306367617,"n":290967.1336647323,"m":395465.33605982794,",":537493.11839844,".":730528.8883321326,"/":992891.7011588116,"~":1349479.734443893,"!":1834133.120006286,"@":2492845.3655439904,"#":3388128.1291582873,"$":4604943.562990956,"%":6258767.204178883,"^":8506546.57983744,"&":11561595.495456276,"*":15713837.471646374,"(":21357319.42726758,")":29027606.651868403,"_":39452607.84271539,"+":53621653.49208703,"Q":72879383.14973383,"W":99053351.4426129,"E":134627462.63721108,"R":182977692.64913997,"T":248692468.4707607,"Y":338008108.9593464,"U":459400650.22799814,"I":624390219.7485185,"O":848634294.1049739,"P":1153413590.3363597,"{":1567651601.654516,"}":2130659431.0660942,"|":2895866407.0509257,"A":3935890515.965758,"S":5349429834.177007,"D":7270628955.43002,"F":9881809285.506798,"G":13430771306.545492,"H":18254310792.38588,"J":24810180658.993187,"K":33720531623.063618,"L":45830954178.47621,":":62290724962.14551,"\"":84661872873.07019,"Z":115067415297.08824,"X":156392832024.91266,"C":212559896697.28394,"V":288898852325.6794,"B":392654250269.7836,"N":533672456687.7815,"M":725336070681.7466,"<":985833930230.0387,">":1339887229211.3381,"?":1821095553674.76}
	let total = 0
	for(let i = 0; i<input.length; i++){
		if(!(input[i] in values)){
			throw new Error("Invalid Character!")
		}else{
			total += values[input[i]]*(i+1)
		}
	}
	return Math.sin(total)
}