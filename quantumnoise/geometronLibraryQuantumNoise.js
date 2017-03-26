/*
Quantum  noise and amplification instance of geometron library

This sprang from the geoemtron library 3 and was split off by lafe spietz on Wed. March 22, 2017 in Arlington VA USA

*/

function initGeometron(){
  var currentImage = new Image();

  canvasIndex = 0;

  inPath = false;//move to true after path started, back to false after path ended
  svgFile = [];

  currentAddress = 0400;
  currentSymbolAddress = 0300;
  editAddress = 0400;
  tableBottom = 0400;
  tableTop = 0437;

	wordStack = [];
	wordStack.push("Geometron");
	wordIndex = 0;
	myWord = wordStack[wordIndex];
	myFont = "Futura";

	currentWord = "Word";
	currentText = "text";
	currentImageURL = "https://upload.wikimedia.org/wikipedia/commons/7/7b/OlympicMarmot1_%28mirrored%29.jpg";
  
  /*
  
  I'm now changing the format so that the currentTable that is in memory is just action glyphs, with no address or colon at the beginning.  Length is always 02000, and address = index.  Some elements are simply empty and I test for that in code with (if currentTable[index] != undefined){} tests
  
  */

  	currentTable = []; 
	for(var index = 0;index < 01777;index ++){
		currentTable.push("");
	}

  
  
  phi = 0.5*(Math.sqrt(5) + 1);
  unit = 100;
  scaleFactor = 2;
  side = unit;
  thetaStep = Math.PI/2;
  theta0 = -Math.PI/2; 
  theta = theta0;
  slideWidth = 6*unit;
  slideHeight = 4*unit;
  x0 = 3*unit;
  y0 = 2*unit;
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
  loadTable();
	for(var addr = 040;addr < 0176;addr++){
		currentTable[addr + 01000] = currentTable[addr];
	}
	currentGlyph = currentTable[currentAddress];  
	currentGlyphArray = currentGlyph.split(",");
	cursorPosition = currentGlyphArray.length;


}

function byteCode2function(localByteCode){
	var array1 = localByteCode.split("\n");	
	var tempText = "";
	for(var index = 0;index < array1.length;index++){
		tempText += "if(localCommand == ";
		tempText += array1[index].split(":")[0];
		tempText += "){\n";
		tempText += byteCode2string(array1[index].split(":")[1]);
		tempText += "\n}\n";
	}
	 return tempText;
}


function function2byteCode(localFunction){
	rootArray = localFunction.split("localCommand");
	rootArray.reverse();
	rootArray.pop();
	rootArray.reverse();
	
	var outputText = "";
	for(var index = 0;index < rootArray.length;index++){

		var leftTwiddle = rootArray[index].split('{');
		leftTwiddle.reverse();
		var localAddr = leftTwiddle.pop();
	
		localAddr = localAddr.split("==")[1].split(")")[0];
	
		//console.log( localAddr );
		leftTwiddle.reverse();	
		rootArray[index] = "";
		for(var leftIndex = 0;leftIndex < leftTwiddle.length - 1;leftIndex++){
			rootArray[index] += leftTwiddle[leftIndex];
			rootArray[index] += "{";	
		} 
		rootArray[index] += leftTwiddle[leftTwiddle.length - 1];


		var rightTwiddle = rootArray[index].split('}');
		rightTwiddle.pop();
		rootArray[index] = "";
		for(var rightIndex = 0;rightIndex < rightTwiddle.length - 1;rightIndex++){
			rootArray[index] += rightTwiddle[leftIndex];
			rootArray[index] += "}";	
		} 
		rootArray[index] += rightTwiddle[rightTwiddle.length - 1];
				
		outputText +=localAddr + ":" + string2byteCode(rootArray[index]) + "\n";

	}
	return outputText;
}


function byteCode2string(localByteCode){
	var localString = "";
	var stringArray = localByteCode.split(",");
	for(var index = 0;index < stringArray.length;index++){
		var myCharCode = String.fromCharCode(parseInt(stringArray[index],8));
		if(parseInt(stringArray[index],8) >= 040 && parseInt(stringArray[index],8) < 0177 ){
			localString += myCharCode;
		}
		if(parseInt(stringArray[index],8) == 012){
			localString += myCharCode;
		}
		if(parseInt(stringArray[index],8) == 011){
			localString += myCharCode;
		}
		
	}
	return localString;
}

function string2byteCode(localString){
	var localByteCode = "";
	for(var stringIndex = 0;stringIndex < localString.length;stringIndex++){
		var tempCharCode = localString.charCodeAt(stringIndex);
		if(tempCharCode != 0){
			localByteCode += "0";
			localByteCode += tempCharCode.toString(8);
			localByteCode += ",";
		}
	}
	return localByteCode;
}

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


function rootMagic(localCommand){//plain geoemetron canvas
	if(localCommand == 0001){
		slideWidth = 6*unit;

		var newCanvas = document.createElement("CANVAS");
		newCanvas.setAttribute("width", slideWidth.toString());
		newCanvas.setAttribute("height", slideHeight.toString());
		newCanvas.setAttribute("style", "border:1px solid;");
		var canvasName = "canvas" + canvasIndex.toString();
		newCanvas.setAttribute("id",canvasName);
		var divName = "div" + canvasIndex.toString();
		var newDiv  = document.createElement("DIV");
		newDiv.setAttribute("id",divName);
		newDiv.appendChild(newCanvas);      						
		var canvasesDiv = document.getElementById("canvases");
		canvasesDiv.insertBefore(newDiv, canvasesDiv.childNodes[0]);   
		//assumes currentGlyph set somewhere
		ctx = document.getElementById("canvas" + canvasIndex.toString()).getContext("2d");
		drawGlyph(currentGlyph);
		canvasIndex++;
	}
	
	if(localCommand == 0002){ //geoemetron on top of an image 
		var img = new Image();		
		
		img.onload = function() {
			slideWidth = 6*unit*(2*img.width/(3*img.height));//height fixed, img determines aspect ratio
			var newCanvas = document.createElement("CANVAS");
			newCanvas.setAttribute("width", slideWidth.toString());
			newCanvas.setAttribute("height", slideHeight.toString());
			newCanvas.setAttribute("style", "border:1px solid;");
			var canvasName = "canvas" + canvasIndex.toString();
			newCanvas.setAttribute("id",canvasName);
			var divName = "div" + canvasIndex.toString();
			var newDiv  = document.createElement("DIV");
			newDiv.setAttribute("id",divName);
			newDiv.appendChild(newCanvas);      						
			var canvasesDiv = document.getElementById("canvases");
			canvasesDiv.insertBefore(newDiv, canvasesDiv.childNodes[0]);   
			//assumes currentGlyph set somewhere
			ctx = document.getElementById("canvas" + canvasIndex.toString()).getContext("2d");
			ctx.drawImage(img,0,0,img.width,img.height,0,0,slideWidth,slideHeight);	
			x0 = slideWidth/2;
			drawGlyph(currentGlyph);
			x0 = 3*unit;
		};	
	img.src = currentImageURL;	
	canvasIndex++;	
	}
	
	if(localCommand == 003){//text, including mathjax
		var divName = "div" + canvasIndex.toString();
		var newDiv  = document.createElement("DIV");
		newDiv.setAttribute("id",divName);
		newDiv.innerHTML = currentText;//set currentText elsewhere      						
		var canvasesDiv = document.getElementById("canvases");
		canvasesDiv.insertBefore(newDiv, canvasesDiv.childNodes[0]);   
		MathJax.Hub.Typeset();//tell Mathjax to update the math
		canvasIndex++;
	}
	
	if(localCommand == 004){//spelling canvas
		rootMagic(01);
		
			
	}
		
}



function drawGlyph(localString){
	var tempArray = localString.split(',');
	for(var index = 0;index < tempArray.length;index++){
		doTheThing(parseInt(tempArray[index],8));
	}
}



function doTheThing(localCommand){

    if(localCommand >= 0500 && localCommand <= 0600){
		if(currentTable[localCommand] != undefined){
    	 	currentImageURL = byteCode2string(currentTable[localCommand]);
    	}
    }
    
    
    if(localCommand >= 0600 && localCommand < 0700){
    	//get the glyph, turn it into ascii, make it the Word:
    	if(currentTable[localCommand] != undefined){
    	 	currentWord = byteCode2string(currentTable[localCommand]);
    	}	
    }
    if(localCommand >= 01600 && localCommand < 01700){
    	//get the glyph, turn it into ascii, make it the Word:
    	if(currentTable[localCommand] != undefined){
    	 	currentWord = byteCode2string(currentTable[localCommand]);
    	}	
    }
    
    if(localCommand < 010){
    	localRoot(localCommand);
    }
    
    if(localCommand == 0012){
		//reserve this for "\n" newline
		drawGlyph("0331,0331,0332,0332,0332,0332,0332,0332,0332,0332,");
	}
	
    if(localCommand >= 0040 && localCommand <= 0277){//and fonts
		 drawGlyph(currentTable[localCommand]);    	    
    }
    
    if(localCommand >= 0400 && localCommand <= 0477){//manuscript page glyphs
		drawGlyph(currentTable[localCommand]);    	    
    }
    
    if((localCommand > 01000) && (localCommand < 02000)){
		drawGlyph(currentTable[localCommand]);    	    
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
      ctx.strokeStyle="black";
      ctx.fillStyle="black";

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
    	ctx.lineWidth = 35;    	
    }
    if(localCommand == 0322){
		ctx.strokeStyle="black";
    	ctx.lineWidth = 35;    	
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
	  //  ctx.stroke();

	    
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
     currentImage = ctx.getImageData(x,y,side,side);
//ctx.putImageData(imgData,10,70);
    }
    if(localCommand == 0361){//drop image
  //     image(myImage,x,y,int(side),int(side));
//var imgData=ctx.getImageData(10,10,50,50);
       ctx.putImageData(currentImage,x,y);
    }
    if(localCommand == 0362){
	   	backgroundImageOn = false;	
    }
    if(localCommand == 0363){
	   	backgroundImageOn = true;	 
    }
    if(localCommand == 0364){
        ctx.font=side.toString(8) + "px " + myFont;
		myWord = wordStack[wordIndex];
		ctx.fillText(myWord,x,y);
		wordIndex++;
		if(wordIndex >= wordStack.length){
			wordIndex = 0;
		}
    }
    if(localCommand == 0365){
        ctx.font=side.toString(8) + "px " + myFont;
		ctx.fillText(currentWord,x,y);
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
	currentTable[0040] = "0333";
currentTable[0041] = "0333,0336,0336,0332,0332,0332,0330,0336,0331,0336,0341,0330,0330,0330,0337,0337,0337,0342,0336,0336,0336,0331,0331,0331,0331,0331,0337,0337,0333,0337,0337";
currentTable[0042] = "0333,0330,0336,0332,0336,0332,0331,0342,0333,0342,0333,0330,0337,0337,0331";
currentTable[0043] = "0333,0336,0336,0332,0332,0332,0333,0336,0332,0337,0337,0337,0342,0336,0336,0333,0337,0337,0342,0336,0336,0332,0332,0336,0332,0330,0330,0330,0335,0337,0337,0337,0342,0336,0336,0336,0332,0332,0337,0337,0337,0342,0336,0336,0336,0332,0332,0332,0337,0337,0337,0330,0334,0331";
currentTable[0044] = "0333,0336,0330,0332,0336,0330,0350,0335,0335,0334,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0330,0330,0343,0335,0335,0343,0335,0335,0334,0334,0334,0334,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0335,0335,0335,0335,0335,0335,0335,0335,0351,0351,0330,0335,0335,0333,0333,0337,0337,0336,0332,0337,0342,0336,0333,0337";
currentTable[0045] = "0333,0336,0332,0332,0350,0335,0337,0310,0337,0342,0336,0313,0334,0351,0336,0336,0330,0330,0330,0333,0341,0331,0331,0331,0333,0333,0330,0341,0333,0331,0337,0337";
currentTable[0046] = "0333,0336,0332,0330,0336,0330,0341,0331,0334,0350,0334,0342,0334,0330,0343,0335,0335,0343,0334,0334,0334,0334,0334,0334,0351,0333,0350,0334,0342,0335,0335,0335,0335,0342,0334,0334,0336,0342,0334,0351,0331,0331,0333,0333,0337,0337,0337";
currentTable[0047] = "0333,0336,0330,0332,0336,0330,0342,0333,0333,0331,0331,0331,0337,0337";
currentTable[0050] = "0333,0336,0330,0334,0331,0331,0337,0337,0350,0350,0350,0343,0350,0334,0334,0343,0335,0335,0335,0335,0335,0343,0334,0334,0334,0351,0351,0351,0351,0336,0330,0335,0336,0332,0331,0337";
currentTable[0051] = "0333,0336,0330,0335,0337,0331,0331,0337,0350,0350,0350,0343,0350,0334,0334,0343,0335,0335,0335,0335,0343,0334,0334,0351,0351,0351,0351,0330,0335,0335,0335,0336,0336,0331,0336,0333,0337,0337";
currentTable[0052] = "0333,0336,0332,0330,0352,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0353,0331,0333,0337";
currentTable[0053] = "0333,0336,0330,0332,0336,0342,0335,0342,0335,0342,0335,0342,0335,0331,0331,0333,0333,0337,0337";
currentTable[0054] = "0333,0336,0332,0336,0334,0350,0334,0342,0335,0351,0335,0333,0337,0337";
currentTable[0055] = "0333,0336,0330,0332,0335,0336,0342,0331,0342,0333,0333,0330,0330,0330,0334,0337,0337";
currentTable[0056] = "0333,0336,0332,0336,0336,0341,0333,0333,0333,0337,0337,0337";
currentTable[0057] = "0333,0332,0350,0335,0310,0337,0342,0336,0313,0334,0351,0333";
currentTable[0060] = "0313,0304,0336,0336,0330,0333,0330,0330,0343,0331,0331,0334,0334,0343,0332,0334,0334,0337,0342,0332,0342,0336,0331,0337,0337,0350,0350,0335,0350,0350,0335,0350,0334,0311,0337,0310,0336,0342,0337,0311,0336,0335,0351,0334,0351,0351,0334,0304,0333,0336,0336,0332,0337,0337";
currentTable[0061] = "0304,0313,0335,0336,0342,0336,0330,0334,0337,0337,0342,0330,0334,0350,0334,0336,0336,0310,0337,0342,0336,0313,0335,0351,0335,0337,0331,0331,0333,0336,0336,0332,0337,0337,0337";
currentTable[0062] = "0304,0313,0335,0336,0342,0336,0330,0334,0330,0330,0330,0343,0331,0331,0331,0332,0337,0337,0306,0350,0335,0342,0334,0304,0333,0336,0336,0332,0337,0337";
currentTable[0063] = "0313,0304,0336,0336,0330,0333,0335,0343,0332,0332,0343,0334,0350,0343,0331,0331,0335,0335,0335,0335,0343,0330,0334,0334,0334,0334,0304,0333,0336,0333,0337,0337,0337";
currentTable[0064] = "0333,0336,0332,0337,0342,0336,0330,0334,0342,0330,0335,0350,0335,0342,0334,0351,0331,0337,0336,0333,0336,0333,0337,0337";
currentTable[0065] = "0313,0304,0336,0336,0330,0333,0335,0343,0335,0335,0350,0334,0350,0334,0343,0334,0351,0351,0331,0331,0331,0334,0342,0335,0335,0342,0330,0334,0342,0330,0342,0330,0334,0342,0330,0333,0333,0334,0333,0336,0333,0337,0337,0337";
currentTable[0066] = "0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0330,0341,0332,0350,0350,0335,0337,0337,0342,0336,0336,0334,0351,0351,0333,0333,0333,0331,0336,0332,0337,0337,0337";
currentTable[0067] = "0336,0332,0336,0336,0333,0337,0337,0337,0333,0336,0332,0350,0350,0335,0337,0342,0330,0334,0334,0334,0334,0334,0336,0342,0351,0351,0335,0350,0350,0335,0337,0331,0334,0351,0351,0336,0333,0337";
currentTable[0070] = "0304,0313,0336,0336,0336,0332,0332,0337,0337,0337,0333,0336,0332,0336,0330,0341,0330,0330,0341,0333,0333,0331,0331,0331,0336,0332,0337,0337,0337";
currentTable[0071] = "0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0337,0337,0342,0336,0330,0336,0330,0332,0341,0333,0333,0330,0337,0337,0331";
currentTable[0072] = "0333,0336,0332,0330,0336,0336,0336,0341,0331,0331,0331,0331,0331,0331,0331,0341,0333,0333,0333,0333,0331,0337,0337,0337,0337";
currentTable[0073] = "0333,0336,0332,0330,0336,0336,0336,0341,0331,0331,0331,0331,0334,0334,0337,0337,0350,0335,0342,0335,0351,0335,0331,0333,0337,0337";
currentTable[0074] = "0333,0336,0330,0332,0350,0335,0342,0335,0335,0342,0335,0351,0330,0335,0335,0333,0337";
currentTable[0075] = "0333,0336,0336,0332,0330,0334,0337,0342,0336,0333,0337,0342,0336,0332,0332,0335,0333,0337,0337";
currentTable[0076] = "0333,0336,0330,0332,0350,0334,0342,0334,0334,0342,0335,0335,0335,0351,0331,0333,0337,";
currentTable[0077] = "0333,0336,0336,0332,0332,0330,0336,0331,0341,0330,0330,0342,0330,0330,0330,0343,0335,0335,0350,0334,0343,0335,0351,0330,0342,0335,0335,0337,0331,0331,0331,0336,0330,0333,0333,0333,0337,0337,0337";
currentTable[0100] = "0333,0336,0332,0330,0336,0336,0341,0337,0343,0334,0343,0334,0334,0336,0330,0342,0331,0337,0350,0335,0335,0343,0351,0330,0330,0335,0335,0333,0333,0337,0337";
currentTable[0101] = "0304,0313,0311,0305,0350,0350,0335,0342,0351,0335,0336,0333,0334,0334,0337,0342,0336,0336,0330,0334,0334,0342,0335,0335,0331,0350,0335,0337,0337,0304,0313,0336,0336,0336,0333,0337,0337,0337";
currentTable[0102] = "0304,0313,0336,0336,0336,0333,0337,0337,0337,0342,0330,0335,0336,0336,0342,0333,0333,0342,0332,0330,0343,0333,0333,0343,0333,0331,0342,0334,0337,0333,0336,0336,0333,0337,0337,0337,0304,0313";
currentTable[0103] = "0333,0336,0330,0332,0334,0343,0335,0335,0350,0334,0334,0343,0335,0335,0335,0335,0343,0351,0330,0335,0335,0333,0337,0304,0313";
currentTable[0104] = "0333,0332,0342,0336,0330,0350,0335,0343,0335,0335,0343,0335,0351,0330,0335,0335,0336,0333,0337,0333,0337,0304,0313";
currentTable[0105] = "0304,0313,0333,0336,0332,0336,0332,0332,0337,0337,0342,0335,0336,0342,0332,0336,0342,0337,0332,0342,0336,0331,0334,0337,0337,0333,0331,0304,0313";
currentTable[0106] = "0304,0313,0333,0336,0332,0336,0332,0332,0337,0337,0342,0335,0336,0332,0336,0342,0337,0332,0342,0336,0331,0334,0337,0337,0333,0331,0304,0313";
currentTable[0107] = "0304,0313,0333,0336,0330,0332,0334,0343,0335,0335,0350,0334,0334,0343,0335,0335,0335,0335,0343,0351,0330,0335,0335,0333,0337,0336,0336,0332,0336,0333,0337,0342,0330,0334,0342,0335,0331,0333,0337,0337,0304,0313";
currentTable[0110] = "0304,0313,0333,0336,0336,0332,0332,0337,0337,0342,0336,0332,0337,0342,0336,0330,0335,0342,0330,0334,0331,0336,0333,0337,0337,0304,0313";
currentTable[0111] = "0304,0313,0333,0336,0336,0332,0332,0334,0337,0342,0336,0330,0335,0337,0337,0342,0330,0336,0336,0334,0342,0335,0335,0342,0330,0330,0334,0337,0337,0331";
currentTable[0112] = "0304,0313,0333,0336,0330,0332,0342,0330,0335,0336,0342,0334,0334,0342,0334,0330,0330,0342,0330,0333,0343,0335,0335,0333,0331,0333,0336,0333,0337,0337,0337";
currentTable[0113] = "0304,0313,0333,0336,0332,0332,0337,0342,0336,0330,0350,0335,0310,0337,0342,0336,0313,0335,0335,0310,0337,0342,0336,0313,0335,0351,0330,0335,0335,0333,0337,0304,0313,0336,0336,0336,0333,0337,0337,0337";
currentTable[0114] = "0333,0336,0332,0336,0332,0337,0337,0342,0336,0335,0342,0330,0336,0330,0334,0337,0337";
currentTable[0115] = "0304,0310,0342,0330,0335,0306,0335,0311,0336,0342,0330,0334,0334,0342,0330,0334,0334,0334,0334,0350,0335,0337,0342,0330,0304,0335,0335,0313,0336,0336,0336,0333,0337,0337,0337";
currentTable[0116] = "0342,0330,0335,0306,0335,0313,0337,0312,0336,0342,0330,0334,0334,0350,0334,0337,0313,0336,0304,0342,0336,0336,0336,0333,0337,0337,0337";
currentTable[0117] = "0333,0336,0330,0332,0341,0331,0333,0337";
currentTable[0120] = "0333,0332,0336,0336,0333,0337,0337,0342,0336,0330,0336,0330,0333,0341,0333,0333,0330,0337,0337,0331";
currentTable[0121] = "0333,0336,0330,0332,0341,0335,0335,0336,0330,0332,0350,0334,0337,0342,0334,0351,0334,0333,0331,0336,0330,0337,0337";
currentTable[0122] = "0304,0313,0336,0336,0336,0333,0337,0337,0337,0342,0330,0335,0336,0336,0342,0333,0333,0342,0332,0330,0343,0333,0335,0337,0306,0350,0334,0337,0312,0336,0342,0337,0313,0336,0335,0330,0304,0334,0334,0333,0336,0336,0336,0332,0337,0337,0337,0337";
currentTable[0123] = "0313,0304,0336,0336,0332,0337,0337,0336,0330,0333,0336,0330,0343,0334,0350,0334,0343,0332,0332,0334,0334,0334,0334,0343,0335,0335,0335,0351,0343,0335,0335,0333,0331,0333,0337,0337";
currentTable[0124] = "0333,0336,0332,0337,0342,0330,0336,0335,0342,0331,0342,0330,0330,0334,0337,0331";
currentTable[0125] = "0333,0336,0336,0330,0332,0337,0342,0330,0336,0342,0331,0331,0332,0332,0342,0330,0342,0330,0342,0331,0331,0333,0335,0335,0343,0330,0335,0335,0337,0333,0337";
currentTable[0126] = "0333,0336,0332,0350,0350,0335,0337,0342,0334,0334,0342,0335,0335,0334,0351,0351,0336,0333,0337";
currentTable[0127] = "0336,0336,0336,0333,0333,0337,0337,0337,0304,0313,0350,0350,0350,0334,0342,0335,0335,0336,0342,0330,0304,0335,0350,0350,0335,0335,0335,0342,0330,0304,0334,0350,0334,0350,0334,0337,0342,0334,0350,0335,0304,0336,0336,0333,0336,0333,0337,0337,0337";
currentTable[0130] = "0313,0306,0350,0337,0312,0336,0335,0342,0334,0304,0337,0313,0336,0330,0335,0306,0335,0337,0312,0336,0342,0330,0334,0304,0334,0337,0313,0336,0336,0336,0336,0333,0337,0337,0337";
currentTable[0131] = "0304,0313,0336,0336,0336,0332,0337,0337,0337,0336,0333,0342,0330,0306,0350,0334,0337,0312,0336,0342,0335,0335,0342,0337,0313,0336,0334,0304,0331,0333,0337,0336,0336,0336,0332,0337,0337,0337";
currentTable[0132] = "0304,0335,0312,0336,0342,0337,0332,0336,0342,0337,0333,0306,0336,0334,0313,0337,0342,0335,0304,0336,0330,0334,0312,0337,0313,0336,0336,0336,0333,0337,0337,0337";
currentTable[0133] = "0333,0336,0336,0332,0332,0337,0337,0342,0330,0335,0336,0336,0342,0337,0337,0333,0336,0336,0342,0330,0330,0334,0337,0337";
currentTable[0134] = "0333,0336,0336,0332,0337,0337,0350,0350,0334,0342,0335,0351,0351,0336,0336,0333,0337,0337";
currentTable[0135] = "0333,0336,0336,0332,0337,0337,0342,0336,0336,0334,0342,0333,0333,0333,0333,0342,0335,0333,0337,0337,0331";
currentTable[0136] = "0333,0330,0336,0332,0334,0334,0350,0335,0342,0334,0334,0342,0334,0351,0334,0333,0337,0331";
currentTable[0137] = "0333,0334,0336,0336,0330,0337,0342,0336,0331,0335,0337,0337";
currentTable[0140] = "0333,0336,0332,0330,0336,0330,0350,0334,0342,0335,0351,0330,0333,0333,0337,0337,0331";
currentTable[0141] = "0304,0313,0336,0336,0336,0332,0332,0337,0337,0337,0333,0336,0332,0336,0330,0341,0333,0342,0331,0342,0330,0330,0332,0333,0333,0331,0331,0337,0337,0336,0336,0336,0332,0337,0337,0337,0313,0304";
currentTable[0142] = "0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0332,0337,0337,0342,0336,0336,0330,0333,0341,0333,0333,0331,0337,0337,0336,0336,0336,0332,0337,0337,0337,0304,0313";
currentTable[0143] = "0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0336,0330,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0330,0330,0334,0334,0351,0331,0336,0332,0337,0337,0337";
currentTable[0144] = "0333,0336,0336,0332,0332,0337,0337,0342,0336,0336,0330,0332,0341,0333,0333,0331,0337,0337";
currentTable[0145] = "0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0330,0332,0343,0334,0334,0350,0335,0343,0334,0343,0335,0335,0342,0351,0335,0335,0342,0333,0330,0330,0334,0336,0332,0337,0337,0337";
currentTable[0146] = "0304,0313,0336,0336,0332,0337,0337,,0333,0336,0336,0332,0332,0337,0342,0330,0336,0336,0342,0330,0333,0343,0332,0331,0331,0335,0337,0336,0342,0334,0334,0342,0335,0331,0331,0331,0333,0333,0333,0333,0337,0337,0337,0304,0313,0336,0336,0336,0332,0337,0337,0337";
currentTable[0147] = "0304,0313,0336,0336,0336,0332,0332,0337,0337,0337,0333,0336,0332,0336,0330,0341,0333,0342,0331,0342,0331,0342,0331,0342,0332,0335,0335,0343,0331,0331,0332,0332,0334,0334,0337,0337,0336,0336,0336,0332,0337,0337,0337";
currentTable[0150] = "0304,0313,0342,0336,0330,0333,0336,0331,0332,0343,0333,0334,0334,0342,0330,0334,0334,0336,0333,0337,0337,0337";
currentTable[0151] = "0333,0336,0336,0332,0332,0332,0342,0330,0336,0342,0330,0330,0330,0336,0341,0331,0331,0331,0331,0331,0331,0331,0331,0331,0331,0337,0333,0333,0337,0337,0337";
currentTable[0152] = "0333,0336,0336,0332,0332,0332,0342,0331,0342,0332,0335,0335,0343,0332,0331,0331,0331,0336,0336,0341,0330,0330,0330,0330,0330,0330,0330,0330,0335,0335,0337,0333,0333,0337,0337,0337";
currentTable[0153] = "0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0332,0337,0342,0330,0336,0342,0331,0350,0335,0342,0335,0335,0310,0337,0342,0336,0313,0334,0351,0334,0331,0333,0336,0333,0337,,0337,0337,0304,0313";
currentTable[0154] = "0304,0313,0336,0336,0336,0332,0337,0337,0337,0333,0336,0336,0332,0332,0332,0336,0336,0350,0335,0342,0334,0337,0337,0337,0342,0330,0336,0342,0330,0334,0334,0334,0336,0342,0335,0351,0335,0337,0331,0331,0331,0333,0337,0337";
currentTable[0155] = "0304,0313,0333,0336,0332,0336,0332,0336,0332,0332,0337,0337,0342,0336,0333,0330,0336,0332,0343,0333,0333,0343,0332,0331,0342,0331,0342,0337,0333,0342,0333,0337,0337";
currentTable[0156] = "0304,0313,0333,0336,0332,0336,0332,0336,0332,0332,0337,0337,0342,0336,0333,0330,0336,0332,0343,0333,0331,0331,0337,0342,0333,0337,0337";
currentTable[0157] = "0304,0313,0333,0336,0332,0336,0332,0330,0341,0333,0333,0331,0337,0337";
currentTable[0160] = "0304,0313,0336,0336,0332,0337,0337,,0333,0336,0332,0336,0332,0342,0335,0335,0337,0342,0336,0331,0332,0341,0333,0334,0334,0342,0331,0333,0333,0333,0337,0337";
currentTable[0161] = "0304,0313,0333,0336,0332,0336,0330,0332,0341,0333,0342,0331,0331,0337,0342,0336,0333,0334,0334,0336,0333,0343,0335,0335,0330,0330,0333,0337,0337,0337";
currentTable[0162] = "0333,0336,0332,0336,0332,0337,0342,0330,0336,0336,0342,0350,0335,0350,0337,0337,0335,0342,0335,0351,0351,0330,0334,0331,0336,0336,0333,0337,0337,0337";
currentTable[0163] = "0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0330,0336,0330,0350,0343,0334,0334,0343,0334,0350,0334,0343,0334,0351,0330,0330,0343,0334,0334,0343,0334,0334,0335,0343,0334,0351,0331,0333,0333,0337,0337,0337";
currentTable[0164] = "0304,0313,0333,0336,0332,0342,0330,0336,0342,0334,0342,0335,0335,0342,0333,0333,0336,0330,0335,0343,0335,0335,0333,0333,0333,0337,0337,0337";
currentTable[0165] = "0304,0313,0336,0336,0330,0342,0333,0334,0334,0343,0332,0334,0334,0342,0334,0334,0342,0330,0335,0335,0336,0333,0337,0337,0337";
currentTable[0166] = "0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0350,0350,0334,0342,0335,0335,0342,0334,0351,0351,0333,0337,0336,0336,0336,0332,0337,0337,0337";
currentTable[0167] = "0336,0336,0336,0333,0337,0337,0337,0313,0304,0336,0336,0336,0333,0337,0350,0350,0334,0337,0342,0335,0335,0336,0342,0330,0335,0335,0335,0335,0335,0335,0342,0330,0334,0334,0334,0334,0334,0334,0337,0342,0334,0304,0336,0333,0336,0333,0337,0337,0337";
currentTable[0170] = "0304,0313,0336,0306,0350,0335,0342,0351,0336,0333,0334,0337,0342,0350,0335,0304,0336,0336,0333,0337,0337,0337";
currentTable[0171] = "0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0336,0350,0335,0337,0350,0334,0342,0334,0334,0342,0334,0334,0334,0334,0334,0334,0342,0334,0351,0351,0335,0335,0333,0337,0336,0336,0336,0332,0337,0337,0337";
currentTable[0172] = "0304,0313,0336,0350,0335,0310,0337,0342,0330,0334,0334,0334,0336,0342,0334,0337,0330,0334,0334,0334,0336,0342,0330,0334,0334,0304,0313,0337,0336,0336,0336,0333,0337,0337,0337";
currentTable[0173] = "0333,0336,0330,0332,0336,0336,0330,0334,0350,0334,0342,0335,0335,0335,0342,0330,0335,0342,0334,0331,0331,0331,0334,0342,0335,0331,0342,0335,0335,0335,0342,0335,0351,0335,0335,0331,0331,0333,0333,0337,0337,0337";
currentTable[0174] = "0333,0336,0332,0337,0342,0330,0336,0336,0342,0337,0337,0331,0336,0336,0331,0342,0330,0333,0337,0337";
currentTable[0175] = "0333,0336,0336,0332,0332,0330,0330,0336,0330,0342,0330,0350,0334,0342,0335,0331,0335,0335,0335,0342,0335,0330,0330,0334,0334,0334,0342,0335,0335,0335,0342,0330,0335,0342,0334,0351,0330,0330,0335,0335,0333,0333,0333,0337,0337,0337";
currentTable[0176] = "0333,0336,0330,0332,0330,0336,0331,0350,0334,0342,0335,0335,0342,0334,0351,0332,0350,0335,0342,0334,0351,0333,0333,0333,0331,0331,0331,0337,0337";
currentTable[01300] = "0333,0200,0336,0330,0332,0340,0350,0335,0336,0330,0342,0331,0331,0331,0342,0330,0330,0335,0335,0331,0331,0342,0330,0330,0330,0342,0331,0334,0334,0334,0351,0331,0331,0333,0333,0337,0337";
currentTable[01304] = "0333,0200,0336,0330,0332,0341,0342,0335,0342,0335,0342,0335,0342,0350,0335,0351,0336,0336,0330,0330,0341,0331,0331,0335,0330,0330,0341,0331,0331,0335,0330,0330,0341,0331,0331,0335,0330,0330,0341,0331,0331,0350,0334,0351,0337,0337,0330,0335,0335,0333,0337";
currentTable[01305] = "0333,0200,0336,0330,0332,0305,0342,0335,0342,0335,0342,0335,0342,0335,0342,0335,0341,0350,0335,0351,0336,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0350,0335,0304,0337,0331,0333,0337";
currentTable[01306] = "0333,0200,0336,0330,0332,0306,0342,0335,0342,0335,0342,0335,0342,0335,0342,0335,0341,0350,0335,0351,0336,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0350,0335,0335,0335,0337,0342,0334,0336,0330,0336,0336,0341,0337,0337,0331,0304,0335,0337,0331,0333,0337";
currentTable[01310] = "0333,0200,0336,0332,0350,0335,0310,0337,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0334,0351,0336,0313,0333,0337";
currentTable[01311] = "0335,0305,0342,0334,0311,0337,0342,0336,0335,0330,0334,0350,0334,0337,0342,0334,0334,0304,0336,0313,0335,0200,0334,0305,0350,0335,0342,0330,0335,0335,0335,0311,0336,0342,0330,0334,0334,0334,0336,0342,0335,0335,0335,0337,0331,0334,0334,0334,0337,0331,0334,0313,0304,0335";
currentTable[01312] = "0333,0200,0352,0334,0342,0330,0334,0334,0334,0334,0342,0334,0312,0337,0313,0336,0342,0330,0334,0334,0334,0334,0336,0342,0334,0334,0304,0312,0336,0313,0337,0333,0337";
currentTable[01313] = "0333,0200,0336,0336,0332,0332,0330,0342,0334,0342,0330,0335,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0335,0342,0335,0331,0333,0337,0337";
currentTable[01314] = "0333,0200,0314,0336,0332,0332,0330,0200,0333,0200,0333,0200,0331,0337,0313";
currentTable[01315] = "0333,0313,0200,0336,0330,0332,0341,0335,0342,0334,0334,0342,0334,0334,0330,0334,0331,0337";
currentTable[01317] = "0333,0200,0336,0336,0330,0332,0336,0330,0333,0337,0342,0336,0330,0334,0337,0337,0342,0330,0336,0342,0330,0335,0336,0342,0331,0342,0332,0330,0337,0337,0333,0333,0331,0337";
currentTable[01321] = "0333,0200,0336,0336,0330,0332,0332,0337,0321,0342,0321,0332,0320,0336,0331,0337,0337,0333";
currentTable[01322] = "0333,0200,0336,0336,0330,0332,0332,0337,0322,0342,0321,0332,0320,0336,0331,0337,0337,0333";
currentTable[01330] = "0333,0200,0313,0336,0336,0330,0332,0336,0332,0337,0342,0334,0342,0330,0335,0342,0330,0334,0336,0342,0330,0335,0350,0335,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0336,0313,0336,0342,0330,0351,0335,0331,0331,0331,0331,0333,0333,0333,0337,0337,0337";
currentTable[01331] = "0333,0200,0335,0335,0333,0331,0313,0336,0336,0330,0332,0336,0332,0337,0342,0334,0342,0330,0335,0342,0330,0334,0336,0342,0330,0335,0350,0335,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0336,0313,0336,0342,0330,0351,0335,0331,0331,0331,0331,0333,0333,0333,0337,0337,0337,0332,0335,0335,0331";
currentTable[01332] = "0333,0200,0334,0333,0313,0336,0336,0330,0332,0336,0332,0337,0342,0334,0342,0330,0335,0342,0330,0334,0336,0342,0330,0335,0350,0335,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0336,0313,0336,0342,0330,0351,0335,0331,0331,0331,0331,0333,0333,0333,0337,0337,0337,0335,0331";
currentTable[01333] = "0333,0200,0335,0331,0313,0336,0336,0330,0332,0336,0332,0337,0342,0334,0342,0330,0335,0342,0330,0334,0336,0342,0330,0335,0350,0335,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0336,0313,0336,0342,0330,0351,0335,0331,0331,0331,0331,0333,0333,0333,0337,0337,0337,0330,0334";
currentTable[01334] = "0333,0200,0336,0330,0332,0336,0350,0343,0334,0334,0343,0334,0334,0343,0334,0342,0335,0330,0336,0330,0334,0334,0334,0337,0342,0334,0351,0336,0331,0337,0337,0333,0337";
currentTable[01335] = "0333,0200,0336,0330,0332,0336,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0334,0342,0334,0330,0336,0330,0335,0335,0335,0337,0342,0336,0335,0331,0351,0337,0337,0332,0335,0335,0337,0331";
currentTable[01336] = "0333,0200,0336,0330,0334,0336,0330,0337,0342,0336,0331,0335,0337,0331,0337";
currentTable[01337] = "0333,0200,0336,0330,0332,0336,0342,0334,0342,0334,0342,0334,0342,0330,0330,0334,0337,0331,0337";
currentTable[01340] = "0333,0200,0336,0330,0332,0340,0333,0331,0337";
currentTable[01341] = "0333,0200,0336,0330,0332,0341,0340,0333,0331,0337";
currentTable[01342] = "0333,0200,0336,0330,0332,0334,0336,0342,0330,0340,0331,0335,0335,0342,0330,0340,0333,0333,0330,0334,0337,0337";
currentTable[01343] = "0333,0200,0336,0330,0332,0350,0343,0335,0342,0334,0334,0342,0335,0340,0351,0331,0333,0337";
currentTable[01344] = "0304,0313,0333,0200,0336,0332,0344,0333,0337";
currentTable[01345] = "0304,0313,0333,0200,0336,0332,0345,0333,0337";
currentTable[01346] = "0304,0313,0333,0200,0336,0332,0346,0333,0337";
currentTable[01347] = "0304,0313,0333,0200,0336,0332,0347,0333,0337";
currentTable[01350] = "0333,0200,0336,0330,0332,0350,0335,0342,0335,0335,0342,0334,0336,0336,0342,0330,0330,0342,0331,0331,0351,0337,0337,0334,0333,0331,0337";
currentTable[01351] = "0333,0200,0336,0332,0330,0350,0335,0336,0336,0342,0330,0330,0342,0330,0330,0342,0331,0331,0331,0331,0335,0337,0337,0342,0335,0342,0334,0351,0333,0330,0334,0337";
currentTable[01352] = "0333,0200,0336,0330,0332,0335,0350,0352,0334,0334,0334,0342,0335,0335,0336,0336,0342,0330,0330,0342,0331,0331,0335,0335,0342,0330,0330,0342,0331,0331,0335,0335,0337,0337,0342,0335,0335,0335,0351,0353,0330,0334,0334,0333,0337";
currentTable[01353] = "0333,0200,0336,0330,0332,0335,0350,0352,0334,0342,0335,0335,0342,0335,0335,0336,0336,0342,0330,0330,0342,0331,0331,0334,0334,0334,0334,0334,0334,0342,0330,0330,0342,0331,0331,0335,0335,0335,0351,0353,0337,0337,0333,0330,0334,0337";
currentTable[01360] = "0333,0200,0336,0336,0330,0332,0332,0330,0341,0332,0334,0336,0342,0330,0334,0337,0342,0330,0336,0342,0330,0334,0337,0337,0342,0330,0336,0342,0330,0334,0342,0330,0336,0342,0330,0334,0342,0335,0333,0337,0337,0331,0337";
currentTable[01361] = "0333,0200,0336,0330,0332,0336,0350,0343,0334,0343,0334,0343,0335,0335,0335,0335,0343,0334,0334,0351,0331,0334,0336,0330,0342,0330,0334,0342,0330,0334,0342,0330,0342,0330,0342,0330,0342,0330,0334,0342,0330,0334,0342,0335,0333,0333,0331,0331,0337,0337,0337";
currentTable[01364] = "0313,0304,0333,0200,0336,0330,0332,0336,0331,0332,0337,0350,0350,0334,0342,0335,0335,0342,0334,0304,0333,0350,0350,0334,0342,0335,0335,0342,0334,0304,0336,0333,0331,0337,0337";
currentTable[01365] = "0313,0304,0333,0200,0336,0330,0332,0336,0331,0332,0337,0350,0350,0334,0342,0335,0335,0342,0334,0304,0333,0350,0350,0334,0342,0335,0335,0342,0334,0304,0336,0333,0331,0337,0337";

currentTable[01366] = "0304,0313,0333,0200,0336,0330,0332,0336,0330,0332,0337,0366,0336,0330,0332,0337,0337,0333,0331";
currentTable[01370] = "0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0333,0335,0306,0342,0336,0331,0337,0337,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0304,0334,0333,0333,0336,0336,0332,0337,0337,0337,0331,0337";
currentTable[01371] = "0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0336,0331,0331,0331,0333,0335,0337,0337,0306,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0304,0330,0330,0336,0336,0331,0334,0337,0337,0337,0331,0336,0336,0336,0330,0337,0337,0337,0337";
currentTable[01372] = "0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0336,0331,0333,0337,0337,0342,0330,0335,0342,0330,0335,0342,0330,0335,0342,0330,0335,0333,0333,0336,0336,0332,0337,0337,0337,0331,0336,0336,0336,0330,0337,0337,0337,0337";
currentTable[01373] = "0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0331,0331,0336,0330,0333,0337,0337,0342,0330,0335,0342,0330,0335,0342,0330,0335,0342,0330,0335,0333,0333,0331,0331,0336,0336,0330,0332,0337,0337,0337,0337";
currentTable[01374] = "0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0333,0335,0305,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0334,0333,0333,0333,0331,0331,0331,0331,0337,0337,0337";
currentTable[01375] = "0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0331,0331,0333,0330,0335,0305,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0330,0330,0330,0334,0331,0331,0331,0331,0337,0337,0337";
currentTable[01376] = "0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0331,0331,0331,0333,0333,0335,0335,0342,0330,0334,0350,0334,0342,0334,0334,0342,0335,0351,0332,0332,0330,0330,0330,0335,0330,0306,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0330,0330,0330,0334,0337,0337,0331,0337";
currentTable[01377] = "0333,0200,0336,0336,0332,0332,0336,0330,0337,0337,0342,0330,0336,0342,0331,0335,0342,0330,0336,0342,0330,0334,0342,0330,0337,0342,0330,0337,0336,0336,0342,0330,0334,0342,0330,0342,0330,0342,0330,0335,0331,0331,0332,0332,0335,0342,0330,0334,0334,0350,0335,0342,0334,0334,0342,0335,0335,0335,0351,0333,0331,0333,0335,0306,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334,0304,0333,0330,0330,0330,0334,0331,0331,0331,0337,0337,0337";
currentTable[01200] = "0333,0200,0336,0336,0330,0332,0337,0200,0336,0331,0333,0337,0337";
currentTable[01201] = "0304,0313,0333,0200,0336,0336,0330,0330,0332,0332,0332,0335,0336,0337,0337,0342,0330,0335,0350,0335,0336,0336,0342,0335,0335,0342,0335,0304,0337,0331,0331,0333,0337,0337";
currentTable[01202] = "0333,0200,0336,0332,0330,0200,0310,0202,0202,0202,0202,0334,0334,0337,0337,0337,0337,0313,0333,0331,0337";
currentTable[01203] = "0333,0203,0336,0336,0330,0337,0330,0332,0341,0342,0335,0342,0335,0342,0335,0342,0350,0304,0336,0333,0333,0331,0331,0337,0337,0200";
currentTable[01204] = "0333,0200";
currentTable[01205] = "0333,0200";
currentTable[01206] = "0333,0200";
currentTable[01207] = "0333,0200,0336,0332,0336,0330,0337,0207,0336,0331,0333,0333,0337,0337";
currentTable[01210] = "0333,0200,0336,0330,0335,0331,0331,0337,0210,0334,0336,0331,0337";
currentTable[01211] = "0333,0200,0336,0330,0335,0331,0331,0337,0211,0334,0336,0331,0337";
currentTable[01212] = "0333,0200,0336,0330,0332,0335,0335,0331,0342,0330,0335,0310,0336,0342,0330,0334,0334,0350,0335,0337,0342,0330,0334,0334,0342,0330,0334,0334,0334,0336,0342,0335,0335,0351,0332,0337,0313,0333,0331,0337";
currentTable[01213] = "0333,0200";
currentTable[01214] = "0333,0200,0336,0330,0335,0331,0331,0337,0214,0334,0336,0331,0337";
currentTable[01215] = "0333,0200,0336,0330,0335,0331,0331,0337,0215,0334,0336,0331,0337";
currentTable[01216] = "0333,0200,0336,0330,0335,0331,0331,0337,0216,0334,0336,0331,0337";
currentTable[01217] = "0333,0200,0336,0330,0332,0336,0331,0337,0337,0217,0336,0336,0333,0333,0331,0337,0337";
currentTable[01220] = "0333,0200,0336,0330,0332,0336,0331,0334,0334,0337,0337,0220,0336,0342,0333,0336,0331,0337,0337";
currentTable[01221] = "0304,0313,0333,0200,0336,0332,0201,0336,0336,0330,0341,0331,0331,0331,0331,0331,0337,0337,0333,0337";
currentTable[01222] = "0333,0200,0336,0332,0337,0222,0336,0333,0337,0331";
currentTable[01223] = "0333,0200,0332,0336,0330,0335,0337,0223,0336,0334,0331,0337";
currentTable[01224] = "0333,0200,0336,0332,0337,0224,0336,0333,0337,0331";
currentTable[01225] = "0333,0200,0336,0332,0337,0225,0336,0333,0337,0331";
currentTable[01226] = "0333,0200";
currentTable[01227] = "0333,0200";
currentTable[01241] = ",0333,0200,0336,0330,0334,0201,0201,0331,0335,0342,0336,0336,0341,0333,0333,0333,0333,0337,0337,0331,0337,";
currentTable[01242] = ",0333,0200,0336,0330,0332,0331,0330,0332,0242,,0333,0333,0331,0337,";
currentTable[0200] = "0304,0342,0330,0334,0342,0330,0334,0342,0330,0334,0342,0330,0334";
currentTable[0201] = "0342,0330";
currentTable[0202] = "0304,0342,0335,0342,0330,0334,0350,0334,0310,0337,0342";
currentTable[0203] = "0306,0351";
currentTable[0204] = "0350,0335,0321,0342,0336,0333,0337,0322,0342,0336,0333,0337,0321,0342,0336,0333,0337,0322,0342,0336,0333,0337,0321,0342,0336,0333,0337,0322,0342,0336,0333,0337,0321,0342,0336,0333,0337,0322,0342,0336,0333,0337,0321,0342,0336,0333,0337,0322,0342,0336,0333,0337,0321,0342,0336,0333,0337,0322,0342,0336,0333,0337,,0331,0331,";
currentTable[0205] = "0305,0311,0337,0342,0330,0335,0335,0336,0342,0330,0335,0342";
currentTable[0206] = "0340";
currentTable[0207] = "0313,0336,0330,0341,0336,0332,0336,0336,0333,0337,0333,0336,0332,0337,0343,0333,0333,0335,0335,0343,0335,0335,0332,0331,0331,0331,0331,0337,0337,0337,";
currentTable[0210] = "0304,0336,0336,0330,0331,0336,0330,0331,0342,0330,0306,0350,0335,0335,0342,0334,0334,0330,0335,0335,0335,0335,0342,0334,0334,0334,0334,0334,0334,0342,0335,0335,0335,0334,0330,0334,0334,0334,0334,0342,0335,0335,0335,0335,0335,0335,0342,0334,0334,0330,0335,0335,0335,0335,0342,0334,0334,0334,0334,0334,0334,0342,0335,0335,0330,0335,0334,0334,0334,0334,0334,0342,0335,0335,0335,0335,0335,0335,0342,0334,0334,0330,0335,0335,0335,0335,0342,0334,0334,0334,0334,0334,0334,0342,0335,0335,0330,0334,0334,0334,0334,0342,0335,0335,0335,0335,0342,0330,0305,0304,0337,0337,0337";
currentTable[0211] = "0304,0336,0336,0336,0342,0330,0337,0342,0330,0335,0342,0334,0334,0342,0335,0330,0334,0342,0334,0334,0342,0334,0342,0330,0336,0342,0330,0337,0337,0337";
currentTable[0212] = "0304,0313,0336,0336,0335,0342,0334,0334,0342,0330,0350,0335,0335,0335,0310,0337,0342,0330,0335,0335,0342,0330,0335,0335,0335,0351,0336,0330,0334,0313,0337,0337";
currentTable[0213] = "0304,0314,0336,0336,0345,0333,0336,0333,0337,0344,0336,0332,0332,0334,0334,0344,0345,0335,0335,0333,0333,0337,0337,0337";
currentTable[0214] = "0304,0336,0336,0336,0336,0342,0330,0337,0337,0337,0337,0314,0336,0337,0334,0336,0336,0333,0344,0337,0337,0213,0213,0213,0213,0336,0336,0345,0333,0335,0342,0330,0336,0336,0336,0336,0342,0330,0337,0337,0337,0337,0337,0337,0313";
currentTable[0215] = "0304,0342,0314,0336,0330,0313,0336,0332,0304,0350,0335,0337,0310,0337,0342,0336,0333,0334,0334,0337,0342,0336,0313,0336,0332,0335,0351,0330,0330,0330,0330,0314,0337,0313,0337";
currentTable[0216] = "0304,0313,0336,0336,0336,0201,0201,0201,0333,0334,0201,0201,0335,0201,0335,0201,0201,0335,0201,0331,0335,0335,0201,0334,0201,0201,0334,0201,0334,0330,0334,0330,0201,0201,0201,0337,0337,0337";
currentTable[0217] = "0313,0304,0336,0336,0330,0341,0336,0336,0336,0331,0331,0331,0332,0332,0332,0332,0331,0337,0337,0337,0126,0331,0332,0337,0337,0336,0336,0336,0333,0330,0337,0337,0337";
currentTable[0220] = "0304,0313,0336,0336,0334,0342,0335,0335,0342,0334,0314,0336,0330,0330,0335,0342,0334,0334,0342,0332,0342,0330,0342,0331,0331,0331,0342,0330,0342,0330,0335,0331,0337,0313,0337,0337,0334,0334";
currentTable[0221] = "0304,0313,0336,0201,0336,0336,0330,0341,0331,0331,0331,0331,0331,0337,0337,0337";
currentTable[0222] = "0304,0314,0336,0313,0336,0342,0330,0330,0330,0330,0330,0342,0331,0331,0337,0341,0332,0336,0350,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0337,0335,0351,0333,0333,0336,0350,0334,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0335,0351,0332,0332,0330,0330,0330,0337,0314,0337,0313";
currentTable[0223] = "0304,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0337,0342,0335,0335,0342,0336,0334,0330,0330,0335,0350,0335,0337,0310,0337,0342,0335,0335,0342,0335,0335,0335,0351,0336,0313,0336,0330,0337,0337";
currentTable[0224] = "0304,0313,0336,0336,0336,0342,0330,0337,0330,0341,0330,0341,0330,0336,0342,0330,0337,0337,0337";
currentTable[0225] = "0304,0313,0336,0336,0336,0342,0330,0337,0342,0330,0334,0342,0335,0335,0342,0334,0330,0335,0342,0335,0335,0342,0350,0334,0310,0337,0342,0334,0334,0342,0334,0334,0334,0351,0336,0313,0342,0330,0336,0342,0330,0337,0337,0337";
currentTable[0226] = "0300";
currentTable[0227] = "0300";
currentTable[0226] = "0342,0336,0330,0336,0344,0335,0335,0333,0333,0344,0344,0335,0335,0333,0331,0331,0335,0335,0333,0330,0330,0334,0334,0345,0335,0335,0332,0332,0345,0335,0335,0330,0330,0337,0337";
currentTable[0227] = "0342,0330,0330,0335,0330,0342,0330,0330,0335,0330,0342,0330,0335,0330,0332,0342,0333,0335,0335,0330,0335,0336,0342,0333,0330,0350,0334,0343,0333,0334,0334,0334,0334,0334,0342,0330,0330,0330,0342,0330,0335,0333,0334,0334,0343,0333,0334,0334,0334,0334,0334,0342,0330,0330,0330,0342,0330,0335,0333,0334,0334,0343,0333,0335,0335,0335,0342,0330,0330,0330,0342,0330,0335,0335,0330,0334,0334,0334,0343,0333,0335,0335,0335,0342,0304,0335,0335,0332,0332,0332,0332,0332,0331";
currentTable[0230] = "0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0110,0333,0336,0330,0333,0337,0337,0337";
currentTable[01230] = ",0333,0200,0336,0332,0336,0330,0332,0337,,0110,0336,0331,0333,0336,0333,0337,0337,0337,";
currentTable[0231] = "0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0130,0333,0336,0330,0333,0337,0337,0337";
currentTable[0232] = "0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0131,0333,0336,0330,0333,0337,0337,0337";
currentTable[0233] = "0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0132,0333,0336,0330,0333,0337,0337,0337";
currentTable[0234] = "0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0133,0333,0336,0330,0333,0337,0337,0337";
currentTable[0235] = "0313,0304,0336,0330,0341,,0350,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,,0304,0330,0337,";
currentTable[01235] = ",0333,0200,0336,0332,0336,0330,0337,0331,0330,0235,0331,0333,0336,0331,0337,0337,";
currentTable[0236] = "0304,0313,0336,0210,0210,0335,0342,0330,,0335,0350,0335,0310,0337,0201,0335,0335,0201,0335,0335,0335,0336,0201,0335,0335,0330,0335,0337,0201,0334,0334,0334,0336,0201,0201,0334,0334,0334,0337,0201,0335,0336,0304,0313,0330,0337";
currentTable[01236] = "0333,0200,0336,0330,0335,0331,0331,0337,0236,0334,0336,0331,0337";
currentTable[0240] = "0304,0313,0335,0342,0330,0336,0331,0340,0335,0342,0334,0334,0333,0337";
currentTable[01240] = ",0333,0200,0336,0330,0332,0335,0342,0340,0335,0342,0335,0342,0335,0333,0331,0337,,";
currentTable[0241] = "0304,0313,0335,0342,0336,0330,0334,0342,0336,0336,0341,0337,0337,0333,0337";
currentTable[0242] = "0304,0313,0335,0336,0336,0342,0330,0334,0342,0337,0342,0330,0335,0342,0330,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0342,0330,0335,0342,0330,0333,0336,0333,0331,0337,0306,0343,0350,0335,0310,0337,0342,0330,0336,0336,0336,0336,0336,0335,0335,0335,0335,0335,0342,0335,0335,0342,0335,0335,0335,0335,0335,0337,0337,0337,0337,0337,0331,0336,0334,0313,0304,0336,0331,0332,0332,0332,0330,0330,0332,0337,0337";
currentTable[0243] = "0335,0331,0331,0344,0332,0332,0334,0334,0344,0331,0331,0335,0335,0333,0330,0330,0334,0334,0332,0345,0333,0333,0335,0335,0345,0334,0332,0332";
currentTable[0244] = "0304,0313,0331,0337,0342,0336,0336,0333,0334,0334,0350,0335,0343,0334,0330,0334,0334,0351,0337,0337,0342,0330,0342,0330,0336,0336,0332,0350,0335,0343,0334,0330,0334,0334,0351,0337,0337,0342,0330,0336,0336,0332,0350,0335,0343,0334,0330,0334,0334,0351,0337,0337,0337,0342,0330,0335,0336,0336,0336,0331,0350,0334,0343,0335,0304,0331,0331,0337";
currentTable[0245] = "0342,0304,0313,0330,0336,0336,0336,0350,0335,0335,0335,0342,0335,0335,0342,0335,0335,0335,0351,0337,0337,0337,0331";
currentTable[0246] = "0304,0313,0336,0336,0330,0335,0342,0330,0335,0342,0330,0334,0350,0334,0337,0310,0337,0342,0330,0334,0334,0342,0330,0334,0334,0334,0336,0313,0336,0342,0330,0335,0335,0342,0304,0330,0335,0330,0337,0337,0331";
currentTable[0247] = "0304,0313,0336,0336,0330,0335,0337,0337,0342,0336,0332,0337,0342,0333,0334,0336,0330,0336,0331,0337,0337";
currentTable[0250] = "0336,0336,0336,0336,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0337,0337,0337,0337";
currentTable[0400] = "0300";
currentTable[0401] = "0330,0332,0332,0332,0332,0336,0333,0333,0333,0333,0333,0331,0332,0240,0331,0332,0241,0240,0332,0331,0332,0231,0241,0230,0241,0330,0332,0332,0335,0342,0330,0334,0240,0330,0335,0334,0332,0332,0332,0230,0231,0232,0242,0331,0335,0342,0330,0342,0330,0334,0242,0332,0331,0332,0335,0342,0330,0342,0330,0342,0330,0342,0330,0334,0242,0300,0336,0330,0330,0332,0332,0332,0332,0332,0332,0336,0333,0333,061,0332,0342,0333,0350,0335,0310,0336,0342,0330,0334,0334,0342,0330,0335,0337,0331,0304,0331,0331,0331,0332,0332,0332,";
currentTable[0402] = "0300,0342,0330,0350,0334,0342,0330,0334,0342,0330,0335,0335,0335,0335,0351,0332,0342,0330,0334,0310,0337,0342,0330,0333,0335,0350,0335,0337,0342,0330,0334,0312,0337,0342,0330,0334,0334,0342,0336,0310,0336,0335,0335,0330,0334,0334,0337,0337,0342,0335,0335,0335,0336,0336,0342,0330,0334,0313,0337,0342,0330,0335,0335,0310,0336,0342,0330,0334,0334,0342,0304,0335,0336,0330,0335,0337,0337,0337,0342,0330,0350,0335,0342,0330,0336,0336,0336,0336,0342,0330,0334,0342,0330,0336,0336,0342,0330,0334,0337,0337,0342,0330,0334,0342,0300";
currentTable[0403] = "0300,0330,0330,0330,0332,0332,0332,0124,0111,0124,0114,0105,0340,0331,0332,0330,0331,0332,0332,0336,0336,0167,0157,0162,0144,0163,0331,0331,0331,0331,0331,0331,0331,0331,0331,0331,0337,0337,0214,0211,0333,0333";
currentTable[0404] = "0300,0336,0332,0332,0332,0332,0332,0332,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0335,0342,0330,0342,0330,0335,0336,0336,0330,0333,0337,0364,0333,0333,0333,0333,0333,0336,0332,0331,0350,0334,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0334,0334,0336,0331,0335,0335,0304,0313,0336,0332,0334,0342,0331,0331,0335,0335,0342,0334,0337,0337,0337,0342,0336,0336,0336,0332,0332,0337,0337,0337,0342,0330,0336,0336,0336,0334,0342,0331,0331,0331,0342,0350,0335,0337,0310,0337,0342,0330,0334,0334,0342,0335,0336,0351,0313,0342,0330,0335,0337,0337,0342,0336,0336,0333,0333,0334,0342,0335,0337,0337,0342,0330,0334,0336,0342,0336,0331,0332,0332,0332,0330,0336,0330,0332,0337,0364,0331,0331,0331,0331";
currentTable[0405] = "0300,0336,0331,0337,0214,0330,0331,0331,0331,0330,0333,0211,0334,0342,0330,0340,0330,0334,0334,0342,0342,0335,0210,0334,0342,0330,0340,0342,0335,0336,0336,0342,0330,0337,0337,0336,0337,0212,0330,0336,0336,0330,0337,0342,0330,0337,0217,0333,0333,0333,0333,0331,0332,0332,0336,0336,0332,0332,0331,0337,0103,0332,0332,0332,0332,0332,0332,0332,0332,0336,0333,0337,0122,0333,0333,0333,0333,0333,0333,0333,0333,0332,0332,0332,0332,0332,0114,0330,0330,0330,0333,0333,0333,0330,0332,0332,0332,0332,0332,0332,0332,0332,0364";
currentTable[0406] = "0300,0332,0310,0336,0313,0332,0333,0333,0247,0332,0247,0333,0333,0246,0330,0332,0332,0335,0335,0246,0335,0335,0336,0331,0335,0336,0334,0336,0331,0332,0332,0337,0364,0332,0332,0332,0332,0332,0332,0332,0332,0337,0332,0332,0244,0600,0365,0333,0333,0333,0333,0333,0333,0333,0333,0333,0333,0333,0333,0332,0336,0333,0337,0244,0601,0365";
currentTable[0407] = "0300,0340,0332,0332,0333,0332,0335,0223,0331,0335,0335,0336,0336,0201,0334,0201,0337,0337,0216,0336,0212,0333,0333,0333,0330,0330,0336,0331,0332,0330,0330,0335,0337,0210,0211,0335,0340,0222,0222,0222,0220,0330,0330,0330,0335,0211,0214,0335,0214,0212,0333,0214,0335,0210,0210,0210,0331,0331,0331,0335,0330,0212,0332,0332,0332,0330,0201,0201,0207,0332,0332,0332,";
currentTable[0410] = "0332,0330,0101,0350,0350,0335,0351,0351,0336,0102,0350,0350,0335,0351,0351,0336,0103,0336,0333,0350,0350,0335,0351,0351,0104,0336,0105,0335,0300,0331,0332,0330,0350,0335,0343,0336,0331,0334,0304,0331,0333,0332,0304,0350,0335,0350,0334,0335,0337,0337,0350,0334,0351,0343,0335,0335,0335,0334,0304,";
currentTable[0411] = "0340,0341,0333,0341,0340";
currentTable[0412] = "0300,0610,0332,0332,0336,0330,0330,0330,0365,0331,,0611,0333,0333,0365,0331,,0612,0333,0365,,0331,,0613,0365,,0333,0333,0333,0333,0331,,0614,0365,0331,,0617,";
currentTable[0413] = "0300,0620,0336,0336,0330,0330,0330,0330,0330,0332,0332,0332,0332,0332,0332,0332,0332,0365,0331,0331,0621,0365,0331,0331,0617,0365";
currentTable[0414] = "0210,0350,0350,0335,0311,0336,0304,0313,0414,";
currentTable[0415] = "0200,0350,0350,0350,0335,0304,0312,0336,0311,0337,0200,";
currentTable[0416] = "0415,0416,0416";
currentTable[0417] = "0332,0332,0336,01330,01331,01332,01333,,01334,01335,01336,01337";
currentTable[0420] = "0340,0341,0333,0341,0340";
currentTable[0421] = "0340,0341,0333,0341,0340";
currentTable[0422] = "0300,0306,0335,0342,0335,0342,0335,0335,0342,0335,0342,0330,0334,0334,0350,0334,0334,0334,0336,0337,0312,0337,0335,0335,0201,0334,0334,0334,0334,0201,0335,0336,0335,0335,0335,0335,0335,0335,0330,0330,0335,0335,0335,0335,0335,0337,0201,0335,0335,0335,0335,0201,0300,0332,0332,0331,0331,0336,0330,0336,0332,0332,0332,0330,0330,0330,0330,0330,0330,0330,0330,0330,0330,0104,0117,040,0127,0110,0101,0124,040,0124,0110,0117,0125,040,0127,0111,0114,0124,040,0123,0110,0101,0114,0114,040,0102,0105,040,0331,0331,0332,0332,0332,0332,0332,0332,0332,0332,0331,0331,0331,0331,0331,0331,0331,0331,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0124,0110,0105,040,0127,0110,0117,0114,0105,040,0117,0106,040,0124,0110,0105,040,0114,0101,0127,";
currentTable[0423] = "0300,0330,0341,0336,0331,0341,0336,0331,0341,0336,0331,0341,0336,0331,0341,0336,0331,0341,0300,0331,0341,0336,0330,0341,0336,0330,0341,0336,0330,0341,0336,0330,0341,0336,0330,0341,0300,0335,0201,0201,0201,0331,0331,0331,0335,0335,0201,0201,0201,0331,0331,0331,0335,0337,0337,0341,0330,0341,0331,0331,0341,0300,0330,0333,0336,0336,0336,0333,0337,0102,0330,0335,0331,0336,0336,0330,0332,0337,0337,0201,0334,0350,0334,0336,0342,0300,0333,0333,0333,0333,";
currentTable[0424] = "0300,0300,0332,0336,0342,0330,0335,0337,0337,0342,0336,0336,0333,0337,0337,0201,0336,0201,0334,0336,0201,0334,0337,0201,0335,0333,0201,0334,0201,0201,0201,0334,0201,0336,0330,0337,0201,0334,0201,0201,0201,0334,0201,0335,0336,0336,0201,0334,0337,0201,0334,0336,0201,0337,0337,0330,0330,0330,0336,0336,0201,0334,0201,0201,0334,0201,0337,0330,0335,0337,,,0342,0333,0332,0332,0342,0332,0342,0336,0332,0333,0333,0337,0342,0336,0333,0333,0337,0342,0336,0331,,0250,0332,0331,,0250,0332,0331,,0250,0332,0331,,0250,0333,0333,0333,0333,0331,,,,,0250,0331,0335,0335,0337,0342,0333,0342,0333,0342,0336,0332,0337,0342,0332,0342,0332,0336,0330,0335,0337,,0250,0250,0250,0335,0330,0336,0330,0335,0337,,0250,0250,0250,0335,0332,0332,,,";
currentTable[0425] = "0300,0300,0331,0330,0336,0336,0332,0330,0330,0335,0335,0201,0215,0201,0211,0201,0215,0201,0335,0201,0214,0221,0333,0331,0335,0335,0342,0335,0335,0214,0221,0333,0331,0335,0335,0342,0335,0335,0214,0221,0333,0331,0331,0201,0214,0221,0333,0331,0331,0201,0214,0221,0333,0331,0331,0201,0214,0221,0331,0331,0333,0201,0214,0221,0333,0331,0331,0201,0214,0221,0331,0300,0331,0336,0336,0332,0340,0331,0330,0330,0340,0330,0340,0330,0340,0330,0340,0330,0340,0330,0340,0335,0201,0201,0211,0201,0334,0337,0335,0336,0333,0333,0333,0333,0333,0333,0333,0331,0331,0331,0331,0340,0201,0201,0211,0201,0334,0201,0201,0201,0201,0330,0330,0330,0344,0345,0335,0335,,0345,0344,0330,0330,0342,0334,0337,0337,0337,0337,0342,0336,0336,0336,0332,0332,0337,0337,0337,0342,0336,0336,0333,0336,0333,0333,0333,0336,0332,0340,0335,0201,0212,";
currentTable[0426] = "0300,0300,0336,0332,0332,0332,0332,0332,0336,0336,0330,0330,0330,0330,0330,0330,0330,0310,0337,0313,0101,0102,0103,0104,0105,0106,0107,0110,0111,0112,0113,0114,0115,0116,0117,0120,0121,0122,0123,0124,0125,0126,0127,0130,0131,0132,040,0331,0331,0331,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,0332,040,0141,0142,0143,0144,0145,0146,0147,0150,0151,0152,0153,0154,0155,0156,0157,0160,0161,0162,0163,0164,0165,0166,0167,0170,0171,0172,040,040,060,061,062,063,064,065,066,067,070,071,";
currentTable[0427] = "0300";
currentTable[0430] = "0340,0341,0333,0341,0340";
currentTable[0431] = "0340,0341,0333,0341,0340";
currentTable[0432] = "0300";
currentTable[0433] = "0300";
currentTable[0434] = "0300";
currentTable[0435] = "0300";
currentTable[0436] = "0300";
currentTable[0437] = "0300,0330,0332,0332,0332,0332,0332,0330,0330,0123,0114,0111,0104,0105,040,0124,0111,0124,0114,0105,0330,0330,0330,0330,0330,0330,0332,0332,0332,0332,0300,0330,0332,0332,0332,0330,0336,0336,0336,0341,0337,0331,0333,0337,0142,0165,0154,0154,0145,0164,040,0160,0157,0151,0156,0164,0337,0337,0337,0336,0336,0336,0330,0331,0331,0331,0331,0331,0331,0331,0332,0332,0332,0332,0337,0214,0330,0331,0331,0331,0330,0333,0211,0334,0342,0330,0340,0330,0334,0334,0342,0342,0335,0210,0334,0342,0330,0340,0342,0335,0336,0336,0342,0330,0337,0337,0336,0337,0212,0330,0336,0336,0330,0337,0342,0330,0337,0217,0333,0333,0333,0333,0331,0332,0332,0336,0336,0332,0332,0331,0337,,0103,0332,0332,0332,0332,0332,0332,0332,0332,0336,0333,0337,0122,0333,0333,0333,0333,0333,0333,0333,0333,0332,0332,0332,0332,0332,0114";

currentTable[0450] = "0336,0336,0336,0336,0341,0330,0330,0341,0330,0330,0341,0330,0330,0341,0330,0330,0341,0330,0330,0341,0330,0330,0341,0330,0330,0341,0330,0330,0341,0330,";
currentTable[0451] = "0450,0333,0333,0335,0335,0337,0337,0337,0337,,0450,0330,0330,0334,0334,0333,0333,0330,0330,0337,0337,0337,0337,,,,0450,0333,0333,0335,0335,0330,0330,0331,0331,0331,0331,0330,0331,0330,0330,0330,0331,0337,0337,0337,0337,,0450,,0334,0334,0333,0333,0331,0330,0337,0337,0337,0337,,0333,0332,0450,,,,0335,0335,0333,0332,0332,0332,0330,0331,0331,03,,,,0330,0330,0330,0331,0331,,0337,0337,0337,0337,0337,0336,0450,,,0330,0334,0334,0333,0333,0330,0337,0337,0337,0337,,0450,,0330,0334,0334,0333,0333,0330,0337,0337,0337,0337,,0450,,0333,0332,0332,0332,0332,0332,0334,0334,0330,0334,0334,0333,0333,0330,0334,0334,0333,0333,0330,0337,0337,0337,0337,,0450,0330,0334,0334,0333,0333,0330,0333,0332,0332,0332,0332,0332,0330,0330,0330,0331,0337,0337,0337,0337,,0450,,0335,0335,0333,0337,0337,0337,0337,0311,0336,0312,0337,0311,0336,0312,0337,0200,";

currentTable[01020] = "0304,0333,0200,0336,0330,0332,0336,0336,0332,0337,0200,0333,0333,0200,0332,0332,0336,0330,0335,0337,0342,0330,0350,0335,0335,0351,0333,0350,0336,0334,0342,0334,0334,0342,0337,0335,0351,0333,0336,0333,0331,0337,0337,0331,0337,0304,0336,0330,0330,0336,0330,0334,0331,0337,0337"

currentTable[01021] = "0304,0333,0200,0336,0330,0332,0336,0336,0332,0337,0200,0333,0333,0200,0332,0332,0336,0330,0335,0337,0342,0330,0350,0335,0335,0335,0336,0342,0335,0335,0342,0337,0335,0351,0333,0336,0333,0331,0337,0337,0331,0337,0304";

currentTable[01022] = "0333,0200,0336,0336,0330,0330,0332,0332,0332,0336,0336,0333,0337,0337,0336,0330,0336,0333,0337,0337,0200,0333,0200,0333,0200,0331,0331,0332,0332,0200,0333,0200,0333,0200,0336,0333,0331,0337,0337,0332,0330,0336,0336,0331,0337,0342,0330,0335,0350,0335,0336,0342,0335,0335,0342,0337,0335,0335,0335,0351,0331,0331,0331,0333,0333,0336,0330,0337,0337,0337";

currentTable[01023] = "0333,0200,0336,0336,0330,0330,0332,0332,0332,0336,0336,0333,0337,0337,0336,0330,0336,0333,0337,0337,0200,0333,0200,0333,0200,0331,0331,0332,0332,0200,0333,0200,0333,0200,0336,0333,0331,0337,0337,0332,0330,0336,0336,0331,0337,0335,0335,0331,0342,0330,0335,0350,0335,0336,0342,0335,0335,0342,0337,0335,0335,0335,0351,0331,0331,0331,0333,0333,0336,0330,0337,0337,0337,0335,0335,0331,0333";

currentTable[01024] = "0333,0200,0336,0336,0330,0332,0337,0200,0336,0336,0330,0332,0337,0200,0336,0336,0330,0332,0337,0200,0333,0333,0333,0331,0331,0331,0336,0331,0333,0337,0337,0337,0337";

currentTable[01025] = "0333,0200,0336,0336,0330,0332,0337,0336,0336,0330,0332,0337,0200,0336,0336,0330,0332,0337,0200,0333,0333,0333,0331,0331,0331,0336,0331,0333,0337,0337,0337,0337";

currentTable[01026] = "0333,0200,0336,0330,0332,0336,0336,0333,0331,0337,0200,0306,0335,0342,0332,0342,0330,0335,0335,0342,0335,0335,0335,0335,0331,0334,0304,0332,0306,0335,0342,0330,0350,0335,0342,0334,0331,0335,0304,0334,0331,0332,0335,0336,0332,0337,0342,0330,0350,0335,0335,0335,0336,0342,0335,0335,0342,0335,0304,0331,0331,0331,0331,0333,0333,0333,0333,0333,0337,0337,0337";//import cube

currentTable[01027] = "0333,0200,0336,0330,0332,0336,0336,0333,0331,0337,0332,0200,0306,0335,0342,0332,0342,0330,0335,0335,0342,0335,0335,0335,0335,0331,0334,0304,0332,0306,0335,0342,0330,0350,0335,0342,0334,0331,0335,0304,0334,0331,0333,0333,0330,0335,0342,0330,0350,0335,0335,0335,0336,0342,0335,0335,0342,0335,0304,0331,0331,0331,0331,0331,0333,0337,0337,0337";//export cube

currentTable[01010]  = "0333,0200,0350,0334,0310,0337,0342,0336,0332,0335,0335,0337,0342,0336,0333,0334,0351,0313";//delete in glyph spelling

currentTable[01030] = "0333,0200,0336,0336,0330,0332,0332,0332,0336,0331,0333,0337,0200,0333,0200,0333,0200,0330,0200,0330,0200,0332,0332,0200,0333,0200,0331,0332,0200,0331,0331,0333,0333,0333,0336,0330,0332,0337,0337,0337,";//shape table assignment

currentTable[01016] = "0333,0200,0336,0330,0336,0332,0332,0332,0101,0102,0103,0331,0331,0336,0333,0337,0337,0337";//import word

currentTable[0600] = "0101,0154,0151,0143,0145,"
currentTable[0601] = "0102,0157,0142,"
currentTable[0602] = "0105,0166,0145,"
currentTable[0603] = "0121,0165,0141,0156,0164,0165,0155,040,0103,0150,0141,0156,0156,0145,0154,"
currentTable[0604] = "0103,0154,0141,0163,0163,0151,0143,0141,0154,040,0103,0150,0141,0156,0156,0145,0154,"
currentTable[0605] = "0121,0165,0142,0151,0164,"
currentTable[0606] = "0101,0155,0160,0154,0151,0146,0151,0145,0162,"
currentTable[0607] = "0107,"
currentTable[0610] = "0101,"
currentTable[0611] = "0124,"
currentTable[0612] = "0124,0156,0157,0151,0163,0145,"
currentTable[0613] = "0123,0157,0165,0162,0143,0145,"
currentTable[0614] = "0114,0157,0141,0144,"
currentTable[0615] = "0107,0145,0156,0145,0162,0141,0164,0157,0162,"
currentTable[0616] = "0124,0162,0141,0156,0163,0155,0157,0156,"
currentTable[0617] = "0105,0126,0105,0122,0131,0124,0110,0111,0116,0107,040,0111,0123,040,0120,0110,0131,0123,0111,0103,0101,0114,"
currentTable[0620] = "0105,0126,0105,0122,0131,0124,0110,0111,0116,0107,040,0111,0123,040,0122,0105,0103,0125,0122,0123,0111,0126,0105,"
currentTable[0621] = "0105,0126,0105,0122,0131,0124,0110,0111,0116,0107,040,0111,0123,040,0106,0122,0101,0103,0124,0101,0114,"
currentTable[0622] = "0116,0117,040,0115,0117,0116,0105,0131,"
currentTable[0623] = "0116,0117,040,0115,0111,0116,0111,0116,0107,"
currentTable[0624] = "0116,0117,040,0120,0122,0117,0120,0105,0122,0124,0131,"
currentTable[0625] = "0107,0145,0157,0155,0145,0164,0162,0157,0156,"
currentTable[0626] = "0127,0157,0162,0144,0163,"
currentTable[0627] = "0121,0165,0141,0156,0164,0165,0155,040,0103,0157,0155,0160,0165,0164,0145,0162,"


currentTable[0300] = "012,040,040,040,040,040,040,0170,040,075,040,0170,060,073,012,040,040,040,040,040,040,0171,040,075,040,0171,060,073,012,040,040,040,040,040,040,0164,0150,0145,0164,0141,040,075,040,0164,0150,0145,0164,0141,060,073,012,040,040,040,040,040,040,0163,0151,0144,0145,040,075,040,0165,0156,0151,0164,073,012,040,040,040,040,040,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,040,075,040,0115,0141,0164,0150,056,0120,0111,057,062,073,012,040,040,040,040,040,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,040,075,040,062,073,012,040,040,040,040,040,040,011,011,011,0143,0164,0170,056,0154,0151,0156,0145,0127,0151,0144,0164,0150,040,075,040,062,056,065,073,012,040,040,040,040,040,040,011,0167,0157,0162,0144,0111,0156,0144,0145,0170,040,075,040,060,073,012,012,040,040,040,040,";
currentTable[0304] = "012,040,040,040,040,040,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,040,075,040,0115,0141,0164,0150,056,0120,0111,057,062,073,012,040,040,040,040,";
currentTable[0305] = "012,040,040,040,040,040,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,040,075,040,062,052,0115,0141,0164,0150,056,0120,0111,057,065,073,012,040,040,040,040,";
currentTable[0306] = "012,040,040,040,040,040,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,040,075,040,0115,0141,0164,0150,056,0120,0111,057,063,073,012,040,040,040,040,";
currentTable[0310] = "012,040,040,040,040,040,040,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,040,075,040,0115,0141,0164,0150,056,0163,0161,0162,0164,050,062,051,073,040,012,040,040,040,040,";
currentTable[0311] = "012,040,040,040,040,040,040,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,040,075,040,0160,0150,0151,073,040,057,057,042,0147,0157,0154,0144,0145,0156,042,040,0162,0141,0164,0151,0157,040,012,040,040,040,040,";
currentTable[0312] = "012,040,040,040,040,040,040,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,040,075,040,0115,0141,0164,0150,056,0163,0161,0162,0164,050,063,051,073,040,012,040,040,040,040,";
currentTable[0313] = "012,040,040,040,040,040,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,040,075,040,062,073,040,040,057,057,062,0170,012,040,040,040,040,";
currentTable[0314] = "012,040,040,040,040,040,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,040,075,040,063,073,040,040,057,057,063,0170,012,040,040,040,040,";
currentTable[0315] = "012,040,040,040,040,040,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,040,075,040,063,056,061,064,061,065,071,073,040,040,057,057,0160,0151,052,012,040,040,040,040,";
currentTable[0317] = "012,040,040,040,040,040,040,040,0163,0151,0144,0145,040,075,040,0165,0156,0151,0164,073,040,012,040,040,040,040,";
currentTable[0320] = "012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,0123,0164,0171,0154,0145,075,042,0142,0154,0141,0143,0153,042,073,012,040,040,040,040,011,0143,0164,0170,056,0154,0151,0156,0145,0127,0151,0144,0164,0150,040,075,040,062,073,040,040,040,040,011,012,040,040,040,040,";
currentTable[0321] = "012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,0123,0164,0171,0154,0145,075,042,0171,0145,0154,0154,0157,0167,042,073,012,040,040,040,040,011,0143,0164,0170,056,0154,0151,0156,0145,0127,0151,0144,0164,0150,040,075,040,063,065,073,040,040,040,040,011,012,040,040,040,040,";
currentTable[0322] = "012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,0123,0164,0171,0154,0145,075,042,0142,0154,0141,0143,0153,042,073,012,040,040,040,040,011,0143,0164,0170,056,0154,0151,0156,0145,0127,0151,0144,0164,0150,040,075,040,063,065,073,040,040,040,040,011,012,040,040,040,040,";
currentTable[0330] = "012,040,040,040,040,040,040,0170,040,053,075,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,040,040,040,012,040,040,040,040,040,040,0171,040,053,075,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,040,012,040,040,040,040,";
currentTable[0331] = "012,040,040,040,040,040,040,0170,040,055,075,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,040,040,040,012,040,040,040,040,040,040,0171,040,055,075,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,040,012,040,040,040,040,";
currentTable[0332] = "012,040,040,040,040,040,040,0170,040,053,075,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,040,040,040,040,040,040,0171,040,053,075,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,040,040,040,040,";
currentTable[0333] = "012,040,040,040,040,040,040,0170,040,053,075,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,040,040,040,040,040,040,0171,040,053,075,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,040,040,040,040,";
currentTable[0334] = "012,040,040,040,040,040,040,0164,0150,0145,0164,0141,040,055,075,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,073,040,057,057,040,0103,0103,0127,012,040,040,040,040,";
currentTable[0335] = "012,040,040,040,040,040,040,0164,0150,0145,0164,0141,040,053,075,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,073,040,057,057,040,0103,0127,012,040,040,040,040,";
currentTable[0336] = "012,040,040,040,040,040,040,0163,0151,0144,0145,040,057,075,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,073,040,057,057,040,055,012,040,040,040,040,";
currentTable[0337] = "012,040,040,040,040,040,040,0163,0151,0144,0145,040,052,075,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,073,040,057,057,040,053,012,040,040,040,040,";
currentTable[0340] = "040,040,057,057,0160,0157,0151,0156,0164,012,011,011,0143,0164,0170,056,0142,0145,0147,0151,0156,0120,0141,0164,0150,050,051,073,012,011,011,0143,0164,0170,056,0141,0162,0143,050,0170,054,040,0171,054,040,063,054,040,060,054,040,062,040,052,040,0115,0141,0164,0150,056,0120,0111,051,073,012,011,011,0143,0164,0170,056,0146,0151,0154,0154,050,051,073,011,012,011,040,040,040,040,012,011,040,040,040,040,012,011,040,040,040,040,0151,0146,050,0151,0156,0120,0141,0164,0150,051,0173,040,040,057,057,0151,0146,040,0167,0145,047,0162,0145,040,0151,0156,040,0141,040,0160,0141,0164,0150,040,0151,0164,047,0163,040,0157,0166,0145,0162,040,0156,0157,0167,011,011,011,011,012,011,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,042,0134,042,042,051,073,012,011,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,042,0163,0164,0171,0154,0145,075,0134,042,0163,0164,0162,0157,0153,0145,072,0142,0154,0141,0143,0153,073,0163,0164,0162,0157,0153,0145,055,0167,0151,0144,0164,0150,072,062,0134,042,040,0146,0151,0154,0154,075,0134,042,0156,0157,0156,0145,0134,042,040,057,076,042,051,073,012,011,011,011,0151,0156,0120,0141,0164,0150,040,075,040,0146,0141,0154,0163,0145,073,012,011,011,0175,012,011,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,040,040,074,0143,0151,0162,0143,0154,0145,040,0143,0170,075,0134,042,042,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0170,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0134,042,040,0143,0171,075,0134,042,042,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0171,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0134,042,040,0162,075,0134,042,064,0134,042,040,0163,0164,0162,0157,0153,0145,075,0134,042,0142,0154,0141,0143,0153,0134,042,040,0163,0164,0162,0157,0153,0145,055,0167,0151,0144,0164,0150,075,0134,042,063,0134,042,040,0146,0151,0154,0154,075,0134,042,0142,0154,0141,0143,0153,0134,042,040,057,076,042,073,012,011,040,040,040,040,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,040,040,040,040,040,012,011,040,040,040,040,040,040,040,0151,0156,0120,0141,0164,0150,040,075,040,0146,0141,0154,0163,0145,073,012,040,040,040,040,";
currentTable[0341] = "040,040,057,057,0143,0151,0162,0143,0154,0145,012,011,011,0143,0164,0170,056,0142,0145,0147,0151,0156,0120,0141,0164,0150,050,051,073,012,011,011,0143,0164,0170,056,0141,0162,0143,050,0170,054,040,0171,054,040,0163,0151,0144,0145,054,040,060,054,040,062,040,052,040,0115,0141,0164,0150,056,0120,0111,051,073,012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,050,051,073,012,011,011,012,011,011,012,040,040,040,040,";
currentTable[0342] = "040,040,040,057,057,0154,0151,0156,0145,012,011,011,0143,0164,0170,056,0142,0145,0147,0151,0156,0120,0141,0164,0150,050,051,073,012,057,057,011,011,0143,0164,0170,056,0154,0151,0156,0145,0127,0151,0144,0164,0150,040,075,040,062,073,012,011,011,0143,0164,0170,056,0155,0157,0166,0145,0124,0157,050,0170,054,0171,051,073,012,011,011,0143,0164,0170,056,0154,0151,0156,0145,0124,0157,050,0170,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,054,0171,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,051,073,012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,050,051,073,012,011,011,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,042,073,012,011,011,0151,0146,050,041,0151,0156,0120,0141,0164,0150,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,040,074,0160,0141,0164,0150,040,0144,075,0134,042,042,073,011,012,011,011,011,0151,0156,0120,0141,0164,0150,040,075,040,0164,0162,0165,0145,073,012,011,011,0175,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0115,042,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0170,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0171,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,0114,042,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,040,040,040,040,";
currentTable[0343] = "012,011,011,0143,0164,0170,056,0142,0145,0147,0151,0156,0120,0141,0164,0150,050,051,073,012,011,011,0143,0164,0170,056,0141,0162,0143,050,0170,054,040,0171,054,040,0163,0151,0144,0145,054,040,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,054,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,050,051,073,012,011,011,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,042,073,012,011,011,0151,0146,050,041,0151,0156,0120,0141,0164,0150,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,040,074,0160,0141,0164,0150,040,0144,075,0134,042,042,073,011,012,011,011,011,0151,0156,0120,0141,0164,0150,040,075,040,0164,0162,0165,0145,073,012,011,011,0175,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0115,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,040,040,040,040,040,040,040,040,040,040,040,0101,042,040,053,040,0163,0151,0144,0145,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,040,053,040,0163,0151,0144,0145,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,060,040,060,040,061,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,040,040,040,040,040,040,040,040,012,040,040,040,040,";
currentTable[0344] = "012,011,011,0143,0164,0170,056,0142,0145,0147,0151,0156,0120,0141,0164,0150,050,051,073,012,011,011,0143,0164,0170,056,0155,0157,0166,0145,0124,0157,050,0170,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,054,0171,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,051,073,012,011,011,0143,0164,0170,056,0161,0165,0141,0144,0162,0141,0164,0151,0143,0103,0165,0162,0166,0145,0124,0157,050,0170,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,054,0171,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,053,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,054,0170,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,054,0171,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,051,073,012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,050,051,073,012,011,011,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,042,073,012,011,011,0151,0146,050,041,0151,0156,0120,0141,0164,0150,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,040,074,0160,0141,0164,0150,040,0144,075,0134,042,042,073,012,011,011,011,0151,0156,0120,0141,0164,0150,040,075,040,0164,0162,0165,0145,073,011,012,011,011,0175,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0115,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,061,040,075,040,0170,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,062,040,075,040,0171,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,011,011,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,040,040,040,040,040,040,040,040,040,040,040,0121,042,040,053,040,0154,0157,0143,0141,0154,0111,0156,0164,061,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,040,053,040,0154,0157,0143,0141,0154,0111,0156,0164,062,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,012,040,040,040,040,";
currentTable[0345] = "012,011,011,0143,0164,0170,056,0142,0145,0147,0151,0156,0120,0141,0164,0150,050,051,073,012,011,011,0143,0164,0170,056,0155,0157,0166,0145,0124,0157,050,0170,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,054,0171,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,051,073,012,011,011,0143,0164,0170,056,0161,0165,0141,0144,0162,0141,0164,0151,0143,0103,0165,0162,0166,0145,0124,0157,050,0170,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,054,0171,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,053,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,054,0170,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,054,0171,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,051,073,012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,050,051,073,012,011,011,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,042,073,012,011,011,0151,0146,050,041,0151,0156,0120,0141,0164,0150,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,040,074,0160,0141,0164,0150,040,0144,075,0134,042,042,073,011,012,011,011,011,0151,0156,0120,0141,0164,0150,040,075,040,0164,0162,0165,0145,073,012,011,011,0175,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0115,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,061,040,075,040,0170,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,062,040,075,040,0171,040,053,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,011,011,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,040,040,040,040,040,040,040,040,040,040,040,0121,042,040,053,040,0154,0157,0143,0141,0154,0111,0156,0164,061,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,040,053,040,0154,0157,0143,0141,0154,0111,0156,0164,062,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,040,040,040,040,";
currentTable[0346] = "012,011,011,0143,0164,0170,056,0142,0145,0147,0151,0156,0120,0141,0164,0150,050,051,073,012,011,011,0143,0164,0170,056,0155,0157,0166,0145,0124,0157,050,0170,040,053,040,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,054,0171,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,051,073,012,011,011,0143,0164,0170,056,0161,0165,0141,0144,0162,0141,0164,0151,0143,0103,0165,0162,0166,0145,0124,0157,050,0170,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,054,0171,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,053,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,054,0170,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,054,0171,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,051,073,012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,050,051,073,012,011,011,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,042,073,012,011,011,0151,0146,050,041,0151,0156,0120,0141,0164,0150,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,040,074,0160,0141,0164,0150,040,0144,075,0134,042,042,073,011,012,011,011,011,0151,0156,0120,0141,0164,0150,040,075,040,0164,0162,0165,0145,073,012,011,011,0175,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0115,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,061,040,075,040,0170,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,062,040,075,040,0171,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,055,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,011,011,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,040,040,040,040,040,040,040,040,040,040,040,0121,042,040,053,040,0154,0157,0143,0141,0154,0111,0156,0164,061,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,040,053,040,0154,0157,0143,0141,0154,0111,0156,0164,062,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,012,040,040,040,040,";
currentTable[0347] = "012,011,011,0143,0164,0170,056,0142,0145,0147,0151,0156,0120,0141,0164,0150,050,051,073,012,011,011,0143,0164,0170,056,0155,0157,0166,0145,0124,0157,050,0170,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,054,0171,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,051,073,012,011,011,0143,0164,0170,056,0161,0165,0141,0144,0162,0141,0164,0151,0143,0103,0165,0162,0166,0145,0124,0157,050,0170,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,054,0171,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,053,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,054,0170,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,054,0171,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,051,073,012,011,011,0143,0164,0170,056,0163,0164,0162,0157,0153,0145,050,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,042,073,012,011,011,0151,0146,050,041,0151,0156,0120,0141,0164,0150,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,040,074,0160,0141,0164,0150,040,0144,075,0134,042,042,073,011,012,011,011,011,0151,0156,0120,0141,0164,0150,040,075,040,0164,0162,0165,0145,073,012,011,011,0175,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0115,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,061,040,075,040,0170,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,062,040,075,040,0171,040,053,0163,0151,0144,0145,052,050,061,057,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,051,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,040,053,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,051,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,011,011,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,040,040,040,040,040,040,040,040,040,040,040,0121,042,040,053,040,0154,0157,0143,0141,0154,0111,0156,0164,061,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,040,053,040,0154,0157,0143,0141,0154,0111,0156,0164,062,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0170,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0143,0157,0163,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,040,053,040,042,040,042,073,012,011,011,0154,0157,0143,0141,0154,0111,0156,0164,040,075,040,0171,040,053,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,052,0163,0151,0144,0145,052,0115,0141,0164,0150,056,0163,0151,0156,050,0164,0150,0145,0164,0141,051,073,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0154,0157,0143,0141,0154,0111,0156,0164,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,012,012,040,040,040,040,";
currentTable[0350] = "012,040,040,040,040,040,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,040,057,075,040,062,073,040,040,057,057,0141,0156,0147,0154,0145,057,062,012,040,040,040,040,";
currentTable[0351] = "012,040,040,040,040,040,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,040,052,075,040,062,073,040,040,057,057,062,0141,0156,0147,0154,0145,012,040,040,040,040,";
currentTable[0352] = "012,040,040,040,040,040,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,040,057,075,040,063,073,040,057,057,0141,0156,0147,0154,0145,057,063,012,040,040,040,040,";
currentTable[0353] = "012,040,040,040,040,040,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,040,052,075,040,063,073,040,057,057,063,0141,0156,0147,0154,0145,012,040,040,040,040,";
currentTable[0360] = "057,057,0147,0162,0141,0142,040,0151,0155,0141,0147,0145,012,012,057,057,040,040,040,040,040,040,0155,0171,0111,0155,0141,0147,0145,040,075,040,0147,0145,0164,050,0151,0156,0164,050,0170,051,054,0151,0156,0164,050,0171,051,054,0151,0156,0164,050,0163,0151,0144,0145,051,054,0151,0156,0164,050,0163,0151,0144,0145,051,051,073,012,040,040,040,057,057,0150,0164,0164,0160,072,057,057,0167,0167,0167,056,0167,063,0163,0143,0150,0157,0157,0154,0163,056,0143,0157,0155,057,0164,0141,0147,0163,057,0143,0141,0156,0166,0141,0163,0137,0147,0145,0164,0151,0155,0141,0147,0145,0144,0141,0164,0141,056,0141,0163,0160,012,040,040,040,040,040,0143,0165,0162,0162,0145,0156,0164,0111,0155,0141,0147,0145,040,075,040,0143,0164,0170,056,0147,0145,0164,0111,0155,0141,0147,0145,0104,0141,0164,0141,050,0170,054,0171,054,0163,0151,0144,0145,054,0163,0151,0144,0145,051,073,012,057,057,0143,0164,0170,056,0160,0165,0164,0111,0155,0141,0147,0145,0104,0141,0164,0141,050,0151,0155,0147,0104,0141,0164,0141,054,061,060,054,067,060,051,073,012,040,040,040,040,";
currentTable[0361] = "057,057,0144,0162,0157,0160,040,0151,0155,0141,0147,0145,012,040,040,057,057,040,040,040,040,040,0151,0155,0141,0147,0145,050,0155,0171,0111,0155,0141,0147,0145,054,0170,054,0171,054,0151,0156,0164,050,0163,0151,0144,0145,051,054,0151,0156,0164,050,0163,0151,0144,0145,051,051,073,012,057,057,0166,0141,0162,040,0151,0155,0147,0104,0141,0164,0141,075,0143,0164,0170,056,0147,0145,0164,0111,0155,0141,0147,0145,0104,0141,0164,0141,050,061,060,054,061,060,054,065,060,054,065,060,051,073,012,040,040,040,040,040,040,040,0143,0164,0170,056,0160,0165,0164,0111,0155,0141,0147,0145,0104,0141,0164,0141,050,0143,0165,0162,0162,0145,0156,0164,0111,0155,0141,0147,0145,054,0170,054,0171,051,073,012,040,040,040,040,";
currentTable[0362] = "012,011,040,040,040,011,0142,0141,0143,0153,0147,0162,0157,0165,0156,0144,0111,0155,0141,0147,0145,0117,0156,040,075,040,0146,0141,0154,0163,0145,073,011,012,040,040,040,040,";
currentTable[0363] = "012,011,040,040,040,011,0142,0141,0143,0153,0147,0162,0157,0165,0156,0144,0111,0155,0141,0147,0145,0117,0156,040,075,040,0164,0162,0165,0145,073,011,040,012,040,040,040,040,";
currentTable[0364] = "012,040,040,040,040,040,040,040,040,0143,0164,0170,056,0146,0157,0156,0164,075,0163,0151,0144,0145,056,0164,0157,0123,0164,0162,0151,0156,0147,050,070,051,040,053,040,042,0160,0170,040,042,040,053,040,0155,0171,0106,0157,0156,0164,073,073,012,011,011,0155,0171,0127,0157,0162,0144,040,075,040,0167,0157,0162,0144,0123,0164,0141,0143,0153,0133,0167,0157,0162,0144,0111,0156,0144,0145,0170,0135,073,012,011,011,0143,0164,0170,056,0146,0151,0154,0154,0124,0145,0170,0164,050,0155,0171,0127,0157,0162,0144,054,0170,054,0171,051,073,012,011,011,0167,0157,0162,0144,0111,0156,0144,0145,0170,053,053,073,012,011,011,0151,0146,050,0167,0157,0162,0144,0111,0156,0144,0145,0170,040,076,075,040,0167,0157,0162,0144,0123,0164,0141,0143,0153,056,0154,0145,0156,0147,0164,0150,051,0173,012,011,011,011,0167,0157,0162,0144,0111,0156,0144,0145,0170,040,075,040,060,073,012,011,011,0175,012,040,040,040,040,";
currentTable[0365] = "012,040,040,040,040,040,040,040,040,0143,0164,0170,056,0146,0157,0156,0164,075,0163,0151,0144,0145,056,0164,0157,0123,0164,0162,0151,0156,0147,050,070,051,040,053,040,042,0160,0170,040,042,040,053,040,0155,0171,0106,0157,0156,0164,073,073,012,011,011,0143,0164,0170,056,0146,0151,0154,0154,0124,0145,0170,0164,050,0143,0165,0162,0162,0145,0156,0164,0127,0157,0162,0144,054,0170,054,0171,051,073,012,040,040,040,040,";
currentTable[0366] = "057,057,0143,0154,0157,0163,0145,0144,040,0163,0161,0165,0141,0162,0145,012,011,011,0143,0164,0170,056,0146,0151,0154,0154,0122,0145,0143,0164,050,0170,054,0171,054,0163,0151,0144,0145,054,0163,0151,0144,0145,051,073,012,011,011,012,011,011,012,011,011,0151,0146,050,0151,0156,0120,0141,0164,0150,051,0173,040,040,057,057,0151,0146,040,0167,0145,047,0162,0145,040,0151,0156,040,0141,040,0160,0141,0164,0150,040,0151,0164,047,0163,040,0157,0166,0145,0162,040,0156,0157,0167,011,011,011,012,011,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,042,0134,042,042,051,073,012,011,011,011,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,042,0163,0164,0171,0154,0145,075,0134,042,0163,0164,0162,0157,0153,0145,072,0142,0154,0141,0143,0153,073,0163,0164,0162,0157,0153,0145,055,0167,0151,0144,0164,0150,072,062,0134,042,040,0146,0151,0154,0154,075,0134,042,0156,0157,0156,0145,0134,042,040,057,076,042,051,073,012,011,011,011,0151,0156,0120,0141,0164,0150,040,075,040,0146,0141,0154,0163,0145,073,012,011,011,0175,012,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,040,040,074,0162,0145,0143,0164,040,0170,075,0134,042,042,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0170,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0134,042,040,0171,075,0134,042,042,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0171,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0134,042,040,0150,0145,0151,0147,0150,0164,075,0134,042,042,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0163,0151,0144,0145,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,040,040,040,040,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0134,042,040,0167,0151,0144,0164,0150,075,0134,042,042,073,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0163,0151,0144,0145,056,0164,0157,0123,0164,0162,0151,0156,0147,050,051,073,040,040,040,040,040,012,040,040,040,040,040,040,040,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,0134,042,040,0163,0164,0162,0157,0153,0145,075,0134,042,0142,0154,0141,0143,0153,0134,042,040,0163,0164,0162,0157,0153,0145,055,0167,0151,0144,0164,0150,075,0134,042,061,0134,042,040,0146,0151,0154,0154,075,0134,042,0156,0157,0156,0145,0134,042,040,057,076,042,073,012,011,040,040,040,040,0163,0166,0147,0106,0151,0154,0145,056,0160,0165,0163,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,073,040,040,040,040,040,012,011,040,040,040,040,012,040,040,040,0151,0156,0120,0141,0164,0150,040,075,040,0146,0141,0154,0163,0145,073,012,012,011,011,012,057,057,040,040,074,0162,0145,0143,0164,040,0167,0151,0144,0164,0150,075,042,064,060,060,042,040,0150,0145,0151,0147,0150,0164,075,042,061,060,060,042,040,0163,0164,0171,0154,0145,075,042,0146,0151,0154,0154,072,0162,0147,0142,050,060,054,060,054,062,065,065,051,073,0163,0164,0162,0157,0153,0145,055,0167,0151,0144,0164,0150,072,061,060,073,0163,0164,0162,0157,0153,0145,072,0162,0147,0142,050,060,054,060,054,060,051,042,040,057,076,012,012,011,";
currentTable[0370] = "040,057,057,0144,0162,0157,0160,040,0164,0162,0151,0141,0156,0147,0154,0145,040,0155,0141,0162,0153,0145,0162,012,040,040,040,040,040,040,040,040,0164,0162,0151,0141,0156,0147,0154,0145,0130,040,075,040,0170,073,012,040,040,040,040,040,040,040,040,0164,0162,0151,0141,0156,0147,0154,0145,0131,040,075,0171,073,012,040,040,040,040,";
currentTable[0371] = "057,057,0147,0157,040,0164,0157,040,0164,0162,0151,0141,0156,0147,0154,0145,040,0155,0141,0162,0153,0145,0162,012,040,040,040,040,040,040,040,040,0170,040,075,040,0164,0162,0151,0141,0156,0147,0154,0145,0130,073,012,040,040,040,040,040,040,040,040,0171,040,075,040,0164,0162,0151,0141,0156,0147,0154,0145,0131,073,012,040,040,040,040,";
currentTable[0372] = "057,057,0144,0162,0157,0160,040,0163,0161,0165,0141,0162,0145,040,0155,0141,0162,0153,0145,0162,012,040,040,040,040,040,040,040,040,0163,0161,0165,0141,0162,0145,0130,040,075,040,0170,073,012,040,040,040,040,040,040,040,040,0163,0161,0165,0141,0162,0145,0131,040,075,040,0171,073,012,040,040,040,040,";
currentTable[0373] = "057,057,0147,0157,040,0164,0157,040,0163,0161,0165,0141,0162,0145,040,0155,0141,0162,0153,0145,0162,012,040,040,040,040,040,040,040,040,0170,040,075,040,0163,0161,0165,0141,0162,0145,0130,073,012,040,040,040,040,040,040,040,040,0171,040,075,040,0163,0161,0165,0141,0162,0145,0131,073,012,040,040,040,040,";
currentTable[0374] = "057,057,0144,0162,0157,0160,040,0160,0145,0156,0164,0141,0147,0157,0156,040,0155,0141,0162,0153,0145,0162,012,040,040,040,040,040,040,040,040,0160,0145,0156,0164,0141,0147,0157,0156,0130,040,075,040,0170,073,012,040,040,040,040,040,040,040,040,0160,0145,0156,0164,0141,0147,0157,0156,0131,040,075,040,0171,073,012,040,040,040,040,";
currentTable[0375] = "057,057,0147,0157,040,0164,0157,040,0160,0145,0156,0164,0141,0147,0157,0156,040,0155,0141,0162,0153,0145,0162,012,040,040,040,040,040,040,040,040,0170,040,075,040,0160,0145,0156,0164,0141,0147,0157,0156,0130,073,012,040,040,040,040,040,040,040,040,0171,040,075,040,0160,0145,0156,0164,0141,0147,0157,0156,0131,073,012,040,040,040,040,";
currentTable[0376] = "057,057,0144,0162,0157,0160,040,0150,0145,0170,0141,0147,0157,0156,040,0155,0141,0162,0153,0145,0162,012,040,040,040,040,040,040,040,040,0150,0145,0170,0141,0147,0157,0156,0130,040,075,040,0170,073,012,040,040,040,040,040,040,040,040,0150,0145,0170,0141,0147,0157,0156,0131,040,075,040,0171,073,012,040,040,040,040,";
currentTable[0377] = "057,057,0147,0157,040,0164,0157,040,0150,0145,0170,0141,0147,0157,0156,040,0155,0141,0162,0153,0145,0162,012,040,040,040,040,040,040,040,040,0170,040,075,040,0150,0145,0170,0141,0147,0157,0156,0130,073,012,040,040,040,040,040,040,040,040,0171,040,075,040,0150,0145,0170,0141,0147,0157,0156,0131,073,012,040,040,040,040,";


currentTable[0500] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0125,0157,0122,0144,0144,070,0120,056,0160,0156,0147,";
currentTable[01500] = "0127,0141,0164,0145,0162,040,0164,0162,0151,0160,0154,0145,040,0160,0157,0151,0156,0164,";
currentTable[0501] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0101,071,0145,0163,0110,0153,070,056,0160,0156,0147,";
currentTable[01501] = "0117,0160,0164,0151,0143,0141,0154,040,0162,0145,0163,0151,0163,0164,040,0142,0151,0154,0141,0171,0145,0162,040,0151,0155,0141,0147,0145,";
currentTable[0502] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0102,0105,0123,0131,0102,0157,0162,056,0160,0156,0147,";
currentTable[01502] = "0155,0141,0164,0162,0171,0157,0163,0150,0153,0141,0163,0164,0141,0164,040,0160,0151,0143,0164,0165,0162,0145,";
currentTable[0503] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0116,0163,0103,0106,0144,064,0152,056,0160,0156,0147,";
currentTable[01503] = "0162,0145,0163,0151,0163,0164,040,0142,0162,0151,0144,0147,0145,040,0123,0105,0115,";
currentTable[0504] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0171,0131,0124,0164,0112,061,0103,056,0160,0156,0147,";
currentTable[01504] = "0152,0145,0154,0154,0171,0150,0157,0147,040,0160,0151,0143,0164,0165,0162,0145,";
currentTable[0505] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0116,0115,0123,0146,0123,0166,0150,056,0160,0156,0147,";
currentTable[01505] = "0152,0165,0156,0143,0164,0151,0157,0156,040,0123,0105,0115,040,0151,0155,0141,0147,0145,";
currentTable[0506] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0104,0112,0103,0123,0103,060,0124,056,0160,0156,0147,";
currentTable[01506] = "0155,0141,0164,0162,0171,0157,0163,0150,0153,0141,0163,0164,0141,0164,040,0172,0157,0157,0155,040,0160,0150,0157,0164,0157,";
currentTable[0507] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0163,0116,0120,0113,0142,0167,0127,056,0160,0156,0147,";
currentTable[01507] = "0157,0160,0145,0156,040,0152,0165,0156,0143,0164,0151,0157,0156,040,0157,0160,0164,0151,0143,0141,0154,";
currentTable[0510] = "0150,0164,0164,0160,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0151,0167,0172,063,0146,0155,0167,056,0160,0156,0147,";
currentTable[01510] = "0155,0157,0154,0154,0165,0163,0153,";
currentTable[0511] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0142,0142,0141,063,0160,0165,0157,056,0160,0156,0147,";
currentTable[01511] = "0145,0170,0160,0154,0157,0144,0145,0144,040,0152,0165,0156,0143,0164,0151,0157,0156,040,0101,0106,0115,040,0151,0155,0141,0147,0145,";




currentTable[01030] = "0304,0313,0333,0200,0336,0332,0330,0336,0201,0335,0201,0331,0331,0201,0334,0331,0337,0333,0331,0337";
currentTable[01031] ="0313,0304,0333,0200,0336,0330,0332,0336,0331,0201,0333,0337,0200";


currentTable[00] = "074,041,0104,0117,0103,0124,0131,0120,0105,040,0150,0164,0155,0154,076,012,074,0150,0164,0155,0154,076,012,011,074,0150,0145,0141,0144,076,012,011,074,0164,0151,0164,0154,0145,076,0107,0145,0157,0155,0145,0164,0162,0157,0156,040,0120,0162,0145,0163,0145,0156,0164,0163,040,0107,0145,0157,0155,0145,0164,0162,0157,0156,074,057,0164,0151,0164,0154,0145,076,012,012,074,0163,0143,0162,0151,0160,0164,040,0151,0144,040,075,040,042,0150,0145,0141,0144,0123,0143,0162,0151,0160,0164,042,076,012,012,0146,0165,0156,0143,0164,0151,0157,0156,040,0143,0162,0145,0141,0164,0145,050,051,0173,012,012,040,040,011,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,040,075,040,0133,0135,073,040,012,011,0146,0157,0162,050,0166,0141,0162,040,0151,0156,0144,0145,0170,040,075,040,060,073,0151,0156,0144,0145,0170,040,074,040,060,061,067,067,067,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,056,0160,0165,0163,0150,050,042,042,051,073,012,011,0175,012,011,0166,0141,0162,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0143,0165,0142,0145,0111,0156,0160,0165,0164,042,051,056,0166,0141,0154,0165,0145,073,012,011,0166,0141,0162,040,0151,0156,0160,0165,0164,0123,0164,0141,0143,0153,040,075,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,056,0163,0160,0154,0151,0164,050,042,0134,0156,042,051,073,012,011,0146,0157,0162,050,0166,0141,0162,040,0151,0156,0144,0145,0170,040,075,040,060,073,0151,0156,0144,0145,0170,040,074,040,0151,0156,0160,0165,0164,0123,0164,0141,0143,0153,056,0154,0145,0156,0147,0164,0150,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,0166,0141,0162,040,0163,0164,0141,0143,0153,0114,0151,0156,0145,040,075,040,0151,0156,0160,0165,0164,0123,0164,0141,0143,0153,0133,0151,0156,0144,0145,0170,0135,056,0163,0160,0154,0151,0164,050,042,072,042,051,073,012,011,011,0166,0141,0162,040,0154,0157,0143,0141,0154,0101,0144,0144,0162,0145,0163,0163,040,075,040,0160,0141,0162,0163,0145,0111,0156,0164,050,0163,0164,0141,0143,0153,0114,0151,0156,0145,0133,060,0135,054,070,051,073,012,011,011,0166,0141,0162,040,0154,0157,0143,0141,0154,0107,0154,0171,0160,0150,040,075,040,0163,0164,0141,0143,0153,0114,0151,0156,0145,0133,061,0135,073,012,011,011,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0154,0157,0143,0141,0154,0101,0144,0144,0162,0145,0163,0163,0135,040,075,040,0154,0157,0143,0141,0154,0107,0154,0171,0160,0150,073,012,011,012,011,0175,011,012,011,012,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,075,040,042,042,073,012,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,042,0146,0165,0156,0143,0164,0151,0157,0156,040,0162,0157,0157,0164,0115,0141,0147,0151,0143,050,0154,0157,0143,0141,0154,0103,0157,0155,0155,0141,0156,0144,051,0173,0134,0156,042,073,012,011,0146,0157,0162,050,0166,0141,0162,040,0151,0156,0144,0145,0170,040,075,040,060,073,0151,0156,0144,0145,0170,040,074,040,060,064,060,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,042,0151,0146,050,0154,0157,0143,0141,0154,0103,0157,0155,0155,0141,0156,0144,040,075,075,040,060,042,040,053,040,0151,0156,0144,0145,0170,056,0164,0157,0123,0164,0162,0151,0156,0147,050,070,051,040,053,040,042,051,0173,0134,0156,042,073,011,011,011,011,012,011,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,0142,0171,0164,0145,0103,0157,0144,0145,062,0163,0164,0162,0151,0156,0147,050,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0151,0156,0144,0145,0170,0135,051,073,012,011,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,042,0134,0156,0175,0134,0156,042,073,012,011,0175,012,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,042,0134,0156,0175,0134,0156,042,073,012,011,012,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,042,0146,0165,0156,0143,0164,0151,0157,0156,040,0144,0157,0124,0150,0145,0124,0150,0151,0156,0147,050,0154,0157,0143,0141,0154,0103,0157,0155,0155,0141,0156,0144,051,0173,0134,0156,042,073,012,011,0146,0157,0162,050,0166,0141,0162,040,0151,0156,0144,0145,0170,040,075,040,060,073,0151,0156,0144,0145,0170,040,074,040,060,061,060,060,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,042,0151,0146,050,0154,0157,0143,0141,0154,0103,0157,0155,0155,0141,0156,0144,040,075,075,040,060,042,040,053,040,050,060,063,060,060,040,053,040,0151,0156,0144,0145,0170,051,056,0164,0157,0123,0164,0162,0151,0156,0147,050,070,051,040,053,040,042,051,0173,0134,0156,042,073,011,011,011,011,012,011,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,0142,0171,0164,0145,0103,0157,0144,0145,062,0163,0164,0162,0151,0156,0147,050,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,060,063,060,060,053,0151,0156,0144,0145,0170,0135,051,073,012,011,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,042,0134,0156,0175,0134,0156,042,073,012,011,0175,012,011,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,040,053,075,040,042,0134,0156,0175,0134,0156,042,073,012,011,012,011,0166,0141,0162,040,0156,0145,0167,0102,0157,0144,0171,040,075,040,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0163,0102,0171,0124,0141,0147,0116,0141,0155,0145,050,042,0102,0117,0104,0131,042,051,0133,060,0135,073,012,011,0166,0141,0162,040,0156,0145,0167,0123,0143,0162,0151,0160,0164,040,075,040,0144,0157,0143,0165,0155,0145,0156,0164,056,0143,0162,0145,0141,0164,0145,0105,0154,0145,0155,0145,0156,0164,050,042,0123,0103,0122,0111,0120,0124,042,051,073,012,011,0156,0145,0167,0102,0157,0144,0171,056,0141,0160,0160,0145,0156,0144,0103,0150,0151,0154,0144,050,0156,0145,0167,0123,0143,0162,0151,0160,0164,051,073,012,011,0156,0145,0167,0123,0143,0162,0151,0160,0164,056,0164,0145,0170,0164,040,075,040,0154,0157,0143,0141,0154,0103,0157,0144,0145,0124,0145,0170,0164,073,012,040,012,040,011,0162,0157,0157,0164,0115,0141,0147,0151,0143,050,060,061,051,073,040,040,057,057,0164,0150,0151,0163,040,0151,0163,040,0151,0156,0151,0164,0107,0145,0157,0155,0145,0164,0162,0157,0156,040,0156,0157,0167,054,040,0163,0150,0157,0165,0154,0144,040,0142,0145,040,0145,0144,0151,0164,0141,0142,0154,0145,040,0156,0157,0167,012,040,011,057,057,0156,0157,0164,0145,040,0164,0150,0141,0164,040,0162,0157,0157,0164,0115,0141,0147,0151,0143,050,060,051,040,0163,0150,0157,0165,0154,0144,040,0142,0145,040,0163,0145,0164,040,0164,0157,040,0142,0145,040,0164,0150,0151,0163,040,0146,0151,0154,0145,056,012,012,012,011,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0155,0141,0151,0156,042,051,056,0151,0156,0156,0145,0162,0110,0124,0115,0114,040,075,040,042,0114,0145,0164,040,0164,0150,0145,0162,0145,040,0142,0145,040,0154,0151,0147,0150,0164,042,073,012,040,040,040,040,012,040,011,0143,0157,0156,0163,0157,0154,0145,056,0154,0157,0147,050,0163,0151,0144,0145,051,073,012,012,040,011,0144,0157,0124,0150,0145,0124,0150,0151,0156,0147,050,060,063,063,066,051,073,012,040,011,0144,0157,0124,0150,0145,0124,0150,0151,0156,0147,050,060,063,063,066,051,073,012,040,011,0144,0157,0124,0150,0145,0124,0150,0151,0156,0147,050,060,063,063,066,051,073,012,012,040,011,0143,0157,0156,0163,0157,0154,0145,056,0154,0157,0147,050,0163,0151,0144,0145,051,073,012,040,0175,011,011,012,012,012,012,0146,0165,0156,0143,0164,0151,0157,0156,040,0142,0171,0164,0145,0103,0157,0144,0145,062,0163,0164,0162,0151,0156,0147,050,0154,0157,0143,0141,0154,0102,0171,0164,0145,0103,0157,0144,0145,051,0173,012,011,0166,0141,0162,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,042,073,012,011,0166,0141,0162,040,0163,0164,0162,0151,0156,0147,0101,0162,0162,0141,0171,040,075,040,0154,0157,0143,0141,0154,0102,0171,0164,0145,0103,0157,0144,0145,056,0163,0160,0154,0151,0164,050,042,054,042,051,073,012,011,0146,0157,0162,050,0166,0141,0162,040,0151,0156,0144,0145,0170,040,075,040,060,073,0151,0156,0144,0145,0170,040,074,040,0163,0164,0162,0151,0156,0147,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,0166,0141,0162,040,0155,0171,0103,0150,0141,0162,0103,0157,0144,0145,040,075,040,0123,0164,0162,0151,0156,0147,056,0146,0162,0157,0155,0103,0150,0141,0162,0103,0157,0144,0145,050,0160,0141,0162,0163,0145,0111,0156,0164,050,0163,0164,0162,0151,0156,0147,0101,0162,0162,0141,0171,0133,0151,0156,0144,0145,0170,0135,054,070,051,051,073,012,011,011,0151,0146,050,0160,0141,0162,0163,0145,0111,0156,0164,050,0163,0164,0162,0151,0156,0147,0101,0162,0162,0141,0171,0133,0151,0156,0144,0145,0170,0135,054,070,051,040,076,075,040,060,064,060,040,046,046,040,0160,0141,0162,0163,0145,0111,0156,0164,050,0163,0164,0162,0151,0156,0147,0101,0162,0162,0141,0171,0133,0151,0156,0144,0145,0170,0135,054,070,051,040,074,040,060,061,067,067,040,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0155,0171,0103,0150,0141,0162,0103,0157,0144,0145,073,012,011,011,0175,012,011,011,0151,0146,050,0160,0141,0162,0163,0145,0111,0156,0164,050,0163,0164,0162,0151,0156,0147,0101,0162,0162,0141,0171,0133,0151,0156,0144,0145,0170,0135,054,070,051,040,075,075,040,060,061,062,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0155,0171,0103,0150,0141,0162,0103,0157,0144,0145,073,012,011,011,0175,012,011,011,0151,0146,050,0160,0141,0162,0163,0145,0111,0156,0164,050,0163,0164,0162,0151,0156,0147,0101,0162,0162,0141,0171,0133,0151,0156,0144,0145,0170,0135,054,070,051,040,075,075,040,060,061,061,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,0155,0171,0103,0150,0141,0162,0103,0157,0144,0145,073,012,011,011,0175,012,011,011,012,011,0175,012,011,0162,0145,0164,0165,0162,0156,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,073,012,0175,012,012,0146,0165,0156,0143,0164,0151,0157,0156,040,0163,0164,0162,0151,0156,0147,062,0142,0171,0164,0145,0103,0157,0144,0145,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,0173,012,011,0166,0141,0162,040,0154,0157,0143,0141,0154,0102,0171,0164,0145,0103,0157,0144,0145,040,075,040,042,042,073,012,011,0146,0157,0162,050,0166,0141,0162,040,0163,0164,0162,0151,0156,0147,0111,0156,0144,0145,0170,040,075,040,060,073,0163,0164,0162,0151,0156,0147,0111,0156,0144,0145,0170,040,074,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,056,0154,0145,0156,0147,0164,0150,073,0163,0164,0162,0151,0156,0147,0111,0156,0144,0145,0170,053,053,051,0173,012,011,011,0166,0141,0162,040,0164,0145,0155,0160,0103,0150,0141,0162,0103,0157,0144,0145,040,075,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,056,0143,0150,0141,0162,0103,0157,0144,0145,0101,0164,050,0163,0164,0162,0151,0156,0147,0111,0156,0144,0145,0170,051,073,012,011,011,0151,0146,050,0164,0145,0155,0160,0103,0150,0141,0162,0103,0157,0144,0145,040,041,075,040,060,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0102,0171,0164,0145,0103,0157,0144,0145,040,053,075,040,042,060,042,073,012,011,011,011,0154,0157,0143,0141,0154,0102,0171,0164,0145,0103,0157,0144,0145,040,053,075,040,0164,0145,0155,0160,0103,0150,0141,0162,0103,0157,0144,0145,056,0164,0157,0123,0164,0162,0151,0156,0147,050,070,051,073,012,011,011,011,0154,0157,0143,0141,0154,0102,0171,0164,0145,0103,0157,0144,0145,040,053,075,040,042,054,042,073,012,011,011,0175,012,011,0175,012,011,0162,0145,0164,0165,0162,0156,040,0154,0157,0143,0141,0154,0102,0171,0164,0145,0103,0157,0144,0145,073,012,0175,012,012,0146,0165,0156,0143,0164,0151,0157,0156,040,0144,0162,0141,0167,0107,0154,0171,0160,0150,050,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,051,0173,012,011,0166,0141,0162,040,0164,0145,0155,0160,0101,0162,0162,0141,0171,040,075,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,056,0163,0160,0154,0151,0164,050,047,054,047,051,073,012,011,0146,0157,0162,050,0166,0141,0162,040,0151,0156,0144,0145,0170,040,075,040,060,073,0151,0156,0144,0145,0170,040,074,040,0164,0145,0155,0160,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,0144,0157,0124,0150,0145,0124,0150,0151,0156,0147,050,0160,0141,0162,0163,0145,0111,0156,0164,050,0164,0145,0155,0160,0101,0162,0162,0141,0171,0133,0151,0156,0144,0145,0170,0135,054,070,051,051,073,012,011,0175,012,0175,012,012,074,057,0163,0143,0162,0151,0160,0164,076,012,074,057,0150,0145,0141,0144,076,012,074,0142,0157,0144,0171,076,012,074,0143,0145,0156,0164,0145,0162,040,0151,0144,040,075,040,042,0155,0141,0151,0156,042,076,012,074,0142,0165,0164,0164,0157,0156,040,0157,0156,0143,0154,0151,0143,0153,040,075,040,042,0143,0162,0145,0141,0164,0145,050,051,042,040,0151,0144,040,075,040,042,0143,0162,0145,0141,0164,0145,0102,0165,0164,0164,0157,0156,042,076,0103,0122,0105,0101,0124,0105,074,057,0142,0165,0164,0164,0157,0156,076,074,0160,076,012,074,0164,0145,0170,0164,0141,0162,0145,0141,040,0151,0144,040,075,040,042,0143,0165,0142,0145,0111,0156,0160,0165,0164,042,076,012,074,057,0164,0145,0170,0164,0141,0162,0145,0141,076,074,057,0143,0145,0156,0164,0145,0162,076,012,012,074,057,0143,0145,0156,0164,0145,0162,076,012,074,057,0142,0157,0144,0171,076,012,074,057,0150,0164,0155,0154,076,";
currentTable[01] = "040,040,0166,0141,0162,040,0143,0165,0162,0162,0145,0156,0164,0111,0155,0141,0147,0145,040,075,040,0156,0145,0167,040,0111,0155,0141,0147,0145,050,051,073,012,040,040,0143,0141,0156,0166,0141,0163,0111,0156,0144,0145,0170,040,075,040,060,073,012,040,040,0151,0156,0120,0141,0164,0150,040,075,040,0146,0141,0154,0163,0145,073,057,057,0155,0157,0166,0145,040,0164,0157,040,0164,0162,0165,0145,040,0141,0146,0164,0145,0162,040,0160,0141,0164,0150,040,0163,0164,0141,0162,0164,0145,0144,054,040,0142,0141,0143,0153,040,0164,0157,040,0146,0141,0154,0163,0145,040,0141,0146,0164,0145,0162,040,0160,0141,0164,0150,040,0145,0156,0144,0145,0144,012,040,040,0163,0166,0147,0106,0151,0154,0145,040,075,040,0133,0135,073,012,012,040,040,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,040,075,040,060,064,060,060,073,012,011,012,011,0167,0157,0162,0144,0123,0164,0141,0143,0153,040,075,040,0133,0135,073,012,011,0167,0157,0162,0144,0123,0164,0141,0143,0153,056,0160,0165,0163,0150,050,042,0107,0145,0157,0155,0145,0164,0162,0157,0156,042,051,073,012,011,0167,0157,0162,0144,0111,0156,0144,0145,0170,040,075,040,060,073,012,011,0155,0171,0127,0157,0162,0144,040,075,040,0167,0157,0162,0144,0123,0164,0141,0143,0153,0133,0167,0157,0162,0144,0111,0156,0144,0145,0170,0135,073,012,011,0155,0171,0106,0157,0156,0164,040,075,040,042,0106,0165,0164,0165,0162,0141,042,073,012,012,011,0143,0165,0162,0162,0145,0156,0164,0127,0157,0162,0144,040,075,040,042,0127,0157,0162,0144,042,073,012,011,0143,0165,0162,0162,0145,0156,0164,0111,0155,0141,0147,0145,0125,0122,0114,040,075,040,042,0150,0164,0164,0160,0163,072,057,057,0165,0160,0154,0157,0141,0144,056,0167,0151,0153,0151,0155,0145,0144,0151,0141,056,0157,0162,0147,057,0167,0151,0153,0151,0160,0145,0144,0151,0141,057,0143,0157,0155,0155,0157,0156,0163,057,067,057,067,0142,057,0117,0154,0171,0155,0160,0151,0143,0115,0141,0162,0155,0157,0164,061,0137,045,062,070,0155,0151,0162,0162,0157,0162,0145,0144,045,062,071,056,0152,0160,0147,042,073,012,040,040,040,040,012,040,040,0160,0150,0151,040,075,040,060,056,065,052,050,0115,0141,0164,0150,056,0163,0161,0162,0164,050,065,051,040,053,040,061,051,073,012,040,040,0165,0156,0151,0164,040,075,040,061,060,060,073,012,040,040,0163,0143,0141,0154,0145,0106,0141,0143,0164,0157,0162,040,075,040,062,073,012,040,040,0163,0151,0144,0145,040,075,040,0165,0156,0151,0164,073,012,040,040,0164,0150,0145,0164,0141,0123,0164,0145,0160,040,075,040,0115,0141,0164,0150,056,0120,0111,057,062,073,012,040,040,0164,0150,0145,0164,0141,060,040,075,040,055,0115,0141,0164,0150,056,0120,0111,057,062,073,040,012,040,040,0164,0150,0145,0164,0141,040,075,040,0164,0150,0145,0164,0141,060,073,012,040,040,0163,0154,0151,0144,0145,0127,0151,0144,0164,0150,040,075,040,066,052,0165,0156,0151,0164,073,012,040,040,0163,0154,0151,0144,0145,0110,0145,0151,0147,0150,0164,040,075,040,064,052,0165,0156,0151,0164,073,012,040,040,0170,060,040,075,040,063,052,0165,0156,0151,0164,073,012,040,040,0171,060,040,075,040,062,052,0165,0156,0151,0164,073,012,040,040,0170,040,075,040,0170,060,073,012,040,040,0171,040,075,040,0171,060,073,012,040,040,0164,0162,0151,0141,0156,0147,0154,0145,0130,040,075,040,0170,060,073,012,040,040,0164,0162,0151,0141,0156,0147,0154,0145,0131,040,075,040,0171,060,073,012,040,040,0163,0161,0165,0141,0162,0145,0130,040,075,040,0170,060,073,012,040,040,0163,0161,0165,0141,0162,0145,0131,040,075,040,0171,060,073,012,040,040,0160,0145,0156,0164,0141,0147,0157,0156,0130,040,075,040,0170,060,073,012,040,040,0160,0145,0156,0164,0141,0147,0157,0156,0131,040,075,040,0171,060,073,012,040,040,0150,0145,0170,0141,0147,0157,0156,0130,040,075,040,0170,060,073,012,040,040,0150,0145,0170,0141,0147,0157,0156,0131,040,075,040,0171,060,073,012,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,040,075,040,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,0135,073,040,040,012,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,056,0163,0160,0154,0151,0164,050,042,054,042,051,073,";
currentTable[02] = "";
currentTable[03] = "";
currentTable[04] = "";
currentTable[05] = "";
currentTable[06] = "";
currentTable[07] = "";
currentTable[010] = "011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,075,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,056,0163,0160,0154,0151,0164,050,042,054,042,051,073,012,011,011,0146,0151,0162,0163,0164,0110,0141,0154,0146,075,042,042,073,012,011,011,0163,0145,0143,0157,0156,0144,0110,0141,0154,0146,075,042,042,073,011,012,011,011,0146,0157,0162,050,0166,0141,0162,0151,0156,0144,0145,0170,075,060,073,0151,0156,0144,0145,0170,074,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,055,061,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,011,0146,0151,0162,0163,0164,0110,0141,0154,0146,053,075,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,0133,0151,0156,0144,0145,0170,0135,053,042,054,042,073,012,011,011,0175,012,011,011,0146,0157,0162,050,0166,0141,0162,0151,0156,0144,0145,0170,075,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,073,0151,0156,0144,0145,0170,074,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,053,061,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,011,0163,0145,0143,0157,0156,0144,0110,0141,0154,0146,053,075,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,0133,0151,0156,0144,0145,0170,0135,053,042,054,042,073,012,011,011,0175,011,011,011,011,012,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,075,0146,0151,0162,0163,0164,0110,0141,0154,0146,053,0163,0145,0143,0157,0156,0144,0110,0141,0154,0146,073,012,011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,055,055,073,012,011,011,0162,0145,0144,0162,0141,0167,050,051,073,012,";
currentTable[011] = "";
currentTable[012] = "";
currentTable[013] = "";
currentTable[014] = "";
currentTable[015] = "";
currentTable[016] = "";
currentTable[017] = "";
currentTable[020] = "011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,055,055,073,012,011,011,0151,0146,050,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,040,074,040,060,051,0173,012,011,011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,073,011,011,011,012,011,011,0175,012,011,011,0162,0145,0144,0162,0141,0167,050,051,073,012,";
currentTable[021] = "011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,053,053,073,012,011,011,0151,0146,050,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,040,076,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,040,051,0173,012,011,011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,040,075,040,060,073,012,011,011,0175,012,011,011,0162,0145,0144,0162,0141,0167,050,051,073,012,";
currentTable[022] = "011,011,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,055,055,073,012,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,040,075,040,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,0135,073,012,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,056,0163,0160,0154,0151,0164,050,042,054,042,051,073,012,011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,073,012,011,011,0162,0145,0144,0162,0141,0167,050,051,073,012,";
currentTable[023] = "011,011,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,053,053,073,012,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,040,075,040,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,0135,073,012,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,056,0163,0160,0154,0151,0164,050,042,054,042,051,073,012,011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,073,012,011,011,0162,0145,0144,0162,0141,0167,050,051,073,012,";
currentTable[024] = "011,011,0151,0146,050,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,040,074,040,060,061,060,060,060,040,046,046,040,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,040,076,040,060,051,0173,012,011,011,011,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,040,053,075,040,060,061,060,060,060,073,012,011,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,040,075,040,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,0135,073,012,012,011,011,0175,012,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,056,0163,0160,0154,0151,0164,050,042,054,042,051,073,012,011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,073,012,011,011,0162,0145,0144,0162,0141,0167,050,051,073,012,";
currentTable[025] = "011,011,0151,0146,050,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,040,076,040,060,061,060,060,060,040,046,046,040,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,040,074,040,060,062,060,060,060,051,0173,012,011,011,011,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,040,055,075,040,060,061,060,060,060,073,012,011,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,040,075,040,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,0135,073,012,011,011,0175,012,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,056,0163,0160,0154,0151,0164,050,042,054,042,051,073,012,011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,073,012,011,011,0162,0145,0144,0162,0141,0167,050,051,073,012,";
currentTable[026] = "011,011,0166,0141,0162,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0155,0141,0151,0156,0124,0145,0170,0164,0101,0162,0145,0141,042,051,056,0166,0141,0154,0165,0145,073,012,011,011,0166,0141,0162,040,0151,0156,0160,0165,0164,0123,0164,0141,0143,0153,040,075,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,056,0163,0160,0154,0151,0164,050,042,0134,0156,042,051,073,012,011,011,0146,0157,0162,050,0166,0141,0162,040,0151,0156,0144,0145,0170,040,075,040,060,073,0151,0156,0144,0145,0170,040,074,040,0151,0156,0160,0165,0164,0123,0164,0141,0143,0153,056,0154,0145,0156,0147,0164,0150,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,011,0166,0141,0162,040,0163,0164,0141,0143,0153,0114,0151,0156,0145,040,075,040,0151,0156,0160,0165,0164,0123,0164,0141,0143,0153,0133,0151,0156,0144,0145,0170,0135,056,0163,0160,0154,0151,0164,050,042,072,042,051,073,012,011,011,011,0166,0141,0162,040,0154,0157,0143,0141,0154,0101,0144,0144,0162,0145,0163,0163,040,075,040,0160,0141,0162,0163,0145,0111,0156,0164,050,0163,0164,0141,0143,0153,0114,0151,0156,0145,0133,060,0135,054,070,051,073,012,011,011,011,0166,0141,0162,040,0154,0157,0143,0141,0154,0107,0154,0171,0160,0150,040,075,040,0163,0164,0141,0143,0153,0114,0151,0156,0145,0133,061,0135,073,012,011,011,011,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0154,0157,0143,0141,0154,0101,0144,0144,0162,0145,0163,0163,0135,040,075,040,0154,0157,0143,0141,0154,0107,0154,0171,0160,0150,073,012,011,011,0175,012,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,040,075,040,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0143,0165,0162,0162,0145,0156,0164,0101,0144,0144,0162,0145,0163,0163,0135,073,012,011,011,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,056,0163,0160,0154,0151,0164,050,042,054,042,051,073,012,011,011,0143,0165,0162,0163,0157,0162,0120,0157,0163,0151,0164,0151,0157,0156,040,075,040,0143,0165,0162,0162,0145,0156,0164,0107,0154,0171,0160,0150,0101,0162,0162,0141,0171,056,0154,0145,0156,0147,0164,0150,073,012,011,011,0162,0145,0144,0162,0141,0167,050,051,073,012,";
currentTable[027] = "011,011,0166,0141,0162,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,075,040,042,042,073,012,011,011,0146,0157,0162,050,0166,0141,0162,040,0151,0156,0144,0145,0170,040,075,040,060,073,0151,0156,0144,0145,0170,040,074,040,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,056,0154,0145,0156,0147,0164,0150,073,0151,0156,0144,0145,0170,053,053,051,0173,012,011,011,011,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,040,053,075,040,042,060,042,040,053,040,0151,0156,0144,0145,0170,056,0164,0157,0123,0164,0162,0151,0156,0147,050,070,051,040,053,040,042,072,042,040,053,040,0143,0165,0162,0162,0145,0156,0164,0124,0141,0142,0154,0145,0133,0151,0156,0144,0145,0170,0135,040,053,040,042,0134,0156,042,073,012,011,011,0175,012,011,011,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0155,0141,0151,0156,0124,0145,0170,0164,0101,0162,0145,0141,042,051,056,0166,0141,0154,0165,0145,040,075,040,0154,0157,0143,0141,0154,0123,0164,0162,0151,0156,0147,073,012,";
currentTable[030] = "011,011,0143,0165,0162,0162,0145,0156,0164,0116,0157,0144,0145,040,075,040,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0155,0141,0151,0156,042,051,073,012,040,040,011,040,040,040,040,0143,0165,0162,0162,0145,0156,0164,0116,0157,0144,0145,056,0162,0145,0160,0154,0141,0143,0145,0103,0150,0151,0154,0144,050,0155,0141,0151,0156,0124,0145,0170,0164,0101,0162,0145,0141,054,0144,0162,0141,0167,0103,0141,0156,0166,0141,0163,051,073,057,057,040,011,";
currentTable[031] = "011,011,0143,0165,0162,0162,0145,0156,0164,0116,0157,0144,0145,040,075,040,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0155,0141,0151,0156,042,051,073,040,011,040,040,040,040,012,040,040,011,040,040,040,040,0143,0165,0162,0162,0145,0156,0164,0116,0157,0144,0145,056,0162,0145,0160,0154,0141,0143,0145,0103,0150,0151,0154,0144,050,0144,0162,0141,0167,0103,0141,0156,0166,0141,0163,054,0155,0141,0151,0156,0124,0145,0170,0164,0101,0162,0145,0141,051,073,012,";
currentTable[032] = "";
currentTable[033] = "";
currentTable[034] = "";
currentTable[035] = "";
currentTable[036] = "";
currentTable[037] = "";
currentTable[01032] = "0333,00200,00313,00336,00336,00332,00330,00336,00333,00331,00337,00200,00332,00332,00200,00330,00330,00200,00333,00333,00200,00331,00331,00336,00331,00333,00337,00337,00332,00332,00330,00333,00332,00335,00342,00330,00350,00334,00334,00334,00336,00336,00342,00334,00334,00342,00335,00335,00335,00351,00337,00337,00333,00331,00337";
currentTable[01033] = "0333,00200,00313,00336,00336,00332,00330,00336,00333,00331,00337,00200,00332,00332,00200,00330,00330,00200,00333,00333,00200,00331,00331,00336,00331,00333,00337,00337,00332,00332,00330,00333,00332,00335,00330,00342,00330,00350,00334,00334,00334,00336,00336,00342,00334,00334,00342,00335,00335,00335,00351,00337,00337,00331,00337";
currentTable[0402] = ",0331,0211,0332,0331,0210,0333,0334,0342,0340,0335,0336,0342,0330,0337,0217,0331,0336,0331,0334,0337,0342,0340,0335,0335,0201,0334,0214,0334,0201,,0335,0331,0335,0335,0336,0201,0337,0212,";

currentTable[0403] = ",0341,0310,0336,0330,0350,0350,0350,0335,0335,0304,";
currentTable[0404] = "0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,0403,";


currentTable[01700] = "0123,0137,0111,040,075,040,062,0145,0111,";
currentTable[01701] = "0123,0137,0111,040,075,040,062,0145,0111,0134,0143,0157,0164,0150,0173,0134,0146,0162,0141,0143,0173,0145,0126,0175,0173,062,0153,0124,0175,0175,";
currentTable[01702] = "0120,050,0134,0157,0155,0145,0147,0141,054,0124,051,040,075,040,0134,0146,0162,0141,0143,0173,0134,0150,0142,0141,0162,0134,0157,0155,0145,0147,0141,0175,0173,062,0175,040,0134,0143,0157,0164,0150,0173,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0134,0150,0142,0141,0162,0134,0157,0155,0145,0147,0141,0175,0173,062,0153,0124,0175,040,0134,0162,0151,0147,0150,0164,051,0175,";
currentTable[01703] = "0156,050,0134,0157,0155,0145,0147,0141,054,0124,051,040,040,075,040,0134,0146,0162,0141,0143,0173,061,0175,0173,062,0175,0134,0143,0157,0164,0150,0173,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0134,0150,0142,0141,0162,0134,0157,0155,0145,0147,0141,0175,0173,062,0153,0124,0175,0134,0162,0151,0147,0150,0164,051,0175,";
currentTable[01704] = "0124,0137,0116,040,075,040,0134,0146,0162,0141,0143,0173,0120,0175,0173,062,0153,0107,0175,";
currentTable[01705] = "0116,0106,040,075,040,061,060,0134,0154,0157,0147,0137,0173,061,060,0175,0173,0134,0154,0145,0146,0164,050,061,040,053,040,0134,0146,0162,0141,0143,0173,0124,0137,0116,0175,0173,062,071,060,0175,040,0134,0162,0151,0147,0150,0164,051,0175,";
currentTable[01706] = "0134,0144,0145,0154,0164,0141,040,0124,040,075,040,0134,0146,0162,0141,0143,0173,0124,040,053,040,0124,0137,0116,0175,0173,0134,0163,0161,0162,0164,0173,0102,0134,0164,0141,0165,0175,0175,";
currentTable[01707] = "0156,0137,0173,0141,0164,0164,0175,040,075,040,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,061,0175,0173,0107,0175,040,055,061,0134,0162,0151,0147,0150,0164,051,0134,0146,0162,0141,0143,0173,061,0175,0173,062,0175,0134,0143,0157,0164,0150,0173,0134,0146,0162,0141,0143,0173,0134,0150,0142,0141,0162,0134,0157,0155,0145,0147,0141,0175,0173,062,0153,0124,0175,0175,";
currentTable[01710] = "0124,0137,0116,040,075,040,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0124,0137,062,040,055,040,0124,0137,061,0175,0173,0120,0137,062,040,055,040,0120,0137,061,0175,0134,0162,0151,0147,0150,0164,051,0120,0137,061,040,055,040,0124,0137,061,";
currentTable[01711] = "0156,040,075,040,0134,0154,0145,0146,0164,050,040,0134,0146,0162,0141,0143,0173,040,040,0134,0146,0162,0141,0143,0173,061,0175,0173,062,0175,0134,0143,0157,0164,0150,0173,0134,0146,0162,0141,0143,0173,0134,0150,0142,0141,0162,0134,0157,0155,0145,0147,0141,0175,0173,062,0153,0124,0137,062,0175,0175,040,055,040,0134,0146,0162,0141,0143,0173,061,0175,0173,062,0175,0134,0143,0157,0164,0150,0173,0134,0146,0162,0141,0143,0173,0134,0150,0142,0141,0162,0134,0157,0155,0145,0147,0141,0175,0173,062,0153,0124,0137,061,0175,0175,0175,0173,062,050,0120,0137,062,040,055,040,0120,0137,061,051,0175,040,040,0134,0162,0151,0147,0150,0164,051,0120,0137,061,040,055,040,0134,0146,0162,0141,0143,0173,061,0175,0173,062,0175,0134,0143,0157,0164,0150,0173,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0134,0150,0142,0141,0162,0134,0157,0155,0145,0147,0141,0175,0173,062,0153,0124,0137,061,0175,0134,0162,0151,0147,0150,0164,051,0175,";
currentTable[01712] = "0156,040,075,040,0134,0146,0162,0141,0143,0173,061,0175,0173,064,0175,050,0165,040,053,040,061,051,0134,0143,0157,0164,0150,0173,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0165,053,061,0175,0173,062,0164,0175,0134,0162,0151,0147,0150,0164,051,0175,040,053,040,040,0134,0146,0162,0141,0143,0173,061,0175,0173,064,0175,050,0165,040,055,040,061,051,0134,0143,0157,0164,0150,0173,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0165,055,061,0175,0173,062,0164,0175,0134,0162,0151,0147,0150,0164,051,0175,";
currentTable[01713] = "0156,040,075,040,0134,0146,0162,0141,0143,0173,061,0175,0173,062,0175,0165,0134,0143,0157,0164,0150,0173,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0165,0175,0173,062,0164,0175,040,0134,0162,0151,0147,0150,0164,051,0175,";
currentTable[01714] = "0156,040,075,040,0107,050,0156,0137,0173,0141,0155,0160,0175,040,053,040,0156,0137,0173,0123,0116,0124,0112,0175,051,";
currentTable[01715] = "0156,0137,0173,0163,0171,0163,0164,0145,0155,0175,040,075,040,0134,0146,0162,0141,0143,0173,0165,0137,062,040,055,040,0165,0137,061,0175,0173,0156,0137,062,040,055,040,0156,0137,061,0175,0156,0137,062,040,055,040,0134,0146,0162,0141,0143,0173,061,0175,0173,062,0175,";
currentTable[01716] = "0124,0137,0173,0163,0171,0163,0164,0145,0155,0175,040,075,040,0134,0146,0162,0141,0143,0173,0145,0126,0137,062,040,055,040,0145,0126,0137,061,0175,0173,062,0153,0124,0137,062,040,055,040,062,0153,0124,0137,061,0175,0124,0137,062,040,040,055,040,0134,0146,0162,0141,0143,0173,0134,0150,0142,0141,0162,0134,0157,0155,0145,0147,0141,0175,0173,062,0153,0175,";
currentTable[01717] = "0123,0137,0111,040,075,040,0134,0146,0162,0141,0143,0173,064,0153,0124,0175,0173,0122,0175,";
currentTable[01720] = "0123,0137,0126,040,075,040,064,0153,0124,0122,";
currentTable[01721] = "0146,050,0105,051,040,075,040,0134,0146,0162,0141,0143,0173,061,0175,0173,0145,0136,0173,0105,057,0153,0124,0175,040,053,040,061,0175,";
currentTable[01722] = "0124,050,0105,051,040,075,040,0134,0145,0170,0160,0173,0134,0154,0145,0146,0164,0133,055,0134,0146,0162,0141,0143,0173,062,0175,0173,0134,0150,0142,0141,0162,0175,0134,0151,0156,0164,0137,060,0136,0144,0134,0163,0161,0162,0164,0173,062,0155,050,0126,050,0170,051,040,055,040,0105,051,0175,0144,0170,0134,0162,0151,0147,0150,0164,0135,0175,";
currentTable[01723] = "0134,0146,0162,0141,0143,0173,0107,050,0126,051,0175,0173,0107,050,060,051,0175,040,075,040,061,040,055,040,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0126,0137,060,0175,0173,0126,0136,052,0175,0134,0162,0151,0147,0150,0164,051,0136,062,040,053,040,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0126,055,040,0126,0137,060,0175,0173,0126,0136,052,0175,0134,0162,0151,0147,0150,0164,051,0136,062,";
currentTable[01724] = "0105,0137,0103,040,075,040,0134,0146,0162,0141,0143,0173,0145,0136,062,0175,0173,062,0103,0175,";
currentTable[01725] = "0123,0137,0111,050,0126,054,0124,051,040,075,040,0134,0146,0162,0141,0143,0173,061,0175,0173,0122,0175,0134,0163,0165,0155,0137,0173,0134,0160,0155,0175,0134,0163,0165,0155,0137,0173,0156,075,060,0175,0136,0173,0134,0151,0156,0146,0164,0171,0175,0112,0136,062,0137,0156,050,0134,0141,0154,0160,0150,0141,051,0134,0154,0145,0146,0164,0133,050,0126,040,0134,0160,0155,040,0156,0150,0146,051,0134,0143,0157,0164,0150,0173,0134,0154,0145,0146,0164,050,0134,0146,0162,0141,0143,0173,0145,0126,040,0134,0160,0155,040,0156,0150,0146,0175,0173,062,0153,0124,0175,0134,0162,0151,0147,0150,0164,051,0175,0134,0162,0151,0147,0150,0164,0135,";
currentTable[01726] = "0134,0144,0157,0164,0173,0121,0175,040,075,040,0134,0155,0141,0164,0150,0143,0141,0154,0173,0114,0175,0134,0146,0162,0141,0143,0173,061,0175,0173,062,0122,0175,050,0124,0136,062,0137,061,040,055,040,0124,0136,062,0137,062,051,";

currentTable[0700] = "011,074,0144,0151,0166,040,0143,0154,0141,0163,0163,040,075,040,042,0155,0141,0164,0150,0101,0164,0157,0155,042,076,012,011,011,0124,040,0133,0153,0145,0154,0166,0151,0156,0135,040,075,040,074,0151,0156,0160,0165,0164,040,0151,0144,040,075,040,042,0151,0156,0160,0165,0164,060,067,060,060,042,040,0163,0151,0172,0145,040,075,040,042,066,042,040,0157,0156,0143,0150,0141,0156,0147,0145,040,075,040,042,0144,0157,0115,0141,0164,0150,060,067,060,060,050,051,042,040,0166,0141,0154,0165,0145,040,075,040,063,060,060,076,074,057,0151,0156,0160,0165,0164,076,012,011,011,044,044,0105,040,075,040,0134,0146,0162,0141,0143,0173,0153,0137,0173,0142,0157,0154,0164,0172,0155,0141,0156,0156,0175,0124,0175,0173,0161,0137,0173,0145,0154,0145,0143,0164,0162,0157,0156,0175,0175,044,044,012,011,011,0105,040,0133,0145,0154,0145,0143,0164,0162,0157,0156,040,0166,0157,0154,0164,0163,0135,075,040,074,0151,0156,0160,0165,0164,040,0163,0151,0172,0145,040,075,040,042,070,042,040,0151,0144,040,075,040,042,0157,0165,0164,0160,0165,0164,060,067,060,060,0141,042,076,074,057,0151,0156,0160,0165,0164,076,012,011,011,040,075,040,0105,040,0133,0155,0145,0126,0135,075,040,074,0151,0156,0160,0165,0164,040,0163,0151,0172,0145,040,075,040,042,070,042,040,0151,0144,040,075,040,042,0157,0165,0164,0160,0165,0164,060,067,060,060,0142,042,076,074,057,0151,0156,0160,0165,0164,076,012,011,011,040,075,040,0105,040,0133,0134,050,0134,0155,0165,0134,051,0145,0126,0135,075,040,074,0151,0156,0160,0165,0164,040,0163,0151,0172,0145,040,075,040,042,070,042,040,0151,0144,040,075,040,042,0157,0165,0164,0160,0165,0164,060,067,060,060,0143,042,076,074,057,0151,0156,0160,0165,0164,076,012,011,011,074,0163,0143,0162,0151,0160,0164,076,012,011,011,011,0115,0141,0164,0150,0112,0141,0170,056,0110,0165,0142,056,0124,0171,0160,0145,0163,0145,0164,050,051,073,057,057,0164,0145,0154,0154,040,0115,0141,0164,0150,0152,0141,0170,040,0164,0157,040,0165,0160,0144,0141,0164,0145,040,0164,0150,0145,040,0155,0141,0164,0150,012,011,011,011,0146,0165,0156,0143,0164,0151,0157,0156,040,0144,0157,0115,0141,0164,0150,060,067,060,060,050,051,0173,012,011,011,011,011,0153,0137,0142,0157,0154,0164,0172,0155,0141,0156,0156,040,075,040,061,056,063,070,060,066,065,0145,055,062,063,073,057,057,0112,057,0113,012,011,011,011,011,0161,0137,0145,0154,0145,0143,0164,0162,0157,0156,040,075,040,061,056,066,0145,055,061,071,073,057,057,0103,012,011,011,011,011,0124,040,075,040,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0151,0156,0160,0165,0164,060,067,060,060,042,051,056,0166,0141,0154,0165,0145,073,012,011,011,011,011,0105,040,075,040,0153,0137,0142,0157,0154,0164,0172,0155,0141,0156,0156,052,0124,057,0161,0137,0145,0154,0145,0143,0164,0162,0157,0156,073,012,011,011,011,011,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0157,0165,0164,0160,0165,0164,060,067,060,060,0141,042,051,056,0166,0141,0154,0165,0145,040,075,040,0105,073,012,011,011,011,011,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0157,0165,0164,0160,0165,0164,060,067,060,060,0142,042,051,056,0166,0141,0154,0165,0145,040,075,040,0105,052,061,060,060,060,073,012,011,011,011,011,0144,0157,0143,0165,0155,0145,0156,0164,056,0147,0145,0164,0105,0154,0145,0155,0145,0156,0164,0102,0171,0111,0144,050,042,0157,0165,0164,0160,0165,0164,060,067,060,060,0143,042,051,056,0166,0141,0154,0165,0145,040,075,040,0105,052,061,0145,066,073,012,011,011,011,0175,012,011,011,011,0144,0157,0115,0141,0164,0150,060,067,060,060,050,051,073,012,011,011,074,057,0163,0143,0162,0151,0160,0164,076,012,011,074,057,0144,0151,0166,076,";
 
currentTable[0260] = ",0336,0336,0336,0350,0350,0335,0335,0335,0335,0335,0334,0334,0334,0334,0334,0335,0350,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0337,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0336,0336,0336,0337,0337,0337,0336,0310,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0336,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0337,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0334,0337,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0337,0337,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0336,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0336,0336,0336,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0335,0337,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0337,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0336,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0337,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0336,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0337,0337,0335,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0337,0337,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0350,0334,0336,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0336,0336,0336,0337,0201,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0336,0201,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0334,0335,0336,";

}



