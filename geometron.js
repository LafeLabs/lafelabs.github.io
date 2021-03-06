var ASCIImode = false;
var backgroundOn = false;
var glyphSpellingOn = false;
var roctalOn = false;
var x,y,x0,y0;
var spellX,spellY;
var roctalX,roctalY,roctalSide,roctalX0,roctalY0;
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
var currentGlyphTable = [];
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
var imageStackStub;

var svgFile = [];


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
  createCanvas(800, 600);
  x0 = 150;
  y0 = 150;
  x = x0;
  y = y0;
  
  roctalX = 0;
  roctalY = 0;
  roctalX0 = 0;
  roctalY0 = 0;
  roctalSide = 16;
  
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
  currentGlyphIndex = 0;
  currentTableIndex = 0;
  currentGlyphAddress = 0;
  imageStackIndex = 3;
  imageStackStub = "https://lafelabs.github.io/geometronfiles/images/";  
//  doTheThing(0362);

//	saveStrings(font,"foo.txt");
	
	rootMagic(0004); //control-d, get manuscript

}

function draw() {
	background(255);
    if(backgroundOn){
		image(baseImage,0,50,width,height*baseImage.height/baseImage.width);
	}
	doTheThing(0300);
    doGlyphString(currentGlyphString);    
    drawCursor();
    if(glyphSpellingOn){
    	spellGlyph(currentGlyphString);
	}
	if(roctalOn){
		spellRoctal(currentGlyphString);
	}
}


function keyPressed(){
	if(keyCode == DOWN_ARROW){
		rootMagic(0015);
	}
	if(keyCode == UP_ARROW){
		rootMagic(0011);
	}
}

function keyTyped(){
	if(key.charCodeAt(0) < 0040){
		rootMagic(key.charCodeAt(0));
	}
	if(key.charCodeAt(0) >= 040 && key.charCodeAt(0) <= 0176){
    	currentGlyphString += key;
	}
	if(key.charAt(0) == '\b' && currentGlyphString.length > 0){
        currentGlyphString = currentGlyphString.substring(0,currentGlyphString.length - 1);
	}

}


function doGlyphString(localString){
	var localStringArray = split(localString,'~');
	for(var q = 0;q < localStringArray.length;q++){	
		localString = localStringArray[q];
		if(q%2 == 0){
			for(var j = 0;j < localString.length;j++){
				doTheThing(key2command(localString.charAt(j)));
			}
		}
		if(q%2 == 1){
			for(var j = 0;j < localString.length;j++){	
				doTheThing(localString.charCodeAt(j));
			}
		}		
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

function writeRoctal(localByte){
	noFill();
	rect(roctalX,roctalY,roctalSide,roctalSide);
	fill(0);
	noStroke();
	rect(roctalX,roctalY,roctalSide/8,roctalSide/8);	
	rect(roctalX + roctalSide/8,roctalY + roctalSide/8,roctalSide/8,roctalSide/8);	
	for(var bitIndex = 0;bitIndex < 9;bitIndex++){
		if((localByte >> (8 - bitIndex)) & 1 == 1){
			fill(0);	
		} 
		else{
			fill(255);
		}
		rect(roctalX + (1 + (bitIndex%3))*roctalSide/4,roctalY + (1 + floor(bitIndex/3))*roctalSide/4,roctalSide/4,roctalSide/4);
	}
	noFill();
	stroke(0);
}

function spellRoctal(localGlyphString){
    theta = theta0;
    thetaStep = PI/2;
    scaleFactor = 2;
	roctalX = roctalX0;
	roctalY = roctalY0;
    var splitGlyphStringArray = split(localGlyphString,'~');
	for(var q = 0;q <splitGlyphStringArray.length;q++){
  		localGlyphString = splitGlyphStringArray[q];
  		if(q%2 == 0){
  			for(var k = 0;k < localGlyphString.length;k++){
  				writeRoctal(key2command(localGlyphString.charAt(k)));
  				  		roctalX += roctalSide;

  			}
  		}
  		if(q%2 == 1){
  			for(var k = 0;k < localGlyphString.length;k++){
  				writeRoctal(localGlyphString.charCodeAt(k));
  				  		roctalX += roctalSide;

  			}  		
  		}
  	}
}


function spellGlyph(localGlyphString){

      theta = theta0;
      thetaStep = PI/2;
      scaleFactor = 2;

  x = spellX;
  y = spellY;
  
  var tempInt = side;
  side = spellSide;

  var splitGlyphStringArray = split(localGlyphString,'~');

for(var q = 0;q <splitGlyphStringArray.length;q++){
  localGlyphString = splitGlyphStringArray[q];
  if(q%2 ==0){
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
  text(localGlyphString.charAt(k),x - 0.7*spellSide,y + 0.6*spellSide);
  noFill();
    if(x > width - 20){
      x = spellX;
      y += 2*spellSide;
    }
  }
 
  }
  x += spellSide;
}
 side = tempInt;
}

function rootMagic(localCommand){
	if(localCommand == 0001){ //shape actions
		currentTableIndex = 0;
        var localStringArray = split(shapeActions[currentTableIndex],':');
        var localString = localStringArray[1];  
        currentGlyphAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        currentGlyphString = "";
       for(var index = 0;index < localString.length;index++){
          currentGlyphString += localString.charAt(index);
        }  
        tableMode = 0001;
        currentGlyphTable = shapeActions; 
	}
	if(localCommand == 0002){ //shape symbols
		currentTableIndex = 0;
        var localStringArray = split(shapeSymbols[currentTableIndex],':');
        var localString = localStringArray[1];  
        currentGlyphAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        currentGlyphString = "";
       for(var index = 0;index < localString.length;index++){
          currentGlyphString += localString.charAt(index);
        }  
        tableMode = 0002;
        currentGlyphTable = shapeSymbols; 
	}
	if(localCommand == 0003){ //command glyph symbols
		currentTableIndex = 0;
        var localStringArray = split(commandSymbolGlyphTable[currentTableIndex],':');
        var localString = localStringArray[1];  
        currentGlyphAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        currentGlyphString = "";
       for(var index = 0;index < localString.length;index++){
          currentGlyphString += localString.charAt(index);
        }  
        tableMode = 0002;
        currentGlyphTable = commandSymbolGlyphTable; 
	}

	if(localCommand == 0004){ //manuscript actions
		currentTableIndex = 0;
        var localStringArray = split(manuscriptActions[currentTableIndex],':');
        var localString = localStringArray[1];  
        currentGlyphAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        currentGlyphString = "";
       for(var index = 0;index < localString.length;index++){
          currentGlyphString += localString.charAt(index);
        }  
        tableMode = 0004;
        currentGlyphTable = manuscriptActions; 
	}
	if(localCommand == 0006){//font
		currentTableIndex = 0;
        var localStringArray = split(font[currentTableIndex],':');
        var localString = localStringArray[1];  
        currentGlyphAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        currentGlyphString = "";
       for(var index = 0;index < localString.length;index++){
          currentGlyphString += localString.charAt(index);
        }  
        tableMode = 0006;
        currentGlyphTable = font; 
	}
	
	 if(localCommand == 7){//control-g, toggle spelling on/off
     	glyphSpellingOn = !glyphSpellingOn;
	 }
	if(localCommand == 0011){
	  var localOctalAddress = "0";
      localOctalAddress += str(currentGlyphAddress >> 6);
      localOctalAddress += str((currentGlyphAddress >> 3)&7);
      localOctalAddress += str((currentGlyphAddress)&7);
	  currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
	  currentTableIndex--;
	  if(currentTableIndex < 0){
        currentTableIndex = currentGlyphTable.length - 1;
      }
        var localStringArray = split(currentGlyphTable[currentTableIndex],':');
        var localString = localStringArray[1];  
        if(localStringArray.length == 3){
           baseImage = loadImage(imageStackStub + localStringArray[2]);
           backgroundOn = true;
        }
        else{
          backgroundOn = false;
        }

        currentGlyphAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        currentGlyphString = "";
        for(var index = 0;index < localString.length;index++){
          currentGlyphString += localString.charAt(index);
        }
	}
	if(localCommand == 0015){
	  var localOctalAddress = "0";
      localOctalAddress += str(currentGlyphAddress >> 6);
      localOctalAddress += str((currentGlyphAddress >> 3)&7);
      localOctalAddress += str((currentGlyphAddress)&7);
	  currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
	  currentTableIndex++;
	  if(currentTableIndex == currentGlyphTable.length){
        currentTableIndex = 0;
      }
        var localStringArray = split(currentGlyphTable[currentTableIndex],':');
        var localString = localStringArray[1];  
        if(localStringArray.length == 3){
           baseImage = loadImage(imageStackStub + localStringArray[2]);
           backgroundOn = true;
        }
        else{
          backgroundOn = false;
        }
        currentGlyphAddress = (int(localStringArray[0].charCodeAt(1))- 060)*64 + (int(localStringArray[0].charCodeAt(2))  - 060)*8 + int(localStringArray[0].charCodeAt(3)) - 060;        
        currentGlyphString = "";
        for(var index = 0;index < localString.length;index++){
          currentGlyphString += localString.charAt(index);
        }
     	   
	}
	if(localCommand == 0020){
		var localImage;
		localImage = get(0,0,width,height);
    localImage.save();

	}
	if(localCommand == 0022){//ctrl-R roctal on/off
		roctalOn = !roctalOn;
	}
	if(localCommand == 0023){//ctrl-S  save
	  var localOctalAddress = "0";
      localOctalAddress += str(currentGlyphAddress >> 6);
      localOctalAddress += str((currentGlyphAddress >> 3)&7);
      localOctalAddress += str((currentGlyphAddress)&7);
		currentGlyphTable[currentGlyphIndex] = localOctalAddress + ":" + currentGlyphString;
		saveStrings(currentGlyphTable,"glyph.txt");
	}
	
	
	
	if(localCommand == 031){ ////031 = 25 = control-y:toggle background image on/off
     	backgroundOn = !backgroundOn;
    }

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
       var localImageLocation = imageFeed[imageStackIndex];
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