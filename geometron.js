var x = 100;
var y = 100;



function setup() {
  createCanvas(640, 480);

}

function draw() {
background(255);
noFill();

  ellipse(x, y, 50, 50);
}

function keyTyped(){

	if(key === 'f'){
		x += 10;
	}
	if(key === 'd'){
		x -= 10;
	}
	if(key === 'a'){
		y += 10;
	}
	if(key === 's'){
		y -= 10;
	}

}