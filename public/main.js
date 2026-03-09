const ROOT = document.URL

let session = -1
let currentGame = -1

let currentTab = signedOut
function switchTab(tab){
	currentTab.hidden = true
	tab.hidden = false
}


async function sessionData(){
	let res = await fetch(ROOT+"sessionData?s="+session)
	let data = await res.json()
	return data
}

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
	if(localStorage.session != undefined){
		if(localStorage.session in await (await fetch(ROOT + "sessionIDs")).json()){
			session = localStorage.session
			switchTab(signedIn)
		        signedInUsernameLabel.innerHTML = (await sessionData()).u
			return
		}else{
			localStorage.removeItem("session")
		}
	}
	
	
	let username = prompt("Please enter your username")
	if(username == null){return}
	let pass = sineEncrypt(prompt("Please enter your password (note: please do not use your default password on this site)"))
	if(pass == null){return}
	
	let userExists = await fetch(ROOT+"accountdetails?u=" + username)
	userExists = await userExists.json()
	
	if(!userExists){
		if(confirm("No account exists under this username. Would you like to make a new account?")){
			let res = await fetch(ROOT+"signup?u="+username+"&p="+pass)
			alert("signed in!")
			
			session = await fetch(ROOT + "initSession?u=" + username + "&p=" + pass).json()
			localStorage.session = session
			
			switchTab(signedIn)
		        signedInUsernameLabel.innerHTML = (await sessionData()).u
		}
	}else{
		let res = await fetch(ROOT+"login?u="+username+"&p="+pass)
		let success = await res.text()
		if(success == "false"){
			alert("username or password is incorrect")
		}else{
			alert("signed in!")
			
			session = await (await fetch(ROOT + "initSession?u=" + username + "&p=" + pass)).text()
			localStorage.session = session
			
			switchTab(signedIn)
		        signedInUsernameLabel.innerHTML = (await sessionData()).u
		}
	}
	
	
	
}
async function signOut(){
	await fetch(ROOT+"endSession?s="+session)
	session = -1
	localStorage.removeItem("session")
	switchTab(signedOut)
}

async function createGame(){
	let allGameNames = await (await fetch(ROOT+"games")).json()
	console.log(allGameNames)
	let name = prompt("Please enter the game name")
	if(name == null){return}
	while(name in allGameNames){
		name = prompt("A game with that name already exists. Please enter another name.")
		if(name == null){return}
	}
	let pass = prompt("Please enter a password (leave blank for a public game)")
	if(pass == null){return}
	if(pass != ''){
		pass = sineEncrypt(pass)
	}
	
	await fetch(ROOT+"createGame?n=" + name + "&p=" + pass)
        await fetch(ROOT+"joinGame?n=" + name + "&p=" + pass + "&s=" + session)
}
async function joinGame(){
    let allGameNames = await (await fetch(ROOT+"games")).json()

    let gameName = prompt("Please enter game name")
    if(gameName == null){return}
    while(!(gameName in allGameNames)){
	gameName = prompt("Game does not exist")
	if(gameName == null){return}
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
