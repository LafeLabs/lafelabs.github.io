#!/usr/bin/env python
import math

hyperCube = []
for index in range(1024):
    hyperCube.append("")        

unit = 50
side = unit
scaleFactor = 2

def geometron():
    f = open("metabot.txt", 'r')
    data = f.read()
    f.close()
    inputarray = data.split("\n")
    for index in range(len(inputarray)):
        if len(inputarray[index]) > 0:
            foo = inputarray[index].split(":")
            address = int(foo[0],8)
            bytecode = foo[1]
            hyperCube[address] = bytecode
    
    

            
def drawGlyph(localGlyph,side,scaleFactor):
    glyphArray = localGlyph.split(",")
    for index in range(len(glyphArray)):
        if len(glyphArray[index]) > 0:
            doTheThing(int(glyphArray[index],8),side,scaleFactor)

def doTheThing(localCommand,side,scaleFactor):
    if localCommand >= 040 and localCommand <= 0277:
        if len(hyperCube[localCommand]) > 0:
            drawGlyph(hyperCube[localCommand],side,scaleFactor)
    if localCommand == 0310:
        scaleFactor = math.sqrt(2)
    if localCommand == 0311:
        scaleFactor = (1 + math.sqrt(5))/2
    if localCommand == 0312:
        scaleFactor = math.sqrt(3)
    if localCommand == 0313:
        scaleFactor = 2
    if localCommand == 0314:
        scaleFactor = 3
    if localCommand == 0316:
        scaleFactor = 5
    if localCommand == 0330:
        pass
        #turn on y+
        #wait side*factor
        #turn off y+
    if localCommand == 0331:
        pass
        #turn on y-
        #wait side*factor
        #turn off y-
    if localCommand == 0332:
        pass
        #turn on x+
        #wait side*factor
        #turn off x+
    if localCommand == 0333:
        pass
        #turn on x-
        #wait side*factor
        #turn off x-
    if localCommand == 0360: 
        pass
        #pen down
    if localCommand == 0361:
        pass
        #pen up

geometron()

