function keystring2command(localKeyString){//from a key sequence to a command address seq.
  
  var localCommandString = "";
  for(var glyphIndex = 0;glyphIndex < localKeyString.length;glyphIndex++){
  	for(var keyIndex = 0;keyIndex < keyStringFull.length;keyIndex++){
  		if(localKeyString.charAt(glyphIndex)==keyStringFull.charAt(keyIndex)){
  			localCommandString += addressStringArray[keyIndex] + ",";
  		}
  	}
  }  
  return localCommandString.substring(0,localCommandString.length - 1);	//remove commma at end
}


function initGeometron(){
  var img = new Image();
  imageIndex = 07;
	
  keyStringFull = "1234567890";
  addressStringFull = "0304,0305,0306,0310,0311,0312,0313,0314,0223,0300,";
  keyStringFull += "qwertyuiop";
  addressStringFull += "0200,0210,0211,0214,0212,0215,0216,0217,0220,0221,";
  keyStringFull += "asdfghjkl;";
  addressStringFull += "0330,0331,0332,0333,0334,0335,0336,0337,0350,0351,";
  keyStringFull += "zxcvbnm,./";
  addressStringFull += "0340,0341,0342,0343,0362,0224,0225,0222,0352,0353";
  addressStringArray = addressStringFull.split(",");
  
  inPath = false;//move to true after path started, back to false after path ended
  svgFile = [];

  editAddress = 0400;
  tableBottom = 0400;
  tableTop = 0407;

  editGlyph = "0300";
  cursorPosition = 1;
  loadTable();	
  
  
  for(var index = 0;index < currentTable.length;index++){
		var localArray = currentTable[index].split(':');
		if(parseInt(localArray[0],8) == editAddress){
			editGlyph = localArray[1];
		}
   }

  
  phi = 0.5*(Math.sqrt(5) + 1);
  unit = 50;
  scaleFactor = 2;
  side = unit;
  thetaStep = Math.PI/2;
  theta0 = -Math.PI/2; 
  theta = theta0;
  x0 = 250;
  y0 = 250;
  x = x0;
  y = y0;
  triangleX = x0;
  triangleY = y0;
  squareX = x0;
  squareY = y0;
  pentagonX = x0;
  pentagonY = y0;
  hexagonX = x0;
  hexagonY = y0;
  backgroundImageOn = false;	
  doTheThing(0500);
}


function updateGlyphs(){
	for(var index = 0;index < currentTable.length;index++){
		var localArray = currentTable.split(':');
		if(parseInt(localArray[0],8) == editAddress){
			editGlyph = localArray[1];
		}
	}

}


	 
function rootMagic(localCommand){
	if(localCommand == 0010){
		backgroundImageOn = !backgroundImageOn;
		redraw();	
	}
	if(localCommand == 0011){//move to next image
		imageIndex++;
		if(imageIndex >= imageTable.length){
			imageIndex = 0;
		}
		doTheThing(0500 + imageIndex);
		redraw();
	}
	if(localCommand == 0012){//move to prev image
		imageIndex--;
		if(imageIndex < 0){
			imageIndex = imageTable.length - 1;
		}
		doTheThing(0500 + imageIndex);
		redraw();
	}
	if(localCommand == 0013){
	    
	    for(var index = 0;index < currentTable.length;index++){
			var localArray = currentTable[index].split(':');
			if(parseInt(localArray[0],8) == editAddress){
				currentTable[index] = "0" + editAddress.toString(8) + ":" + editGlyph;
			}
   		}
	
		editAddress++;
		if(editAddress > tableTop){
			editAddress = tableBottom;
		}
		for(var index = 0;index < currentTable.length;index++){
			var localArray = currentTable[index].split(':');
			if(parseInt(localArray[0],8) == editAddress){
				editGlyph = localArray[1];
			}
   		}

		redraw();
	}
	if(localCommand == 0014){
		for(var index = 0;index < currentTable.length;index++){
			var localArray = currentTable[index].split(':');
			if(parseInt(localArray[0],8) == editAddress){
				currentTable[index] = "0" + editAddress.toString(8) + ":" + editGlyph;
			}
   		}

		editAddress--;
		if(editAddress < tableBottom){
			editAddress = tableTop;
		}
		for(var index = 0;index < currentTable.length;index++){
			var localArray = currentTable[index].split(':');
			if(parseInt(localArray[0],8) == editAddress){
				editGlyph = localArray[1];
			}
   		}
		redraw();
	}
	
}


function drawGlyph(localString){
	var tempArray = localString.split(',');
	for(var index = 0;index < tempArray.length;index++){
		doTheThing(parseInt(tempArray[index],8));
	}
}

function spellGlyph(localString){
	var tempArray = localString.split(',');
	for(var index = 0;index < tempArray.length;index++){
		doTheThing(parseInt(tempArray[index],8) + 01000);
	}
}


function getImage(localCommand){	
	for(var localIndex = 0;localIndex < imageTable.length;localIndex++){
		var tempArray  = imageTable[localIndex].split(':');
			if(parseInt(tempArray[0],8) == localCommand){
				currentImageWidth = tempArray[1];
				currentImageHeight = tempArray[2];
			    currentImageURL = imageURLbase + tempArray[3];
			}
	}
}


function doTheThing(localCommand){
    if(localCommand >= 0500 && localCommand <= 0600){
    	getImage(localCommand);    
    }
    
    
    if(localCommand >= 0040 && localCommand <= 0277){//and fonts
		 for(var symbolSearchIndex = 0;symbolSearchIndex < currentTable.length;symbolSearchIndex++){
    		var tempSymbolLocalArray = currentTable[symbolSearchIndex].split(":");
    		if(parseInt(tempSymbolLocalArray[0],8) == localCommand){
    			drawGlyph(tempSymbolLocalArray[1]);
    		}
    	}    
    }
    
    if(localCommand > 01000){
    	for(var symbolSearchIndex = 0;symbolSearchIndex < currentTable.length;symbolSearchIndex++){
    		var tempSymbolLocalArray = currentTable[symbolSearchIndex].split(":");
    		if(parseInt(tempSymbolLocalArray[0],8) == localCommand){
    			drawGlyph(tempSymbolLocalArray[1]);
    		}
    	}
    }
    
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
    if(localCommand == 0340){  //point
		ctx.beginPath();
		ctx.arc(x, y, 3, 0, 2 * Math.PI);
		ctx.fill();	
	    
	    
	    if(inPath){  //if we're in a path it's over now				
			svgFile.push("\"");
			svgFile.push("style=\"stroke:black;stroke-width:2\" fill=\"none\" />");
			inPath = false;
		}
	    localString = "  <circle cx=\"";
        localString += x.toString();
        localString += "\" cy=\"";
        localString += y.toString();
        localString += "\" r=\"4\" stroke=\"black\" stroke-width=\"3\" fill=\"black\" />";
	    svgFile.push(localString);     
	       inPath = false;
    }
    if(localCommand == 0341){  //circle
		ctx.beginPath();
		ctx.arc(x, y, side, 0, 2 * Math.PI);
		ctx.stroke();
		
		
		if(inPath){  //if we're in a path it's over now			
			svgFile.push("\"");
			svgFile.push("style=\"stroke:black;stroke-width:2\" fill=\"none\" />");
			inPath = false;
		}
		localString = "  <circle cx=\"";
        localString += x.toString();
        localString += "\" cy=\"";
        localString += y.toString();
        localString += "\" r=\"";
        localString += side.toString();    
        localString += "\" stroke=\"black\" stroke-width=\"3\" fill=\"none\" />";
	    svgFile.push(localString);     
	    
   inPath = false;
    }
    if(localCommand == 0342){   //line
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(x,y);
		ctx.lineTo(x + side*Math.cos(theta),y + side*Math.sin(theta));
		ctx.stroke();
		
		localString = "";
		if(!inPath){
			localString += "  <path d=\"";	
			inPath = true;
		}
		localString += "M"
		localString += x.toString();
		localString += " ";
		localString += y.toString();
		localString += " L"
		localInt = x + side*Math.cos(theta);
		localString += localInt.toString();
		localString += " ";
		localInt = y + side*Math.sin(theta);
		localString += localInt.toString();
		svgFile.push(localString);
    }
    if(localCommand == 0343){
		ctx.beginPath();
		ctx.arc(x, y, side, theta - thetaStep,theta + thetaStep);
		ctx.stroke();
		
		localString = "";
		if(!inPath){
			localString += "  <path d=\"";	
			inPath = true;
		}
		localString += "M";
		localInt = x + side*Math.cos(theta - thetaStep);
		localString += localInt.toString();
		localString += " ";
		localInt = y + side*Math.sin(theta - thetaStep);
		localString += localInt.toString();

		svgFile.push(localString);
		localString = "           A" + side.toString() + " " + side.toString() + " 0 0 1 ";
		localInt = x + side*Math.cos(theta + thetaStep);
		localString += localInt.toString() + " ";
		localInt = y + side*Math.sin(theta + thetaStep);
		localString += localInt.toString() + " ";
		svgFile.push(localString);
        
    }
    if(localCommand == 0344){
		ctx.beginPath();
		ctx.moveTo(x +side*Math.cos(theta - thetaStep),y +side*Math.sin(theta - thetaStep));
		ctx.quadraticCurveTo(x +side*Math.cos(theta - thetaStep) + scaleFactor*side*Math.cos(theta),y +side*Math.sin(theta - thetaStep)+scaleFactor*side*Math.sin(theta),x + scaleFactor*side*Math.cos(theta),y + scaleFactor*side*Math.sin(theta));
		ctx.stroke();
		
		localString = "";
		if(!inPath){
			localString += "  <path d=\"";
			inPath = true;	
		}
		localString += "M";
		localInt = x + side*Math.cos(theta - thetaStep);
		localString += localInt.toString();
		localString += " ";
		localInt = y + side*Math.sin(theta - thetaStep);
		localString += localInt.toString();
		svgFile.push(localString);
		localInt1 = x +side*Math.cos(theta - thetaStep) + scaleFactor*side*Math.cos(theta);
		localInt2 = y +side*Math.sin(theta - thetaStep) + scaleFactor*side*Math.sin(theta);		
		localString = "           Q" + localInt1.toString() + " " + localInt2.toString() + " ";
		localInt = x + scaleFactor*side*Math.cos(theta);
		localString += localInt.toString() + " ";
		localInt = y + scaleFactor*side*Math.sin(theta);
		localString += localInt.toString();
		svgFile.push(localString);

    }
    if(localCommand == 0345){
		ctx.beginPath();
		ctx.moveTo(x +side*Math.cos(theta + thetaStep),y +side*Math.sin(theta + thetaStep));
		ctx.quadraticCurveTo(x +side*Math.cos(theta + thetaStep) + scaleFactor*side*Math.cos(theta),y +side*Math.sin(theta + thetaStep)+scaleFactor*side*Math.sin(theta),x + scaleFactor*side*Math.cos(theta),y + scaleFactor*side*Math.sin(theta));
		ctx.stroke();
		
		localString = "";
		if(!inPath){
			localString += "  <path d=\"";	
			inPath = true;
		}
		localString += "M";
		localInt = x + side*Math.cos(theta + thetaStep);
		localString += localInt.toString();
		localString += " ";
		localInt = y + side*Math.sin(theta + thetaStep);
		localString += localInt.toString();
		svgFile.push(localString);
		localInt1 = x +side*Math.cos(theta + thetaStep) + scaleFactor*side*Math.cos(theta);
		localInt2 = y +side*Math.sin(theta + thetaStep) + scaleFactor*side*Math.sin(theta);		
		localString = "           Q" + localInt1.toString() + " " + localInt2.toString() + " ";
		localInt = x + scaleFactor*side*Math.cos(theta);
		localString += localInt.toString() + " ";
		localInt = y + scaleFactor*side*Math.sin(theta);
		localString += localInt.toString();
		svgFile.push(localString);
    }
        if(localCommand == 0346){
		ctx.beginPath();
		ctx.moveTo(x + side*(1/scaleFactor)*Math.cos(theta - thetaStep),y +side*(1/scaleFactor)*Math.sin(theta - thetaStep));
		ctx.quadraticCurveTo(x +side*(1/scaleFactor)*Math.cos(theta - thetaStep) + scaleFactor*side*Math.cos(theta),y +side*(1/scaleFactor)*Math.sin(theta - thetaStep)+scaleFactor*side*Math.sin(theta),x + scaleFactor*side*Math.cos(theta),y + scaleFactor*side*Math.sin(theta));
		ctx.stroke();
		
		localString = "";
		if(!inPath){
			localString += "  <path d=\"";	
			inPath = true;
		}
		localString += "M";
		localInt = x + side*(1/scaleFactor)*Math.cos(theta - thetaStep);
		localString += localInt.toString();
		localString += " ";
		localInt = y + side*(1/scaleFactor)*Math.sin(theta - thetaStep);
		localString += localInt.toString();
		svgFile.push(localString);
		localInt1 = x +side*(1/scaleFactor)*Math.cos(theta - thetaStep) + scaleFactor*side*Math.cos(theta);
		localInt2 = y +side*(1/scaleFactor)*Math.sin(theta - thetaStep) + scaleFactor*side*Math.sin(theta);		
		localString = "           Q" + localInt1.toString() + " " + localInt2.toString() + " ";
		localInt = x + scaleFactor*side*Math.cos(theta);
		localString += localInt.toString() + " ";
		localInt = y + scaleFactor*side*Math.sin(theta);
		localString += localInt.toString();
		svgFile.push(localString);

    }
    if(localCommand == 0347){
		ctx.beginPath();
		ctx.moveTo(x +side*(1/scaleFactor)*Math.cos(theta + thetaStep),y +side*(1/scaleFactor)*Math.sin(theta + thetaStep));
		ctx.quadraticCurveTo(x +side*(1/scaleFactor)*Math.cos(theta + thetaStep) + scaleFactor*side*Math.cos(theta),y +side*(1/scaleFactor)*Math.sin(theta + thetaStep)+scaleFactor*side*Math.sin(theta),x + scaleFactor*side*Math.cos(theta),y + scaleFactor*side*Math.sin(theta));
		ctx.stroke();
		localString = "";
		if(!inPath){
			localString += "  <path d=\"";	
			inPath = true;
		}
		localString += "M";
		localInt = x + side*(1/scaleFactor)*Math.cos(theta + thetaStep);
		localString += localInt.toString();
		localString += " ";
		localInt = y + side*(1/scaleFactor)*Math.sin(theta + thetaStep);
		localString += localInt.toString();
		svgFile.push(localString);
		localInt1 = x +side*(1/scaleFactor)*Math.cos(theta + thetaStep) + scaleFactor*side*Math.cos(theta);
		localInt2 = y +side*(1/scaleFactor)*Math.sin(theta + thetaStep) + scaleFactor*side*Math.sin(theta);		
		localString = "           Q" + localInt1.toString() + " " + localInt2.toString() + " ";
		localInt = x + scaleFactor*side*Math.cos(theta);
		localString += localInt.toString() + " ";
		localInt = y + scaleFactor*side*Math.sin(theta);
		localString += localInt.toString();
		svgFile.push(localString);

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
    if(localCommand == 0362){//turn background image on
       backgroundImageOn = true;
    }
    if(localCommand == 0363){//turn background image off
       backgroundImageOn = false; 
    }
    if(localCommand == 0364){//move to next background image
              
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



function loadTable(){


		imageURLbase = "geometronfiles/images/"
        imageTable= [];
        imageTable.push("0500:588:581:airelemental.png");
        imageTable.push("0501:400:1133:crystalCityMap.png");
        imageTable.push("0502:531:492:cursor1.png");
        imageTable.push("0503:458:391:frontcover.png");
        imageTable.push("0504:567:481:intro1.png");
        imageTable.push("0505:855:633:longbridgepark.png");
        imageTable.push("0506:454:442:rootsof1.png");
        imageTable.push("0507:498:338:sky.png");
        imageTable.push("0510:293:424:alaskabeach.png");
        imageTable.push("0511:987:584:thePentagon.png");
        imageTable.push("0512:800:800:dime.png");
        imageTable.push("0513:1314:600:dcmap1.png");


     currentTable = [];
    currentTable.push("0040:0333");
    currentTable.push("0041:0333,0336,0336,0332,0332,0332,0330,0336,0331,0336,0341,0330,0330,0330,0337,0337,0337,0342,0336,0336,0336,0331,0331,0331,0331,0331,0337,0337,0333,0337,0337");
    currentTable.push("0042:0333,0330,0336,0332,0336,0332,0331,0342,0333,0342,0333,0330,0337,0337,0331");
    currentTable.push("0043:0333,0336,0336,0332,0332,0332,0333,0336,0332,0337,0337,0337,0342,0336,0336,0333,0337,0337,0342,0336,0336,0332,0332,0336,0332,0330,0330,0330,0335,0337,0337,0337,0342,0336,0336,0336,0332,0332,0337,0337,0337,0342,0336,0336,0336,0332,0332,0332,0337,0337,0337,0330,0334,0331");
    currentTable.push("0044:0333,0336,0330,0332,0336,0330,0350,0335,0335,0334,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0330,0330,0343,0335,0335,0343,0335,0335,0334,0334,0334,0334,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0335,0335,0335,0335,0335,0335,0335,0335,0351,0351,0330,0335,0335,0333,0333,0337,0337,0336,0332,0337,0342,0336,0333,0337");
    currentTable.push("0045:0333,0336,0332,0332,0350,0335,0337,0310,0337,0342,0336,0313,0334,0351,0336,0336,0330,0330,0330,0333,0341,0331,0331,0331,0333,0333,0330,0341,0333,0331,0337,0337");
    currentTable.push("0046:0333,0336,0332,0330,0336,0330,0341,0331,0334,0350,0334,0342,0334,0330,0343,0335,0335,0343,0334,0334,0334,0334,0334,0334,0351,0333,0350,0334,0342,0335,0335,0335,0335,0342,0334,0334,0336,0342,0334,0351,0331,0331,0333,0333,0337,0337,0337");
    currentTable.push("0047:0333,0336,0330,0332,0336,0330,0342,0333,0333,0331,0331,0331,0337,0337");
    currentTable.push("0050:0333,0336,0330,0334,0331,0331,0337,0337,0350,0350,0350,0343,0350,0334,0334,0343,0335,0335,0335,0335,0335,0343,0334,0334,0334,0351,0351,0351,0351,0336,0330,0335,0336,0332,0331,0337");
    currentTable.push("0051:0333,0336,0330,0335,0337,0331,0331,0337,0350,0350,0350,0343,0350,0334,0334,0343,0335,0335,0335,0335,0343,0334,0334,0351,0351,0351,0351,0330,0335,0335,0335,0336,0336,0331,0336,0333,0337,0337");
    currentTable.push("0052:0333,0336,0332,0330,0352,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0353,0331,0333,0337");
    currentTable.push("0053:0333,0336,0330,0332,0336,0342,0335,0342,0335,0342,0335,0342,0335,0331,0331,0333,0333,0337,0337");
    currentTable.push("0054:0333,0336,0332,0336,0334,0350,0334,0342,0335,0351,0335,0333,0337,0337");
    currentTable.push("0055:0333,0336,0330,0332,0335,0336,0342,0331,0342,0333,0333,0330,0330,0330,0334,0337,0337");
    currentTable.push("0056:0333,0336,0332,0336,0336,0341,0333,0333,0333,0337,0337,0337");
    currentTable.push("0057:0333,0332,0350,0335,0310,0337,0342,0336,0313,0334,0351,0333");
    currentTable.push("0060:0333,0336,0330,0332,0336,0341,0350,0335,0337,0342,0335,0335,0335,0335,0342,0335,0335,0335,0351,0331,0333,0337");
    currentTable.push("0061:0313,0336,0336,0332,0337,0337,0333,0336,0332,0336,0336,0330,0334,0342,0335,0335,0342,0334,0337,0337,0342,0330,0336,0342,0330,0350,0334,0334,0334,0310,0336,0342,0337,0313,0334,0351,0330,0337,0330,0336,0336,0330,0337,0337,0334,0334,0336,0333,0337,0337");
    currentTable.push("0062:0333,0336,0330,0332,0336,0350,0336,0343,0335,0335,0343,0335,0335,0330,0335,0342,0334,0334,0334,0334,0342,0334,0334,0335,0351,0331,0334,0342,0335,0335,0342,0334,0331,0331,0337,0337,0333,0337");
    currentTable.push("0063:0333,0336,0332,0330,0336,0350,0336,0330,0330,0343,0335,0335,0343,0335,0335,0350,0334,0343,0335,0330,0330,0351,0351,0334,0334,0350,0350,0335,0343,0335,0335,0335,0351,0343,0335,0335,0343,0351,0335,0335,0337,0337,0333,0331,0337");
    currentTable.push("0064:0333,0336,0332,0337,0342,0336,0330,0334,0342,0330,0335,0350,0335,0342,0334,0351,0331,0337,0336,0333,0336,0333,0337,0337");
    currentTable.push("0065:0333,0336,0332,0330,0336,0342,0330,0335,0342,0333,0333,0343,0333,0330,0330,0334,0337,0337");
    currentTable.push("0066:0333,0336,0336,0332,0332,0330,0341,0332,0350,0350,0335,0337,0337,0342,0336,0336,0334,0351,0351,0333,0333,0333,0331,0337,0337");
    currentTable.push("0067:0333,0336,0332,0350,0350,0335,0337,0342,0330,0334,0334,0334,0334,0334,0336,0342,0351,0351,0335,0350,0350,0335,0337,0331,0334,0351,0351,0336,0333,0337");
    currentTable.push("0070:0333,0336,0332,0336,0330,0341,0330,0330,0341,0333,0333,0331,0331,0331,0337,0337");
    currentTable.push("0071:0333,0336,0336,0332,0337,0337,0342,0336,0330,0336,0330,0332,0341,0333,0333,0330,0337,0337,0331");
    currentTable.push("0072:0333,0336,0332,0330,0336,0336,0336,0341,0331,0331,0331,0331,0331,0331,0331,0341,0333,0333,0333,0333,0331,0337,0337,0337,0337");
    currentTable.push("0073:0333,0336,0332,0330,0336,0336,0336,0341,0331,0331,0331,0331,0334,0334,0337,0337,0350,0335,0342,0335,0351,0335,0331,0333,0337,0337");
    currentTable.push("0074:0333,0336,0330,0332,0350,0335,0342,0335,0335,0342,0335,0351,0330,0335,0335,0333,0337");
    currentTable.push("0075:0333,0336,0336,0332,0330,0334,0337,0342,0336,0333,0337,0342,0336,0332,0332,0335,0333,0337,0337");
    currentTable.push("0076:0333,0336,0330,0332,0350,0334,0342,0334,0334,0342,0335,0335,0335,0351,0331,0333");
    currentTable.push("0077:0333,0336,0336,0332,0332,0330,0336,0331,0341,0330,0330,0342,0330,0330,0330,0343,0335,0335,0350,0334,0343,0335,0351,0330,0342,0335,0335,0337,0331,0331,0331,0336,0330,0333,0333,0333,0337,0337,0337");
    currentTable.push("0100:0333,0336,0332,0330,0336,0336,0341,0337,0343,0334,0343,0334,0334,0336,0330,0342,0331,0337,0350,0335,0335,0343,0351,0330,0330,0335,0335,0333,0333,0337,0337");
    currentTable.push("0101:0311,0305,0350,0350,0335,0342,0351,0335,0336,0333,0334,0334,0337,0342,0336,0336,0330,0334,0334,0342,0335,0335,0331,0350,0335,0337,0337,0304");
    currentTable.push("0102:0304,0313,0336,0336,0336,0333,0337,0337,0337,0342,0330,0335,0336,0336,0342,0333,0333,0342,0332,0330,0343,0333,0333,0343,0333,0331,0342,0334,0337,0333,0336,0336,0333,0337,0337,0337");
    currentTable.push("0103:0333,0336,0330,0332,0334,0343,0335,0335,0350,0334,0334,0343,0335,0335,0335,0335,0343,0351,0330,0335,0335,0333,0337");
    currentTable.push("0104:0333,0332,0336,0336,0333,0337,0337,0342,0336,0330,0350,0335,0343,0335,0335,0343,0335,0351,0330,0335,0335,0336,0333,0337,0333,0337");
    currentTable.push("0105:0333,0336,0332,0336,0332,0337,0337,0342,0335,0336,0342,0332,0336,0342,0337,0332,0342,0336,0331,0334,0337,0337,0333,0331");
    currentTable.push("0106:0333,0336,0332,0336,0332,0337,0337,0342,0335,0336,0332,0336,0342,0337,0332,0342,0336,0331,0334,0337,0337,0333,0331");
    currentTable.push("0107:0333,0336,0330,0332,0334,0343,0335,0335,0350,0334,0334,0343,0335,0335,0335,0335,0343,0351,0330,0335,0335,0333,0337,0336,0336,0332,0336,0333,0337,0342,0330,0334,0342,0335,0331,0333,0337,0337");
    currentTable.push("0110:0333,0336,0336,0332,0337,0337,0342,0336,0332,0337,0342,0336,0330,0335,0342,0330,0334,0331,0336,0333,0337,0337");
    currentTable.push("0111:0333,0336,0336,0332,0334,0337,0342,0336,0330,0335,0337,0337,0342,0330,0336,0336,0334,0342,0335,0335,0342,0330,0330,0334,0337,0337,0331");
    currentTable.push("0112:0333,0336,0330,0332,0336,0342,0330,0336,0342,0330,0334,0342,0335,0335,0342,0334,0331,0337,0331,0335,0335,0342,0333,0330,0343,0335,0335,0333,0331,0337,0333,0337");
    currentTable.push("0113:0333,0336,0332,0337,0342,0336,0330,0350,0335,0310,0337,0342,0336,0313,0335,0335,0310,0337,0342,0336,0313,0335,0351,0330,0335,0335,0333,0337");
    currentTable.push("0114:0333,0336,0332,0336,0332,0337,0337,0342,0336,0335,0342,0330,0336,0330,0334,0337,0337");
    currentTable.push("0115:0333,0336,0332,0336,0332,0337,0337,0342,0336,0333,0337,0342,0330,0334,0350,0334,0336,0342,0335,0330,0334,0334,0334,0342,0334,0334,0334,0351,0336,0332,0337,0337,0333,0331");
    currentTable.push("0116:0333,0336,0332,0336,0332,0337,0337,0342,0336,0333,0337,0342,0336,0332,0330,0330,0335,0350,0335,0350,0335,0337,0342,0335,0351,0351,0330,0335,0335,0333,0336,0336,0332,0337,0337");
    currentTable.push("0117:0333,0336,0330,0332,0341,0331,0333,0337");
    currentTable.push("0120:0333,0332,0336,0336,0333,0337,0337,0342,0336,0330,0336,0330,0333,0341,0333,0333,0330,0337,0337,0331");
    currentTable.push("0121:0333,0336,0330,0332,0341,0335,0335,0336,0330,0332,0350,0334,0337,0342,0334,0351,0334,0333,0331,0336,0330,0337,0337");
    currentTable.push("0122:0333,0332,0336,0336,0333,0337,0337,0342,0336,0330,0336,0330,0335,0343,0333,0350,0335,0350,0335,0337,0342,0335,0351,0351,0330,0335,0335,0333,0337");
    currentTable.push("0123:0333,0336,0330,0332,0336,0330,0350,0335,0335,0334,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0330,0330,0343,0335,0335,0343,0335,0335,0334,0334,0334,0334,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0335,0335,0335,0335,0335,0335,0335,0335,0351,0351,0330,0335,0335,0333,0333,0337,0337");
    currentTable.push("0124:0333,0336,0332,0337,0342,0330,0336,0335,0342,0331,0342,0330,0330,0334,0337,0331");
    currentTable.push("0125:0333,0336,0336,0330,0332,0337,0342,0330,0336,0342,0331,0331,0332,0332,0342,0330,0342,0330,0342,0331,0331,0333,0335,0335,0343,0330,0335,0335,0337,0333,0337");
    currentTable.push("0126:0333,0336,0332,0350,0350,0335,0337,0342,0334,0334,0342,0335,0335,0334,0351,0351,0336,0333,0337");
    currentTable.push("0127:0333,0330,0334,0350,0350,0334,0334,0334,0350,0334,0342,0334,0351,0351,0351,0333,0350,0350,0350,0334,0342,0335,0330,0351,0351,0351,0336,0336,0332,0334,0350,0334,0334,0350,0335,0337,0342,0334,0351,0351,0333,0350,0350,0334,0342,0335,0351,0351,0336,0333,0337,0337");
    currentTable.push("0130:0333,0350,0334,0342,0332,0335,0335,0342,0310,0337,0342,0336,0333,0334,0334,0337,0342,0336,0313,0335,0351");
    currentTable.push("0131:0333,0336,0332,0342,0330,0350,0335,0342,0334,0334,0342,0335,0351,0331,0333,0337");
    currentTable.push("0132:0333,0334,0342,0333,0342,0350,0334,0310,0337,0342,0336,0313,0335,0336,0330,0334,0334,0330,0335,0335,0336,0342,0351,0335,0335,0342,0333,0333,0330,0330,0334,0337,0337");
    currentTable.push("0133:0333,0336,0336,0332,0332,0337,0337,0342,0330,0335,0336,0336,0342,0337,0337,0333,0336,0336,0342,0330,0330,0334,0337,0337");
    currentTable.push("0134:0333,0336,0336,0332,0337,0337,0350,0350,0334,0342,0335,0351,0351,0336,0336,0333,0337,0337");
    currentTable.push("0135:0333,0336,0336,0332,0337,0337,0342,0336,0336,0334,0342,0333,0333,0333,0333,0342,0335,0333,0337,0337,0331");
    currentTable.push("0136:0333,0330,0336,0332,0334,0334,0350,0335,0342,0334,0334,0342,0334,0351,0334,0333,0337,0331");
    currentTable.push("0137:0333,0334,0336,0336,0330,0337,0342,0336,0331,0335,0337,0337");
    currentTable.push("0140:0333,0336,0332,0330,0336,0330,0350,0334,0342,0335,0351,0330,0333,0333,0337,0337,0331");
    currentTable.push("0141:0333,0336,0332,0336,0330,0341,0333,0342,0331,0342,0330,0330,0332,0343,0333,0333,0331,0331,0337,0337");
    currentTable.push("0142:0333,0336,0336,0332,0332,0332,0337,0337,0342,0336,0336,0330,0333,0341,0333,0333,0331,0337,0337");
    currentTable.push("0143:0333,0336,0332,0336,0330,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0330,0330,0334,0334,0351,0331,0337,0337");
    currentTable.push("0144:0333,0336,0336,0332,0332,0337,0337,0342,0336,0336,0330,0332,0341,0333,0333,0331,0337,0337");
    currentTable.push("0145:0333,0336,0336,0332,0330,0332,0343,0334,0334,0350,0335,0343,0334,0343,0335,0335,0342,0351,0335,0335,0342,0333,0330,0330,0334,0337,0337");
    currentTable.push("0146:0333,0336,0336,0332,0332,0337,0342,0330,0336,0336,0342,0330,0333,0343,0332,0331,0331,0335,0337,0336,0342,0334,0334,0342,0335,0331,0331,0331,0333,0333,0333,0333,0337,0337,0337");
    currentTable.push("0147:0333,0336,0332,0336,0330,0341,0333,0342,0331,0342,0331,0342,0331,0342,0332,0335,0335,0343,0331,0331,0332,0332,0334,0334,0337,0337");
    currentTable.push("0150:0333,0336,0336,0332,0332,0332,0337,0337,0342,0336,0336,0330,0336,0333,0343,0333,0331,0342,0331,0342,0337,0333,0337,0337");
    currentTable.push("0151:0333,0336,0336,0332,0332,0332,0342,0330,0336,0342,0330,0330,0330,0336,0341,0331,0331,0331,0331,0331,0331,0331,0331,0331,0331,0337,0333,0333,0337,0337,0337");
    currentTable.push("0152:0333,0336,0336,0332,0332,0332,0342,0331,0342,0332,0335,0335,0343,0332,0331,0331,0331,0336,0336,0341,0330,0330,0330,0330,0330,0330,0330,0330,0335,0335,0337,0333,0333,0337,0337,0337");
    currentTable.push("0153:0333,0336,0336,0332,0332,0332,0337,0342,0330,0336,0342,0331,0350,0335,0342,0335,0335,0310,0337,0342,0336,0313,0334,0351,0334,0331,0333,0333,0337,0337");
    currentTable.push("0154:0333,0336,0336,0332,0332,0332,0336,0336,0350,0335,0342,0334,0337,0337,0337,0342,0330,0336,0342,0330,0334,0334,0334,0336,0342,0335,0351,0335,0337,0331,0331,0331,0333,0337,0337");
    currentTable.push("0155:0333,0336,0332,0336,0332,0336,0332,0337,0337,0342,0336,0333,0330,0336,0332,0343,0333,0333,0343,0332,0331,0342,0331,0342,0337,0333,0342,0333,0337,0337");
    currentTable.push("0156:0333,0336,0332,0336,0332,0336,0332,0337,0337,0342,0336,0333,0330,0336,0332,0343,0333,0331,0331,0337,0342,0333,0337,0337");
    currentTable.push("0157:0333,0336,0332,0336,0332,0330,0341,0333,0333,0331,0337,0337");
    currentTable.push("0160:0333,0336,0332,0336,0332,0342,0335,0335,0337,0342,0336,0331,0332,0341,0333,0334,0334,0342,0331,0333,0333,0333,0337,0337");
    currentTable.push("0161:0333,0336,0332,0336,0330,0332,0341,0333,0342,0331,0331,0337,0342,0336,0333,0334,0334,0336,0333,0343,0335,0335,0330,0330,0333,0333,0333,0337,0337,0337");
    currentTable.push("0162:0333,0336,0332,0336,0332,0337,0342,0330,0336,0336,0342,0350,0335,0350,0337,0337,0335,0342,0335,0351,0351,0330,0334,0331,0336,0336,0333,0337,0337,0337");
    currentTable.push("0163:0333,0336,0336,0332,0332,0330,0336,0330,0350,0343,0334,0334,0343,0334,0350,0334,0343,0334,0351,0330,0330,0343,0334,0334,0343,0334,0334,0335,0343,0334,0351,0331,0333,0333,0337,0337,0337");
    currentTable.push("0164:0333,0336,0332,0342,0330,0336,0342,0334,0342,0335,0335,0342,0333,0333,0336,0330,0335,0343,0335,0335,0333,0333,0333,0337,0337,0337");
    currentTable.push("0165:0333,0336,0336,0332,0332,0332,0337,0342,0336,0330,0333,0335,0335,0343,0332,0335,0335,0342,0333,0331,0337,0337");
    currentTable.push("0166:0333,0336,0332,0350,0350,0334,0342,0335,0335,0342,0334,0351,0351,0333,0337");
    currentTable.push("0167:0333,0336,0332,0336,0332,0350,0350,0334,0342,0335,0335,0342,0334,0351,0351,0333,0350,0350,0334,0342,0335,0335,0342,0334,0351,0351,0333,0337,0337");
    currentTable.push("0170:0333,0336,0332,0336,0332,0350,0335,0310,0337,0342,0336,0334,0351,0333,0350,0334,0337,0342,0336,0335,0351,0313,0337,0336,0333,0337,0337");
    currentTable.push("0171:0333,0336,0332,0336,0350,0335,0337,0350,0334,0342,0334,0334,0342,0334,0334,0334,0334,0334,0334,0342,0334,0351,0351,0335,0335,0333,0337");
    currentTable.push("0172:0333,0336,0332,0336,0334,0342,0335,0335,0342,0332,0332,0342,0334,0334,0342,0332,0350,0334,0342,0335,0335,0335,0335,0342,0335,0336,0342,0334,0334,0334,0334,0342,0335,0335,0351,0333,0333,0333,0333,0331,0331,0337,0337,0337");
    currentTable.push("0173:0333,0336,0330,0332,0336,0336,0330,0334,0350,0334,0342,0335,0335,0335,0342,0330,0335,0342,0334,0331,0331,0331,0334,0342,0335,0331,0342,0335,0335,0335,0342,0335,0351,0335,0335,0331,0331,0333,0333,0337,0337,0337");
    currentTable.push("0174:0333,0336,0332,0337,0342,0330,0336,0336,0342,0337,0337,0331,0336,0336,0331,0342,0330,0333,0337,0337");
    currentTable.push("0175:0333,0336,0336,0332,0332,0330,0330,0336,0330,0342,0330,0350,0334,0342,0335,0331,0335,0335,0335,0342,0335,0330,0330,0334,0334,0334,0342,0335,0335,0335,0342,0330,0335,0342,0334,0351,0330,0330,0335,0335,0333,0333,0333,0337,0337,0337");
    currentTable.push("0176:0333,0336,0330,0332,0330,0336,0331,0350,0334,0342,0335,0335,0342,0334,0351,0332,0350,0335,0342,0334,0351,0333,0333,0333,0331,0331,0331,0337,0337");
    currentTable.push("01300:0333,0200,0336,0330,0332,0340,0350,0335,0336,0330,0342,0331,0331,0331,0342,0330,0330,0335,0335,0331,0331,0342,0330,0330,0330,0342,0331,0334,0334,0334,0351,0331,0331,0333,0333,0337,0337");
    currentTable.push("01304:0333,0200,0336,0330,0332,0341,0342,0335,0342,0335,0342,0335,0342,0350,0335,0351,0336,0336,0330,0330,0341,0331,0331,0335,0330,0330,0341,0331,0331,0335,0330,0330,0341,0331,0331,0335,0330,0330,0341,0331,0331,0350,0334,0351,0337,0337,0330,0335,0335,0333,0337");
    currentTable.push("01305:0333,0200,0336,0330,0332,0305,0342,0335,0342,0335,0342,0335,0342,0335,0342,0335,0341,0350,0335,0351,0336,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0350,0335,0304,0337,0331,0333,0337");
    currentTable.push("01306:0333,0200,0336,0330,0332,0306,0342,0335,0342,0335,0342,0335,0342,0335,0342,0335,0341,0350,0335,0351,0336,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0350,0335,0335,0335,0337,0342,0334,0336,0330,0336,0336,0341,0337,0337,0331,0304,0335,0337,0331,0333,0337");
    currentTable.push("01310:0333,0200,0336,0332,0350,0335,0310,0337,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0334,0351,0336,0313,0333,0337");
    currentTable.push("01311:0335,0305,0342,0334,0311,0337,0342,0336,0335,0330,0334,0350,0334,0337,0342,0334,0334,0304,0336,0313,0335,0200,0334,0305,0350,0335,0342,0330,0335,0335,0335,0311,0336,0342,0330,0334,0334,0334,0336,0342,0335,0335,0335,0337,0331,0334,0334,0334,0337,0331,0334,0313,0304,0335");
    currentTable.push("01312:0333,0200,0352,0334,0342,0330,0334,0334,0334,0334,0342,0334,0312,0337,0313,0336,0342,0330,0334,0334,0334,0334,0336,0342,0334,0334,0304,0312,0336,0313,0337,0333,0337");
    currentTable.push("01313:0333,0200,0336,0336,0332,0332,0330,0342,0334,0342,0330,0335,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0335,0342,0335,0331,0333,0337,0337");
    currentTable.push("01314:0333,0200,0314,0336,0332,0332,0330,0200,0333,0200,0333,0200,0331,0337,0313");
    currentTable.push("01317:0333,0200,0336,0336,0330,0332,0336,0330,0333,0337,0342,0336,0330,0334,0337,0337,0342,0330,0336,0342,0330,0335,0336,0342,0331,0342,0332,0330,0337,0337,0333,0333,0331,0337");
    currentTable.push("01330:0333,0200,0313,0336,0336,0330,0332,0336,0332,0337,0342,0334,0342,0330,0335,0342,0330,0334,0336,0342,0330,0335,0350,0335,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0336,0313,0336,0342,0330,0351,0335,0331,0331,0331,0331,0333,0333,0333,0337,0337,0337");
    currentTable.push("01331:0333,0200,0335,0335,0333,0331,0313,0336,0336,0330,0332,0336,0332,0337,0342,0334,0342,0330,0335,0342,0330,0334,0336,0342,0330,0335,0350,0335,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0336,0313,0336,0342,0330,0351,0335,0331,0331,0331,0331,0333,0333,0333,0337,0337,0337,0332,0335,0335,0331");
    currentTable.push("01332:0333,0200,0334,0333,0313,0336,0336,0330,0332,0336,0332,0337,0342,0334,0342,0330,0335,0342,0330,0334,0336,0342,0330,0335,0350,0335,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0336,0313,0336,0342,0330,0351,0335,0331,0331,0331,0331,0333,0333,0333,0337,0337,0337,0335,0331");
    currentTable.push("01333:0333,0200,0335,0331,0313,0336,0336,0330,0332,0336,0332,0337,0342,0334,0342,0330,0335,0342,0330,0334,0336,0342,0330,0335,0350,0335,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0336,0313,0336,0342,0330,0351,0335,0331,0331,0331,0331,0333,0333,0333,0337,0337,0337,0330,0334");
    currentTable.push("01334:0333,0200,0336,0330,0332,0336,0350,0343,0334,0334,0343,0334,0334,0343,0334,0342,0335,0330,0336,0330,0334,0334,0334,0337,0342,0334,0351,0336,0331,0337,0337,0333,0337");
    currentTable.push("01335:0333,0200,0336,0330,0332,0336,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0334,0342,0334,0330,0336,0330,0335,0335,0335,0337,0342,0336,0335,0331,0351,0337,0337,0332,0335,0335,0337,0331");
    currentTable.push("01336:0333,0200,0336,0330,0334,0336,0330,0337,0342,0336,0331,0335,0337,0331,0337");
    currentTable.push("01337:0333,0200,0336,0330,0332,0336,0342,0334,0342,0334,0342,0334,0342,0330,0330,0334,0337,0331,0337");
    currentTable.push("01340:0333,0200,0336,0330,0332,0340,0333,0331,0337");
    currentTable.push("01341:0333,0200,0336,0330,0332,0341,0340,0333,0331,0337");
    currentTable.push("01342:0333,0200,0336,0330,0332,0334,0336,0342,0330,0340,0331,0335,0335,0342,0330,0340,0333,0333,0330,0334,0337,0337");
    currentTable.push("01343:0333,0200,0336,0330,0332,0350,0343,0335,0342,0334,0334,0342,0335,0340,0351,0331,0333,0337");
    currentTable.push("01350:0333,0200,0336,0330,0332,0350,0335,0342,0335,0335,0342,0334,0336,0336,0342,0330,0330,0342,0331,0331,0351,0337,0337,0334,0333,0331,0337");
    currentTable.push("01351:0333,0200,0336,0332,0330,0350,0335,0336,0336,0342,0330,0330,0342,0330,0330,0342,0331,0331,0331,0331,0335,0337,0337,0342,0335,0342,0334,0351,0333,0330,0334,0337");
    currentTable.push("01352:0333,0200,0336,0330,0332,0335,0350,0352,0334,0334,0334,0342,0335,0335,0336,0336,0342,0330,0330,0342,0331,0331,0335,0335,0342,0330,0330,0342,0331,0331,0335,0335,0337,0337,0342,0335,0335,0335,0351,0353,0330,0334,0334,0333,0337");
    currentTable.push("01353:0333,0200,0336,0330,0332,0335,0350,0352,0334,0342,0335,0335,0342,0335,0335,0336,0336,0342,0330,0330,0342,0331,0331,0334,0334,0334,0334,0334,0334,0342,0330,0330,0342,0331,0331,0335,0335,0335,0351,0353,0337,0337,0333,0330,0334,0337");
    currentTable.push("01360:0333,0200,0336,0336,0330,0332,0332,0330,0341,0332,0334,0336,0342,0330,0334,0337,0342,0330,0336,0342,0330,0334,0337,0337,0342,0330,0336,0342,0330,0334,0342,0330,0336,0342,0330,0334,0342,0335,0333,0337,0337,0331,0337");
    currentTable.push("01361:0333,0200,0336,0330,0332,0336,0350,0343,0334,0343,0334,0343,0335,0335,0335,0335,0343,0334,0334,0351,0331,0334,0336,0330,0342,0330,0334,0342,0330,0334,0342,0330,0342,0330,0342,0330,0342,0330,0334,0342,0330,0334,0342,0335,0333,0333,0331,0331,0337,0337,0337");
    currentTable.push("01370:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0333,0335,0306,0342,0336,0331,0337,0337,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0304,0334,0333,0333,0336,0336,0332,0337,0337,0337,0331,0337");
    currentTable.push("01371:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0336,0331,0331,0331,0333,0335,0337,0337,0306,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0304,0330,0330,0336,0336,0331,0334,0337,0337,0337,0331,0336,0336,0336,0330,0337,0337,0337,0337");
    currentTable.push("01372:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0336,0331,0333,0337,0337,0342,0330,0335,0342,0330,0335,0342,0330,0335,0342,0330,0335,0333,0333,0336,0336,0332,0337,0337,0337,0331,0336,0336,0336,0330,0337,0337,0337,0337");
    currentTable.push("01373:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0331,0331,0336,0330,0333,0337,0337,0342,0330,0335,0342,0330,0335,0342,0330,0335,0342,0330,0335,0333,0333,0331,0331,0336,0336,0330,0332,0337,0337,0337,0337");
    currentTable.push("01374:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0333,0335,0305,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0334,0333,0333,0333,0331,0331,0331,0331,0337,0337,0337");
    currentTable.push("01375:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0331,0331,0333,0330,0335,0305,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0330,0330,0330,0334,0331,0331,0331,0331,0337,0337,0337");
    currentTable.push("01376:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0335,0330,0306,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0330,0330,0330,0334,0337,0337,0331,0337");
    currentTable.push("01377:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0331,0333,0335,0306,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0333,0330,0330,0330,0334,0331,0331,0331,0337,0337,0337");
    currentTable.push("01200:0333,0200,0336,0336,0330,0332,0337,0200,0336,0331,0333,0337,0337");
    currentTable.push("01201:0333,0200,0201,0201,0201,0201,0201,0201,0337,0337,0337,0337,0330,0334,0331,0313,0336,0336,0336,0330,0333,0337,0337,0337,0337");
    currentTable.push("01202:0333,0200,0336,0332,0330,0200,0310,0202,0202,0202,0202,0334,0334,0337,0337,0337,0337,0313,0333,0331,0337");
    currentTable.push("01203:0333,0200");
    currentTable.push("01204:0333,0200");
    currentTable.push("01205:0333,0200");
    currentTable.push("01206:0333,0200");
    currentTable.push("01207:0333,0200");
    currentTable.push("01210:0333,0200,0336,0330,0335,0331,0331,0337,0210,0334,0336,0331,0337");
    currentTable.push("01211:0333,0200,0336,0330,0335,0331,0331,0337,0211,0334,0336,0331,0337");
    currentTable.push("01212:0333,0200,0336,0330,0332,0335,0335,0331,0342,0330,0335,0310,0336,0342,0330,0334,0334,0350,0335,0337,0342,0330,0334,0334,0342,0330,0334,0334,0334,0336,0342,0335,0335,0351,0332,0337,0313,0333,0331,0337");
    currentTable.push("01213:0333,0200");
    currentTable.push("01214:0333,0200,0336,0330,0335,0331,0331,0337,0214,0334,0336,0331,0337");
    currentTable.push("01215:0333,0200,0336,0330,0335,0331,0331,0337,0215,0334,0336,0331,0337");
    currentTable.push("01216:0333,0200,0336,0330,0335,0331,0331,0337,0216,0334,0336,0331,0337");
    currentTable.push("01217:0333,0200,0336,0330,0332,0336,0331,0337,0337,0217,0336,0336,0333,0333,0331,0337,0337");
    currentTable.push("01220:0333,0200,0336,0330,0332,0336,0331,0334,0334,0337,0337,0220,0336,0342,0333,0336,0331,0337,0337");
    currentTable.push("01221:0333,0200,0336,0330,0332,0221,0334,0336,0331,0337,0337");
    currentTable.push("01222:0333,0200,0336,0332,0337,0222,0336,0333,0337,0331");
    currentTable.push("01223:0333,0200,0332,0336,0330,0335,0337,0223,0336,0334,0331,0337");
    currentTable.push("01224:0333,0200,0336,0332,0337,0224,0336,0333,0337,0331");
    currentTable.push("01225:0333,0200,0336,0332,0337,0225,0336,0333,0337,0331");
    currentTable.push("01226:0333,0200");
    currentTable.push("01227:0333,0200");
    currentTable.push("0200:0304,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334");
    currentTable.push("0201:0306,0350,0334,0342,0330,0334,0334,0334,0334,0342,0330,0334,0334,0334,0334,0342,0330,0334,0334,0334");
    currentTable.push("0202:0304,0342,0335,0342,0330,0334,0350,0334,0310,0337,0342");
    currentTable.push("0203:0304,0310,0350,0335,0336,0342,0330,0335,0335,0342,0330,0334,0337,0331,0342");
    currentTable.push("0204:0305,0311,0342,0335,0337,0342,0330,0334,0334,0342,0336");
    currentTable.push("0205:0305,0311,0337,0342,0330,0335,0335,0336,0342,0330,0335,0342");
    currentTable.push("0206:0340");
    currentTable.push("0207:0300");
    currentTable.push("0210:0304,0336,0336,0330,0331,0336,0330,0331,0342,0330,0306,0350,0335,0335,0342,0334,0334,0330,0335,0335,0335,0335,0342,0334,0334,0334,0334,0334,0334,0342,0335,0335,0335,0334,0330,0334,0334,0334,0334,0342,0335,0335,0335,0335,0335,0335,0342,0334,0334,0330,0335,0335,0335,0335,0342,0334,0334,0334,0334,0334,0334,0342,0335,0335,0330,0335,0334,0334,0334,0334,0334,0342,0335,0335,0335,0335,0335,0335,0342,0334,0334,0330,0335,0335,0335,0335,0342,0334,0334,0334,0334,0334,0334,0342,0335,0335,0330,0334,0334,0334,0334,0342,0335,0335,0335,0335,0342,0330,0305,0304,0337,0337,0337")
    currentTable.push("0211:0304,0336,0336,0336,0342,0330,0337,0342,0330,0335,0342,0334,0334,0342,0335,0330,0334,0342,0334,0334,0342,0334,0342,0330,0336,0342,0330,0337,0337,0337");
    currentTable.push("0212:0304,0313,0336,0336,0335,0342,0334,0334,0342,0330,0350,0335,0335,0335,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0351,0336,0330,0334,0313,0337,0337");
    currentTable.push("0213:0304,0314,0336,0336,0345,0333,0336,0333,0337,0344,0336,0332,0332,0334,0334,0344,0345,0335,0335,0333,0333,0337,0337,0337");
    currentTable.push("0214:0304,0336,0336,0336,0336,0342,0330,0337,0337,0337,0337,0314,0336,0337,0334,0336,0336,0333,0344,0337,0337,0213,0213,0213,0213,0336,0336,0345,0333,0335,0342,0330,0336,0336,0336,0336,0342,0330,0337,0337,0337,0337,0337,0337,0313");
    currentTable.push("0215:0304,0342,0314,0336,0330,0313,0336,0332,0304,0350,0335,0337,0310,0337,0342,0336,0333,0334,0334,0337,0342,0336,0313,0336,0332,0335,0351,0330,0330,0330,0330,0314,0337,0313,0337");
    currentTable.push("0216:0304,0314,0336,0342,0330,0334,0313,0336,0342,0334,0334,0342,0335,0335,0337,0314,0335,0313,0336,0332,0304,0350,0337,0342,0336,0335,0337,0310,0337,0342,0336,0333,0334,0342,0334,0337,0342,0336,0313,0336,0332,0335,0351,0330,0330,0334,0342,0335,0335,0342,0334,0342,0330,0342,0330,0314,0337,0313,0337");
    currentTable.push("0217:0313,0304,0336,0336,0330,0341,0336,0336,0336,0331,0331,0331,0332,0332,0332,0332,0331,0337,0337,0337,0126,0331,0332,0337,0337,0336,0336,0336,0333,0330,0337,0337,0337");
    currentTable.push("0220:0304,0313,0336,0336,0334,0342,0335,0335,0342,0334,0314,0336,0330,0330,0335,0342,0334,0334,0342,0332,0342,0330,0342,0331,0331,0331,0342,0330,0342,0330,0335,0331,0337,0313,0337,0337,0334,0334");
    currentTable.push("0221:0304,0336,0336,0346,0347,0334,0334,0346,0347,0335,0342,0330,0336,0336,0336,0330,0341,0331,0337,0337,0337,0331,0336,0331,0342,0330,0335,0330,0330,0330,0330,0335,0337,0337,0337,0342,0333,0342,0330");
    currentTable.push("0222:0304,0314,0336,0313,0336,0342,0330,0330,0330,0330,0330,0342,0331,0331,0337,0341,0332,0336,0350,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0337,0335,0351,0333,0333,0336,0350,0334,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0335,0351,0332,0332,0330,0330,0330,0337,0314,0337,0313");
    currentTable.push("0223:0304,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0337,0342,0335,0335,0342,0336,0334,0330,0330,0335,0350,0335,0337,0310,0337,0342,0335,0335,0342,0335,0335,0335,0351,0336,0313,0336,0330,0337,0337");
    currentTable.push("0224:0304,0313,0336,0336,0336,0342,0330,0337,0330,0341,0330,0341,0330,0336,0342,0330,0337,0337,0337");
    currentTable.push("0225:0304,0313,0336,0336,0336,0342,0330,0337,0342,0330,0334,0342,0335,0335,0342,0334,0330,0335,0342,0335,0335,0342,0350,0334,0310,0337,0342,0334,0334,0342,0334,0334,0334,0351,0336,0313,0342,0330,0336,0342,0330,0337,0337,0337");
    currentTable.push("0226:0300");
    currentTable.push("0227:0300");

currentTable.push("0400:0340,0341,0333,0341,0340");	currentTable.push("0401:0300,0331,0331,0210,0211,0214,0217,0334,0334,0330,0330,0330,0212,0332,0332");
currentTable.push("0402:0300,0332,0332,0332,0330,0330,0330,0330,0336,0115,0105,0115,0105,040,0124,0111,0115,0105,041,0331,0331,0337,0337,0332,0336,0336,0332,0332,0332,0332,0332,0332,0332,0332,0332,0107,0105,0117,0115,0105,0124,0122,0117,0116,040,0103,0125,0102,0105,040,0132,0105,0122,0117,040");
currentTable.push("0403:0300");
currentTable.push("0404:0300");
currentTable.push("0405:0300");
currentTable.push("0406:0300");
currentTable.push("0407:0300");
currentTable.push("0410:0340,0341,0333,0341,0340");
currentTable.push("0411:0340,0341,0333,0341,0340");
currentTable.push("0412:0300");
currentTable.push("0413:0300");
currentTable.push("0414:0300");
currentTable.push("0415:0300");
currentTable.push("0416:0300");
currentTable.push("0417:0300");
currentTable.push("0420:0340,0341,0333,0341,0340");
currentTable.push("0421:0340,0341,0333,0341,0340");
currentTable.push("0422:0300");
currentTable.push("0423:0300");
currentTable.push("0424:0300");
currentTable.push("0425:0300");
currentTable.push("0426:0300");
currentTable.push("0427:0300");
currentTable.push("0430:0340,0341,0333,0341,0340");
currentTable.push("0431:0340,0341,0333,0341,0340");
currentTable.push("0432:0300");
currentTable.push("0433:0300");
currentTable.push("0434:0300");
currentTable.push("0435:0300");
currentTable.push("0436:0300");
currentTable.push("0437:0300");


}