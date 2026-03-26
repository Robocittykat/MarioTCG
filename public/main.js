const ROOT = window.location.origin + "/"

let session = -1
let currentGame = -1

let inGame = false

let localGameData = {
    choice: -1,
    mario:{
		cardsChosen: [],
		typeChosen: null,
		playerChosen: null,
		
    },
}
let currentlyDisplayed = {}

let currentTab = signedOut
function switchTab(tab){
    currentTab.hidden = true
    tab.hidden = false
    currentTab = tab
}

let gameTab = document.getElementById("RPS")
function switchGame(tab){
    gameTab.hidden = true
    tab.hidden = false
    gameTab = tab
}

async function sessionData(){
    try{
		let res = await fetch(ROOT+"sessionData?s="+session)
		let data = await res.json()
		return data
    }catch(e){
		alert("sessionData failed: "+e)
    }
}

async function showCard(){
    const res = await fetch(ROOT + "10_coins.png");
    //let data = await res.file()
    console.log(data)
    //demoCard = data
}

async function newCard(){
    const CardList = await (await fetch(ROOT + "cardnames")).json()
    let cardName = CardList[Math.floor(Math.random()*CardList.length)]
    demoCard.src = "/cardimg?name="+cardName
    console.log(cardName)
}

async function logIn(){
    if(localStorage.session != undefined){
		if(await (await fetch(ROOT+"sessionExists?s="+localStorage.session)).json()){
			session = localStorage.session
			switchTab(signedIn)
			signedInUsernameLabel.innerHTML = (await sessionData()).u
			sessionLabel.innerHTML = session
			return
		}else{
			localStorage.removeItem("session")
		}
    }
    
    
    let username = prompt("Please enter your username")
    if(username == null){return}
    let pass = prompt("Please enter your password (note: please do not use your default password on this site)")
    if(pass == null){return}
    
    let userExists = await fetch(ROOT+"accountdetails?u=" + username)
    userExists = await userExists.json()
    
    if(!userExists){
		if(confirm("No account exists under this username. Would you like to make a new account?")){
			let res = await fetch(ROOT+"signup?u="+username+"&p="+pass)
			alert("signed in!")
			
			session = await (await fetch(ROOT + "initSession?u=" + username + "&p=" + pass)).json()
			localStorage.session = session
			
			switchTab(signedIn)
			signedInUsernameLabel.innerHTML = (await sessionData()).u
			sessionLabel.innerHTML = session
		}
    }else{
		let res = await fetch(ROOT+"login?u="+username+"&p="+pass)
		let success = await res.text()
		if(success == "false"){
			alert("username or password is incorrect")
		}else{
			alert("signed in!")
			
			session = await (await fetch(ROOT + "initSession?u=" + username + "&p=" + pass)).json()
			localStorage.session = session
			
			
			
			switchTab(signedIn)
			
			signedInUsernameLabel.innerHTML = (await sessionData()).u
			sessionLabel.innerHTML = session
		}
    }
    
    
    
}
async function signOut(){
    await fetch(ROOT+"endSession?s="+session)
    session = -1
    localStorage.removeItem("session")
    switchTab(signedOut)
}

async function createGame(type){
    let allGameNames = await (await fetch(ROOT+"games")).json()
    
    let name = prompt("Please enter the game name")
    if(name == null){return}
    while(name in allGameNames){
		name = prompt("A game with that name already exists. Please enter another name.")
		if(name == null){return}
    }
    let pass = prompt("Please enter a password (leave blank for a public game)")
    if(pass == null){return}
    
    
    await fetch(ROOT+"create"+type+"Game?n=" + name + "&p=" + pass)
    await fetch(ROOT+"joinGame?n=" + name + "&p=" + pass + "&s=" +session)
    
    switchTab(gameDiv)
    switchGame(document.getElementById(type))
    currentGame = name
    inGame = true
    updateGame()
}
async function joinGame(){
    let allGameNames = await (await fetch(ROOT+"games")).json()
    
    let gameName = prompt("Please enter game name")
    if(gameName == null){return}
    if(!(gameName in allGameNames)){return alert("game does not exist")}
    
    
    let game = allGameNames[gameName]
    
    let pass = ''
    if(!game.isPublic){
		pass = prompt("Please enter game password")
		pass = pass
    }
    
    await fetch(ROOT+"joinGame?n=" + gameName + "&p=" + pass + "&s=" + session)
    
    switchTab(gameDiv)
    switchGame(document.getElementById(game.gameType))
    currentGame = gameName
	inGame = true
	updateGame()
}


async function updateGame(recurse = true){
    let user = await sessionData()
    let game = await (await fetch(ROOT+"getGame?g="+currentGame)).json()
    let player = game.gameData[user.u]
    let displayedPlayer = currentlyDisplayed[user.u]
    let opponent
    let displayedOpponent
    for(let p of game.players){
		if(p != user.u){
			opponent = game.gameData[p]
			displayedOpponent = currentlyDisplayed[user.u]
			break
		}opponent = null
    }
    
    let i = 1
    for(let p of game.players){
		document.getElementById("P"+i+"Label").innerHTML = p
		i ++
    }
    if(opponent == null){
		if(inGame && recurse){setTimeout(()=>updateGame(),5000)}
		return
    }
    
    switch(game.gameType){
    case 'RPS':
		break
    case 'COW':
		
		cowBullets.innerHTML = player.bullets
		if(player.submitted){
			cow0.disabled = true
			cow1.disabled = true
			cow2.disabled = true
			cowSubmitButton.disabled = true
		}else{
			cow0.disabled = false
			if(player.bullets >= 1){
				cow1.disabled = false
			}else{cow1.disabled = true}
			cow2.disabled = false
			if(localGameData.choice != -1){
				cowSubmitButton.disabled = false
			}else{cowSubmitButton.disabled = true}
		}
		cowOppChoice.innerHTML = ["reload","shoot","shield"][opponent.lastChoice]
		break
    case 'MARIO':
		let cardDivs = [marioOppItems,marioOppQueue,marioQueue,marioHand,marioItems]
		let cardLists = [opponent.items,opponent.queue,player.queue,player.hand,player.items]
		let displayedLists = [[],[],[],[],[]]
		try{
			displayedLists = [displayedOpponent.items,displayedOpponent.queue,displayedPlayer.queue,displayedPlayer.hand,displayedPlayer.items]
		}catch(e){}
		for(let div in cardDivs){
			if(JSON.stringify(cardLists[div]) == JSON.stringify(displayedLists[div])){
				continue
			}
			let newData = ""
			for(let card in cardLists[div]){
				newData += '<img src="' + cardLists[div][card].img + '" class="gameCard" index="' + card + '"' +
					(()=>{if(div == 3){return ' onclick="cardChoice(this)"'}})() + '>' //only adds the onclick when editing playerHand
			}
			
			cardDivs[div].innerHTML = newData
			
		}
		let newData = ""
		for(let card of opponent.hand){
			newData += '<img src="/cardimg?name=card_back.png" class="gameCard">'
		}
		if(marioOppHand.innerHTML != newData){
			marioOppHand.innerHTML = newData
		}
		marioStateDisplay.innerHTML = JSON.stringify(player.state)
		currentlyDisplayed = game.gameData
    }
    
    
    let winner = game.gameData.winner
    if(winner != null){
		gameWinner.innerHTML = "Winner: " + winner
		if(user.u == winner){
			reaction.src = ROOT+"cardimg?name=tfw_win.png"
		}else if(winner == "tie"){
			reaction.src = ROOT+"cardimg?name=tfw_tie.png"
		}else{
			reaction.src = ROOT+"cardimg?name=tfw_lose.png"
		}
		reaction.hidden = false
		inGame = false
    }
    
    
    
    if(inGame && recurse){setTimeout(()=>updateGame(),5000)}
}

function rpsChoice(number){
    let mapping = ["boulder","flat","angle"]
    localGameData.choice = number
    rpsCurrentChoice.innerHTML = mapping[number]
}
async function rpsSubmit(){
    await fetch(ROOT+"rpsSubmit?choice=" + localGameData.choice + "&s=" + session + "&g=" + currentGame)
    rps0.disabled = true
    rps1.disabled = true
    rps2.disabled = true
    rpsSubmitButton.disabled = true
}

function cowChoice(number){
    let mapping = ["reload","shoot","shield"]
    localGameData.choice = number
    cowCurrentChoice.innerHTML = mapping[number]
    cowSubmitButton.disabled = false
}
async function cowSubmit(){
    await fetch(ROOT+"cowSubmit?choice=" + localGameData.choice + "&s=" + session + "&g=" + currentGame)
    cow0.disabled = true
    cow1.disabled = true
    cow2.disabled = true
    cowSubmitButton.disabled = true
    localGameData.choice = -1
}

async function cardChoice(elem){
    let game = await (await fetch(ROOT+"getGame?g="+currentGame)).json()
    let user = await (await fetch(ROOT+"sessionData?s="+session)).json()
    let hand = game.gameData[user.u].hand
    
    let selectingCard = hand[elem.getAttribute("index")]
    
    
    if(selectingCard.type != localGameData.mario.typeChosen && localGameData.mario.typeChosen != null){
		return
    }
    
    
    if(elem.classList.contains("selected")){
		elem.classList.remove("selected")
		localGameData.mario.cardsChosen.splice(localGameData.mario.cardsChosen.indexOf(elem.getAttribute("index")),1)
		if(localGameData.mario.cardsChosen.length == 0){
			localGameData.mario.typeChosen = null
		}
    }else{
		elem.classList.add("selected")
		localGameData.mario.cardsChosen = localGameData.mario.cardsChosen.concat(elem.getAttribute("index"))
		localGameData.mario.typeChosen = selectingCard.type
    }
    
}
async function marioPlay(who){
	await fetch(ROOT+"marioPlay?choice=" + localGameData.mario.cardsChosen.join("&choice=") + "&who=" + who + "&s=" + session + "&g=" + currentGame)
	localGameData.mario = {
		cardsChosen: [],
		typeChosen: null,
		playerChosen: null,
		
    }
	updateGame(false)
}
async function resolveQueue(endTurn = false){
	await fetch(ROOT+"resolveQueue?s=" + session + "&g=" + currentGame)
	updateGame(false)
}




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
