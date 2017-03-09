function initGeometron(){
  var currentImage = new Image();

  canvasIndex = 0;

  inPath = false;//move to true after path started, back to false after path ended
  svgFile = [];

  currentAddress = 0400;
	
  editAddress = 0400;
  tableBottom = 0400;
  tableTop = 0437;

	wordStack = [];
	wordStack.push("Geometron");
	wordIndex = 0;
	myWord = wordStack[wordIndex];
	myFont = "Futura";

	currentWord = "Word";
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
		if(parseInt(stringArray[index],8) > 040 && parseInt(stringArray[index],8) < 0177 ){
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
    
    
    if(localCommand >= 0600 && localCommand <= 0700){
    	//get the glyph, turn it into ascii, make it the Word:
    	if(currentTable[localCommand] != undefined){
    	 	currentWord = byteCode2string(currentTable[localCommand]);
    	}
    	
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
        ctx.font=side.toString(8) + "px " + myFont;;
		myWord = wordStack[wordIndex];
		ctx.fillText(myWord,x,y);
		wordIndex++;
		if(wordIndex >= wordStack.length){
			wordIndex = 0;
		}
    }
    if(localCommand == 0365){
        ctx.font=side.toString(8) + "px " + myFont;;
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
currentTable[0076] = "0333,0336,0330,0332,0350,0334,0342,0334,0334,0342,0335,0335,0335,0351,0331,0333";
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
currentTable[0231] = "0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0130,0333,0336,0330,0333,0337,0337,0337";
currentTable[0232] = "0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0131,0333,0336,0330,0333,0337,0337,0337";
currentTable[0233] = "0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0132,0333,0336,0330,0333,0337,0337,0337";
currentTable[0234] = "0304,0313,0335,0336,0336,0342,0330,0330,0330,0342,0331,0331,0334,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0336,0336,0333,0330,0333,0330,0333,0337,0337,0133,0333,0336,0330,0333,0337,0337,0337";
currentTable[0240] = "0304,0313,0335,0342,0330,0336,0331,0340,0335,0342,0334,0334,0333,0337";
currentTable[0241] = "0304,0313,0335,0342,0336,0330,0334,0342,0336,0336,0341,0337,0337,0333,0337";
currentTable[0242] = "0304,0313,0335,0336,0336,0342,0330,0334,0342,0337,0342,0330,0335,0342,0330,0342,0330,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0342,0330,0342,0330,0335,0342,0330,0333,0336,0333,0331,0337,0306,0343,0350,0335,0310,0337,0342,0330,0336,0336,0336,0336,0336,0335,0335,0335,0335,0335,0342,0335,0335,0342,0335,0335,0335,0335,0335,0337,0337,0337,0337,0337,0331,0336,0334,0313,0304,0336,0331,0332,0332,0332,0330,0330,0332,0337,0337";
currentTable[0243] = "0335,0331,0331,0344,0332,0332,0334,0334,0344,0331,0331,0335,0335,0333,0330,0330,0334,0334,0332,0345,0333,0333,0335,0335,0345,0334,0332,0332";
currentTable[0244] = "0304,0313,0331,0337,0342,0336,0336,0333,0334,0334,0350,0335,0343,0334,0330,0334,0334,0351,0337,0337,0342,0330,0342,0330,0336,0336,0332,0350,0335,0343,0334,0330,0334,0334,0351,0337,0337,0342,0330,0336,0336,0332,0350,0335,0343,0334,0330,0334,0334,0351,0337,0337,0337,0342,0330,0335,0336,0336,0336,0331,0350,0334,0343,0335,0304,0331,0331,0337";
currentTable[0245] = "0342,0304,0313,0330,0336,0336,0336,0350,0335,0335,0335,0342,0335,0335,0342,0335,0335,0335,0351,0337,0337,0337,0331";
currentTable[0246] = "0304,0313,0336,0336,0330,0335,0342,0330,0335,0342,0330,0334,0350,0334,0337,0310,0337,0342,0330,0334,0334,0342,0330,0334,0334,0334,0336,0313,0336,0342,0330,0335,0335,0342,0304,0330,0335,0330,0337,0337,0331";
currentTable[0247] = "0304,0313,0336,0336,0330,0335,0337,0337,0342,0336,0332,0337,0342,0333,0334,0336,0330,0336,0331,0337,0337";
currentTable[0250] = "0336,0336,0336,0336,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0342,0330,0330,0337,0337,0337,0337";
currentTable[0400] = "0300";
currentTable[0401] = "0300,0240,0331,0332,0241,0240,0332,0331,0332,0231,0241,0230,0241,0330,0332,0332,0335,0342,0330,0334,0240,0330,0335,0334,0332,0332,0332,0230,0231,0232,0242,0331,0335,0342,0330,0342,0330,0334,0242,0332,0331,0332,0335,0342,0330,0342,0330,0342,0330,0342,0330,0334,0242,0300,0332,0332,0336,0333,0333,061,0332,0342,0333,0350,0335,0310,0336,0342,0330,0334,0334,0342,0330,0335,0337,0331,0304,0331,0331,0331,0332,0332,0332";
currentTable[0402] = "0300,0342,0330,0350,0334,0342,0330,0334,0342,0330,0335,0335,0335,0335,0351,0332,0342,0330,0334,0310,0337,0342,0330,0333,0335,0350,0335,0337,0342,0330,0334,0312,0337,0342,0330,0334,0334,0342,0336,0310,0336,0335,0335,0330,0334,0334,0337,0337,0342,0335,0335,0335,0336,0336,0342,0330,0334,0313,0337,0342,0330,0335,0335,0310,0336,0342,0330,0334,0334,0342,0304,0335,0336,0330,0335,0337,0337,0337,0342,0330,0350,0335,0342,0330,0336,0336,0336,0336,0342,0330,0334,0342,0330,0336,0336,0342,0330,0334,0337,0337,0342,0330,0334,0342,0300";
currentTable[0403] = "0300,0330,0330,0330,0332,0332,0332,0124,0111,0124,0114,0105,0340,0331,0332,0330,0331,0332,0332,0336,0336,0167,0157,0162,0144,0163,0331,0331,0331,0331,0331,0331,0331,0331,0331,0331,0337,0337,0214,0211,0333,0333";
currentTable[0404] = "0300,0336,0332,0332,0332,0332,0332,0332,0342,0330,0335,0342,0330,0342,0330,0335,0342,0330,0335,0342,0330,0342,0330,0335,0336,0336,0330,0333,0337,0364,0333,0333,0333,0333,0333,0336,0332,0331,0350,0334,0337,0310,0337,0342,0330,0335,0335,0342,0330,0335,0334,0334,0336,0331,0335,0335,0304,0313,0336,0332,0334,0342,0331,0331,0335,0335,0342,0334,0337,0337,0337,0342,0336,0336,0336,0332,0332,0337,0337,0337,0342,0330,0336,0336,0336,0334,0342,0331,0331,0331,0342,0350,0335,0337,0310,0337,0342,0330,0334,0334,0342,0335,0336,0351,0313,0342,0330,0335,0337,0337,0342,0336,0336,0333,0333,0334,0342,0335,0337,0337,0342,0330,0334,0336,0342,0336,0331,0332,0332,0332,0330,0336,0330,0332,0337,0364,0331,0331,0331,0331";
currentTable[0405] = "0300,0336,0331,0337,0214,0330,0331,0331,0331,0330,0333,0211,0334,0342,0330,0340,0330,0334,0334,0342,0342,0335,0210,0334,0342,0330,0340,0342,0335,0336,0336,0342,0330,0337,0337,0336,0337,0212,0330,0336,0336,0330,0337,0342,0330,0337,0217,0333,0333,0333,0333,0331,0332,0332,0336,0336,0332,0332,0331,0337,0103,0332,0332,0332,0332,0332,0332,0332,0332,0336,0333,0337,0122,0333,0333,0333,0333,0333,0333,0333,0333,0332,0332,0332,0332,0332,0114,0330,0330,0330,0333,0333,0333,0330,0332,0332,0332,0332,0332,0332,0332,0332,0364";
currentTable[0406] = "0300,0332,0310,0336,0313,0332,0333,0333,0247,0332,0247,0333,0333,0246,0330,0332,0332,0335,0335,0246,0335,0335,0336,0331,0335,0336,0334,0336,0331,0332,0332,0337,0364,0332,0332,0332,0332,0332,0332,0332,0332,0337,0332,0332,0244,0364,0333,0333,0333,0333,0333,0333,0333,0333,0333,0333,0333,0333,0332,0336,0333,0337,0244,0364";
currentTable[0407] = "0300,0340,0332,0332,0333,0332,0335,0223,0331,0335,0335,0336,0336,0201,0334,0201,0337,0337,0216,0336,0212,0333,0333,0333,0330,0330,0336,0331,0332,0330,0330,0335,0337,0210,0211,0335,0340,0222,0222,0222,0220,0330,0330,0330,0335,0211,0214,0335,0214,0212,0333,0214,0335,0210,0210,0210,0331,0331,0331,0335,0330,0212,0332,0332,0332,0330,0201,0201,0207,0332,0332,0332,";
currentTable[0410] = "0300";
currentTable[0411] = "0340,0341,0333,0341,0340";
currentTable[0412] = "0300";
currentTable[0413] = "0300";
currentTable[0414] = "0300";
currentTable[0415] = "0300";
currentTable[0416] = "0300";
currentTable[0417] = "0300";
currentTable[0420] = "0340,0341,0333,0341,0340";
currentTable[0421] = "0340,0341,0333,0341,0340";
currentTable[0422] = "0300";
currentTable[0423] = "0300";
currentTable[0424] = "0300";
currentTable[0425] = "0300";
currentTable[0426] = "0300";
currentTable[0427] = "0300";
currentTable[0430] = "0340,0341,0333,0341,0340";
currentTable[0431] = "0340,0341,0333,0341,0340";
currentTable[0432] = "0300";
currentTable[0433] = "0300";
currentTable[0434] = "0300";
currentTable[0435] = "0300";
currentTable[0436] = "0300";
currentTable[0437] = "0300,0330,0332,0332,0332,0332,0332,0330,0330,0123,0114,0111,0104,0105,040,0124,0111,0124,0114,0105,0330,0330,0330,0330,0330,0330,0332,0332,0332,0332,0300,0330,0332,0332,0332,0330,0336,0336,0336,0341,0337,0331,0333,0337,0142,0165,0154,0154,0145,0164,040,0160,0157,0151,0156,0164,0337,0337,0337,0336,0336,0336,0330,0331,0331,0331,0331,0331,0331,0331,0332,0332,0332,0332,0337,0214,0330,0331,0331,0331,0330,0333,0211,0334,0342,0330,0340,0330,0334,0334,0342,0342,0335,0210,0334,0342,0330,0340,0342,0335,0336,0336,0342,0330,0337,0337,0336,0337,0212,0330,0336,0336,0330,0337,0342,0330,0337,0217,0333,0333,0333,0333,0331,0332,0332,0336,0336,0332,0332,0331,0337,,0103,0332,0332,0332,0332,0332,0332,0332,0332,0336,0333,0337,0122,0333,0333,0333,0333,0333,0333,0333,0333,0332,0332,0332,0332,0332,0114";


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


currentTable[0500] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,063,0151,0150,063,0110,0101,0164,056,0152,0160,0147,"
currentTable[0501] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0155,061,0144,0107,0166,0110,060,056,0152,0160,0147,"
currentTable[0502] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0155,0107,0106,067,062,063,061,056,0152,0160,0147,"
currentTable[0503] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,062,0167,0146,062,0117,0132,0157,056,0152,0160,0147,"
currentTable[0504] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0105,0162,0154,067,0171,0114,0160,056,0152,0160,0147,"
currentTable[0505] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0102,0172,0124,060,070,0112,0146,056,0152,0160,0147,"
currentTable[0506] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0143,0117,0161,0150,0113,0155,0110,056,0152,0160,0147,"
currentTable[0507] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,060,0143,0141,0112,0171,0114,0157,056,0152,0160,0147,"
currentTable[01501] = "0164,0141,0164,0145,0162,";

currentTable[0510] = "0150,0164,0164,0160,0163,072,057,057,0151,056,0151,0155,0147,0165,0162,056,0143,0157,0155,057,0101,0146,0150,0156,0144,0171,0105,056,0152,0160,0147,";
currentTable[01510] = "0142,0157,0156,0144,0153,0151,0164,0164,0145,0150,";
currentTable[01507] = "0163,0160,0151,0162,0141,0154,0163,";

currentTable[01030] = "0304,0313,0333,0200,0336,0332,0330,0336,0201,0335,0201,0331,0331,0201,0334,0331,0337,0333,0331,0337";
currentTable[01031] ="0313,0304,0333,0200,0336,0330,0332,0336,0331,0201,0333,0337,0200";


currentTable[00] = "";
currentTable[01] = "";
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


}



