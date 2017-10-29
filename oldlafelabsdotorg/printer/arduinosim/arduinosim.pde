
/*
GEOMETRON:
EVERYTHING IS PHYSICAL
EVERYTHING IS FRACTAL
EVERYTHING IS RECURSIVE
NO MONEY 
NO MINING
NO PROPERTY
[EGO DEATH]
LOOK TO THE FUNGI
LOOK TO THE INSECTS
LANGUAGE IS THE TOOL THE MIND USES TO PARSE REALITY

PROCESSING SIMULATOR OF ARDUINO FOR TRASH PRINTER
TRASHNET
METADUMPSTER

*/

float x,y,x0,y0,xold,yold;
int xmotorIndex = 0;
int ymotorIndex = 0;
int[] xpins = {4,5,6,7};
int[] ypins = {8,9,10,11};
float side;
float scaleFactor, unit;
float theta,theta0,thetaStep;
float phi = 0.5*(sqrt(5) + 1);
boolean penDown = false;

String[] shapes = new String[0300];


void setup(){
  
  ellipseMode(CENTER);
  noFill();
  strokeWeight(1);
  unit = 75;
  scaleFactor = 2;
  side = 100;
  thetaStep = PI/2;
  theta0 = -PI/2; 
  theta = theta0;
  size(500,500);
  x0 = 250;
  y0 = 250;
  x = x0;
  y = y0;
shapes[0200] = "0340,0304,0330,0332,0331,0333";
shapes[0201] =  "0304,0341,0333,0340,0342,0342,0342,0342,0341,0332,";
shapes[0202] =  "0304,0313,0350,0335,0336,0336,0342,0333,0342,0333,0342,0333,0342,0333,0334,0304,0337,0337,";
shapes[0203] =  "0344,0330";
shapes[0204] =  "0362,0203,0334,0203,0334,0203,0334,0203,0334,0363";
shapes[0205] =  "0362,0203,0335,0203,0203,0335,0203,0335,0203,0203,0335,0363,0336,0330,0333,0336,0331,0332,0337,0365,0336,0332,0331,0337,0337,";
shapes[0206] =  "0336,0332,0337,0362,0203,0334,0336,0203,0335,0350,0335,0337,0310,0337,0203,0335,0335,0203,0335,0304,0335,0336,0313,0336,0203,0334,0337,0203,0363,0335,0335,0336,0332,0337,";
shapes[0207] =  "0340,0330,0331,0335,0330,0331,0334,0334,0330,0331,0335,0336,0330,0336,0335,0330,0331,0334,0334,0330,0331,0335,0337,0331,0337,0337,0341,0330,0336,0336,0336,0340,0330,0331,0335,0330,0331,0334,0334,0330,0331,0335,0331,0330,0341,0337,0337,0337,0341,0331,0336,0340,";
shapes[0210] =  "0350,0340,0330,0335,0330,0335,0330,0335,0330,0335,0330,0335,0330,0335,0330,0335,0330,0335,0304,0310,0336,0333,0337,0330,0336,0332,0333,0330,0331,0337,0333,0336,0330,0331,0333,0332,0337,0331,0336,0333,0332,0331,0330,0337,0332,0336,0331,0330,0332,0341,";
shapes[0211] =  "0341,0332,0332,0332,0332,0336,0332,0332,0330,0330,0330,0350,0350,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0335,0304,01101,01102,01103,01104,01105,01106,01107,01110,01111,01112,01113,01114,01115,01116,01117,01120,01121,01122,01123,01124,01125,01126,01127,01130,01131,01132,";
shapes[0212] =  "0341,0333,0333,0332,0332,0332,0332,0332,0332,0330,0332,01115,01105,01124,01101,01104,01125,01115,01120,0250,0250,0340,01123,01124,01105,01122,0341,0333,0333,";
shapes[0213] =  "0220,0333,0331,0222,0333,0331,0224,0333,0331,0226,";
shapes[0214] =  "0227,0337,0333,0341,0331,0336,0336,0330,0227,";
shapes[0220] =  "0340,0333,0336,0336,0330,0337,0337,0332,0336,0336,0330,0337,0337,0333,0336,0336,0330,0337,0337,0332,0336,0336,0330,0337,0337,0333,";
shapes[0221] =  "0333,0336,0336,0336,0340,0330,0337,0337,0337,0332,0336,0336,0336,0330,0337,0337,0337,";
shapes[0222] =  "0221,0221,0221,0221,0333,";
shapes[0223] =  "0340,0333,0336,0336,0336,0336,0330,0337,0337,0337,0337,0332,0336,0336,0336,0336,0330,0337,0337,0337,0337,";
shapes[0224] =  "0223,0223,0223,0223,0223,0223,0223,0223,0333,";
shapes[0225] =  "0340,0333,0336,0336,0336,0336,0336,0330,0337,0337,0337,0337,0337,0332,0336,0336,0336,0336,0336,0330,0337,0337,0337,0337,0337,";
shapes[0226] =  "0225,0225,0225,0225,0225,0225,0225,0225,0225,0225,0225,0225,0225,0225,0225,0225,0333,";
shapes[0227] =  "0213,0335,0213,0335,0213,0335,0213,0335,";

}

void draw(){    
    background(255); 
    drawGlyph("0300,0330,0330,0330,0332,0332,0332,0214");
    noLoop();
}


void drawGlyph(String localGlyph){
  String[] glyphArray = split(localGlyph,",");
  for(int index = 0;index < glyphArray.length;index++){
    if((glyphArray[index]).length() > 1){
        int tempAddress = (int(glyphArray[index].charAt(1))- 060)*64 + (int(glyphArray[index].charAt(2))  - 060)*8 + int(glyphArray[index].charAt(3)) - 060;
        if(tempAddress >= 0300){
            doTheThing(tempAddress);  
        }
        else{
            drawGlyph(shapes[tempAddress]);
        }
    }
  }  
}

void taxicab(float startx,float starty,float stopx,float stopy){
   line(startx,starty,stopx,starty); //move x motor round(deltax) steps, deltax = x-xold
   int xsteps = round(abs(stopx - startx));
   for(int step =0;step < xsteps;step++){
       if(stopx > startx){
         xplus();
       }
       if(stopx < startx){
         xminus();
       }
   }
   
   
   line(stopx,starty,stopx,stopy);//move y motor round(deltay)steps, where deltay = y-yold
   int ysteps = round(abs(stopy - starty));
   for(int step =0;step < ysteps;step++){
       if(stopy > starty){
         yplus();
       }
       if(stopy < starty){
         yminus();
       }
   }

}


void xplus(){//one step up in x 
  int localPin = 13;
  int highTime = 10;//length of pulse set manually based on hardware
  int lowTime = 10;//the pause after the pulse
//  digitalWrite(localPin,HIGH);
//  delay(highTime)
//  digitalWrite(localPin,LOW);
//  delay(lowTime)
  
}
void xminus(){//one step down in x
  int localPin = 13;//pin gets selected based on stepper or DC motor
  int highTime = 10;//length of pulse set manually based on hardware
  int lowTime = 10;//the pause after the pulse
//  digitalWrite(localPin,HIGH);
//  delay(highTime)
//  digitalWrite(localPin,LOW);
//  delay(lowTime)

}
void yplus(){//one step up in y
  int localPin = 13;
  int highTime = 10;//length of pulse set manually based on hardware
  int lowTime = 10;//the pause after the pulse
//  digitalWrite(localPin,HIGH);
//  delay(highTime)
//  digitalWrite(localPin,LOW);
//  delay(lowTime)

}
void yminus(){//one step down in y
  int localPin = 13;
  int highTime = 10;//length of pulse set manually based on hardware
  int lowTime = 10;//the pause after the pulse
//  digitalWrite(localPin,HIGH);
//  delay(highTime)
//  digitalWrite(localPin,LOW);
//  delay(lowTime)

}

void zplus(){//one step up in y
  int localPin = 13;
  int highTime = 10;//length of pulse set manually based on hardware
  int lowTime = 10;//the pause after the pulse
//  digitalWrite(localPin,HIGH);
//  delay(highTime)
//  digitalWrite(localPin,LOW);
//  delay(lowTime)

}
void zminus(){//one step down in y
  int localPin = 13;
  int highTime = 10;//length of pulse set manually based on hardware
  int lowTime = 10;//the pause after the pulse
//  digitalWrite(localPin,HIGH);
//  delay(highTime)
//  digitalWrite(localPin,LOW);
//  delay(lowTime)

}
void penUp(){
}
void penDown(){
}

void doTheThing(int localCommand){
    
    //geometric native action commands
    if(localCommand == 0300){
      x = x0;
      y = y0;
      theta = theta0;
      side = unit;
      thetaStep = PI/2;
      scaleFactor = 2;
    }
    if(localCommand == 0304){
      thetaStep = PI/2;
    }
    if(localCommand == 0305){
      thetaStep = 2*PI/5;
    }
    if(localCommand == 0306){
      thetaStep = PI/3;
    }    
    if(localCommand == 0310){
       scaleFactor = sqrt(2); 
    }
    if(localCommand == 0311){
       scaleFactor = phi; //"golden" ratio 
    }
    if(localCommand == 0312){
       scaleFactor = sqrt(3); 
    }
    if(localCommand == 0313){
      scaleFactor = 2;  //2x
    }
    if(localCommand == 0314){
      scaleFactor = 3;  //3x
    }
    if(localCommand == 0315){
      scaleFactor = 5;  //3x
    }
    
    if(localCommand == 0330){
      xold = x;
      yold = y;
      for(int index = 1;index <= int(side);index++){
          x = x + cos(theta)*float(index)/side;
          y = y + sin(theta)*float(index)/side;
          if(penDown){
            taxicab(xold,yold,x,y); 
          }
          xold = x;
          yold = y;
       }
    }
    if(localCommand == 0331){
      xold = x;
      yold = y;
      for(int index = 1;index <= int(side);index++){
          x = x - cos(theta)*float(index)/side;
          y = y - sin(theta)*float(index)/side;
          if(penDown){
              taxicab(xold,yold,x,y); 
          }
          xold = x;
          yold = y;
       }      
    }
    if(localCommand == 0332){
      xold = x;
      yold = y;
      for(int index = 1;index <= int(side);index++){
          x = x + cos(theta - thetaStep)*float(index)/side;
          y = y + sin(theta - thetaStep)*float(index)/side;
          if(penDown){
            taxicab(xold,yold,x,y); 
          }
          xold = x;
          yold = y;
       }
      
    }
    if(localCommand == 0333){
      xold = x;
      yold = y;
      for(int index = 1;index <= int(side);index++){
          x = x + cos(theta + thetaStep)*float(index)/side;
          y = y + sin(theta + thetaStep)*float(index)/side;
          if(penDown){
            taxicab(xold,yold,x,y); 
          }
          xold = x;
          yold = y;
       }
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
      penDown = true;
    }
    if(localCommand == 0341){
      penDown = false;      
    }
    if(localCommand == 0342){
      //arc left
      
    }
    if(localCommand == 0343){
      //arc right
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

}