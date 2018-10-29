var walls = document.querySelector(".walls");
var field = document.querySelector(".field");
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
		gravity: 2
	},
	jumpHeight: 0,
	jumpMaxHeight: 10,
	setPosition: function() {
		player.el.style.left = player.x + "px";
		player.el.style.top = player.y + "px";
	}
};
var enemy = {
	el: null,
	x: [],
	y: [],
	resolution: []
};
/*
0 - empty
1 - wall
2 - money
3 - needles
4 - player
5 - enemy
6 - obstacle
7 - finish
*/
var map = [
	[0,0,1,1,0,0,0,0,0,0],
	[0,0,0,1,0,0,0,0,0,0],
	[0,0,0,1,0,0,0,0,0,0],
	[4,0,1,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,6,5,0,0,6,0,0,0],
	[0,0,6,0,0,5,6,0,0,0],
	[0,0,1,1,1,1,1,0,0,0],
	[0,1,0,7,0,0,2,0,3,0]
];

function placesObjects() {
	walls.innerHTML = "";

	for (var i = 0; i < map.length; i++) {
		for(var j = 0; j < map[i].length; j++) {
			switch(map[i][j]) {
				case 0:
					walls.innerHTML += template.empty;
					break;
				case 1:
					walls.innerHTML += template.wall;
					break;
				case 2:
					walls.innerHTML += template.money;
					break;
				case 3:
					walls.innerHTML += template.needles;
					break;
				case 4:
					walls.innerHTML += template.player;
					walls.innerHTML += template.empty;
					player.x = j * size.w;
					player.y = i * size.h;
					break;
				case 5:
					walls.innerHTML += template.enemy;
					walls.innerHTML += template.empty;
					enemy.x.push(j * size.w);
					enemy.y.push(i * size.h);
					enemy.resolution.push(true)
					break;
				case 6:
					walls.innerHTML += template.obstacle;
					break;
				case 7:
					walls.innerHTML += template.finish;
					break;
			}
		}
	}
}

function moveEnemy() {
	for(var i = 0;i < enemy.el.length; i++) {
		if(enemy.resolution[i]) {
			enemy.x[i]++;

			for(var  j = 0; j < obstacle.length; j++) {

				if(enemy.x[i] + enemy.el[i].offsetWidth == obstacle[j].offsetLeft + obstacle[j].offsetWidth
					&& enemy.x[i] == obstacle[j].offsetLeft
					&& enemy.y[i] + enemy.el[i].offsetHeight == obstacle[j].offsetTop + obstacle[j].offsetHeight
					&& enemy.y[i] == obstacle[j].offsetTop) {
					enemy.resolution[i] = false;
				}
			}
		}
		
		if(!enemy.resolution[i]) {
			enemy.x[i]--;

			for(var j = 0; j < obstacle.length; j++) {
				if(enemy.x[i] + enemy.el[i].offsetWidth == obstacle[j].offsetLeft + obstacle[j].offsetWidth
					&& enemy.x[i] == obstacle[j].offsetLeft
					&& enemy.y[i] + enemy.el[i].offsetHeight == obstacle[j].offsetTop + obstacle[j].offsetHeight
					&& enemy.y[i] == obstacle[j].offsetTop) {
					enemy.resolution[i] = true;
				}
			}
		}

		enemy.el[i].style.left = enemy.x[i] + "px";
		enemy.el[i].style.top = enemy.y[i] + "px";
	}
}

function findObjects() {
	wall = document.querySelectorAll(".wall");
	money = document.querySelectorAll(".money");
	needles = document.querySelectorAll(".needles");
	player.el = document.querySelector(".player");
	finish = document.querySelector(".finish");
	enemy.el = document.querySelectorAll(".enemy");
	obstacle = document.querySelectorAll(".obstacle");
}

function move(e) {
	switch(e.keyCode) {
		case 38:
			jump();
			break;
		case 37:
			player.x -= player.step.walk;
			break;
		case 39:
			player.x += player.step.walk;
			break;
	}
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
	}, 10);
}

function gravity() {
	player.y += player.step.gravity;
	collision();
}

function gameover() {
	placesObjects();
	findObjects();
	player.x = 0;
	player.y = 0;
	player.setPosition();
}

function collision() {
	for(var i = 0; i < wall.length; i++) {
		if (player.x + player.el.offsetWidth > wall[i].offsetLeft
			&& player.x < wall[i].offsetLeft + wall[i].offsetWidth
			&& player.y + player.el.offsetHeight > wall[i].offsetTop
			&& player.y < wall[i].offsetTop + wall[i].offsetHeight) {
			player.x = player.el.offsetLeft;
			player.y = player.el.offsetTop;
		}
	}

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

	for(var i = 0; i < money.length; i++) {
		if(player.x + player.el.offsetWidth > money[i].offsetLeft
			&& player.x < money[i].offsetLeft + money[i].offsetWidth
			&& player.y + player.el.offsetHeight > money[i].offsetTop
			&& player.y < money[i].offsetTop + money[i].offsetHeight) {
			money[i].classList.add("empty");
			money[i].classList.remove("money");
		}
	}

	for(var i = 0; i < needles.length; i++) {
		if(player.x + player.el.offsetWidth > needles[i].offsetLeft
			&& player.x < needles[i].offsetLeft + needles[i].offsetWidth
			&& player.y + player.el.offsetHeight > needles[i].offsetTop
			&& player.y < needles[i].offsetTop + needles[i].offsetHeight) {
			gameover();
		}
	}

	for(var i = 0; i < enemy.el.length; i++) {
		if(player.x + player.el.offsetWidth > enemy.el[i].offsetLeft
			&& player.x < enemy.el[i].offsetLeft + enemy.el[i].offsetWidth
			&& player.y + player.el.offsetHeight > enemy.el[i].offsetTop
			&& player.y < enemy.el[i].offsetTop + enemy.el[i].offsetHeight) {
			gameover();
		}
	}

	player.setPosition();
}

function init() {
	placesObjects();
	findObjects();
	setInterval(gravity, 10);
	setInterval(moveEnemy,10);
	player.setPosition();
	
	document.addEventListener("keydown", move);
}

init();

