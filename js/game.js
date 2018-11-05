var doc = document;
var objects = doc.querySelector(".objects");
var room = doc.querySelector(".room");
var field = doc.querySelector(".field");
var wall;
var money;
var needles;
var obstacle;
var finish;
var water;
var size = {
	w: 50,
	h: 50
};
var arrow = {
	up: 38,
	left: 37,
	right: 39
};
var id = {
	empty: 0,
	wall: 1,
	money: 2,
	needles: 3,
	player: 4,
	enemy: 5,
	obstacle: 6,
	finish: 7,
	surface: 8,
	water: 9
};
var template = {
	wall: "<div class='wall'></div>",
	empty: "<div class='empty'></div>",
	money: "<div class='money'></div>",
	needles: "<div class='needles'></div>",
	player: "<div class='player'></div>",
	enemy: "<div class='enemy'></div>",
	obstacle: "<div class='obstacle'></div>",
	finish: "<div class='finish'></div>",
	surface: "<div class='wall surface'></div>",
	water: "<div class='water'></div>"
};
var map = [
	[0,0,8,8,6,0,5,0,0,0,6,1,0,0,0,0,0,0,0,0],
	[0,0,0,1,6,5,0,0,0,0,6,1,0,0,0,0,0,0,0,0],
	[0,0,0,1,6,0,0,0,5,0,6,1,0,0,0,0,0,0,0,0],
	[4,0,8,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,6,0,0,0,6,0,0,0,0,0,0,0,8,0,0,0,0,0],
	[0,0,6,0,0,0,6,0,0,0,0,0,0,8,1,8,0,0,0,0],
	[8,8,8,8,8,8,8,8,9,9,9,9,8,1,1,1,0,0,0,0],
	[1,1,1,1,1,1,1,1,8,8,8,8,1,1,1,1,8,8,8,8]
];
var player = {
	el: null,
	x: 0,
	y: 0,
	step: {
		walk: 10,
		jump: 20,
		gravity: 2,
		speed: 1
	},
	jumpHeight: 0,
	jumpMaxHeight: 10,
	setPosition: function() {
		this.el.style.left = this.x + "px";
		this.el.style.top = this.y + "px";
	},
	checkPosition: function() {
		/*if(objects.offsetLeft + objects.offsetWidth < field.offsetWidth) {
			console.log("stop world")
			world.move = false;
			world.x = -500;
			objects.style.left = world.x + "px";
		}*/
		if((player.el.offsetLeft + player.el.offsetWidth > field.offsetWidth / 2
			&& objects.offsetLeft + objects.offsetWidth > field.offsetWidth)
			|| (player.el.offsetLeft + player.el.offsetWidth < field.offsetWidth / 2
				&& objects.offsetLeft != 0)) {
			world.move = true;
		} else {
			world.move = false;
		};
		//console.log("p: " + (player.el.offsetLeft + player.el.offsetWidth) + " f " + field.offsetWidth / 2 )
	},
	move: function(direction) {
		if(direction == "left") this.x -= this.step.walk * this.step.speed;
		if(direction == "right") this.x += this.step.walk * this.step.speed;
	},
	freeze: function() {
		this.x = this.el.offsetLeft;
	 	this.y = this.el.offsetTop;
	},
	places: function() {
		room.innerHTML = "";

		for (var i = 0; i < map.length; i++) {
			for(var j = 0; j < map[i].length; j++) {
				if(map[i][j] == id.player) {
					room.innerHTML += template.player;
					objects.innerHTML += template.empty;
					this.x = j * size.w;
					this.y = i * size.h;
				};
			};
		};
	},
	jump: function() {
		var i = setInterval(function() {
			player.y -= player.step.jump;
			player.jumpHeight++
			if (player.jumpHeight == player.jumpMaxHeight) {
				player.jumpHeight = 0;
				clearInterval(i);
			}
		}, 10);
	},
	gravity: function() {
		player.y += player.step.gravity;
		collision();
	}
};
var enemy = {
	el: null,
	x: [],
	y: [],
	resolution: [],
	speed: 1,
	move: function() {
		for(var i = 0;i < this.el.length; i++) {
			if(this.resolution[i]) {
				this.x[i]++;
				this.switchResolution(i, false);
				this.el[i].classList.add("right");
				this.el[i].classList.remove("left");
			};
			
			if(!this.resolution[i]) {
				this.x[i]--;
				this.switchResolution(i, true);
				this.el[i].classList.add("left");
				this.el[i].classList.remove("right");
			};

			this.el[i].style.left = this.x[i] + "px";
			this.el[i].style.top = this.y[i] + "px";
		}
	},
	switchResolution: function(index, resolution) {
		for(var i = 0; i < obstacle.length; i++) {
			if(this.x[index] + this.el[index].offsetWidth == obstacle[i].offsetLeft + obstacle[i].offsetWidth
				&& this.x[index] == obstacle[i].offsetLeft
				&& this.y[index] + this.el[index].offsetHeight == obstacle[i].offsetTop + obstacle[i].offsetHeight
				&& this.y[index] == obstacle[i].offsetTop) {
				this.resolution[index] = resolution;
			};
		};
	}
};
var world = {
	x: 0,
	move: false,
	speed: 10,
	setWidth: function() {
		objects.style.width = map[0].length * size.w + "px";
	},
	setPosition: function(value) {
		this.x = value;
		objects.style.left = this.x + "px";
	},
	reset: function() {
		this.setPosition(0);
		this.move = false;
		objects.style.left = this.x + "px";
	}
};

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
					player.places();
					break;
				case id.enemy:
					objects.innerHTML += template.enemy;
					objects.innerHTML += template.empty;
					enemy.x.push(j * size.w);
					enemy.y.push(i * size.h);
					enemy.resolution.push(true);
					break;
				case id.obstacle:
					objects.innerHTML += template.obstacle;
					break;
				case id.finish:
					objects.innerHTML += template.finish;
					break;
				case id.surface:
					objects.innerHTML += template.surface;
					break;
				case id.water:
					objects.innerHTML += template.water;
					break;
			};
		};
	};
};

function findObjects() {
	wall = doc.querySelectorAll(".wall");
	money = doc.querySelectorAll(".money");
	needles = doc.querySelectorAll(".needles");
	player.el = doc.querySelector(".player");
	finish = doc.querySelectorAll(".finish");
	enemy.el = doc.querySelectorAll(".enemy");
	obstacle = doc.querySelectorAll(".obstacle");
	water = doc.querySelectorAll(".water");
};

function move(e) {
	switch(e.keyCode) {
		case arrow.up:
			player.jump();
			break;
		case arrow.left:
			moveWorld("left");
			player.el.classList.remove("left")
			player.el.classList.add("right");
			break;
		case arrow.right:
			moveWorld("right");
			player.el.classList.remove("right")
			player.el.classList.add("left");
			break;
	};

	collision();
};

function gameover() {
	player.places();
	findObjects();
	player.setPosition();
	world.reset();
};

function checkCollision(object, action) {
	for(var i = 0; i < object.length; i++) {
		if(player.x - world.x + player.el.offsetWidth > object[i].offsetLeft
			&& player.x - world.x < object[i].offsetLeft + object[i].offsetWidth
			&& player.y + player.el.offsetHeight > object[i].offsetTop
			&& player.y < object[i].offsetTop + object[i].offsetHeight) {
			action(i);
		};
	};
};

function moveWorld(direction) {
	var index;

	if(direction == "right") index = -1;
	if(direction == "left") index = 1;

	if(world.move && world.x <= 0) {
		world.x += player.step.walk * player.step.speed * index;
		objects.style.left = world.x + "px";

		checkCollision(wall, function() {
			world.x -= player.step.walk * player.step.speed * index;
			objects.style.left = world.x + "px";
		})	
	} else {
		player.move(direction);
	};

	if(world.x > 0) {
		player.move(direction);
		world.reset();
	};
};

function collision() {
	if (player.x + player.el.offsetWidth > field.offsetWidth
			|| player.y + player.el.offsetHeight >= field.offsetHeight
			|| player.x < 0
			|| player.y < 0) {
		player.freeze()
	};

	checkCollision(finish, function() {
		console.log("finish");
	});

	checkCollision(money, function(index) {
		money[index].classList.add("empty");
		money[index].classList.remove("money");
	});

	player.step.speed = 1;
	checkCollision(water, function() {
		player.step.speed = 0.5;
	});

	checkCollision(wall, player.freeze.bind(player));
	checkCollision(needles, gameover);
	checkCollision(enemy.el, gameover);
	player.setPosition();
	player.checkPosition();
}

function init() {
	placesObjects();
	findObjects();
	setInterval(player.gravity, world.speed);
	setInterval(enemy.move.bind(enemy), world.speed * enemy.speed);
	player.setPosition();
	world.setWidth();
	doc.addEventListener("keydown", move);
}

init();