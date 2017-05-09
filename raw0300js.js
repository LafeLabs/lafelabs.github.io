 	  if(localCommand == 0300
      x = x0;
      y = y0;
      theta = theta0;
      side = unit;
      thetaStep = Math.PI/2;
      scaleFactor = 2;
      ctx.lineWidth = 2;
      ctx.strokeStyle="black";
      ctx.fillStyle="black";
    if(localCommand == 0304
      thetaStep = Math.PI/2;
    if(localCommand == 0305
      thetaStep = 2*Math.PI/5;
    if(localCommand == 0306
      thetaStep = Math.PI/3;
    if(localCommand == 0310
       scaleFactor = Math.sqrt(2); 
    if(localCommand == 0311
       scaleFactor = phi; //"golden" ratio 
    if(localCommand == 0312
       scaleFactor = Math.sqrt(3); 
    if(localCommand == 0313
      scaleFactor = 2;  //2x
    if(localCommand == 0314
      scaleFactor = 3;  //3x
    if(localCommand == 0315
      scaleFactor = 3.14159;  //pi*
    if(localCommand == 0316
      scaleFactor = 5;  //5*
    if(localCommand == 0317
       side = unit; 
    if(localCommand == 0320
		ctx.strokeStyle="black";
    	ctx.lineWidth = 2;    	
    	ctx.fillStyle = "black";
    if(localCommand == 0321
		ctx.strokeStyle = "yellow";
    	ctx.lineWidth = 2;    	
    	ctx.fillStyle = "yellow";
    if(localCommand == 0322
		ctx.strokeStyle="orange";
    	ctx.lineWidth = 2;
    	ctx.fillStyle = "orange";    
    if(localCommand == 0323
		ctx.strokeStyle="white";
    	ctx.lineWidth = 2;
    	ctx.fillStyle = "white";    
    if(localCommand == 0324
		ctx.strokeStyle="red";
    	ctx.lineWidth = 2;
    	ctx.fillStyle = "red";    
    if(localCommand == 0325
		ctx.strokeStyle="green";
    	ctx.lineWidth = 2;
    	ctx.fillStyle = "green";    
    if(localCommand == 0326
		ctx.strokeStyle="purple";
    	ctx.lineWidth = 2;
    	ctx.fillStyle = "purple";    
    if(localCommand == 0327
		ctx.strokeStyle="blue";
    	ctx.lineWidth = 2;
    	ctx.fillStyle = "blue";    
    if(localCommand == 0330
      x += side*Math.cos(theta);   
      y += side*Math.sin(theta); 
    if(localCommand == 0331
      x -= side*Math.cos(theta);   
      y -= side*Math.sin(theta); 
    if(localCommand == 0332
      x += side*Math.cos(theta - thetaStep);
      y += side*Math.sin(theta - thetaStep);
    if(localCommand == 0333
      x += side*Math.cos(theta + thetaStep);
      y += side*Math.sin(theta + thetaStep);
    if(localCommand == 0334
      theta -= thetaStep; // CCW
    if(localCommand == 0335
      theta += thetaStep; // CW
    if(localCommand == 0336
      side /= scaleFactor; // -
    if(localCommand == 0337
      side *= scaleFactor; // +
    if(localCommand == 0340  
    	//point
		ctx.beginPath();
		ctx.arc(x, y, 3, 0, 2 * Math.PI);
		ctx.fill();	
		ctx.closePath();
		currentSVG += "<circle cx=\"";
		currentSVG += Math.round(x).toString();
		currentSVG += "\" cy = \"";
		currentSVG += Math.round(y).toString();
		currentSVG += "\" r = \"3\" stroke = \"black\" stroke-width = \"2\" ";
		currentSVG += "fill = \"black\" />\n";		
    if(localCommand == 0341
      //circle
		ctx.beginPath();
		ctx.arc(x, y, side, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.stroke();
		currentSVG += "    <circle cx=\"";
		currentSVG += Math.round(x).toString();
		currentSVG += "\" cy = \"";
		currentSVG += Math.round(y).toString();
		currentSVG += "\" r = \"" + side.toString() + "\" stroke = \"black\" stroke-width = \"2\" ";
		currentSVG += "fill = \"none\" />\n";		
    if(localCommand == 0342
        //line
    	ctx.beginPath();
    	ctx.moveTo(x,y);
		ctx.lineTo(x + side*Math.cos(theta),y + side*Math.sin(theta));
		ctx.stroke();		
   		ctx.closePath();
   		
   		var x2 = Math.round(x + side*Math.cos(theta));
   		var y2 = Math.round(y + side*Math.sin(theta));
   		currentSVG += "    <line x1=\""+Math.round(x).toString()+"\" y1=\""+Math.round(y).toString()+"\" x2=\""+x2.toString()+"\" y2=\""+y2.toString()+"\" style=\"stroke:black;stroke-width:2\" />\n"

    if(localCommand == 0343
    	ctx.beginPath();
		ctx.arc(x, y, side, theta - thetaStep,theta + thetaStep);
		ctx.stroke();
		ctx.closePath();
		localString = "";
		localString += "  <path d=\"";	
		localString += "M";
		var localInt = x + side*Math.cos(theta - thetaStep);
		localString += localInt.toString();
		localString += " ";
		localInt = y + side*Math.sin(theta - thetaStep);
		localString += localInt.toString();
		currentSVG += localString;
		localString = "           A" + side.toString() + " " + side.toString() + " 0 0 1 ";
		localInt = x + side*Math.cos(theta + thetaStep);
		localString += localInt.toString() + " ";
		localInt = y + side*Math.sin(theta + thetaStep);
		localString += localInt.toString() + "\" fill = \"none\" stroke = \"black\" stroke-width = \"2\" />\n";
		currentSVG += localString;

    if(localCommand == 0344
       //part of a poly line or path 
		ctx.lineTo(x + side*Math.cos(theta),y + side*Math.sin(theta));
		ctx.stroke();		

   		var x2 = Math.round(x + side*Math.cos(theta));
   		var y2 = Math.round(y + side*Math.sin(theta));
   		currentSVG += "L" + x2 + " " + y2 + " ";

    if(localCommand == 0345
       //arc
		ctx.arc(x, y, side, theta - thetaStep,theta + thetaStep);
		ctx.stroke();
    if(localCommand == 0346
      //arc, reverse direction
		ctx.arc(x, y, side, theta + thetaStep,theta - thetaStep,true);
		ctx.stroke();
    if(localCommand == 0347
        //filled circle
		ctx.beginPath();
		ctx.arc(x, y, side, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		currentSVG += "    <circle cx=\"";
		currentSVG += Math.round(x).toString();
		currentSVG += "\" cy = \"";
		currentSVG += Math.round(y).toString();
		currentSVG += "\" r = \"" + side.toString() + "\" stroke = \"black\" stroke-width = \"2\" ";
		currentSVG += "fill = \"black\" />\n";		

    if(localCommand == 0350
      thetaStep /= 2;  //angle/2
    if(localCommand == 0351
      thetaStep *= 2;  //2angle
    if(localCommand == 0352
      thetaStep /= 3; //angle/3
    if(localCommand == 0353
      thetaStep *= 3; //3angle
	if(localCommand == 0360
		imgData = imgctx.getImageData(x,y,side,side);
	if(localCommand == 0361
		ctx.putImageData(imgData,x,y);
    if(localCommand == 0362
	   ctx.beginPath();
	   ctx.moveTo(x,y);
	   currentSVG += "	<path d = \"M";
	   currentSVG += Math.round(x).toString() + " ";
	   currentSVG += Math.round(y).toString() + " ";

//	   currentSVG += "  <polyline points=\"";		
    if(localCommand == 0363
	   ctx.closePath();
	   ctx.stroke();		
	   ctx.fill();		
	   currentSVG += "Z\""+ " stroke = \"black\" stroke-width = \"2\" fill = \"none\" "+"/>";
    if(localCommand == 0364
	   ctx.closePath();
	   ctx.stroke();		
	   ctx.fill();		
	   currentSVG += "Z\""+ " stroke = \"black\" stroke-width = \"2\" fill = \"black\" "+"/>";
    if(localCommand == 0365
        ctx.font=side.toString(8) + "px " + myFont;
		ctx.fillText(currentWord,x,y);
		currentSVG += "    <text x=\"";
		currentSVG += Math.round(x).toString();
		currentSVG += "\" y = \"";
		currentSVG += Math.round(y).toString();
		currentSVG += "\" fill = \"black\""; 
		currentSVG += " font-size = \"";
		currentSVG += side + "px\"";
		currentSVG += " font-family = \"futura\"";
		currentSVG += ">";
		currentSVG += currentWord;
		currentSVG += "</text>\n";	
	if(localCommand == 0366
		ctx.beginPath();
		ctx.moveTo(Math.round(x),Math.round(y));
		cpx1 = Math.round(x + side*Math.cos(theta));
		cpy1 = Math.round(y + side*Math.sin(theta));
		currentSVG += "<path    d = \"M";
		currentSVG += (Math.round(x)).toString() + ",";
		currentSVG += (Math.round(y)).toString() + " C";
		currentSVG += cpx1.toString() + "," + cpy1.toString() + " ";
		
//<path  d="M100,200 C150,150 200,150 250,200" />
	if(localCommand == 0367
		x2 = Math.round(x);
		y2 = Math.round(y);
		cpx2 = Math.round(x + side*Math.cos(theta));
		cpy2 = Math.round(y + side*Math.sin(theta));
		ctx.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,x2,y2);
		ctx.stroke();
		currentSVG += cpx2.toString() + "," + cpy2.toString() + " ";
		currentSVG += x2.toString() + "," + y2.toString() + "\" fill = \"none\" stroke-width = \"2\" stroke = \"black\" />";		