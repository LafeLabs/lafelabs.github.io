//EVERYTHING IS PHYSICAL
//EVERYTHING IS ALWAYS RECURSIVE
//NO LAWS NO PROPERTY NO MINING NO NUMBERS
//THE SOLE PURPOSE OF THE EXISTING SOFTWARE INDUSTRY IS TO CREATE AND MAINTAIN STRUCTURAL VIOLENCE
//ALL COMPUTER "SCIENCE" IS AN EVIL RELIGION
//ALL "TECH" COMPANIES ARE BASED ON FRAUD AND LIES
//SMASH THE TECHNOCRATIC PRIESTHOOD
//ALL CODE HERE ENTERED INTO PUBLIC DOMAIN WITH NO RESTRICTIONS WHATSOEVER

function setGeometronGlobals(){
	
  spellingOn = false;
  imageOn = false;
  inPath = false;//move to true after path started, back to false after path ended
	
  keyRow0 = ['1','2','3','7','0','-','='];
  keyAddressRow0 = [0304,0305,0306,0317,0300,0336,0337];
  keyRow1 = ['q','w','e','r','t','u','i','o','p'];
  keyAddressRow1 = [0310,0311,0312,0313,0314,0370,0371,0360,0361];
  keyRow2 = ['a','s','d','f','g','h','j','k','l',';'];
  keyAddressRow2 = [0330,0331,0332,0333,0334,0335,0350,0351,0352,0353];
  keyRow3 = ['z','x','c','v','b','n','m',','];
  keyAddressRow3 = [0340,0341,0342,0343,0344,0345,0346,0347];
  keyRow4 = ['!','@','#','$','%','^','&','*','Q','W','E','R','T','Y','U','I','A','S','D','F','G','H','J','K'];
  keyAddressRow4 = [0200,0201,0202,0203,0204,0205,0206,0207,0210,0211,0212,0213,0214,0215,0216,0217,0220,0221,0222,0223,0224,0225,0226,0227];

  phi = 0.5*(Math.sqrt(5) + 1);
  unit = 75;
  scaleFactor = 2;
  side = 50;
  thetaStep = Math.PI/2;
  theta0 = -Math.PI/2; 
  theta = theta0;


  x0 = 300;
  y0 = 200;
  x = x0;
  y = y0;
  
  roctalX = 0;
  roctalY = 0;
  roctalX0 = 0;
  roctalY0 = 0;
  roctalSide = 16;
  
  spellX = 2;
  spellY = 18;
  spellSide = 16;
  textSide = 40;
  glyphsPerRow = 32;
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
  currentGlyphString = "0";
  currentGlyphTable = [];
  currentGlyphAddress = 0400;//int
  currentTableIndex = 0;
  cursorString = "gchhcgc1rjahhh--chhchhhk==s";
  manuscriptPageindex = 0;

  imageTableIndex = 0;
  imageStub = "geometronfiles/images/";  

	var imageTextLocal = "sky.png\nairelemental.png\ncrystalCityMap.png\ncursor1.png\nfrontcover.png\nintro1.png\nlongbridgepark.png\nrootsof1.png\nalaskabeach.png\nthePentagon.png\ndime.png\nhebrew1.png\nhebrew2.png\nhebrew3.png\nhebrew4.png";
	imageTable = imageTextLocal.split('\n');

	svgFile = [];

//   svgFile.push("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>");    
   svgFile.push("<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"");
   svgFile.push("viewBox=\"0 0 600 600\" width=\"600\" height=\"600\" id=\"geometron_svg\">");     


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
    font.push("0061:r--d==f-d--agchhcg==ca-cajgggq-c=rgka=a--a==gg-f==");
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
    font.push("0101:w2jjhckh-fgg=c--aggchhsjh==1");
    font.push("0102:1r---f===cah--cffcdavffvfscg=f--f===");
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
    shapeActions.push("0206:z");
    shapeActions.push("0207:0aadddd-~0207~0");
    shapeActions.push("0210:1--as-asca3jhhcggahhhhcggggggchhhgaggggchhhhhhcggahhhhcggggggchhahgggggchhhhhhcggahhhhcggggggchhaggggchhhhca21===");//resistor
    shapeActions.push("0211:1---ca=cahcggchagcggcgca-ca===");//capacitor
    shapeActions.push("0212:1r--hcggcajhhhq=cahhcahhhk-agr==");//ground
    shapeActions.push("0213:1t--nf-f=b-ddggbnhhff===");//loop in a transformer
    shapeActions.push("0214:1----ca====t-=g--fb==RRRR--nfhca----ca======r");//inductor
    shapeActions.push("0215:1ct-ar-d1jh=q=c-fgg=c-r-dhkaaaat=r=");//"x" josephson junction
    shapeActions.push("0216:1t-cagr-cggchh=thr-d1j=c-h=q=c-fgcg=c-r-dhkaagchhcgcacat=r=");//xbox jj
    shapeActions.push("0217:r1--ax---sssdddds===~V~sd==---fa===");

    shapeActions.push("0220:1r--gchhcgt-aahcggcdcacssscacahs=r==gg");
    shapeActions.push("0221:1--m,ggm,hca---axs===s-scahaaaah===cfca");
    shapeActions.push("0222:1t-r-caaaaacss=xd-jhchhchhchhc=hkff-jgchhchhchhchhhkddaaa=t=r");
    shapeActions.push("0223:1--caaacssg=chhc-gaahjh=q=chhchhhk-r-a==");
    shapeActions.push("0224:1r---ca=axaxa-ca===");
    shapeActions.push("0225:1r---ca=cagchhcgahchhcjgq=cggcgggk-rca-ca===");
    shapeActions.push("0226:0");
    shapeActions.push("0227:0");

}

function loadShapeSymbols(){
	shapeSymbols = [];
    shapeSymbols.push("0200:f!--ad=!-sf==");  //! square
    shapeSymbols.push("0201:f!@@@@@@====agsr---af====");
    shapeSymbols.push("0202:f!-da!q####gg====rfs=");
    shapeSymbols.push("0203:f!");
    shapeSymbols.push("0204:f!");
    shapeSymbols.push("0205:f!");
    shapeSymbols.push("0206:f!");
    shapeSymbols.push("0207:f!");

    shapeSymbols.push("0210:f!-ahss=Qg-s=");//Q  resistor
    shapeSymbols.push("0211:f!-ahss=Wg-s=");//W  capacitor
    shapeSymbols.push("0212:f!-adhhscahq-caggjh=caggcaggg-chhkd=rfs=");//E triangle ground
    shapeSymbols.push("0213:f!");
    shapeSymbols.push("0214:f!-ahss=Tg-s=");//T  inductor
    shapeSymbols.push("0215:f!-ahss=Yg-s=");//Y  X junction
    shapeSymbols.push("0216:f!-ahss=Ug-s=");//U box junction
    shapeSymbols.push("0217:f!-ad-s==I--ffs==");//I voltage source
    shapeSymbols.push("0220:f!-ad-sgg==A-cf-s==");//A multi line ground
    shapeSymbols.push("0221:f!-adSg-s==");//S  coax
    shapeSymbols.push("0222:f!-d=D-f=s");//D SQUID
    shapeSymbols.push("0223:f!d-ah=F-gs=");//F RF amp
    shapeSymbols.push("0224:f!-d=G-f=s");//G current source
    shapeSymbols.push("0225:f!-d=H-f=s");//H diode
    shapeSymbols.push("0226:f!");
    shapeSymbols.push("0227:f!");

}

function loadManuscript(){
	manuscriptActions = [];
    manuscriptActions.push("0400:0zx");
    manuscriptActions.push("0401:0ThhfWgcagagcahsh-azhca=E-adaafzca=hTTaggTddhhdT-dss=----d====c---f===c0sssaTsf aggTggag-cag=Wh-cggch=Qssssg");
    manuscriptActions.push("0402:0ThcahWhchhcagQgcahz-caggaaaaEcaaaa-ax--ssdd==~V~0dd");
    manuscriptActions.push("0403:0--EEEEE");
    manuscriptActions.push("0404:0DdhhTEfOhhEahcaFssshhcacagS");
    manuscriptActions.push("0405:0dd==~A~jjhkk-~A~-jjhkk~A~-jjhkk~A~-jjhkk~A~-jjhkk~A~-jjhkk~A~-jjhkk~A~");
manuscriptActions.push("0406:0addd--d~ABCDEFGHIJKLMNOPQRSTUVWXYZ~====d-d-d-fs-~abcdefghijklmnopqrstuvwxyz");
    manuscriptActions.push("0407:0dddaff--~STOP~jhk~STOP~jhk~STOP~jhk~STOP~jhk~STOP~jhk~STOP~jhk~STOP~jhk~STOP~0-ddds~STOP~0aa");

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

function redrawCurrentGlyphString(addedString){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(addedString.length !=0){
		currentGlyphString += addedString;
	}
	doGlyphString(currentGlyphString);
	doGlyphString(cursorString);
	if(spellingOn){
		spellGlyph(currentGlyphString);
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
     if(x >= glyphsPerRow*spellSide){
     	x=spellX;
     	y+= spellSide;
     }
     
     for(var l = 0;l <  commandSymbolGlyphTable.length; l++){
        var localStringArray = commandSymbolGlyphTable[l].split(':');
        var localString = localStringArray[1];  
        var tempAddress = (Number(localStringArray[0].charCodeAt(1))- 060)*64 + (Number(localStringArray[0].charCodeAt(2))  - 060)*8 + Number(localStringArray[0].charCodeAt(3)) - 060;        
        if(tempAddress == key2command(localGlyphString.charAt(k))){
           doGlyphString(localString); 
        }   
     }
     
     for(var l = 0;l <  shapeSymbols.length; l++){
        var localStringArray = shapeSymbols[l].split(':');
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

function rootMagic(localCommand){

	if(localCommand == 0001){//shape actions
		var localOctalAddress = "0" + currentGlyphAddress.toString(8);
		currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
		currentGlyphTable = shapeActions;
		currentTableIndex = 0;
		var tempStringArray = currentGlyphTable[currentTableIndex].split(':');
		currentGlyphString = tempStringArray[1];
		currentGlyphAddress = parseInt(tempStringArray[0],8);
	}
	if(localCommand == 0002){//shape symbols
		var localOctalAddress = "0" + currentGlyphAddress.toString(8);
		currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
		currentGlyphTable = shapeSymbols;
		currentTableIndex = 0;
		var tempStringArray = currentGlyphTable[currentTableIndex].split(':');
		currentGlyphString = tempStringArray[1];
		currentGlyphAddress = parseInt(tempStringArray[0],8);	
	}
	if(localCommand == 0003){//command glyph symbols
		var localOctalAddress = "0" + currentGlyphAddress.toString(8);
		currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
		currentGlyphTable = commandSymbolGlyphTable;
		currentTableIndex = 0;
		var tempStringArray = currentGlyphTable[currentTableIndex].split(':');
		currentGlyphString = tempStringArray[1];
		currentGlyphAddress = parseInt(tempStringArray[0],8);
	}
	if(localCommand == 0004){//manuscript actions
		var localOctalAddress = "0" + currentGlyphAddress.toString(8);
		currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
		currentGlyphTable = manuscriptActions;
		currentTableIndex = 0;
		var tempStringArray = currentGlyphTable[currentTableIndex].split(':');
		currentGlyphString = tempStringArray[1];
		currentGlyphAddress = parseInt(tempStringArray[0],8);
	}
	if(localCommand == 0005){//mansuscript symbols
	    var localOctalAddress = "0" + currentGlyphAddress.toString(8);
		currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
		currentGlyphTable = manuscriptSymbols;
		currentTableIndex = 0;
		var tempStringArray = currentGlyphTable[currentTableIndex].split(':');
		currentGlyphString = tempStringArray[1];
		currentGlyphAddress = parseInt(tempStringArray[0],8);
	
	}
	if(localCommand == 0006){//font
		var localOctalAddress = "0" + currentGlyphAddress.toString(8);
		currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
		currentGlyphTable = font;
		currentTableIndex = 0;
		var tempStringArray = currentGlyphTable[currentTableIndex].split(':');
		currentGlyphString = tempStringArray[1];
		currentGlyphAddress = parseInt(tempStringArray[0],8);	
	}
	
	if(localCommand == 0011){//go to previous glyph in current glyph table
		var localOctalAddress = "0" + currentGlyphAddress.toString(8);
		currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
		currentTableIndex--;
		if(currentTableIndex < 0){
        	currentTableIndex = currentGlyphTable.length - 1;
    	}
    	var localStringArray = currentGlyphTable[currentTableIndex].split(':');
    	currentGlyphString = localStringArray[1];  
    	currentGlyphAddress = parseInt(localStringArray[0],8); 
	}

	if(localCommand == 0015){//go to next glyph in current glyph table
		var localOctalAddress = "0" + currentGlyphAddress.toString(8);
		currentGlyphTable[currentTableIndex] = localOctalAddress + ":" + currentGlyphString;
		currentTableIndex++;
		if(currentTableIndex >= currentGlyphTable.length){
        	currentTableIndex =  0;
    	}
    	var localStringArray = currentGlyphTable[currentTableIndex].split(':');
    	currentGlyphString = localStringArray[1];  
    	currentGlyphAddress = parseInt(localStringArray[0],8); 

	}
	if(localCommand == 024){//go to previous image in table
		imageTableIndex--;
		if(imageTableIndex < 0){
			imageTableIndex = imageTable.length -1;
		}	
	}
	if(localCommand == 025){//go to next image in table
		imageTableIndex++;
		if(imageTableIndex >= imageTable.length){
			imageTableIndex = 0;
		}	
	}
	
	if(localCommand == 031){ ////031 = 25 = control-y:toggle background image on/off
     	imageOn = !imageOn;
    }	
}

function doTheThing(localCommand){
    
        if(localCommand >= 0040 && localCommand < 0176){  //printable ASCII from space thru ~
      for(var searchIndex = 0;searchIndex <  font.length; searchIndex++){
        var localStringArray = font[searchIndex].split(':');
        var localString = localStringArray[1];  
        var tempAddress = parseInt(localStringArray[0],8);
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
       // tempAddress = Number(localStringArray[0]);
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
    if(localCommand == 0362){
              
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