#!/usr/bin/env python
import math
import urllib2   
import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)

#button input pins, in sequence of physical layout:
GPIO.setup(9,GPIO.IN, pull_up_down=GPIO.PUD_UP) #0270
GPIO.setup(11,GPIO.IN, pull_up_down=GPIO.PUD_UP) #0271
GPIO.setup(0,GPIO.IN, pull_up_down=GPIO.PUD_UP) #0272
GPIO.setup(5,GPIO.IN, pull_up_down=GPIO.PUD_UP) #0273
GPIO.setup(26,GPIO.IN, pull_up_down=GPIO.PUD_UP) #0274
GPIO.setup(19,GPIO.IN, pull_up_down=GPIO.PUD_UP) #0275
GPIO.setup(13,GPIO.IN, pull_up_down=GPIO.PUD_UP) #0276
GPIO.setup(6,GPIO.IN, pull_up_down=GPIO.PUD_UP) #0277


GPIO.setup(25,GPIO.OUT)#heater
GPIO.setup(8,GPIO.OUT)# oscillator
GPIO.setup(7,GPIO.OUT)#Z up
GPIO.setup(1,GPIO.OUT)#Z down

GPIO.setup(12,GPIO.OUT)#X+
GPIO.setup(16,GPIO.OUT)#X-
GPIO.setup(20,GPIO.OUT)#Y+
GPIO.setup(21,GPIO.OUT)#Y-


class geometron:
    def __init__(self,unit):
        self.hyperCube = []
        for index in range(1024):
            self.hyperCube.append("")        
        f = open("metabot.txt", 'r')
        data = f.read()
        f.close()
        inputarray = data.split("\n")
        for index in range(len(inputarray)):
            if len(inputarray[index]) > 0:
                foo = inputarray[index].split(":")
                address = int(foo[0],8)
                bytecode = foo[1]
                self.hyperCube[address] = bytecode
        self.unit = unit
        self.side = self.unit
        self.scaleFactor = 2
        self.zstep = 200

    def drawGlyph(self,localGlyph):
        glyphArray =  localGlyph.split(",")
        for index in range(len(glyphArray)):
            if len(glyphArray[index]) > 0:
                self.doTheThing(int(glyphArray[index],8))

    
    def doTheThing(self,localCommand):
        if localCommand >= 040 and localCommand <= 0277:
            if len(self.hyperCube[localCommand]) > 0:
                self.drawGlyph(self.hyperCube[localCommand])
        if localCommand >= 01000 and localCommand <= 01777:
            if len(self.hyperCube[localCommand]) > 0:
                self.drawGlyph(self.hyperCube[localCommand]) 
        if localCommand == 0300:
            self.side = self.unit
            self.scaleFactor = 2
        if localCommand == 0310:
            self.scaleFactor = math.sqrt(2)
        if localCommand == 0311:
            self.scaleFactor = (1 + math.sqrt(5))/2
        if localCommand == 0312:
            self.scaleFactor = math.sqrt(3)
        if localCommand == 0313:
            self.scaleFactor = 2
        if localCommand == 0314:
            self.scaleFactor = 3
        if localCommand == 0316:
            self.scaleFactor = 5
        if localCommand == 0330:
            print "move in y direction by +" + str(self.side)
            #turn on y+
            GPIO.output(20,GPIO.HIGH)
            #wait side
            time.sleep(self.side / 1000.0)
            #turn off y+
            GPIO.output(20,GPIO.LOW)
        if localCommand == 0331:
            print "move in y direction by -" + str(self.side)
            #turn on y- :
            GPIO.output(21,GPIO.HIGH)
            #wait side
            time.sleep(self.side / 1000.0)
            #turn off y-
            GPIO.output(21,GPIO.LOW)
        if localCommand == 0332:
            print "move in x direction by -" + str(self.side)
            #turn on x-
            GPIO.output(16,GPIO.HIGH)
            #wait side
            time.sleep(self.side / 1000.0)
            #turn off x-
            GPIO.output(16,GPIO.LOW)
        if localCommand == 0333:
            print "move in x direction by +" + str(self.side)
            #turn on x+
            GPIO.output(12,GPIO.HIGH)
            #wait side
            time.sleep(self.side / 1000.0)
            #turn off x+
            GPIO.output(12,GPIO.LOW)
        if localCommand == 0336:
            self.side /= self.scaleFactor
        if localCommand == 0337:
            self.side *= self.scaleFactor
        if localCommand == 0360: 
            #pen down
            print "pen down"
            GPIO.output(1,GPIO.HIGH)
            time.sleep(self.zstep / 1000.0)  
            GPIO.output(1,GPIO.LOW)
        if localCommand == 0361:
            #pen up
            GPIO.output(7,GPIO.HIGH)
            time.sleep(self.zstep / 1000.0)  
            GPIO.output(7,GPIO.LOW)
            print "pen up"
        if localCommand == 0362: 
            #heat on
            print "heat on"
            GPIO.output(25,GPIO.HIGH)
        if localCommand == 0363:
            #heat off
            print "heat off"
            GPIO.output(25,GPIO.LOW)
        if localCommand == 0364: 
            #oscillator on
            GPIO.output(8,GPIO.HIGH)
            print "oscillator on"
        if localCommand == 0365:
            #osctillator off
            GPIO.output(8,GPIO.LOW)
            print "oscillator off"
        if localCommand == 0377:
            #wait side while doing nothing
            time.sleep(self.side / 1000.0)

g = geometron(50)#Initiate geometron object "g", with "unit" = 50 miliseconds


print("Starting Geometron. Press CTRL+C to exit")
try:
    while 1:
        if not GPIO.input(9): #
            print("9")
            g.doTheThing(0270)
        if not GPIO.input(11): #
            print("11")
            g.doTheThing(0271)
        if not GPIO.input(0): #
            print("0")
            g.doTheThing(0272)
        if not GPIO.input(5): #
            print("5")
            g.doTheThing(0273)
        if not GPIO.input(26): #
            print("26")
            g.doTheThing(0274)
        if not GPIO.input(19): #
            print("19")
            g.doTheThing(0275)
        if not GPIO.input(13): #
            print("13")
            g.doTheThing(0276)
        if not GPIO.input(6): #
            print("6")
            g.doTheThing(0277)


except KeyboardInterrupt: # If CTRL+C is pressed, exit cleanly:
    GPIO.cleanup() # cleanup all GPIO
