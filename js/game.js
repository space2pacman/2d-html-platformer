var doc = document;
var room = doc.querySelector(".room");
var field = doc.querySelector(".field");
var wall;
var money;
var needles;
var finish;
var water;

var size = {
	w: 50,
	h: 50
};

var key = {
	up: 38,
	left: 37,
	right: 39
};

var id = {
	empty: 100,
	wall: {
		default: 101,
		surface: 103,
		stone: 106,
		box: 107
	},
	finish: 102,
	water: {
		default: 104,
		surface: 105
	},
	money: 200,
	obstacle: 300,
	enemy: {
		bee: 301,
		bat: 302,
		fish: 303
	},
	needles: 400,
	player: 500,
};

var template = {
	wall: {
		default: "wall",
		surface: "wall-surface",
		stone: "wall-stone",
		box: "wall-box"
	},
	empty: "empty",
	money: "money",
	needles: "needles",
	player: "player",
	enemy: {
		default: "enemy",
		bee: "bee",
		bat: "bat",
		fish: "fish"
	},
	obstacle: "obstacle",
	finish: "finish",
	water: {
		default: "water",
		surface: "water-surface"
	}
};

var map = {
	length: 24,
	objects: [
		[100,100,107,107,100,100,100,100,100,100,100,107,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,107,100,100,100,100,100,100,100,107,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,107,100,100,100,100,100,100,100,107,100,100,100,100,100,100,100,100,100,100,100,100],
		[500,100,107,107,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,300,100,100,100,300,100,100,100,100,100,100,106,106,106,100,100,100,100,100,100,100,100],
		[100,100,300,100,100,100,300,100,100,100,100,100,100,103,103,103,105,105,105,105,105,105,105,103],
		[103,103,103,103,103,103,103,103,105,105,105,105,103,101,101,101,104,104,104,104,104,104,104,101],
		[101,101,101,101,101,101,101,101,103,103,103,103,101,101,101,101,103,103,103,103,103,103,103,101]
	],
	enemies:[
		[100,100,100,100,300,100,302,100,100,100,300,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,100,300,301,100,100,100,100,300,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,100,300,100,100,100,301,100,300,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
		[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,300,100,303,100,100,100,300,100],
		[100,100,100,100,100,100,100,100,300,303,100,300,100,100,100,100,300,100,100,100,100,303,300,100],
		[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]
	]
};

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
	range: 50,
	jumpHeight: 0,
	jumpMaxHeight: 10,
	setPosition: function() {
		this.el.style.left = this.x + "px";
		this.el.style.top = this.y + "px";
	},
	checkPosition: function() {
		if((player.el.offsetLeft + player.el.offsetWidth > field.offsetWidth / 2
			&& objects.el.offsetLeft + objects.el.offsetWidth > field.offsetWidth)
			|| (player.el.offsetLeft + player.el.offsetWidth < field.offsetWidth / 2
				&& objects.el.offsetLeft != 0)) {
			world.freeze = false;
		} else {
			world.freeze = true;
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

		for (var i = 0; i < map.objects.length; i++) {
			for(var j = 0; j < map.objects[i].length; j++) {
				if(map.objects[i][j] == id.player) {
					room.appendChild(objects.create(template.player));
					objects.el.appendChild(objects.create(template.empty));
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
		world.collision();
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
		for(var i = 0; i < obstacle.el.length; i++) {
			if(this.x[index] + this.el[index].offsetWidth == obstacle.el[i].offsetLeft + obstacle.el[i].offsetWidth
				&& this.x[index] == obstacle.el[i].offsetLeft
				&& this.y[index] + this.el[index].offsetHeight == obstacle.el[i].offsetTop + obstacle.el[i].offsetHeight
				&& this.y[index] == obstacle.el[i].offsetTop) {
				this.resolution[index] = resolution;
			};
		};
	}
};

var world = {
	x: 0,
	freeze: true,
	speed: 10,
	setWidth: function() {
		objects.el.style.width = map.objects[0].length * size.w + "px";
	},
	setPosition: function(value) {
		this.x = value;
		objects.el.style.left = this.x + "px";
	},
	reset: function() {
		this.setPosition(0);
		this.freeze = true;
		objects.el.style.left = this.x + "px";
	},
	move: function(direction) {
		var index;

		if(direction == "right") index = -1;
		if(direction == "left") index = 1;

		if(!this.freeze && this.x <= 0) {
			this.x += player.step.walk * player.step.speed * index;
			objects.el.style.left = this.x + "px";

			this.checkCollision(wall, function() {
				this.x -= player.step.walk * player.step.speed * index;
				objects.el.style.left = this.x + "px";
			}.bind(this))	
		} else {
			player.move(direction);
		};

		if(this.x > 0) {
			player.move(direction);
			this.reset();
		};
	},
	checkCollision: function(object, action, range = 0) {
		for(var i = 0; i < object.length; i++) {
			if(player.x - world.x + player.el.offsetWidth > object[i].offsetLeft
				&& player.x - world.x < object[i].offsetLeft + object[i].offsetWidth
				&& player.y + player.el.offsetHeight > object[i].offsetTop + range
				&& player.y < object[i].offsetTop + object[i].offsetHeight) {
				action(i);
			};
		};
	},
	collision: function() {
		if (player.x + player.el.offsetWidth > field.offsetWidth
				|| player.y + player.el.offsetHeight >= field.offsetHeight
				|| player.x < 0
				|| player.y < 0) {
			player.freeze()
		};

		world.checkCollision(finish, function() {
			console.log("finish");
		});

		world.checkCollision(money, function(index) {
			money[index].classList.add("empty");
			money[index].classList.remove("money");
		});

		player.step.speed = 1;
		world.checkCollision(water, function() {
			player.step.speed = 0.5;
		},player.range);

		world.checkCollision(wall, player.freeze.bind(player));
		world.checkCollision(needles, game.gameover);
		world.checkCollision(enemy.el, game.gameover);
		player.setPosition();
		player.checkPosition();
	}
};

var obstacle = {
	el: null,
	x: [],
	y: [],
	places: function() {
		for(var i = 0; i < this.el.length; i++) {
			this.el[i].style.left = this.x[i] + "px";
			this.el[i].style.top = this.y[i] + "px";
		}
	}
};

var objects = {
	el: doc.querySelector(".objects"),
	places: function(type) {

		for (var i = 0; i < map[type].length; i++) {
			for(var j = 0; j < map[type][i].length; j++) {
				switch(map[type][i][j]) {
					case id.empty:
						objects.el.appendChild(objects.create(template.empty));
						break;
					case id.wall.default:
						objects.el.appendChild(objects.create(template.wall.default));
						break;
					case id.money:
						objects.el.appendChild(objects.create(template.money));
						break;
					case id.needles:
						objects.el.appendChild(objects.create(template.needles));
						break;
					case id.player:
						player.places();
						break;
					case id.enemy.bee:
						var obj = objects.create(template.enemy.default)
						obj.classList.add(template.enemy.bee);
						objects.el.appendChild(obj);
						objects.el.appendChild(objects.create(template.empty));
						enemy.x.push(j * size.w);
						enemy.y.push(i * size.h);
						enemy.resolution.push(true);
						break;
					case id.enemy.bat:
						var obj = objects.create(template.enemy.default)
						obj.classList.add(template.enemy.bat);
						objects.el.appendChild(obj);
						objects.el.appendChild(objects.create(template.empty));
						enemy.x.push(j * size.w);
						enemy.y.push(i * size.h);
						enemy.resolution.push(true);
						break;
					case id.enemy.fish:
						var obj = objects.create(template.enemy.default)
						obj.classList.add(template.enemy.fish);
						objects.el.appendChild(obj);
						objects.el.appendChild(objects.create(template.empty));
						enemy.x.push(j * size.w);
						enemy.y.push(i * size.h);
						enemy.resolution.push(true);
						break;
					case id.obstacle:
						objects.el.appendChild(objects.create(template.obstacle));
						objects.el.appendChild(objects.create(template.empty));
						obstacle.x.push(j * size.w);
						obstacle.y.push(i * size.h);
						break;
					case id.finish:
						objects.el.appendChild(objects.create(template.finish));
						break;
					case id.wall.surface:
						var obj = objects.create(template.wall.default)
						obj.classList.add(template.wall.surface);
						objects.el.appendChild(obj);
						break;
					case id.wall.stone:
						var obj = objects.create(template.wall.default)
						obj.classList.add(template.wall.stone);
						objects.el.appendChild(obj);
						break;
					case id.wall.box:
						var obj = objects.create(template.wall.default)
						obj.classList.add(template.wall.box);
						objects.el.appendChild(obj);
						break;
					case id.water.default:
						objects.el.appendChild(objects.create(template.water.default));
						break;
					case id.water.surface:
						var obj = objects.create(template.water.default)
						obj.classList.add(template.water.surface);
						objects.el.appendChild(obj);
						break;
				};
			};
		};
	},
	find: function() {
		wall = doc.querySelectorAll(".wall");
		money = doc.querySelectorAll(".money");
		needles = doc.querySelectorAll(".needles");
		player.el = doc.querySelector(".player");
		finish = doc.querySelectorAll(".finish");
		enemy.el = doc.querySelectorAll(".enemy");
		obstacle.el = doc.querySelectorAll(".obstacle");
		objects.el = doc.querySelector(".objects");
		water = doc.querySelectorAll(".water");
	},
	create: function(type) {
		var el = doc.createElement("div");
		el.classList.add(type);
		return el;
	}
};

var game = {
	move: function(e) {
		switch(e.keyCode) {
			case key.up:
				player.jump();
				break;
			case key.left:
				world.move("left");
				player.el.classList.remove("left")
				player.el.classList.add("right");
				break;
			case key.right:
				world.move("right");
				player.el.classList.remove("right")
				player.el.classList.add("left");
				break;
		};

		world.collision();
	},
	gameover: function() {
		player.places();
		objects.find();
		player.setPosition();
		world.reset();
	},
	init: function() {
		objects.places("objects");
		objects.places("enemies");
		objects.find();
		obstacle.places();
		setInterval(player.gravity, world.speed);
		setInterval(enemy.move.bind(enemy), world.speed * enemy.speed);
		player.setPosition();
		world.setWidth();
		doc.addEventListener("keydown", game.move);
	}
};

game.init();