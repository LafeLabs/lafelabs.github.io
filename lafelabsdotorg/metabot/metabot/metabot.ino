
int a,b,c,d;

int inA = 4;
int inB = 5;
int inC = 6;
int inD = 7;
int outA = 8;
int outB = 9;
int outC = 10;
int outD = 11;


void setup() {
  pinMode(inA,INPUT);
  pinMode(inB,INPUT);
  pinMode(inC,INPUT);
  pinMode(inD,INPUT);
  pinMode(outA,OUTPUT);
  pinMode(outB,OUTPUT);
  pinMode(outC,OUTPUT);
  pinMode(outD,OUTPUT);
}

void loop() {
  a = digitalRead(inA);
  if(a == 1){
    digitalWrite(outA,HIGH);
    digitalWrite(outB,LOW);
    digitalWrite(outC,LOW);
    digitalWrite(outD,LOW);
  }
  else{
    digitalWrite(outA,LOW);
  }
  b = digitalRead(inB);
  if(b == 1){
    digitalWrite(outB,HIGH);
    digitalWrite(outA,LOW);
    digitalWrite(outC,LOW);
    digitalWrite(outD,LOW);
  }
  else{
    digitalWrite(outB,LOW);
  }
  c = digitalRead(inC);
  if(c == 1){
    digitalWrite(outC,HIGH);
    digitalWrite(outB,LOW);
    digitalWrite(outA,LOW);
    digitalWrite(outD,LOW);
  }
  else{
    digitalWrite(outC,LOW);
  }  
  d = digitalRead(inD);
  if(d == 1){
    digitalWrite(outD,HIGH);
    digitalWrite(outB,LOW);
    digitalWrite(outC,LOW);
    digitalWrite(outA,LOW);
  }
  else{
    digitalWrite(outD,LOW);
  }  
  
}
