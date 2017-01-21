
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
  spellY = 550;
  spellSide = 26;
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

function loadFont(){
	font = [];
    font.push("0040:f");
    font.push("0041:f--ddda-s-xaaa===c---sssss==f==");
    font.push("0042:fa-d-dscfcfa==s");
    font.push("0043:f--dddf-d===c--f==c--dd-daaah===c---dd===c---ddd===ags");
    font.push("0044:f-ad-ajhhgjvggvggvggvggvggaavhhvhhggggggvggvggvggvhhhhhhhhkkahhff==-d=c-f=");
    font.push("0045:f-ddjh=q=c-rgk--aaafxsssffaxfs==");
    font.push("0046:f-da-axsgjgcgavhhvggggggkfjgchhhhcgg-cgkssff===");
    font.push("0047:f-ad-acffsss==");
    font.push("0050:f-agss==jjjvjggvhhhhhvgggkkkk-ah-ds=");
    font.push("0051:f-ah=ss=jjjvjggvhhhhvggkkkkahhh--s-f==");
    font.push("0052:f-dalchhchhchhchhchhchh;sf=");
    font.push("0053:f-ad-chchchchssff==");
    font.push("0054:f-d-gjgchkhf==");
    font.push("0055:f-adh-cscffaaag==");
    font.push("0056:f-d--xfff===");
    font.push("0057:fdjhq=c-rgkf");
    font.push("0060:f-ad-xjh=chhhhchhhksf=");
    font.push("0061:f-d--agchhcg==ca-cajgggcgka=a--a==ggf=");
    font.push("0062:f-ad-j-vhhvhhahcggggcgghksgchhcgss==f=");
    font.push("0063:f-da-j-aavhhvhhjgvhaakkggjjhvhhhkvhhvkhh==fs=");
    font.push("0064:f-d=c-agcahjhcgks=-f-f==");
    font.push("0065:f-da-cahcffvfaag==");
    font.push("0066:f--ddaxdjjh==c--gkkfffs==");
    font.push("0067:f-djjh=caggggg-ckkhjjh=sgkk-f=");
    font.push("0070:f-d-axaaxffsss==");
    font.push("0071:f--d==c-a-adxffa==s");
    font.push("0072:f-da---xsssssssxffffs====");
    font.push("0073:f-da---xssssgg==jhchkhsf==");
    font.push("0074:f-adjhchhchkahhf=");
    font.push("0075:f--dag=c-f=c-ddhf==");
    font.push("0076:f-adjgcggchhhksf");
    font.push("0077:f--dda-sxaacaaavhhjgvhkachh=sss-afff===");
    font.push("0100:f-da--x=vgvgg-acs=jhhvkaahhff==");
    font.push("0101:fa-dggjjh=cggchkk-ah-chhcffaag==");
    font.push("0102:f-d-d==c-a-afxssxffs==");
    font.push("0103:f-adgvhhjggvhhhhvkahhf=");
    font.push("0104:fd--f==c-ajhvhhvhkahh-f=f=");
    font.push("0105:f-d-d==ch-cd-c=dc-sg==fs");
    font.push("0106:f-d-d==ch-d-c=dc-sg==fs");
    font.push("0107:f-adgvhhjggvhhhhvkahhf=--d-f=cagchsf==");
    font.push("0110:f--d==c-d=c-ahcags-f==");
    font.push("0111:f--dg=c-ah==ca--gchhcaag==s");
    font.push("0112:f-ad-ca-cagchhcgs=shhcfavhhfs=f=");
    font.push("0113:f-d=c-ajhq=c-rhhq=c-rhkahhf=");
    font.push("0114:f-d-d==c-hca-ag==");
    font.push("0115:f-d-d==c-f=cagjg-chagggcgggk-d==fs");
    font.push("0116:f-d-d==c-f=c-daahjhjh=chkkahhf--d==");
    font.push("0117:f-adxsf=");
    font.push("0120:fd--f==c-a-afxffa==s");
    font.push("0121:f-adxhh-adjg=cgkgfs-a==");
    font.push("0122:fd--f==c-a-ahvfjhjh=chkkahhf=");
    font.push("0123:f-ad-ajhhgjvggvggvggvggvggaavhhvhhggggggvggvggvggvhhhhhhhhkkahhff==");
    font.push("0124:f-d=ca-hcscaag=s");
    font.push("0125:f--ad=ca-cssddcacacssfhhvahh=f=");
    font.push("0126:f-djjh=cggchhgkk-f=");
    font.push("0127:fagjjgggjgcgkkkfjjjgchakkk--dgjggjh=cgkkfjjgchkk-f==");
    font.push("0130:fjgcdhhcq=c-fgg=c-rhk");
    font.push("0131:f-dcajhcggchksf=");
    font.push("0132:fgcfcjgq=c-rh-aggahh-ckhhcffaag==");
    font.push("0133:f--dd==cah--c==f--caag==");
    font.push("0134:f--d==jjgchkk--f==");
    font.push("0135:f--d==c--gcffffchf==s");
    font.push("0136:fa-dggjhcggcgkgf=s");
    font.push("0137:fg--a=c-sh==");
    font.push("0140:f-da-ajgchkaff==s");
    font.push("0141:f-d-axfcscaadvffss==");
    font.push("0142:f--ddd==c--afxffs==");
    font.push("0143:f-d-ajvggvggvggaaggks==");
    font.push("0144:f--dd==c--adxffs==");
    font.push("0145:f--dadvggjhvgvhhckhhcfaag==");
    font.push("0146:f--dd=ca--cafvdssh=-cggchsssffff===");
    font.push("0147:f-d-axfcscscscdhhvssddgg==");
    font.push("0150:f--ddd==c--a-fvfscsc=f==");
    font.push("0151:f--dddca-caaa-xssssssssss=ff===");
    font.push("0152:f--dddcscdhhvdsss--xaaaaaaaahh=ff===");
    font.push("0153:f--ddd=ca-csjhchhq=c-rgkgsff==");
    font.push("0154:f--ddd--jhcg===ca-caggg-chkh=sssf==");
    font.push("0155:f-d-d-d==c-fa-dvffvdscsc=fcf==");
    font.push("0156:f-d-d-d==c-fa-dvfss=cf==");
    font.push("0157:f-d-daxffs==");
    font.push("0160:f-d-dchh=c-sdxfggcsfff==");
    font.push("0161:f-d-adxfcss=c-fgg-fvhhaafff===");
    font.push("0162:f-d-d=ca--cjhj==hchkkags--f===");
    font.push("0163:f--dda-ajvggvgjgvgkaavggvgghvgksff===");
    font.push("0164:f-dca-cgchhcff-ahvhhfff===");
    font.push("0165:f--ddd=c-afhhvdhhcfs==");
    font.push("0166:f-djjgchhcgkkf=");
    font.push("0167:f-d-djjgchhcgkkfjjgchhcgkkf==");
    font.push("0170:f-d-djhq=c-gkfjg=c-hkr=-f==");
    font.push("0171:f-d-jh=jgcggcggggggcgkkhhf=");
    font.push("0172:f-d-gchhcddcggcdjgchhhhch-cggggchhkffffss===");
    font.push("0173:f-ad--agjgchhhcahcgsssgchschhhchkhhssff===");
    font.push("0174:f-d=ca--c==s--scaf==");
    font.push("0175:f--ddaa-acajgchshhhchaagggchhhcahcgkaahhfff===");
    font.push("0176:f-ada-sjgchhcgkdjhcgkfffsss==");

}

function loadCommandGlyphs(){
commandSymbolGlyphTable = [];
    commandSymbolGlyphTable.push("0300:f!-adzjh-acssscaahhsscaaacsgggkssff==");
    commandSymbolGlyphTable.push("0304:f!-adxchchchcjhk--aaxsshaaxsshaaxsshaaxssjgk==ahhf=");
    commandSymbolGlyphTable.push("0305:f!-ad2chchchchchxjhk-a--x==sha--x==sha--x==sha--x==sha--x==sjh1=sf=");
    commandSymbolGlyphTable.push("0306:f!-ad3chchchchchxjhk-a--x==sha--x==sha--x==sha--x==sha--x==sjhhh=cg-a--x==s1h=sf=");
    commandSymbolGlyphTable.push("0310:f!-djhq=caggcaggcaggcagggk-rf=");
    commandSymbolGlyphTable.push("0311:h2cgw=c-hagjg=cgg1-rh!g2jhcahhhw-caggg-chhh=sggg=sgr1h");
    commandSymbolGlyphTable.push("0312:f!lgcaggggcge=r-cagggg-cgg1e-r=f=");
    commandSymbolGlyphTable.push("0313:f!--ddacgcahcahcacahcahchsf==");
    commandSymbolGlyphTable.push("0314:f!t-dda!f!f!s=r");
    commandSymbolGlyphTable.push("0317:f!--ad-af=c-ag==ca-cah-cscda==ffs=");
    commandSymbolGlyphTable.push("0330:f!r--ad-d=cgcahcag-cahjh=q=cahhcahhh-r-cakhssssfff===");
    commandSymbolGlyphTable.push("0331:f!hhfsr--ad-d=cgcahcag-cahjh=q=cahhcahhh-r-cakhssssfff===dhhs");
    commandSymbolGlyphTable.push("0332:f!gfr--ad-d=cgcahcag-cahjh=q=cahhcahhh-r-cakhssssfff===hs");
    commandSymbolGlyphTable.push("0333:f!hsr--ad-d=cgcahcag-cahjh=q=cahhcahhh-r-cakhssssfff===ag");
    commandSymbolGlyphTable.push("0334:f!-ad-jvggvggvgcha-aggg=cgk-s==f=");
    commandSymbolGlyphTable.push("0335:f!-ad-jvggvggvgggcga-ahhh=c-hsk==dhh=s");
    commandSymbolGlyphTable.push("0336:f!-ag-a=c-sh=s=");
    commandSymbolGlyphTable.push("0337:f!-ad-cgcgcgcaag=s=");
    commandSymbolGlyphTable.push("0340:f!-adzfs=");
    commandSymbolGlyphTable.push("0341:f!-adxzfs=");
    commandSymbolGlyphTable.push("0342:f!-adg-cazshhcazffag==");
    commandSymbolGlyphTable.push("0343:f!-adjvhcggchzksf=");
    commandSymbolGlyphTable.push("0350:f!-adjhchhcg--caacssk==gfs=");
    commandSymbolGlyphTable.push("0351:f!-dajh--caacaacssssh==chcgkfag=");
    commandSymbolGlyphTable.push("0352:f!-adhjlgggchh--caacsshhcaacsshh==chhhk;aggf=");
    commandSymbolGlyphTable.push("0353:f!-adhjlgchhchh--caacssggggggcaacsshhhk;==fag=");
    commandSymbolGlyphTable.push("0360:f!--addaxdg-cag=ca-cag==ca-cagca-cagchf==s=");
    commandSymbolGlyphTable.push("0361:f!-ad-jvgvgvhhhhvggksg-acagcagcacacacagcagchffss===");
    commandSymbolGlyphTable.push("0370:f!--dd-a==ca-cshca-cagca=ca=--cagcacacahsssssffhhcagjgcggchkddaaafh3c-s==caggcaggcagg1gff--d===s=");
    commandSymbolGlyphTable.push("0371:f!--dd-a==ca-cshca-cagca=ca=--cagcacacahssddhcaggjhcggchhhkf-sssfh==3caggcaggcagg1aa--sg===s---a====");
    commandSymbolGlyphTable.push("0372:f!--dd-a==ca-cshca-cagca=ca=--cagcacacahsssssffhhcagjgcggchkddaaa-sf==cahcahcahcahff--d===s---a====");
    commandSymbolGlyphTable.push("0373:f!--dd-a==ca-cshca-cagca=ca=--cagcacacahssddhcaggjhcggchhhkfss-af==cahcahcahcahffss--ad====");
    commandSymbolGlyphTable.push("0374:f!--dd-a==ca-cshca-cagca=ca=--cagcacacahsssssffhhcagjgcggchkddaaafh2cagcagcagcagcag1gfffssss===");
    commandSymbolGlyphTable.push("0375:f!--dd-a==ca-cshca-cagca=ca=--cagcacacahssddhcaggjhcggchhhkfssfah2cagcagcagcagcag1aaagssss===");
    commandSymbolGlyphTable.push("0376:f!--dd-a==ca-cshca-cagca=ca=--cagcacacahsssssffhhcagjgcggchkddaaaha3cagcagcagcagcagcag1aaag==s=");
    commandSymbolGlyphTable.push("0377:f!--dd-a==ca-cshca-cagca=ca=--cagcacacahssddhcaggjhcggchhhkfsfh3cagcagcagcagcagcag1faaagsss===");

}

function loadShapes(){
	shapeActions = [];
    shapeActions.push("0200:1cagcagcagcag");
    shapeActions.push("0201:3jgcaggggcaggggcaggg");
    shapeActions.push("0202:1chcagjgq=c");
    shapeActions.push("0203:1qjh-cahhcag=sc");
    shapeActions.push("0204:2wch=caggc-");
    shapeActions.push("0205:2w=cahh-cahc");
    shapeActions.push("0206:-as-asca3jhhcggahhhhcggggggchhhgaggggchhhhhhcggahhhhcggggggchhahgggggchhhhhhcggahhhhcggggggchhaggggchhhhca21==");
    shapeActions.push("0207:");
    shapeActions.push("0210:c3jhe=r-aggge-chhh=s");
    shapeActions.push("0211:cq1jh-aggchhs");
    shapeActions.push("0213:3hcahhcahhca");
    shapeActions.push("0214:3gcaggcaggca");
    shapeActions.push("0215:3r=caggcaggcag");
    shapeActions.push("0216:3r-cahhcahhcah");
    shapeActions.push("0217:3ht-aggs=");

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

function spellGlyph(localGlyphString){

  theta = theta0;
  thetaStep = Math.PI/2;
  scaleFactor = 2;

  x = spellX;
  y = spellY;
  
  var tempInt = side;
  side = spellSide;

  var splitGlyphStringArray = localGlyphString.split('~');

for(var q = 0;q < splitGlyphStringArray.length;q++){
  localGlyphString = splitGlyphStringArray[q];
  if(q%2 ==0){
  for(var k = 0;k < localGlyphString.length;k++){
     for(var l = 0;l <  commandSymbolGlyphTable.length; l++){
        var localStringArray = commandSymbolGlyphTable[l].split(':');
        var localString = localStringArray[1];  
        var tempAddress = (Number(localStringArray[0].charCodeAt(1))- 060)*64 + (Number(localStringArray[0].charCodeAt(2))  - 060)*8 + Number(localStringArray[0].charCodeAt(3)) - 060;        
        if(tempAddress == key2command(localGlyphString.charAt(k))){
           doGlyphString(localString); 
        } 
     }

  }
 
  }
  x += spellSide;
}
 side = tempInt;
}



function doTheThing(localCommand){
    
        if(localCommand >= 0040 && localCommand < 0176){  //printable ASCII from space thru ~
      for(var searchIndex = 0;searchIndex <  font.length; searchIndex++){
        var localStringArray = font[searchIndex].split(':');
        var localString = localStringArray[1];  
        var tempAddress = (Number(localStringArray[0].charCodeAt(1))- 060)*64 + (Number(localStringArray[0].charCodeAt(2))  - 060)*8 + Number(localStringArray[0].charCodeAt(3)) - 060;        
        if(tempAddress == localCommand){
           doGlyphString(localString);
        }
     }     
    }

    if(localCommand >= 0200 && localCommand < 0277){//shapes
      for(var searchIndex = 0;searchIndex <  shapeActions.length; searchIndex++){
        var localStringArray = shapeActions[searchIndex].split(':');
        var localString = localStringArray[1];  
        var tempAddress = (Number(localStringArray[0].charCodeAt(1))- 060)*64 + (Number(localStringArray[0].charCodeAt(2))  - 060)*8 + Number(localStringArray[0].charCodeAt(3)) - 060;        
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