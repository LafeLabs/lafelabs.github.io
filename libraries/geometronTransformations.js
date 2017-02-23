function byteCode2string(localByteCode){
	var localString = "";
	var stringArray = localByteCode.split(",");
	for(var index = 0;index < stringArray.length;index++){
		localString += String.fromCharCode(parseInt(stringArray[index],8));
	}
	return localString;
}

function string2byteCode(localString){
	var localByteCode = "";
	for(var stringIndex = 0;stringIndex < localString.length;stringIndex++){
		var tempCharCode = localString.charCodeAt(stringIndex);
		localByteCode += "0";
		localByteCode += tempCharCode.toString(8);
		localByteCode += ",";
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