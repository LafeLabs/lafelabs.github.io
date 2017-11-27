
int a,b,c,d;
int inA = 25;
int inB = 27;
int inC = 29;
int inD = 31;
int outA = 24;
int outB = 26;
int outC = 28;
int outD = 30;


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
  }
  else{
    digitalWrite(outA,LOW);
  }
  b = digitalRead(inB);
  if(b == 1){
    digitalWrite(outB,HIGH);
  }
  else{
    digitalWrite(outB,LOW);
  }
  c = digitalRead(inC);
  if(c == 1){
    digitalWrite(outC,HIGH);
  }
  else{
    digitalWrite(outC,LOW);
  }  
  d = digitalRead(inD);
  if(d == 1){
    digitalWrite(outD,HIGH);
  }
  else{
    digitalWrite(outD,LOW);
  }  
  
}
