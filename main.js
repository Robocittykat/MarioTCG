const server_root = "http://localhost:8080/"




fetch('http://localhost:8080/users')
    .then(response => response.json())
    .then(users => {
        const list = document.getElementById('user-list');
        users.forEach(user => {
			const li = document.createElement('li');
			li.textContent = user.name;
			list.appendChild(li);
        });
    })
	.catch(error => {
        console.error('Error fetching user list:', error);
    });







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