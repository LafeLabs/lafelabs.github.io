var ASCIImode = false;
var backgroundOn = false;
var glyphSpellingOn = true;
var x,y,x0,y0;
var spellX,spellY;
var spellSide;
var textSide;
var textX,textY;
var side;
var scaleFactor, unit;
var theta,theta0,thetaStep;
var currentGlyphIndex = 0;
var currentTableIndex = 0;
var currentGlyphAddress = 0;
var triangleX,triangleY,squareX,squareY,pentagonX,pentagonY,hexagonX,hexagonY;

var tableMode = 4;  
//1: font
//2: shape symbols
//16(0020): shape actions
//3: command symbols
//4: manuscript actions 
//5: manuscript symbols

var phi;
var currentGlyphString = "";


//"~" is 0176 in octal and switches between ASCIImode true and false, should not go here
var keyRow0 = [];
var keyAddressRow0 = [];
var keyRow1 = [];
var keyAddressRow1 = [];
var keyRow2 = [];
var keyAddressRow2 = [];
var keyRow3 = [];
var keyAddressRow3 = [];
var keyRow4 = [];
var keyAddressRow4 = [];


var font = []; //mode 1
var shapeSymbols = []; //mode 2
var shapeActions = []; //mode 16
var commandSymbolGlyphTable = []; //mode 3
var manuscriptActions = []; //mode 4
var backgroundFileTable = [];
var backgroundIndex = 0;
var baseImage;
var manuscriptPageindex = 0;
var currentPageAddress;
var currentPageText;
var currentPageAction;
var currentImageLocation;
var imageFeed = [];
var imageStack = [];
var imageStackIndex;

function preload(){
	//http://pastebin.com/raw/istthY6r   = font.txt
	commandSymbolGlyphTable = loadStrings('https://lafelabs.github.io/geometronfiles/text/commandSymbolGlyphTable.txt');
	font = loadStrings('https://lafelabs.github.io/geometronfiles/text/font.txt');
	//font = loadStrings('http://pastebin.com/raw/istthY6r');
	shapeSymbols = loadStrings('https://lafelabs.github.io/geometronfiles/text/shapeSymbols.txt');
	shapeActions = loadStrings('https://lafelabs.github.io/geometronfiles/text/shapeActions.txt');
	manuscriptActions = loadStrings('https://lafelabs.github.io/geometronfiles/text/manuscriptActions.txt');	
	backgroundFileTable = loadStrings("https://lafelabs.github.io/geometronfiles/text/backgroundTable.txt");

	imageFeed = loadStrings("https://lafelabs.github.io/geometronfiles/text/imageFeed.txt");
	imageStack = loadStrings("https://lafelabs.github.io/geometronfiles/text/imageStack.txt");

	baseImage = loadImage("https://lafelabs.github.io/geometronfiles/images/masterKeyboard.png");
}


function setup() {

  keyRow0 = ['1','2','3','7','0','-','='];
  keyAddressRow0 = [0304,0305,0306,0317,0300,0336,0337];
  keyRow1 = ['q','w','e','r','t','u','i','o','p'];
  keyAddressRow1 = [0310,0311,0312,0313,0314,0370,0371,0360,0361];
  keyRow2 = ['a','s','d','f','g','h','j','k','l',';'];
  keyAddressRow2 = [0330,0331,0332,0333,0334,0335,0350,0351,0352,0353];
  keyRow3 = ['z','x','c','v'];
  keyAddressRow3 = [0340,0341,0342,0343];
  keyRow4 = ['!','@','#','$','%','^','&','*','Q','W','E','R','T','Y','U','I'];
  keyAddressRow4 = [0200,0201,0202,0203,0204,0205,0206,0207,0210,0211,0212,0213,0214,0215,0216,0217];

  phi = 0.5*(sqrt(5) + 1);
  ellipseMode(CENTER);
  noFill();
  strokeWeight(1);
  unit = 75;
  scaleFactor = 2;
  side = 50;
  thetaStep = PI/2;
  theta0 = -PI/2; 
  theta = theta0;
  createCanvas(900, 900);
  x0 = 250;
  y0 = 250;
  x = x0;
  y = y0;
  
  spellX = 10;
  spellY = height - 100;
  spellSide = 20;
  textSide = 40;
  textX = 2*textSide;
  textY = 2*textSide;

  triangleX = x0;
  triangleY = y0;
  squareX = x0;
  squareY = y0;
  pentagonX = x0;
  pentagonY = y0;
  hexagonX = x0;
  hexagonY = y0;
  noFill();
  currentPageAddress = "";
  currentGlyphString = "0";
  manuscriptPageindex = 0;
  currentPageText = "";
  currentImageLocation = "https://lafelabs.github.io/geometronfiles/images/masterKeyboard.png";

  imageStackIndex = 0;  
 // doTheThing(0362);
  loadManuscriptPage();
  doTheThing(0362);


//  currentGlyphString =   "=2w=cjh-caggcgggg-cahhcg-cahhcg-cahhcg-cahhcg-cahhcg-cahhcg-c-ca";
}

function draw() {
	ASCIImode = false;
	background(255);
	image(baseImage,0,50,width,height);
	doTheThing(0300);
    doGlyphString(currentGlyphString);    
    drawCursor();
	spellGlyph(currentGlyphString);
}

function keyTyped(){
	if(key.charCodeAt(0) >= 040 && key.charCodeAt(0) <= 0176){
    	currentGlyphString += key;
	}
	if(key.charAt(0) == '\b' && currentGlyphString.length > 0){
        currentGlyphString = currentGlyphString.substring(0,currentGlyphString.length - 1);
	}

}

function mouseClicked(){
	if(mouseY > height - 50){
		manuscriptPageindex++;
		if(manuscriptPageindex == manuscriptActions.length){
			manuscriptPageindex = 0;
		}
	}
	if(mouseY < 50){
		manuscriptPageindex--;
		if(manuscriptPageindex < 0){
			manuscriptPageindex = manuscriptActions.length-1;
		}
	}
  loadManuscriptPage();
}

function loadManuscriptPage(){
	var localStringArray = split(manuscriptActions[manuscriptPageindex],':');
    print(localStringArray.length);

	currentPageAddress = localStringArray[0];
	currentPageAction = "0" + localStringArray[1];	
	if(localStringArray.length > 2){
		currentPageText = localStringArray[2];
	}
	if(localStringArray.length > 3){
		currentImageLocation = "https://lafelabs.github.io/geometronfiles/images/" + localStringArray[3];
		baseImage = loadImage(currentImageLocation);
		print(currentImageLocation);
	}

}

function printString(localString){
	var localSide = side;
	side = textSide;
	for(var j = 0;j < localString.length;j++){	
		doTheThing(localString.charCodeAt(j));
	}
	side = localSide;
}

function doGlyphString(localString){
	for(var j = 0;j < localString.length;j++){
		var localCommand = key2command(localString.charAt(j));
		doTheThing(key2command(localString.charAt(j)));
	}
}

function key2command(localChar){
    for(var i = 0;i<keyRow0.length;i++){
    	if(localChar === keyRow0[i]){
    		return(keyAddressRow0[i]);
    	}
    }

	for(var i = 0;i<keyRow1.length;i++){
    	if(localChar === keyRow1[i]){
    		return(keyAddressRow1[i]);
    	}
    }
	for(var i = 0;i<keyRow2.length;i++){
    	if(localChar === keyRow2[i]){
    		return(keyAddressRow2[i]);
    	}
    }
	for(var i = 0;i<keyRow3.length;i++){
    	if(localChar === keyRow3[i]){
    		return(keyAddressRow3[i]);
    	}
    }
	for(var i = 0;i<keyRow4.length;i++){
    	if(localChar === keyRow4[i]){
    		return(keyAddressRow4[i]);
    	}
    }
    	
}

function drawCursor(){
  stroke(color(255,0,0));
  line(x,y,x + scaleFactor*side*cos(theta),y+scaleFactor*side*sin(theta));
  strokeWeight(3);
  stroke(0);
  line(x,y,x + side*cos(theta),y + side*sin(theta));
  stroke(color(0,0,255));
  strokeWeight(4);
  line(x,y,x + (side/scaleFactor)*cos(theta),y+(side/scaleFactor)*sin(theta));
  strokeWeight(1);
  stroke(0);
  line(x,y,x + side*cos(theta + thetaStep),y+side*sin(theta + thetaStep));
  line(x,y,x + side*cos(theta - thetaStep),y+side*sin(theta - thetaStep));
  rect(x,y,side,side);
}


function spellGlyph(localGlyphString){

      theta = theta0;
      thetaStep = PI/2;
      scaleFactor = 2;

  x = spellX;
  y = spellY;
  
  var tempInt = side;
  side = spellSide;

  for(var k = 0;k < localGlyphString.length;k++){
     for(var l = 0;l <  commandSymbolGlyphTable.length; l++){
        var localStringArray = split(commandSymbolGlyphTable[l],':');
        var localString = localStringArray[1];  
        var tempAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        if(tempAddress == key2command(localGlyphString.charAt(k))){
           doGlyphString(localString); 
        } 
     }
  textSize(12);
  fill(0);
  text(currentGlyphString.charAt(k),x - 0.7*spellSide,y + 0.6*spellSide);
  noFill();


    if(x > width - 20){
      x = spellX;
      y += 2*spellSide;
    }
  }

  side = tempInt;

}


function doTheThing(localCommand){
    
    if(localCommand >= 0040 && localCommand < 0176){  //printable ASCII from space thru ~
      for(var searchIndex = 0;searchIndex <  font.length; searchIndex++){
        var localStringArray = split(font[searchIndex],':');
        var localString = localStringArray[1];  
        var tempAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        if(tempAddress == localCommand){
           doGlyphString(localString);
        }
     }     
    }
    
    if(localCommand >= 0200 && localCommand < 0277){//shapes
      for(var searchIndex = 0;searchIndex <  shapeActions.length; searchIndex++){
        var localStringArray = split(shapeActions[searchIndex],':');
        var localString = localStringArray[1];  
        var tempAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        if(tempAddress == localCommand){
           doGlyphString(localString);
        }
     }
    }
    
    //geometric native action commands
    if(localCommand == 0300){
      x = x0;
      y = y0;
      theta = theta0;
      side = unit;
      thetaStep = PI/2;
      scaleFactor = 2;
    }
    if(localCommand == 0304){
      thetaStep = PI/2;
    }
    if(localCommand == 0305){
      thetaStep = 2*PI/5;
    }
    if(localCommand == 0306){
      thetaStep = PI/3;
    }    
    if(localCommand == 0310){
       scaleFactor = sqrt(2); 
    }
    if(localCommand == 0311){
       scaleFactor = phi; //"golden" ratio 
    }
    if(localCommand == 0312){
       scaleFactor = sqrt(3); 
    }
    if(localCommand == 0313){
      scaleFactor = 2;  //2x
    }
    if(localCommand == 0314){
      scaleFactor = 3;  //3x
    }
    if(localCommand == 0317){
       side = unit; 
    }
    
    if(localCommand == 0330){
      x += side*cos(theta);   
      y += side*sin(theta); 
    }
    if(localCommand == 0331){
      x -= side*cos(theta);   
      y -= side*sin(theta); 
    }
    if(localCommand == 0332){
      x += side*cos(theta - thetaStep);
      y += side*sin(theta - thetaStep);
    }
    if(localCommand == 0333){
      x += side*cos(theta + thetaStep);
      y += side*sin(theta + thetaStep);
    }
    if(localCommand == 0334){
      theta -= thetaStep; // CCW
    }
    if(localCommand == 0335){
      theta += thetaStep; // CW
    }
    if(localCommand == 0336){
      side /= scaleFactor; // -
    }
    if(localCommand == 0337){
      side *= scaleFactor; // +
    }
    if(localCommand == 0340){
      strokeWeight(5);
      point(x,y);
      strokeWeight(1);//point
    }
    if(localCommand == 0341){
      ellipse(x,y,2*side,2*side);//circle
    }
    if(localCommand == 0342){
      line(x,y,x + side*cos(theta),y + side*sin(theta));//line
    }
    if(localCommand == 0343){
        arc(x,y,2*side,2*side,theta - thetaStep,theta + thetaStep);//arc
    }
    if(localCommand == 0350){
      thetaStep /= 2;  //angle/2
    }
    if(localCommand == 0351){
      thetaStep *= 2;  //2angle
    }
    if(localCommand == 0352){
      thetaStep /= 3; //angle/3
    }
    if(localCommand == 0353){
      thetaStep *= 3; //3angle
    }
    if(localCommand == 0360){//grab image
      myImage = get(int(x),int(y),int(side),int(side));
    }
    if(localCommand == 0361){//drop image
       image(myImage,x,y,int(side),int(side));
    }
    if(localCommand == 0362){
       var localImageLocation = imageStack[imageStackIndex];
       baseImage = loadImage(localImageLocation);
              
    }
    if(localCommand == 0370){ //drop triangle marker
        triangleX = x;
        triangleY =y;
    }
    if(localCommand == 0371){//go to triangle marker
        x = triangleX;
        y = triangleY;
    }
    if(localCommand == 0372){//drop square marker
        squareX = x;
        squareY = y;
    }
    if(localCommand == 0373){//go to square marker
        x = squareX;
        y = squareY;
    }
    if(localCommand == 0374){//drop pentagon marker
        pentagonX = x;
        pentagonY = y;
    }
    if(localCommand == 0375){//go to pentagon marker
        x = pentagonX;
        y = pentagonY;
    }
    if(localCommand == 0376){//drop hexagon marker
        hexagonX = x;
        hexagonY = y;
    }
    if(localCommand == 0377){//go to hexagon marker
        x = hexagonX;
        y = hexagonY;
    }
    
        if(x > width){
      x=0;
    }
    if(x<0){
       x = width; 
    }
    if(y>height){
      y=0;
    }
    if(y<0){
      y = height;
    }

}