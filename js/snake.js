var
/**
 * Constats
 */
COLS = 26,
ROWS = 26,
EMPTY = 0,
SNAKE = 1,
FRUIT = 2,
LEFT  = 0,
UP    = 1,
RIGHT = 2,
DOWN  = 3,
KEY_LEFT  = 37,
KEY_UP    = 38,
KEY_RIGHT = 39,
KEY_DOWN  = 40,
/**
 * Game objects
 */
canvas,	  
ctx,	  /* CanvasRenderingContext2d */
keystate, /* Steuerung */
frames,   /* Bilder pro sekunde oder Animation */
score,	  /* zählt die Punkte */

grid = {
	width: null,  /* nummeriert die kollonen */
	height: null, /* nummeriert die nummer der Kollonne*/
	_grid: null,  
	init: function(d, c, r) {
		this.width = c;
		this.height = r;
		this._grid = [];
		for (var x=0; x < c; x++) {
			this._grid.push([]);
			for (var y=0; y < r; y++) {
				this._grid[x].push(d);
			}
		}
	},

	set: function(val, x, y) {
		this._grid[x][y] = val;
	},
	

	get: function(x, y) {
		return this._grid[x][y];
	}
},

snake = {
	direction: null, 
	last: null,		 
	_queue: null,	 
	init: function(d, x, y) {
		this.direction = d;
		this._queue = [];
		this.insert(x, y);
	},
	   insert: function(x, y) {
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},
	remove: function() {  
		return this._queue.pop();
	}
};

/**
 * platziert eine zufällige frucht.
 */
function setFood() {
	var empty = [];
	// findet alle zellen
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			if (grid.get(x, y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}
	// wählt eine zufällige zelle.
	var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
	grid.set(FRUIT, randpos.x, randpos.y);
}
/**
 * startet das spiel
 */
function main() {
	// zeichnet das canvas element also das Spielfeld
	canvas = document.createElement("canvas");
	canvas.width = COLS*20;
	canvas.height = ROWS*20;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	ctx.font = "12px Helvetica";
	frames = 0;
	keystate = {};
	// Ist zuständig für die tasten
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});
	// Startet den Gameloop.
	init();
}
/**
 * Bei einem fehler resetet er das spiel 
 */
function init() {
    score = 0;
	grid.init(EMPTY, COLS, ROWS);
	var sp = {x:Math.floor(COLS/2), y:ROWS-1};
	snake.init(UP, sp.x, sp.y);
	grid.set(SNAKE, sp.x, sp.y);
	setFood();
    display = $('#time');
	countdown(3, display);
}

/**
 * rendert das spiel
 */
function loop() {
	update();
	draw();
	window.requestAnimationFrame(loop, canvas);
}

function update() {
	frames++;
	// ändert die richtung der schlange
	if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
		snake.direction = LEFT;
	}
	if (keystate[KEY_UP] && snake.direction !== DOWN) {
		snake.direction = UP;
	}
	if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
		snake.direction = RIGHT;
	}
	if (keystate[KEY_DOWN] && snake.direction !== UP) {
		snake.direction = DOWN;
	}
	if (frames%5 === 0) {
		var nx = snake.last.x;
		var ny = snake.last.y;
		// aktualisiert die Position der Schlange.
		switch (snake.direction) {
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}
		// checks all gameover conditions
		if (0 > nx || nx > grid.width-1  ||
			0 > ny || ny > grid.height-1 ||
			grid.get(nx, ny) === SNAKE
		) {
			$('#score').text(score);
			$("#endScreen").show();
			//return init(); // da wirds game wieder gstartet
		}
		if (grid.get(nx, ny) === FRUIT) {
			// signalisiert dem score, dass eine frucht aufgelesen  wurde.
			score++;
			setFood();
		} else {
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
		}
		grid.set(SNAKE, nx, ny);
		snake.insert(nx, ny);
	}
}

function draw() {
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;
	// zeichnet alle zellen
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = "#3ed958";
					break;
				case SNAKE:
					ctx.fillStyle = "#ffffff";
					break;
				case FRUIT:
					ctx.fillStyle = "#f00";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}
	// Zeichnet den score
	ctx.fillStyle = "#000";
	ctx.fillText("SCORE: " + score, 1, canvas.height-1);
}

function countdown(timer, display) {
    var t = setInterval(function () {

        display.text(timer);

        if (--timer < 0) {
        	if(timer == -1){
            	display.text("los!");
        	}else{
	            display.text("");
	            clearInterval(t);
				loop();

        	}
        }
    }, 1000);
}
