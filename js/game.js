/*
Процесс добавления новых объектов
0) Переменная для последующего поиска всех элементов
1) Добалвение id в объект id
2) Добавление название класса в объект template
3) Добавление на карту id в объект map
4) Добавление в objects.places в switch свой case с id и кодом добавления элемента
5) Добавление в objects.find querySelectorAll'a
6) Добавление в world.collision -> world.checkCollision(элементы, callback с index'ом для каждого элемента)

Если нужна коллизия при движении world'a чтобы персонаж останавливался нужно писать условие в world.move -> this.checkCollision()
*/

var doc = document;
var room = doc.querySelector(".room");
var field = doc.querySelector(".field");
var wall;
var money;
var keys;
var locks;
var needles;
var finish;
var water;
var level = 0;

var size = {
	w: 50,
	h: 50
};

var buttons = {
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
	keys: {
		blue: 220,
		yellow: 221,
		green: 222,
		red: 223
	},
	obstacle: 300,
	enemy: {
		bee: 301,
		bat: 302,
		fish: 303
	},
	needles: 400,
	player: 500,
	locks: {
		blue: 650,
		yellow: 651,
		green: 652,
		red: 653
	}
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
	},
	keys: {
		default: "key",
		blue: "blue",
		yellow: "yellow",
		green: "green",
		red: "red"
	},
	locks: {
		default: "lock",
		blue: "blue",
		yellow: "yellow",
		green: "green",
		red: "red"
	}
};

var map = [{
		objects: [
			[100,100,107,107,100,100,100,100,100,100,100,107,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,107,100,100,100,100,100,100,100,107,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,107,100,100,100,100,100,100,100,107,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[500,100,107,107,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,107,107,107,107,107,100,100,100,107,100,100,100,100,107,107,107,107,100,107,100,100,100,107,100,100,100,107,100,100,100,107,100,100,100,107,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,107,100,100,100,107,100,100,107,100,107,100,100,107,100,100,100,100,100,107,107,100,107,107,100,100,107,100,107,100,100,107,107,100,100,107,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,107,107,107,107,107,100,100,107,107,107,100,100,107,100,100,100,100,100,107,100,107,100,107,100,100,107,107,107,100,100,107,100,107,100,107,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,106,106,106,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,107,100,100,100,100,100,107,107,100,107,107,100,107,100,100,100,100,100,107,100,100,100,107,100,107,107,100,107,107,100,107,100,100,107,107,100],
			[100,102,220,100,650,100,100,100,100,100,100,100,100,103,103,103,105,105,105,105,105,105,105,103,105,105,105,105,105,105,103,100,100,100,100,100,107,100,100,100,100,100,107,100,100,100,107,100,100,107,107,107,107,100,107,100,100,100,107,100,107,100,100,100,107,100,107,100,100,100,107,100],
			[103,103,103,103,103,103,103,103,105,105,105,105,103,101,101,101,104,104,104,104,104,104,104,101,104,104,104,104,104,104,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,102],
			[101,101,101,101,101,101,101,101,103,103,103,103,101,101,101,101,103,103,103,103,103,103,103,101,101,101,101,101,101,101,101,101,103,103,103,103,101,101,101,101,103,103,103,103,103,103,103,101,101,101,101,101,101,101,101,101,103,103,103,103,101,101,101,101,103,103,103,103,103,103,103,101]
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
	},
	{
		objects: [
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,106,106,106,100,106,106,106,100,106,106,106,100,106,106,106,100,106,106,106],
			[100,100,500,100,100,100,220,106,100,650,221,106,100,651,222,106,100,652,223,106,100,653,102,106],
			[103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103,103]
		],
		enemies: []
	},
	{
		objects: [
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,103,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,100,100,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[100,500,100,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[103,103,103,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
			[101,101,101,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]
		],
		enemies: []
	}
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
	range: 50,
	jumpHeight: 0,
	jumpMaxHeight: 10,
	jumpSpeed: 10,
	items: {
		keys: []
	},
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

		for (var i = 0; i < map[level].objects.length; i++) {
			for(var j = 0; j < map[level].objects[i].length; j++) {
				if(map[level].objects[i][j] == id.player) {
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
			player.jumpHeight++;
			if (player.jumpHeight == player.jumpMaxHeight) {
				player.jumpHeight = 0;
				clearInterval(i);
			}
		}, player.jumpSpeed);
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

var locks = {
	el: null,
	hide: function(index) {
		locks.el[index].classList.add("hide--down");
	},
	collision: function(index) {
		var lock = locks.el[index].getAttribute("data-lock");

		if(player.items.keys.includes(lock)) {
			locks.hide(index);
			setTimeout(function() {
				locks.el[index].classList.add("empty");
				locks.el[index].classList.remove("wall");
				locks.el[index].classList.remove("lock");
				locks.el[index].classList.remove("lock-" + lock);
				objects.find();
			}, 1000);
			player.items.keys.splice(player.items.keys.indexOf(lock),1);
		}
	}
}

var world = {
	x: 0,
	freeze: true,
	speed: 10,
	setWidth: function() {
		objects.el.style.width = map[level].objects[0].length * size.w + "px";
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
		var delta;
		var i;

		if(direction == "right") delta = -1;
		if(direction == "left") delta = 1;

		if(!this.freeze && this.x <= 0) {
			this.x += player.step.walk * player.step.speed * delta;
			objects.el.style.left = this.x + "px";
			// Из-за архитектуры игры нужно две коллизии. Когда игрок ходит или когда мир движется
			this.checkCollision(wall, function(index) {  
				this.x -= player.step.walk * player.step.speed * delta;
				objects.el.style.left = this.x + "px";

				if(wall[index].classList.contains("lock")) {
					locks.el.each((el,number) => { if(el == wall[index]) i = number; })
					locks.collision(i);
				}
			}.bind(this));
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
			player.freeze();
		};

		world.checkCollision(finish, function() {
			console.log("finish");
			game.nextLevel();
		});

		world.checkCollision(money, function(index) {
			money[index].classList.add("empty");
			money[index].classList.remove("money");
		});

		world.checkCollision(keys, function(index) {
			var key = keys[index].getAttribute("data-key");

			if(!player.items.keys.includes(key)) {
				player.items.keys.push(key);
			}
			keys[index].classList.add("empty");
			keys[index].classList.remove("key");
			keys[index].classList.remove("key-" + key);
		});

		world.checkCollision(locks.el, locks.collision);

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
		var obj;

		for (var i = 0; i < map[level][type].length; i++) {
			for(var j = 0; j < map[level][type][i].length; j++) {
				switch(map[level][type][i][j]) {
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
						obj = objects.create(template.enemy.default);
						obj.classList.add(template.enemy.bee);
						objects.el.appendChild(obj);
						objects.el.appendChild(objects.create(template.empty));
						enemy.x.push(j * size.w);
						enemy.y.push(i * size.h);
						enemy.resolution.push(true);
						break;
					case id.enemy.bat:
						obj = objects.create(template.enemy.default);
						obj.classList.add(template.enemy.bat);
						objects.el.appendChild(obj);
						objects.el.appendChild(objects.create(template.empty));
						enemy.x.push(j * size.w);
						enemy.y.push(i * size.h);
						enemy.resolution.push(true);
						break;
					case id.enemy.fish:
						obj = objects.create(template.enemy.default);
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
						obj = objects.create(template.wall.default);
						obj.classList.add(template.wall.surface);
						objects.el.appendChild(obj);
						break;
					case id.wall.stone:
						obj = objects.create(template.wall.default);
						obj.classList.add(template.wall.stone);
						objects.el.appendChild(obj);
						break;
					case id.wall.box:
						obj = objects.create(template.wall.default);
						obj.classList.add(template.wall.box);
						objects.el.appendChild(obj);
						break;
					case id.water.default:
						objects.el.appendChild(objects.create(template.water.default));
						break;
					case id.water.surface:
						obj = objects.create(template.water.default);
						obj.classList.add(template.water.surface);
						objects.el.appendChild(obj);
						break;
					case id.keys.blue:
						obj = objects.create(template.keys.default)
						obj.classList.add(template.keys.default + "-" + template.keys.blue);
						obj.setAttribute("data-" + template.keys.default, template.keys.blue);
						objects.el.appendChild(obj);
						break;
					case id.keys.yellow:
						obj = objects.create(template.keys.default)
						obj.classList.add(template.keys.default + "-" + template.keys.yellow);
						obj.setAttribute("data-" + template.keys.default, template.keys.yellow);
						objects.el.appendChild(obj);
						break;
					case id.keys.green:
						obj = objects.create(template.keys.default)
						obj.classList.add(template.keys.default + "-" + template.keys.green);
						obj.setAttribute("data-" + template.keys.default, template.keys.green);
						objects.el.appendChild(obj);
						break;
					case id.keys.red:
						obj = objects.create(template.keys.default)
						obj.classList.add(template.keys.default + "-" + template.keys.red);
						obj.setAttribute("data-" + template.keys.default, template.keys.red);
						objects.el.appendChild(obj);
						break;
					case id.locks.blue:
						obj = objects.create(template.locks.default)
						obj.classList.add(template.locks.default + "-" + template.locks.blue);
						obj.classList.add(template.wall.default);
						obj.setAttribute("data-" + template.locks.default, template.locks.blue);
						objects.el.appendChild(obj);
						break;
					case id.locks.yellow:
						obj = objects.create(template.locks.default)
						obj.classList.add(template.locks.default + "-" + template.locks.yellow);
						obj.classList.add(template.wall.default);
						obj.setAttribute("data-" + template.locks.default, template.locks.yellow);
						objects.el.appendChild(obj);
						break;
					case id.locks.green:
						obj = objects.create(template.locks.default)
						obj.classList.add(template.locks.default + "-" + template.locks.green);
						obj.classList.add(template.wall.default);
						obj.setAttribute("data-" + template.locks.default, template.locks.green);
						objects.el.appendChild(obj);
						break;
					case id.locks.red:
						obj = objects.create(template.locks.default)
						obj.classList.add(template.locks.default + "-" + template.locks.red);
						obj.classList.add(template.wall.default);
						obj.setAttribute("data-" + template.locks.default, template.locks.red);
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
		keys = doc.querySelectorAll(".key");
		locks.el = doc.querySelectorAll(".lock");
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
			case buttons.up:
				player.jump();
				break;
			case buttons.left:
				world.move("left");
				player.el.classList.remove("left");
				player.el.classList.add("right");
				break;
			case buttons.right:
				world.move("right");
				player.el.classList.remove("right");
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
	nextLevel: function() {
		level++;
		world.reset();
		objects.el.innerHTML = "";
		this.init();
	},
	init: function() {
		NodeList.prototype.each = [].forEach;
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