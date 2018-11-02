var doc = document;
var objects = doc.querySelector(".objects");
var room = doc.querySelector(".room");
var field = doc.querySelector(".field");
var template = {
	wall: "<div class='wall'></div>",
	empty: "<div class='empty'></div>",
	money: "<div class='money'></div>",
	needles: "<div class='needles'></div>",
	player: "<div class='player'></div>",
	enemy: "<div class='enemy'></div>",
	obstacle: "<div class='obstacle'></div>",
	finish: "<div class='finish'></div>"
}
var wall;
var money;
var needles;
var obstacle;
var finish;
var size = {
	w: 50,
	h: 50
}
var player = {
	el: null,
	x: 0,
	y: 0,
	step: {
		walk: 10,
		jump: 20,
		gravity: 2,
		speed: 10
	},
	jumpHeight: 0,
	jumpMaxHeight: 10,
	setPosition: function() {
		this.el.style.left = this.x + "px";
		this.el.style.top = this.y + "px";
	},
	checkPosition: function() {
		if(player.el.offsetLeft > field.offsetWidth / 2) {
			world.move = true;
		} else {
			world.move = false;
		}
	},
	move: function(direction) {
		if(direction == "left") this.x -= this.step.walk;
		if(direction == "right") this.x += this.step.walk;
	}
};
var arrow = {
	up: 38,
	left: 37,
	right: 39
}
var enemy = {
	el: null,
	x: [],
	y: [],
	resolution: []
};
var id = {
	empty: 0,
	wall: 1,
	money: 2,
	needles: 3,
	player: 4,
	enemy: 5,
	obstacle: 6,
	finish: 7
}
var world = {
	step: 0,
	move: false,
	speed: 10
}
var map = [
	[0,0,1,1,0,0,0,0,0,0,0,1],
	[0,0,0,1,0,0,0,0,0,0,0,1],
	[0,0,0,1,0,0,0,0,0,0,0,1],
	[4,0,1,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,6,0,0,0,6,0,0,0,0,0],
	[0,0,6,0,0,0,6,0,0,0,0,0],
	[0,0,1,1,1,1,1,0,0,0,0,0],
	[0,1,0,7,0,0,2,0,3,0,0,0]
];

function placesPlayer() {
	room.innerHTML = "";

	for (var i = 0; i < map.length; i++) {
		for(var j = 0; j < map[i].length; j++) {
			if(map[i][j] == id.player) {
				room.innerHTML += template.player;
				objects.innerHTML += template.empty;
				player.x = j * size.w;
				player.y = i * size.h;
			}
		}
	}
}

function placesObjects() {
	objects.innerHTML = "";

	for (var i = 0; i < map.length; i++) {
		for(var j = 0; j < map[i].length; j++) {
			switch(map[i][j]) {
				case id.empty:
					objects.innerHTML += template.empty;
					break;
				case id.wall:
					objects.innerHTML += template.wall;
					break;
				case id.money:
					objects.innerHTML += template.money;
					break;
				case id.needles:
					objects.innerHTML += template.needles;
					break;
				case id.player:
					placesPlayer();
					break;
				case id.enemy:
					objects.innerHTML += template.enemy;
					objects.innerHTML += template.empty;
					enemy.x.push(j * size.w);
					enemy.y.push(i * size.h);
					enemy.resolution.push(true)
					break;
				case id.obstacle:
					objects.innerHTML += template.obstacle;
					break;
				case id.finish:
					objects.innerHTML += template.finish;
					break;
			}
		}
	}
}

function findObjects() {
	wall = doc.querySelectorAll(".wall");
	money = doc.querySelectorAll(".money");
	needles = doc.querySelectorAll(".needles");
	player.el = doc.querySelector(".player");
	finish = doc.querySelector(".finish");
	enemy.el = doc.querySelectorAll(".enemy");
	obstacle = doc.querySelectorAll(".obstacle");
}

function switchResolution(index, resulution) {
	for(var i = 0; i < obstacle.length; i++) {
		if(enemy.x[index] + enemy.el[index].offsetWidth == obstacle[i].offsetLeft + obstacle[i].offsetWidth
			&& enemy.x[index] == obstacle[i].offsetLeft
			&& enemy.y[index] + enemy.el[index].offsetHeight == obstacle[i].offsetTop + obstacle[i].offsetHeight
			&& enemy.y[index] == obstacle[i].offsetTop) {
			enemy.resolution[index] = resulution;
		}
	}
}

function moveEnemy() {
	for(var i = 0;i < enemy.el.length; i++) {
		if(enemy.resolution[i]) {
			enemy.x[i]++;
			switchResolution(i, false);
		}
		
		if(!enemy.resolution[i]) {
			enemy.x[i]--;
			switchResolution(i, true);
		}

		enemy.el[i].style.left = enemy.x[i] + "px";
		enemy.el[i].style.top = enemy.y[i] + "px";
	}
}

function move(e) {
	switch(e.keyCode) {
		case arrow.up:
			jump();
			break;
		case arrow.left:
			moveWorld("left");
			break;
		case arrow.right:
			moveWorld("right");
			break;
	}

	player.checkPosition();
	collision();
}

function jump() {
	var i = setInterval(function() {
		player.y -= player.step.jump;
		player.jumpHeight++
		if (player.jumpHeight == player.jumpMaxHeight) {
			player.jumpHeight = 0;
			clearInterval(i);
		}
	}, jump.speed);
}

function gravity() {
	player.y += player.step.gravity;
	collision();
}

function gameover() {
	placesPlayer();
	findObjects();
	player.x = 0;
	player.y = 0;
	player.setPosition();
}

function checkCollision(object, action) {
	for(var i = 0; i < object.length; i++) {
		if(player.x - world.step + player.el.offsetWidth > object[i].offsetLeft
			&& player.x - world.step < object[i].offsetLeft + object[i].offsetWidth
			&& player.y + player.el.offsetHeight > object[i].offsetTop
			&& player.y < object[i].offsetTop + object[i].offsetHeight) {
			action(i);
		}
	}
}

function moveWorld(direction) {
	var index;

	if(direction == "right") index = -1;
	if(direction == "left") index = 1;

	if(world.move && world.step <= 0) {
		world.step += player.step.walk * index;
		objects.style.left = world.step + "px";
	} else {
		player.move(direction);
		world.step = 0;
	}

	if(world.step > 0) {
		world.step = 0;
		world.move = false;
		objects.style.left = world.step + "px";
		player.move(direction);
	}
}

function collision() {
	if (player.x + player.el.offsetWidth > field.offsetWidth
			|| player.y + player.el.offsetHeight >= field.offsetHeight
			|| player.x < 0
			|| player.y < 0) {
		player.x = player.el.offsetLeft;
	 	player.y = player.el.offsetTop;
	}

	if(player.x + player.el.offsetWidth > finish.offsetLeft
		&& player.x < finish.offsetLeft + finish.offsetWidth
		&& player.y + player.el.offsetHeight > finish.offsetTop
		&& player.y < finish.offsetTop + finish.offsetHeight) {
		console.log(true)
	}

	checkCollision(wall, function() {
		//////////////////////////////////
		//world.move = false;
		//console.log(world.move)
		player.x = player.el.offsetLeft;
		player.y = player.el.offsetTop;
	})

	checkCollision(money, function(index) {
		money[index].classList.add("empty");
		money[index].classList.remove("money");
	})

	checkCollision(needles, gameover);
	checkCollision(enemy.el, gameover);
	player.setPosition();
}

function init() {
	placesObjects();
	findObjects();
	setInterval(gravity, world.speed);
	setInterval(moveEnemy, world.speed);
	player.setPosition();
	doc.addEventListener("keydown", move);
}

init();