
function setGeometronGlobals(){
	
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

  phi = 0.5*(Math.sqrt(5) + 1);
  unit = 75;
  scaleFactor = 2;
  side = 50;
  thetaStep = Math.PI/2;
  theta0 = -Math.PI/2; 
  theta = theta0;


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
  spellY = 500;
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
}

function doGlyphString(localString){
	var localStringArray = localString.split('~');
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


function doTheThing(localCommand){
    

    //geometric native action commands
    if(localCommand == 0300){
      x = x0;
      y = y0;
      theta = theta0;
      side = unit;
      thetaStep = Math.PI/2;
      scaleFactor = 2;
    }
    if(localCommand == 0304){
      thetaStep = Math.PI/2;
    }
    if(localCommand == 0305){
      thetaStep = 2*Math.PI/5;
    }
    if(localCommand == 0306){
      thetaStep = Math.PI/3;
    }    
    if(localCommand == 0310){
       scaleFactor = Math.sqrt(2); 
    }
    if(localCommand == 0311){
       scaleFactor = phi; //"golden" ratio 
    }
    if(localCommand == 0312){
       scaleFactor = Math.sqrt(3); 
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
      x += side*Math.cos(theta);   
      y += side*Math.sin(theta); 
    }
    if(localCommand == 0331){
      x -= side*Math.cos(theta);   
      y -= side*Math.sin(theta); 
    }
    if(localCommand == 0332){
      x += side*Math.cos(theta - thetaStep);
      y += side*Math.sin(theta - thetaStep);
    }
    if(localCommand == 0333){
      x += side*Math.cos(theta + thetaStep);
      y += side*Math.sin(theta + thetaStep);
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
		ctx.beginPath();
		ctx.arc(x, y, 3, 0, 2 * Math.PI);
		ctx.fill();
    }
    if(localCommand == 0341){
		ctx.beginPath();
		ctx.arc(x, y, side, 0, 2 * Math.PI);
		ctx.stroke();
    }
    if(localCommand == 0342){
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(x,y);
		ctx.lineTo(x + side*Math.cos(theta),y + side*Math.sin(theta));
		ctx.stroke();
    }
    if(localCommand == 0343){
		ctx.beginPath();
		ctx.arc(x, y, side, theta - thetaStep,theta + thetaStep);
		ctx.stroke();
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
//      myImage = get(int(x),int(y),int(side),int(side));
    }
    if(localCommand == 0361){//drop image
  //     image(myImage,x,y,int(side),int(side));
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
    
}