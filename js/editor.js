var walls = document.querySelector(".walls");
var field = document.querySelector(".field");
var objects = document.querySelector(".objects");
var object = "wall";
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
var map = [
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0]
];

function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

function getElIndex(el) {
    for (var i = 0; el = el.previousElementSibling; i++);
    return i;
}

objects.addEventListener("click", function() {
	if (event.target.className == this.className || event.target.className == "object") return;
    event.stopPropagation();
    object = event.target.className;
});

walls.addEventListener("click", function(event){
	if (event.target.className == this.className) return;
    event.stopPropagation();
    event.target.className = object;
    console.log(getElIndex(event.target))
});

function placesObjects() {
	walls.innerHTML = "";

	for (var i = 0; i < map.length; i++) {
		for(var j = 0; j < map[i].length; j++) {
			if(map[i][j] == 0) {
				walls.innerHTML += template.empty;
			}
		}
	}
	for(item in template) {
		objects.innerHTML += template[item];
		var el = document.querySelector('.objects .' + item);
		var wrapper = document.createElement('div');
		wrapper.className = "object";
		wrap(el, wrapper);
		console.log(item)
	}
}

placesObjects();

