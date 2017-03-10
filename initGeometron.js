function initGeometron(){
  var currentImage = new Image();
  canvasIndex = 0;
  inPath = false;//move to true after path started, back to false after path ended
  svgFile = [];

  currentAddress = 0400;
	
	wordStack = [];
	wordStack.push("Geometron");
	wordIndex = 0;
	myWord = wordStack[wordIndex];
	myFont = "Futura";

	currentWord = "Word";
	currentImageURL = "https://upload.wikimedia.org/wikipedia/commons/7/7b/OlympicMarmot1_%28mirrored%29.jpg";
    
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
	currentGlyph = currentTable[currentAddress];  
	currentGlyphArray = currentGlyph.split(",");
}
