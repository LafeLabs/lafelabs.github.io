#!/usr/bin/env python
import urllib2

def string2byteCode(inputstring):
    outbytes = ""
    for index in range(len(inputstring)):
        thisbyte = ord(inputstring[index])
        thisbyte = oct(thisbyte)
        if thisbyte[1] == "o":
            outbytes += "0o" + thisbyte.lstrip("0") + ","
        else:
            outbytes += thisbyte + ","
    print outbytes

def byteCode2string(inputcode):
    inputarray = inputcode.split(",")
    outputstring = ""
    for index in range(len(inputarray)):
        if len(inputarray[index]) > 0:
            #print chr(int(inputarray[index],8))
            outputstring += chr(int(inputarray[index],8))
    return outputstring


cubeurl = "https://pastebin.com/raw/X5p1F8L1"
response1 = urllib2.urlopen(cubeurl)
hypercubestring = response1.read()
response1.close()

'''f = open("cube.txt", 'r')
hypercubestring = f.read()
f.close()
'''
hyperCube = []
for index in range(1024):
    hyperCube.append("")
inputarray = hypercubestring.split("\n")
inputarray[0]
tableString = ""
for index in range(len(inputarray)):
    if len(inputarray[index]) > 0:
        foo = inputarray[index].split(":")
        address = int(foo[0],8)
        bytecode = foo[1].rstrip()
        hyperCube[address] = bytecode
        tableString += foo[0] + ":" + bytecode + "\n"


pythonOUT = ""
pythonOUT += byteCode2string(hyperCube[0])

outputFile = 'creator2.py'
f = open(outputFile, 'w')
f.write(pythonOUT)
f.close()