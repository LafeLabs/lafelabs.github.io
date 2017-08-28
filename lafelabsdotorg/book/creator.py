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

'''
cubeurl = "https://pastebin.com/raw/X5p1F8L1"
response1 = urllib2.urlopen(cubeurl)
hypercubestring = response1.read()
response1.close()
'''
f = open("cube.txt", 'r')
hypercubestring = f.read()
f.close()

hyperCube = []
for index in range(1024):
    hyperCube.append("")
inputarray = hypercubestring.split("\n")
tableString = ""
for index in range(len(inputarray)):
    if len(inputarray[index]) > 0:
        foo = inputarray[index].split(":")
        address = int(foo[0],8)
        bytecode = foo[1].rstrip()
        hyperCube[address] = bytecode
        tableString += foo[0] + ":" + bytecode + "\n"

htmlOUT = "<!--<page01>"
htmlOUT += byteCode2string(hyperCube[01])
htmlOUT += "</page01>-->\n"
htmlOUT += "\n<script id = \"bytecodeScript\">\n"
htmlOUT += "/*\n"
htmlOUT += hypercubestring
htmlOUT += "\n*/\n"
htmlOUT += "\n</script>\n"
htmlOUT += "\n<!--<page02>"
htmlOUT += byteCode2string(hyperCube[02]) + "\n"
htmlOUT += "\n//</page02>\n"

for index in range(0300,0377):
    if len(hyperCube[index]) > 1:
        htmlOUT += "    if(localCommand == " + oct(index) + "){"
        htmlOUT += "//<page" + oct(index) + ">\n"
        htmlOUT += byteCode2string(hyperCube[index]) 
        htmlOUT += "//</page" + oct(index) + ">\n"
        htmlOUT += "\n    }\n"

for index in range(06,037):
    if len(hyperCube[index]) > 1:
        htmlOUT += "    if(localCommand == " + oct(index) + "){"
        htmlOUT += "//<page" + oct(index) + ">\n"
        htmlOUT += byteCode2string(hyperCube[index]) 
        htmlOUT += "//</page" + oct(index) + ">\n"
        htmlOUT += "\n    }\n"


htmlOUT += "\n//<page03>\n"
htmlOUT += byteCode2string(hyperCube[03])
htmlOUT += "</page03>"
htmlOUT += "-->\n<!--"

for index in range(0400,0477):
    if len(hyperCube[index]) > 1:
        htmlOUT += "<page" + oct(index) + ">"
        htmlOUT += byteCode2string(hyperCube[index]) 
        htmlOUT += "</page" + oct(index) + ">"
htmlOUT += "-->\n<!--"

for index in range(0600,0677):
    if len(hyperCube[index]) > 1:
        htmlOUT += "<page" + oct(index) + ">"
        htmlOUT += byteCode2string(hyperCube[index]) 
        htmlOUT += "</page" + oct(index) + ">"
        htmlOUT += "-->\n<!--"

for index in range(0700,0777):
    if len(hyperCube[index]) > 1:
        htmlOUT += "<page" + oct(index) + ">"
        htmlOUT += byteCode2string(hyperCube[index]) 
        htmlOUT += "</page" + oct(index) + ">"
        htmlOUT += "-->\n<!--"

for index in range(0500,0577):
    if len(hyperCube[index]) > 1:
        htmlOUT += "<page" + oct(index) + ">"
        htmlOUT += byteCode2string(hyperCube[index]) 
        htmlOUT += "</page" + oct(index) + ">"
        htmlOUT += "-->\n<!--"

htmlOUT += "<page05>"
htmlOUT += byteCode2string(hyperCube[05])
htmlOUT += "</page05>-->"


outputFile = 'indexout.html'
f = open(outputFile, 'w')
f.write(htmlOUT)
f.close()
