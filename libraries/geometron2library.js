function keystring2command(localKeyString){//from a key sequence to a command address seq.
  var localASCIIboolean = false;
  var localCommandString = "";
  for(var glyphIndex = 0;glyphIndex < localKeyString.length;glyphIndex++){
      if(localKeyString.charAt(glyphIndex-2)=="\\" && localKeyString.charAt(glyphIndex-1) == "~"){
	  		localASCIIboolean = !localASCIIboolean;
  	}

  	for(var keyIndex = 0;keyIndex < keyStringFull.length;keyIndex++){
  		 
  		if(localKeyString.charAt(glyphIndex)==keyStringFull.charAt(keyIndex)){
			if(!localASCIIboolean){
  				localCommandString += addressStringArray[keyIndex] + ",";
  			}
  		}
  	}
    if(localASCIIboolean){
    	var localCharCode = localKeyString.charCodeAt(glyphIndex);
  	    if(!( localKeyString.charAt(glyphIndex-1) == "\\" &&localKeyString.charAt(glyphIndex) == "~")&&!( localKeyString.charAt(glyphIndex) == "\\" &&localKeyString.charAt(glyphIndex+1) == "~")){
  	    localCommandString += "0" + localCharCode.toString(8) + ",";	  	    
  	    }
    }
  }  
  return localCommandString.substring(0,localCommandString.length - 1);	//remove commma at end
}
function commandString2keyString(localCommandString){
    var localASCIIboolean = false;
	var localKeyString = "";
    var localCommandArray = localCommandString.split(",");
	for(var outerIndex = 0;outerIndex < localCommandArray.length;outerIndex++){
		for(var  innerIndex = 0;innerIndex < addressStringArray.length;innerIndex++){
			if(addressStringArray[innerIndex]==localCommandArray[outerIndex]){
				localKeyString += keyStringFull.charAt(innerIndex);
			}
		}
		var thisCode = parseInt(localCommandArray[outerIndex],8); 
		var nextCode = parseInt(localCommandArray[outerIndex+1],8); 
		if(((040<=thisCode)&&(thisCode <= 0175)) && !((040<=nextCode)&&(nextCode <= 0175))){
			if(localASCIIboolean){
				localKeyString += String.fromCharCode(thisCode);
			}
			localKeyString += "\\~";
			localASCIIboolean = false;
		}
		if( !((040<=thisCode)&&(thisCode <= 0175)) && ((040<=nextCode)&&(nextCode <= 0175))){
			localKeyString += "\\~";
			localASCIIboolean = true;
		}
		if((040<=thisCode)&&(thisCode <= 0175)){
			if(localASCIIboolean){
				localKeyString += String.fromCharCode(thisCode);
			}
		}
	}
	return localKeyString;
	
}

function roctalPrintString(localString){
	for(var index = 0;index < localString.length;index++){
		var localCode = localString.charCodeAt(index);	
	    roctalChar(localCode);
	    if(x >= 512){
	    	x = 0;
	    	y += side;
	    }
	}

}


function roctalChar(localAddress){
	doTheThing(0304);//fourfold symmetry
	doTheThing(0313);//2x scaling
	doTheThing(0336);//halve
	doTheThing(0336);//halve again to 1/4 "side"
	doTheThing(0336);//halve again to 1/8 "side"
	doTheThing(0366);//calibration square 1
	doTheThing(0331);//move back
	doTheThing(0333);//move right
	doTheThing(0366);//calibration square 2
	doTheThing(0331);//move back
	doTheThing(0333);//move right one bit
	doTheThing(0337);//back up to 1/4 scale
	doTheThing(0333);//move right one bit

	for(var bitIndex = 7;bitIndex >= 0;bitIndex--){
		if(((localAddress>>bitIndex)&1)==1){
			doTheThing(0366);//first data square
		}
		doTheThing(0333);
		if((bitIndex == 6)||(bitIndex == 3)){
			doTheThing(0331);
			doTheThing(0332);		
			doTheThing(0332);		
			doTheThing(0332);		
		}
	}
	doTheThing(0331);//move back to corner
	doTheThing(0337);//back up to 1/2 scale
	doTheThing(0337);//back up to 1 scale
//	doTheThing(0200);//square
	doTheThing(0330);//move forward to make this like other symbol glyphs
}


function initGeometron(){
  var img = new Image();
  var imp = new Image();
  imageIndex = 07;
  spellLine = 800;
  keyStringFull = "`1234567890";
  addressStringFull = "0364,0200,0201,0203,0304,0305,0306,0366,0204,0205,0300,";
  keyStringFull += "qwertyuiop";
  addressStringFull += "0310,0311,0312,0313,0314,0315,0370,0371,0360,0361,";
  keyStringFull += "asdfghjkl;";
  addressStringFull += "0330,0331,0332,0333,0334,0335,0336,0337,0350,0351,";
  keyStringFull += "zxcvbnm,./";
  addressStringFull += "0340,0341,0342,0343,0344,0345,0346,0347,0352,0353,";
  keyStringFull += "!@#$%^&*()";
  addressStringFull += "0207,0210,0211,0212,0213,0214,0215,0216,0217,0220,";
  keyStringFull += "QWERTYUIOP";
  addressStringFull += "0221,0222,0223,0224,0225,0226,0227,0230,0231,0232,";
  keyStringFull += "ASDFGHJKL";
  addressStringFull += "0240,0241,0242,0243,0244,0245,0246,0247,0250";

  addressStringArray = addressStringFull.split(",");
  
  keyboardTable = "0320,0331,0337,01200,040,040,01304,01305,01306,01203,01204,01205,01300,0331,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,01310,01311,01312,01313,01314,01315,01370,01371,01360,01361,0331,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,01330,01331,01332,01333,01334,01335,01336,01337,01350,01351,0331,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,01340,01341,01342,01343,01344,01345,01346,01347,01352,01353";
  
  inPath = false;//move to true after path started, back to false after path ended
  svgFile = [];

  editAddress = 0400;
  tableBottom = 0400;
  tableTop = 0437;

	myWord = "word";
	wordStack = [];
	wordStack.push("Geometron");
	wordStack.push("sub-title");
	wordStack.push("Random Words");
	wordIndex = 0;
	myWord = wordStack[wordIndex];
	myFont = "Futura";

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
  unit = 100;
  scaleFactor = 2;
  side = unit;
  thetaStep = Math.PI/2;
  theta0 = -Math.PI/2; 
  theta = theta0;
  x0 = 400;
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
  
  numPoints = 100;
  domainStart = 0;
  domainStop = 10;
  X = 0;//globals for mathOtron
  Y = 0;
  delta = (domainStop - domainStart)/(numPoints - 1.0);
  domain  = [];
  for(var domainIndex = 0;domainIndex < numPoints;domainIndex++){
  	domain.push(domainStart + domainIndex*delta);
  }
  
//pixels ---> domain units --> function glyph --> codomain/range units --> pixels
//math operations all live in 0700's, as do constants and HP calculator stack
//could I parse latex and output a function glyph?  
//perhaps do this by hand, but display both the glyph sequence for the function and the 
//function graph and the latex and the table

//actual data is a subset of the class of information I call the "domain"

//xy plots can have multiple function glyphs

//image plots can have 2d domain, one dimensional range and codomain

// taken together, this will eat Wolfram's lunch
  
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
	    if((parseInt(tempArray[index],8) >= 040) && (parseInt(tempArray[index],8) <= 0176)){
	    	doTheThing(parseInt(tempArray[index],8));
	    }
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
    
    if(localCommand >= 0400 && localCommand <= 0477){//manuscript page glyphs
		 for(var symbolSearchIndex = 0;symbolSearchIndex < currentTable.length;symbolSearchIndex++){
    		var tempSymbolLocalArray = currentTable[symbolSearchIndex].split(":");
    		if(parseInt(tempSymbolLocalArray[0],8) == localCommand){
    			drawGlyph(tempSymbolLocalArray[1]);
    		}
    	}    
    }
    
    if((localCommand > 01000) && (localCommand < 02000)){
    	for(var symbolSearchIndex = 0;symbolSearchIndex < currentTable.length;symbolSearchIndex++){
    		var tempSymbolLocalArray = currentTable[symbolSearchIndex].split(":");
    		if(parseInt(tempSymbolLocalArray[0],8) == localCommand){
    			if(x > spellLine){
    				y += 1.5*side;
    				x = 2;
    			}
    			drawGlyph(tempSymbolLocalArray[1]);
    		}
    	}
    }
    if((localCommand > 02000)&&(localCommand < 03000)){
    	roctalChar(localCommand - 02000);
    }
    
    //geometric native action commands
    if(localCommand == 0300){
      x = x0;
      y = y0;
      theta = theta0;
      side = unit;
      thetaStep = Math.PI/2;
      scaleFactor = 2;
      			ctx.lineWidth = 2.5;
      	wordIndex = 0;

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
    if(localCommand == 0315){
      scaleFactor = 3.14159;  //pi*
    }    
    if(localCommand == 0317){
       side = unit; 
    }
    if(localCommand == 0320){
		ctx.strokeStyle="black";
    	ctx.lineWidth = 2;    	
    }
    if(localCommand == 0321){
		ctx.strokeStyle="yellow";
    	ctx.lineWidth = 5;    	
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
		
		
    }
    if(localCommand == 0342){   //line
		ctx.beginPath();
//		ctx.lineWidth = 2;
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
   //http://www.w3schools.com/tags/canvas_getimagedata.asp
     img = ctx.getImageData(x,y,side,side);
//ctx.putImageData(imgData,10,70);
    }
    if(localCommand == 0361){//drop image
  //     image(myImage,x,y,int(side),int(side));
//var imgData=ctx.getImageData(10,10,50,50);
       ctx.putImageData(img,x,y);
    }
    if(localCommand == 0362){
	   	backgroundImageOn = false;	
    }
    if(localCommand == 0363){
	   	backgroundImageOn = true;	 
    }
    if(localCommand == 0364){
        ctx.font=side.toString(8) + "px " + myFont;;
		myWord = wordStack[wordIndex];
		ctx.fillText(myWord,x,y);
		wordIndex++;
		if(wordIndex >= wordStack.length){
			wordIndex = 0;
		}
    }
    
	if(localCommand == 0366){//closed square
		ctx.fillRect(x,y,side,side);
		
		
		if(inPath){  //if we're in a path it's over now			
			svgFile.push("\"");
			svgFile.push("style=\"stroke:black;stroke-width:2\" fill=\"none\" />");
			inPath = false;
		}
		localString = "  <rect x=\"";
        localString += x.toString();
        localString += "\" y=\"";
        localString += y.toString();
        localString += "\" height=\"";
        localString += side.toString();    
        localString += "\" width=\"";
        localString += side.toString();     
        localString += "\" stroke=\"black\" stroke-width=\"1\" fill=\"none\" />";
	    svgFile.push(localString);     
	    
   inPath = false;

		
//  <rect width="400" height="100" style="fill:rgb(0,0,255);stroke-width:10;stroke:rgb(0,0,0)" />

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
        imageTable.push("0514:896:463:futura.png");
imageTable.push("0513:477:573:hebrew1.png");
imageTable.push("0514:486:578:hebrew2.png");
imageTable.push("0515:678:214:hebrew3.png");
imageTable.push("0516:817:198:hebrew4.png");


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
    currentTable.push("0060:0313,0304,0336,0336,0330,0333,0330,0330,0343,0331,0331,0334,0334,0343,0332,0334,0334,0337,0342,0332,0342,0336,0331,0337,0337,0350,0350,0335,0350,0350,0335,0350,0334,0311,0337,0310,0336,0342,0337,0311,0336,0335,0351,0334,0351,0351,0334,0304,0333,0336,0336,0332,0337,0337");
    currentTable.push("0061:0304,0313,0335,0336,0342,0336,0330,0334,0337,0337,0342,0330,0334,0350,0334,0336,0336,0310,0337,0342,0336,0313,0335,0351,0335,0337,0331,0331,0333,0336,0336,0332,0337,0337,0337");
    currentTable.push("0062:0304,0313,0335,0336,0342,0336,0330,0334,0330,0330,0330,0343,0331,0331,0331,0332,0337,0337,0306,0350,0335,0342,0334,0304,0333,0336,0336,0332,0337,0337");
    currentTable.push("0063:0313,0304,0336,0336,0330,0333,0335,0343,0332,0332,0343,0334,0350,0343,0331,0331,0335,0335,0335,0335,0343,0330,0334,0334,0334,0334,0304,0333,0336,0333,0337,0337,0337");
    currentTable.push("0064:0333,0336,0332,0337,0342,0336,0330,0334,0342,0330,0335,0350,0335,0342,0334,0351,0331,0337,0336,0333,0336,0333,0337,0337");
    currentTable.push("0065:0313,0304,0336,0336,0330,0333,0335,0343,0335,0335,0350,0334,0350,0334,0343,0334,0351,0351,0331,0331,0331,0334,0342,0335,0335,0342,0330,0334,0342,0330,0342,0330,0334,0342,0330,0333,0333,0334,0333,0336,0333,0337,0337,0337");
    currentTable.push("0066:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0330,0341,0332,0350,0350,0335,0337,0337,0342,0336,0336,0334,0351,0351,0333,0333,0333,0331,0336,0332,0337,0337,0337");
    currentTable.push("0067:0336,0332,0336,0336,0333,0337,0337,0337,0333,0336,0332,0350,0350,0335,0337,0342,0330,0334,0334,0334,0334,0334,0336,0342,0351,0351,0335,0350,0350,0335,0337,0331,0334,0351,0351,0336,0333,0337");
    currentTable.push("0070:0304,0313,0336,0336,0336,0332,0332,0337,0337,0337,0333,0336,0332,0336,0330,0341,0330,0330,0341,0333,0333,0331,0331,0331,0336,0332,0337,0337,0337");
    currentTable.push("0071:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0337,0337,0342,0336,0330,0336,0330,0332,0341,0333,0333,0330,0337,0337,0331");
    currentTable.push("0072:0333,0336,0332,0330,0336,0336,0336,0341,0331,0331,0331,0331,0331,0331,0331,0341,0333,0333,0333,0333,0331,0337,0337,0337,0337");
    currentTable.push("0073:0333,0336,0332,0330,0336,0336,0336,0341,0331,0331,0331,0331,0334,0334,0337,0337,0350,0335,0342,0335,0351,0335,0331,0333,0337,0337");
    currentTable.push("0074:0333,0336,0330,0332,0350,0335,0342,0335,0335,0342,0335,0351,0330,0335,0335,0333,0337");
    currentTable.push("0075:0333,0336,0336,0332,0330,0334,0337,0342,0336,0333,0337,0342,0336,0332,0332,0335,0333,0337,0337");
    currentTable.push("0076:0333,0336,0330,0332,0350,0334,0342,0334,0334,0342,0335,0335,0335,0351,0331,0333");
    currentTable.push("0077:0333,0336,0336,0332,0332,0330,0336,0331,0341,0330,0330,0342,0330,0330,0330,0343,0335,0335,0350,0334,0343,0335,0351,0330,0342,0335,0335,0337,0331,0331,0331,0336,0330,0333,0333,0333,0337,0337,0337");
    currentTable.push("0100:0333,0336,0332,0330,0336,0336,0341,0337,0343,0334,0343,0334,0334,0336,0330,0342,0331,0337,0350,0335,0335,0343,0351,0330,0330,0335,0335,0333,0333,0337,0337");
    currentTable.push("0101:0304,0313,0311,0305,0350,0350,0335,0342,0351,0335,0336,0333,0334,0334,0337,0342,0336,0336,0330,0334,0334,0342,0335,0335,0331,0350,0335,0337,0337,0304,0313,0336,0336,0336,0333,0337,0337,0337");
    currentTable.push("0102:0304,0313,0336,0336,0336,0333,0337,0337,0337,0342,0330,0335,0336,0336,0342,0333,0333,0342,0332,0330,0343,0333,0333,0343,0333,0331,0342,0334,0337,0333,0336,0336,0333,0337,0337,0337,0304,0313");
    currentTable.push("0103:0333,0336,0330,0332,0334,0343,0335,0335,0350,0334,0334,0343,0335,0335,0335,0335,0343,0351,0330,0335,0335,0333,0337,0304,0313");
    currentTable.push("0104:0333,0332,0342,0336,0330,0350,0335,0343,0335,0335,0343,0335,0351,0330,0335,0335,0336,0333,0337,0333,0337,0304,0313");
    currentTable.push("0105:0304,0313,0333,0336,0332,0336,0332,0332,0337,0337,0342,0335,0336,0342,0332,0336,0342,0337,0332,0342,0336,0331,0334,0337,0337,0333,0331,0304,0313");
    currentTable.push("0106:0304,0313,0333,0336,0332,0336,0332,0332,0337,0337,0342,0335,0336,0332,0336,0342,0337,0332,0342,0336,0331,0334,0337,0337,0333,0331,0304,0313");
    currentTable.push("0107:0304,0313,0333,0336,0330,0332,0334,0343,0335,0335,0350,0334,0334,0343,0335,0335,0335,0335,0343,0351,0330,0335,0335,0333,0337,0336,0336,0332,0336,0333,0337,0342,0330,0334,0342,0335,0331,0333,0337,0337,0304,0313");
    currentTable.push("0110:0304,0313,0333,0336,0336,0332,0332,0337,0337,0342,0336,0332,0337,0342,0336,0330,0335,0342,0330,0334,0331,0336,0333,0337,0337,0304,0313");
    currentTable.push("0111:0304,0313,0333,0336,0336,0332,0332,0334,0337,0342,0336,0330,0335,0337,0337,0342,0330,0336,0336,0334,0342,0335,0335,0342,0330,0330,0334,0337,0337,0331");
    currentTable.push("0112:0304,0313,0333,0336,0330,0332,0342,0330,0335,0336,0342,0334,0334,0342,0334,0330,0330,0342,0330,0333,0343,0335,0335,0333,0331,0333,0336,0333,0337,0337,0337");
    currentTable.push("0113:0304,0313,0333,0336,0332,0332,0337,0342,0336,0330,0350,0335,0310,0337,0342,0336,0313,0335,0335,0310,0337,0342,0336,0313,0335,0351,0330,0335,0335,0333,0337,0304,0313,0336,0336,0336,0333,0337,0337,0337");
    currentTable.push("0114:0333,0336,0332,0336,0332,0337,0337,0342,0336,0335,0342,0330,0336,0330,0334,0337,0337");
    currentTable.push("0115:0304,0310,0342,0330,0335,0306,0335,0311,0336,0342,0330,0334,0334,0342,0330,0334,0334,0334,0334,0350,0335,0337,0342,0330,0304,0335,0335,0313,0336,0336,0336,0333,0337,0337,0337");
    currentTable.push("0116:0342,0330,0335,0306,0335,0313,0337,0312,0336,0342,0330,0334,0334,0350,0334,0337,0313,0336,0304,0342,0336,0336,0336,0333,0337,0337,0337");
    currentTable.push("0117:0333,0336,0330,0332,0341,0331,0333,0337");
    currentTable.push("0120:0333,0332,0336,0336,0333,0337,0337,0342,0336,0330,0336,0330,0333,0341,0333,0333,0330,0337,0337,0331");
    currentTable.push("0121:0333,0336,0330,0332,0341,0335,0335,0336,0330,0332,0350,0334,0337,0342,0334,0351,0334,0333,0331,0336,0330,0337,0337");
    currentTable.push("0122:0304,0313,0336,0336,0336,0333,0337,0337,0337,0342,0330,0335,0336,0336,0342,0333,0333,0342,0332,0330,0343,0333,0335,0337,0306,0350,0334,0337,0312,0336,0342,0337,0313,0336,0335,0330,0304,0334,0334,0333,0336,0336,0336,0332,0337,0337,0337,0337");
    //currentTable.push("0123:0333,0336,0330,0332,0336,0330,0350,0335,0335,0334,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0330,0330,0343,0335,0335,0343,0335,0335,0334,0334,0334,0334,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0335,0335,0335,0335,0335,0335,0335,0335,0351,0351,0330,0335,0335,0333,0333,0337,0337");
  currentTable.push("0123:0313,0304,0336,0336,0332,0337,0337,0336,0330,0333,0336,0330,0343,0334,0350,0334,0343,0332,0332,0334,0334,0334,0334,0343,0335,0335,0335,0351,0343,0335,0335,0333,0331,0333,0337,0337");
    currentTable.push("0124:0333,0336,0332,0337,0342,0330,0336,0335,0342,0331,0342,0330,0330,0334,0337,0331");
    currentTable.push("0125:0333,0336,0336,0330,0332,0337,0342,0330,0336,0342,0331,0331,0332,0332,0342,0330,0342,0330,0342,0331,0331,0333,0335,0335,0343,0330,0335,0335,0337,0333,0337");
    currentTable.push("0126:0333,0336,0332,0350,0350,0335,0337,0342,0334,0334,0342,0335,0335,0334,0351,0351,0336,0333,0337");
    currentTable.push("0127:0336,0336,0336,0333,0333,0337,0337,0337,0304,0313,0350,0350,0350,0334,0342,0335,0335,0336,0342,0330,0304,0335,0350,0350,0335,0335,0335,0342,0330,0304,0334,0350,0334,0350,0334,0337,0342,0334,0350,0335,0304,0336,0336,0333,0336,0333,0337,0337,0337");
    currentTable.push("0130:0313,0306,0350,0337,0312,0336,0335,0342,0334,0304,0337,0313,0336,0330,0335,0306,0335,0337,0312,0336,0342,0330,0334,0304,0334,0337,0313,0336,0336,0336,0336,0333,0337,0337,0337");
    currentTable.push("0131:0304,0313,0336,0336,0336,0332,0337,0337,0337,0336,0333,0342,0330,0306,0350,0334,0337,0312,0336,0342,0335,0335,0342,0337,0313,0336,0334,0304,0331,0333,0337,0336,0336,0336,0332,0337,0337,0337");
    currentTable.push("0132:0304,0335,0312,0336,0342,0337,0332,0336,0342,0337,0333,0306,0336,0334,0313,0337,0342,0335,0304,0336,0330,0334,0312,0337,0313,0336,0336,0336,0333,0337,0337,0337");
    currentTable.push("0133:0333,0336,0336,0332,0332,0337,0337,0342,0330,0335,0336,0336,0342,0337,0337,0333,0336,0336,0342,0330,0330,0334,0337,0337");
    currentTable.push("0134:0333,0336,0336,0332,0337,0337,0350,0350,0334,0342,0335,0351,0351,0336,0336,0333,0337,0337");
    currentTable.push("0135:0333,0336,0336,0332,0337,0337,0342,0336,0336,0334,0342,0333,0333,0333,0333,0342,0335,0333,0337,0337,0331");
    currentTable.push("0136:0333,0330,0336,0332,0334,0334,0350,0335,0342,0334,0334,0342,0334,0351,0334,0333,0337,0331");
    currentTable.push("0137:0333,0334,0336,0336,0330,0337,0342,0336,0331,0335,0337,0337");
    currentTable.push("0140:0333,0336,0332,0330,0336,0330,0350,0334,0342,0335,0351,0330,0333,0333,0337,0337,0331");
    currentTable.push("0141:0304,0313,0336,0336,0336,0332,0332,0337,0337,0337,0333,0336,0332,0336,0330,0341,0333,0342,0331,0342,0330,0330,0332,0333,0333,0331,0331,0337,0337,0336,0336,0336,0332,0337,0337,0337,0313,0304");
    currentTable.push("0142:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0332,0337,0337,0342,0336,0336,0330,0333,0341,0333,0333,0331,0337,0337,0336,0336,0336,0332,0337,0337,0337,0304,0313");
    currentTable.push("0143:0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0336,0330,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0330,0330,0334,0334,0351,0331,0336,0332,0337,0337,0337");
    currentTable.push("0144:0333,0336,0336,0332,0332,0337,0337,0342,0336,0336,0330,0332,0341,0333,0333,0331,0337,0337");
    currentTable.push("0145:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0330,0332,0343,0334,0334,0350,0335,0343,0334,0343,0335,0335,0342,0351,0335,0335,0342,0333,0330,0330,0334,0336,0332,0337,0337,0337");
    currentTable.push("0146:0304,0313,0336,0336,0332,0337,0337,,0333,0336,0336,0332,0332,0337,0342,0330,0336,0336,0342,0330,0333,0343,0332,0331,0331,0335,0337,0336,0342,0334,0334,0342,0335,0331,0331,0331,0333,0333,0333,0333,0337,0337,0337,0304,0313,0336,0336,0336,0332,0337,0337,0337");
    currentTable.push("0147:0304,0313,0336,0336,0336,0332,0332,0337,0337,0337,0333,0336,0332,0336,0330,0341,0333,0342,0331,0342,0331,0342,0331,0342,0332,0335,0335,0343,0331,0331,0332,0332,0334,0334,0337,0337,0336,0336,0336,0332,0337,0337,0337");
    currentTable.push("0150:0304,0313,0342,0336,0330,0333,0336,0331,0332,0343,0333,0334,0334,0342,0330,0334,0334,0336,0333,0337,0337,0337");
    currentTable.push("0151:0333,0336,0336,0332,0332,0332,0342,0330,0336,0342,0330,0330,0330,0336,0341,0331,0331,0331,0331,0331,0331,0331,0331,0331,0331,0337,0333,0333,0337,0337,0337");
    currentTable.push("0152:0333,0336,0336,0332,0332,0332,0342,0331,0342,0332,0335,0335,0343,0332,0331,0331,0331,0336,0336,0341,0330,0330,0330,0330,0330,0330,0330,0330,0335,0335,0337,0333,0333,0337,0337,0337");
    currentTable.push("0153:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0332,0337,0342,0330,0336,0342,0331,0350,0335,0342,0335,0335,0310,0337,0342,0336,0313,0334,0351,0334,0331,0333,0336,0333,0337,,0337,0337,0304,0313");
    currentTable.push("0154:0304,0313,0336,0336,0336,0332,0337,0337,0337,0333,0336,0336,0332,0332,0332,0336,0336,0350,0335,0342,0334,0337,0337,0337,0342,0330,0336,0342,0330,0334,0334,0334,0336,0342,0335,0351,0335,0337,0331,0331,0331,0333,0337,0337");
    currentTable.push("0155:0304,0313,0333,0336,0332,0336,0332,0336,0332,0332,0337,0337,0342,0336,0333,0330,0336,0332,0343,0333,0333,0343,0332,0331,0342,0331,0342,0337,0333,0342,0333,0337,0337");
    currentTable.push("0156:0304,0313,0333,0336,0332,0336,0332,0336,0332,0332,0337,0337,0342,0336,0333,0330,0336,0332,0343,0333,0331,0331,0337,0342,0333,0337,0337");
    currentTable.push("0157:0304,0313,0333,0336,0332,0336,0332,0330,0341,0333,0333,0331,0337,0337");
    currentTable.push("0160:0304,0313,0336,0336,0332,0337,0337,,0333,0336,0332,0336,0332,0342,0335,0335,0337,0342,0336,0331,0332,0341,0333,0334,0334,0342,0331,0333,0333,0333,0337,0337");
    currentTable.push("0161:0304,0313,0333,0336,0332,0336,0330,0332,0341,0333,0342,0331,0331,0337,0342,0336,0333,0334,0334,0336,0333,0343,0335,0335,0330,0330,0333,0337,0337,0337");
    currentTable.push("0162:0333,0336,0332,0336,0332,0337,0342,0330,0336,0336,0342,0350,0335,0350,0337,0337,0335,0342,0335,0351,0351,0330,0334,0331,0336,0336,0333,0337,0337,0337");
    currentTable.push("0163:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0330,0336,0330,0350,0343,0334,0334,0343,0334,0350,0334,0343,0334,0351,0330,0330,0343,0334,0334,0343,0334,0334,0335,0343,0334,0351,0331,0333,0333,0337,0337,0337");
    currentTable.push("0164:0304,0313,0333,0336,0332,0342,0330,0336,0342,0334,0342,0335,0335,0342,0333,0333,0336,0330,0335,0343,0335,0335,0333,0333,0333,0337,0337,0337");
    currentTable.push("0165:0304,0313,0336,0336,0330,0342,0333,0334,0334,0343,0332,0334,0334,0342,0334,0334,0342,0330,0335,0335,0336,0333,0337,0337,0337");
    currentTable.push("0166:0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0350,0350,0334,0342,0335,0335,0342,0334,0351,0351,0333,0337,0336,0336,0336,0332,0337,0337,0337");
    currentTable.push("0167:0336,0336,0336,0333,0337,0337,0337,0313,0304,0336,0336,0336,0333,0337,0350,0350,0334,0337,0342,0335,0335,0336,0342,0330,0335,0335,0335,0335,0335,0335,0342,0330,0334,0334,0334,0334,0334,0334,0337,0342,0334,0304,0336,0333,0336,0333,0337,0337,0337");
    currentTable.push("0170:0304,0313,0336,0306,0350,0335,0342,0351,0336,0333,0334,0337,0342,0350,0335,0304,0336,0336,0333,0337,0337,0337");
    currentTable.push("0171:0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0336,0350,0335,0337,0350,0334,0342,0334,0334,0342,0334,0334,0334,0334,0334,0334,0342,0334,0351,0351,0335,0335,0333,0337,0336,0336,0336,0332,0337,0337,0337");
    currentTable.push("0172:0304,0313,0336,0350,0335,0310,0337,0342,0330,0334,0334,0334,0336,0342,0334,0337,0330,0334,0334,0334,0336,0342,0330,0334,0334,0304,0313,0337,0336,0336,0336,0333,0337,0337,0337");
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

currentTable.push("01315:0333,0313,0200,0336,0330,0332,0341,0335,0342,0334,0334,0342,0334,0334,0330,0334,0331,0337")    
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
    
currentTable.push("01344:0304,0313,0333,0200,0336,0332,0344,0333,0337");    
currentTable.push("01345:0304,0313,0333,0200,0336,0332,0345,0333,0337");    
currentTable.push("01346:0304,0313,0333,0200,0336,0332,0346,0333,0337");    
currentTable.push("01347:0304,0313,0333,0200,0336,0332,0347,0333,0337");    
    currentTable.push("01350:0333,0200,0336,0330,0332,0350,0335,0342,0335,0335,0342,0334,0336,0336,0342,0330,0330,0342,0331,0331,0351,0337,0337,0334,0333,0331,0337");
    currentTable.push("01351:0333,0200,0336,0332,0330,0350,0335,0336,0336,0342,0330,0330,0342,0330,0330,0342,0331,0331,0331,0331,0335,0337,0337,0342,0335,0342,0334,0351,0333,0330,0334,0337");
    currentTable.push("01352:0333,0200,0336,0330,0332,0335,0350,0352,0334,0334,0334,0342,0335,0335,0336,0336,0342,0330,0330,0342,0331,0331,0335,0335,0342,0330,0330,0342,0331,0331,0335,0335,0337,0337,0342,0335,0335,0335,0351,0353,0330,0334,0334,0333,0337");
    currentTable.push("01353:0333,0200,0336,0330,0332,0335,0350,0352,0334,0342,0335,0335,0342,0335,0335,0336,0336,0342,0330,0330,0342,0331,0331,0334,0334,0334,0334,0334,0334,0342,0330,0330,0342,0331,0331,0335,0335,0335,0351,0353,0337,0337,0333,0330,0334,0337");
    currentTable.push("01360:0333,0200,0336,0336,0330,0332,0332,0330,0341,0332,0334,0336,0342,0330,0334,0337,0342,0330,0336,0342,0330,0334,0337,0337,0342,0330,0336,0342,0330,0334,0342,0330,0336,0342,0330,0334,0342,0335,0333,0337,0337,0331,0337");
    currentTable.push("01361:0333,0200,0336,0330,0332,0336,0350,0343,0334,0343,0334,0343,0335,0335,0335,0335,0343,0334,0334,0351,0331,0334,0336,0330,0342,0330,0334,0342,0330,0334,0342,0330,0342,0330,0342,0330,0342,0330,0334,0342,0330,0334,0342,0335,0333,0333,0331,0331,0337,0337,0337");

currentTable.push("01364:0313,0304,0333,0200,0336,0330,0332,0336,0331,0332,0337,0350,0350,0334,0342,0335,0335,0342,0334,0304,0333,0350,0350,0334,0342,0335,0335,0342,0334,0304,0336,0333,0331,0337,0337");

currentTable.push("01366:0304,0313,0333,0200,0336,0330,0332,0336,0330,0332,0337,0366,0336,0330,0332,0337,0337,0333,0331");
    currentTable.push("01370:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0333,0335,0306,0342,0336,0331,0337,0337,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0304,0334,0333,0333,0336,0336,0332,0337,0337,0337,0331,0337");
    currentTable.push("01371:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0336,0331,0331,0331,0333,0335,0337,0337,0306,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0304,0330,0330,0336,0336,0331,0334,0337,0337,0337,0331,0336,0336,0336,0330,0337,0337,0337,0337");
    currentTable.push("01372:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0336,0331,0333,0337,0337,0342,0330,0335,0342,0330,0335,0342,0330,0335,0342,0330,0335,0333,0333,0336,0336,0332,0337,0337,0337,0331,0336,0336,0336,0330,0337,0337,0337,0337");
    currentTable.push("01373:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0331,0331,0336,0330,0333,0337,0337,0342,0330,0335,0342,0330,0335,0342,0330,0335,0342,0330,0335,0333,0333,0331,0331,0336,0336,0330,0332,0337,0337,0337,0337");
    currentTable.push("01374:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0333,0335,0305,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0334,0333,0333,0333,0331,0331,0331,0331,0337,0337,0337");
    currentTable.push("01375:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0331,0331,0333,0330,0335,0305,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0330,0330,0330,0334,0331,0331,0331,0331,0337,0337,0337");
    currentTable.push("01376:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0335,0330,0306,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0330,0330,0330,0334,0337,0337,0331,0337");
    currentTable.push("01377:0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0331,0333,0335,0306,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0333,0330,0330,0330,0334,0331,0331,0331,0337,0337,0337");
    currentTable.push("01200:0333,0200,0336,0336,0330,0332,0337,0200,0336,0331,0333,0337,0337");
    currentTable.push("01201:0304,0313,0333,0200,0201,0304");
    currentTable.push("01202:0333,0200,0336,0332,0330,0200,0310,0202,0202,0202,0202,0334,0334,0337,0337,0337,0337,0313,0333,0331,0337");
    currentTable.push("01203:0333,0203,0336,0336,0330,0337,0330,0332,0341,0342,0335,0342,0335,0342,0335,0342,0350,0304,0336,0333,0333,0331,0331,0337,0337,0200");
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
    currentTable.push("0203:0306,0351");
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

currentTable.push("0226:0342,0336,0330,0336,0344,0335,0335,0333,0333,0344,0344,0335,0335,0333,0331,0331,0335,0335,0333,0330,0330,0334,0334,0345,0335,0335,0332,0332,0345,0335,0335,0330,0330,0337,0337");


currentTable.push("0227:0342,0330,0330,0335,0330,0342,0330,0330,0335,0330,0342,0330,0335,0330,0332,0342,0333,0335,0335,0330,0335,0336,0342,0333,0330,0350,0334,0343,0333,0334,0334,0334,0334,0334,0342,0330,0330,0330,0342,0330,0335,0333,0334,0334,0343,0333,0334,0334,0334,0334,0334,0342,0330,0330,0330,0342,0330,0335,0333,0334,0334,0343,0333,0335,0335,0335,0342,0330,0330,0330,0342,0330,0335,0335,0330,0334,0334,0334,0343,0333,0335,0335,0335,0342,0304,0335,0335,0332,0332,0332,0332,0332,0331");

currentTable.push("0230:0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0110,0333,0336,0330,0333,0337,0337,0337");

currentTable.push("0231:0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0130,0333,0336,0330,0333,0337,0337,0337");
currentTable.push("0232:0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0131,0333,0336,0330,0333,0337,0337,0337");
currentTable.push("0233:0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0132,0333,0336,0330,0333,0337,0337,0337");
currentTable.push("0234:0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0133,0333,0336,0330,0333,0337,0337,0337");

currentTable.push("0240:0304,0313,0335,0342,0330,0336,0331,0340,0335,0342,0334,0334,0333,0337");

currentTable.push("0241:0304,0313,0335,0342,0336,0330,0334,0342,0336,0336,0341,0337,0337,0333,0337");


currentTable.push("0242:0304,0313,0335,0336,0336,0342,0330,0334,0342,0337,0342,0330,0335,0342,0330,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0342,0330,0335,0342,0330,0333,0336,0333,0331,0337,0306,0343,0350,0335,0310,0337,0342,0330,0336,0336,0336,0336,0336,0335,0335,0335,0335,0335,0342,0335,0335,0342,0335,0335,0335,0335,0335,0337,0337,0337,0337,0337,0331,0336,0334,0313,0304,0336,0331,0332,0332,0332,0330,0330,0332,0337,0337");

currentTable.push("0243:0335,0331,0331,0344,0332,0332,0334,0334,0344,0331,0331,0335,0335,0333,0330,0330,0334,0334,0332,0345,0333,0333,0335,0335,0345,0334,0332,0332");

currentTable.push("0244:0304,0313,0331,0337,0342,0336,0336,0333,0334,0334,0350,0335,0343,0334,0330,0334,0334,0351,0337,0337,0342,0330,0342,0330,0336,0336,0332,0350,0335,0343,0334,0330,0334,0334,0351,0337,0337,0342,0330,0336,0336,0332,0350,0335,0343,0334,0330,0334,0334,0351,0337,0337,0337,0342,0330,0335,0336,0336,0336,0331,0350,0334,0343,0335,0304,0331,0331,0337");

currentTable.push("0245:0342,0304,0313,0330,0336,0336,0336,0350,0335,0335,0335,0342,0335,0335,0342,0335,0335,0335,0351,0337,0337,0337,0331");

currentTable.push("0246:0304,0313,0336,0336,0330,0335,0342,0330,0335,0342,0330,0334,0350,0334,0337,0310,0337,0342,0330,0334,0334,0342,0330,0334,0334,0334,0336,0313,0336,0342,0330,0335,0335,0342,0304,0330,0335,0330,0337,0337,0331");

currentTable.push("0247:0304,0313,0336,0336,0330,0335,0337,0337,0342,0336,0332,0337,0342,0333,0334,0336,0330,0336,0331,0337,0337");

currentTable.push("0250:0336,0336,0336,0336,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0337,0337,0337,0337");

currentTable.push("0400:0300");	
currentTable.push("0401:0300,0240,0331,0332,0241,0240,0332,0331,0332,0231,0241,0230,0241,0330,0332,0332,0335,0342,0330,0334,0240,0330,0335,0334,0332,0332,0332,0230,0231,0232,0242,0331,0335,0342,0330,0342,0330,0334,0242,0332,0331,0332,0335,0342,0330,0342,0330,0342,0330,0342,0330,0334,0242,0300,0332,0332,0336,0333,0333,061,0332,0342,0333,0350,0335,0310,0336,0342,0330,0334,0334,0342,0330,0335,0337,0331,0304,0331,0331,0331,0332,0332,0332");
currentTable.push("0402:0300,0342,0330,0350,0334,0342,0330,0334,0342,0330,0335,0335,0335,0335,0351,0332,0342,0330,0334,0310,0337,0342,0330,0333,0335,0350,0335,0337,0342,0330,0334,0312,0337,0342,0330,0334,0334,0342,0336,0310,0336,0335,0335,0330,0334,0334,0337,0337,0342,0335,0335,0335,0336,0336,0342,0330,0334,0313,0337,0342,0330,0335,0335,0310,0336,0342,0330,0334,0334,0342,0304,0335,0336,0330,0335,0337,0337,0337,0342,0330,0350,0335,0342,0330,0336,0336,0336,0336,0342,0330,0334,0342,0330,0336,0336,0342,0330,0334,0337,0337,0342,0330,0334,0342,0300");
currentTable.push("0403:0300,0330,0330,0330,0332,0332,0332,0124,0111,0124,0114,0105,0340,0331,0332,0330,0331,0332,0332,0336,0336,0167,0157,0162,0144,0163,0331,0331,0331,0331,0331,0331,0331,0331,0331,0331,0337,0337,0214,0211,0333,0333");
currentTable.push("0404:0300,0336,0332,0332,0332,0332,0332,0332,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0335,0342,0330,0342,0330,0335,0336,0336,0330,0333,0337,0364,0333,0333,0333,0333,0333,0336,0332,0331,0350,0334,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0334,0334,0336,0331,0335,0335,0304,0313,0336,0332,0334,0342,0331,0331,0335,0335,0342,0334,0337,0337,0337,0342,0336,0336,0336,0332,0332,0337,0337,0337,0342,0330,0336,0336,0336,0334,0342,0331,0331,0331,0342,0350,0335,0337,0310,0337,0342,0330,0334,0334,0342,0335,0336,0351,0313,0342,0330,0335,0337,0337,0342,0336,0336,0333,0333,0334,0342,0335,0337,0337,0342,0330,0334,0336,0342,0336,0331,0332,0332,0332,0330,0336,0330,0332,0337,0364,0331,0331,0331,0331");
currentTable.push("0405:0300,0336,0331,0337,0214,0330,0331,0331,0331,0330,0333,0211,0334,0342,0330,0340,0330,0334,0334,0342,0342,0335,0210,0334,0342,0330,0340,0342,0335,0336,0336,0342,0330,0337,0337,0336,0337,0212,0330,0336,0336,0330,0337,0342,0330,0337,0217,0333,0333,0333,0333,0331,0332,0332,0336,0336,0332,0332,0331,0337,0103,0332,0332,0332,0332,0332,0332,0332,0332,0336,0333,0337,0122,0333,0333,0333,0333,0333,0333,0333,0333,0332,0332,0332,0332,0332,0114,0330,0330,0330,0333,0333,0333,0330,0332,0332,0332,0332,0332,0332,0332,0332,0364");
currentTable.push("0406:0300,0332,0310,0336,0313,0332,0333,0333,0247,0332,0247,0333,0333,0246,0330,0332,0332,0335,0335,0246,0335,0335,0336,0331,0335,0336,0334,0336,0331,0332,0332,0337,0364,0332,0332,0332,0332,0332,0332,0332,0332,0337,0332,0332,0244,0364,0333,0333,0333,0333,0333,0333,0333,0333,0333,0333,0333,0333,0332,0336,0333,0337,0244,0364");
currentTable.push("0407:0300");
currentTable.push("0410:0300");
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
currentTable.push("0437:0300,0330,0332,0332,0332,0332,0332,0330,0330,0123,0114,0111,0104,0105,040,0124,0111,0124,0114,0105,0330,0330,0330,0330,0330,0330,0332,0332,0332,0332,0300,0330,0332,0332,0332,0330,0336,0336,0336,0341,0337,0331,0333,0337,0142,0165,0154,0154,0145,0164,040,0160,0157,0151,0156,0164,0337,0337,0337,0336,0336,0336,0330,0331,0331,0331,0331,0331,0331,0331,0332,0332,0332,0332,0337,0214,0330,0331,0331,0331,0330,0333,0211,0334,0342,0330,0340,0330,0334,0334,0342,0342,0335,0210,0334,0342,0330,0340,0342,0335,0336,0336,0342,0330,0337,0337,0336,0337,0212,0330,0336,0336,0330,0337,0342,0330,0337,0217,0333,0333,0333,0333,0331,0332,0332,0336,0336,0332,0332,0331,0337,,0103,0332,0332,0332,0332,0332,0332,0332,0332,0336,0333,0337,0122,0333,0333,0333,0333,0333,0333,0333,0333,0332,0332,0332,0332,0332,0114");


}