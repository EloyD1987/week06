/*jslint bitwise:true, es5: true */
(function (window, undefined) {
    'use strict';
    var KEY_ENTER = 13,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    canvas = null,
    ctx = null,
lastPress = null,
pause = false,
gameover = false,
currentScene = 0,
scenes = [],
mainScene = null,
gameScene = null,
highscoresScene = null,
body = [],
food = null,
food2 = null,
wall = [],
highscores = [],
posHighscore = 10,
dir = 0,
score = 0,
iBody = new Image(),
iFood = new Image(),
iFood2 = new Image(),
aEat = new Audio(),
aDie = new Audio();
window.requestAnimationFrame = (function () {
return window.requestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame ||
function (callback) {
window.setTimeout(callback, 17);
};
}());
//resize
function resize () {
  var w = window.innerWidth / canvas.width;
var h = window.innerHeight / canvas.height;
var scale = Math.min(h, w);
canvas.style.width = (canvas.width * scale) + 'px';
canvas.style.height = (canvas.height * scale) + 'px';
}
document.addEventListener('keydown', function (evt) {
if (evt.which >= 37 && evt.which <= 40) {
evt.preventDefault();
}
lastPress = evt.which;
}, false);
function Rectangle(x, y, width, height) {
this.x = (x === undefined) ? 0 : x;
this.y = (y === undefined) ? 0 : y;
this.width = (width === undefined) ? 0 : width;
this.height = (height === undefined) ? this.width : height;
}
Rectangle.prototype = {
constructor: Rectangle,
intersects: function (rect) {
if (rect === undefined) {
window.console.warn('Missing parameters on function intersects');
} else {
return (this.x < rect.x + rect.width &&
this.x + this.width > rect.x &&
this.y < rect.y + rect.height &&
this.y + this.height > rect.y);
}
},
fill: function (ctx) {
if (ctx === undefined) {
window.console.warn('Missing parameters on function fill');
} else {
ctx.fillRect(this.x, this.y, this.width, this.height);
}
},
drawImage: function (ctx, img) {
if (img === undefined) {
window.console.warn('Missing parameters on function drawImage');
} else {
if (img.width) {
    ctx.drawImage(img, this.x, this.y);
} else {
ctx.strokeRect(this.x, this.y, this.width, this.height);
}
}
}
};
function Scene() {
this.id = scenes.length;
scenes.push(this);
}
Scene.prototype = {
constructor: Scene,
load: function () {},
paint: function (ctx) {},
act: function () {}
};
function loadScene(scene) {
currentScene = scene.id;
scenes[currentScene].load();
}
function random(max) {
return ~~(Math.random() * max);
}
function addHighscore(score) {
posHighscore = 0;
while (highscores[posHighscore] > score && posHighscore < highscores.length) {
posHighscore += 1;
}
highscores.splice(posHighscore, 0, score);
if (highscores.length > 10) {
highscores.length = 10;
}
localStorage.highscores = highscores.join(',');
}
function repaint() {
window.requestAnimationFrame(repaint);
if (scenes.length) {
scenes[currentScene].paint(ctx);
}
}
function run() {
setTimeout(run, 50);
if (scenes.length) {
scenes[currentScene].act();
}
}
function init() {
// Get canvas and context
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
// Load assets
iBody.src = 'assets/body.png';
iFood.src = 'assets/fruit.png';
iFood2.src = 'assets/dolar.png';
aEat.src = 'assets/chomp.oga';
aDie.src = 'assets/dies.oga';
// Create food
food = new Rectangle(80, 80, 10, 10);
food2 = new Rectangle(50, 50, 10, 10);
// Create walls
wall.push(new Rectangle(130, 20, 10, 10));
wall.push(new Rectangle(130, 50, 10, 10));
wall.push(new Rectangle(130, 80, 10, 10));
wall.push(new Rectangle(130, 110, 10, 10));
wall.push(new Rectangle(160, 110, 10, 10));
wall.push(new Rectangle(100, 20, 10, 10));
wall.push(new Rectangle(160, 20, 10, 10));
wall.push(new Rectangle(100, 110, 10, 10));
wall.push(new Rectangle(130, 110, 10, 10));
// Load saved highscores
if (localStorage.highscores) {
    highscores = localStorage.highscores.split(',');
    }
    // Start game
    resize();
    run();
    repaint();
    }
    // Main Scene
    mainScene = new Scene();
    mainScene.paint = function (ctx) {
    // Clean canvas
    ctx.fillStyle = '#030';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw title
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('SNAKE', 150, 60);
    ctx.fillText('Press Enter', 150, 90);
    };
    mainScene.act = function () {
    // Load next scene
    if (lastPress === KEY_ENTER) {
    loadScene(highscoresScene);
    lastPress = null;
    }
    };
    // Game Scene
    gameScene = new Scene();
    gameScene.load = function () {
    score = 0;
    dir = 1;
    body.length = 0;
    body.push(new Rectangle(40, 40, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
    food2.x = random(canvas.width / 10 - 1) * 10;
    food2.y = random(canvas.height / 10 - 1) * 10;
    gameover = false;
    };
    gameScene.paint = function (ctx) {
    var i = 0,
    l = 0;
    // Clean canvas
    ctx.fillStyle = '#030';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw player
    ctx.strokeStyle = '#0f0';
    for (i = 0, l = body.length; i < l; i += 1) {
    body[i].drawImage(ctx, iBody);
    }
    // Draw walls
    ctx.fillStyle = '#999';
    for (i = 0, l = wall.length; i < l; i += 1) {
     wall[i].fill(ctx);
    }
    // Draw new food
    ctx.strokeStyle = '#f00';
    food2.drawImage(ctx, iFood2);
    // Draw food
    ctx.strokeStyle = '#f00';
food.drawImage(ctx, iFood);
// Draw score
ctx.fillStyle = '#fff';
ctx.textAlign = 'left';
ctx.fillText('Score: ' + score, 0, 10);
// Debug last key pressed
//ctx.fillText('Last Press: '+lastPress,0,20);
// Draw pause
if (pause) {
ctx.textAlign = 'center';
if (gameover) {
ctx.fillText('GAME OVER', 150, 75);
} else {
ctx.fillText('PAUSE', 150, 75);
}
}
};
gameScene.act = function () {
var i = 0,
l = 0;
if (!pause) {
// GameOver Reset
if (gameover) {
loadScene(highscoresScene);
}
// Move Body
for (i = body.length - 1; i > 0; i -= 1) {
body[i].x = body[i - 1].x;
body[i].y = body[i - 1].y;
}
// Change Direction
if (lastPress === KEY_UP && dir !== 2) {
dir = 0;
}
if (lastPress === KEY_RIGHT && dir !== 3) {
dir = 1;
}
if (lastPress === KEY_DOWN && dir !== 0) {
dir = 2;
}
if (lastPress === KEY_LEFT && dir !== 1) {
dir = 3;
}
// Move Head
if (dir === 0) {
body[0].y -= 10;
}
if (dir === 1) {
body[0].x += 10;
}
if (dir === 2) {
body[0].y += 10;
}
if (dir === 3) {
body[0].x -= 10;
}
// Out Screen
if (body[0].x > canvas.width - body[0].width) {
body[0].x = 0;
}
if (body[0].y > canvas.height - body[0].height) {
body[0].y = 0;
}
if (body[0].x < 0) {
body[0].x = canvas.width - body[0].width;
}
if (body[0].y < 0) {
body[0].y = canvas.height - body[0].height;
}
// Food Intersects
if (body[0].intersects(food)) {
body.push(new Rectangle(0, 0, 10, 10));
score += 1;
food.x = random(canvas.width / 10 - 1) * 10;
food.y = random(canvas.height / 10 - 1) * 10;
aEat.play();
send()
}
if (body[0].intersects(food2)) {
    score += 1;
    food2.x = random(canvas.width / 10 - 1) * 10;
    food2.y = random(canvas.height / 10 - 1) * 10;
    aEat.play();
    send()
    }
// Wall Intersects
for (i = 0, l = wall.length; i < l; i += 1) {
if (food.intersects(wall[i])) {
food.x = random(canvas.width / 10 - 1) * 10;
 food.y = random(canvas.height / 10 - 1) * 10;
 food2.x = random(canvas.width / 10 - 1) * 10;
 food2.y = random(canvas.height / 10 - 1) * 10;
 }
 if (body[0].intersects(wall[i])) {
 gameover = true;
 pause = true;
}
}
// Body Intersects
for (i = 2, l = body.length; i < l; i += 1) {
if (body[0].intersects(body[i])) {
gameover = true;
pause = true;
aDie.play();
addHighscore(score);
}
}
}
// Pause/Unpause
if (lastPress === KEY_ENTER) {
pause = !pause;
lastPress = null;
}
};
// Highscore Scene
highscoresScene = new Scene();
highscoresScene.paint = function (ctx) {
var i = 0,
l = 0;
// Clean canvas
ctx.fillStyle = '#030';
ctx.fillRect(0, 0, canvas.width, canvas.height);
// Draw title
ctx.fillStyle = '#fff';
ctx.textAlign = 'center';
ctx.fillText('HIGH SCORES', 150, 30);
// Draw high scores
ctx.textAlign = 'right';
for (i = 0, l = highscores.length; i < l; i += 1) {
if (i === posHighscore) {
ctx.fillText('*' + highscores[i], 180, 40 + i * 10);
} else {
ctx.fillText(highscores[i], 180, 40 + i * 10);
}
}};
highscoresScene.act = function () {
// Load next scene
if (lastPress === KEY_ENTER) {
loadScene(gameScene);
lastPress = null;
}
};
function send(score) {
var url = "https://jsonplaceholder.typicode.com/posts";
var data = {Score : score , Name : "player" };

fetch(url, {
  method: 'POST', 
  body: JSON.stringify(data), 
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.then(response => console.log('“Score sent successfully”', response))
.catch(error => console.error('“Error trying to send the score”', error));
}
window.addEventListener('resize', resize, false);

window.addEventListener('load', init, false);
}(window));



/*fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json))*/
/*
  var url = 'https://example.com/profile';
var data = score ;

fetch(url, {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.catch(error => console.error('“Error trying to send the score”', error))
.then(response => console.log('“Score sent successfully”', response));*/