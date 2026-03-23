class CARD{
	constructor(name){
		card = defaultCard()
		
		switch(name){
			//prototypes (base types, ignoring renames or variants){
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
				
			//}
				
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
	card.img += name + ".png"
	return card
}
	}
	defaultCard(){
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
}