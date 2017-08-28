#!/usr/bin/env python
#cubify.py 

def string2byteCode(inputstring):
    outbytes = ""
    for index in range(len(inputstring)):
        thisbyte = ord(inputstring[index])
        thisbyte = oct(thisbyte)
        if thisbyte[1] == "o":
            outbytes += "0o" + thisbyte.lstrip("0") + ","
        else:
            outbytes += thisbyte + ","
    return outbytes

def byteCode2string(inputcode):
    inputarray = inputcode.split(",")
    outputstring = ""
    for index in range(len(inputarray)):
        if len(inputarray[index]) > 0:
            #print chr(int(inputarray[index],8))
            outputstring += chr(int(inputarray[index],8))
    return outputstring

f = open("index.html", 'r')
indexstring = f.read()
f.close()

f = open("creator.py", 'r')
cubifytext = f.read()
f.close()

hyperCube = []    
for index in range(1024):
    hyperCube.append("")

tableout = "0:" + string2byteCode(cubifytext) + "\n"
for index in range(len(hyperCube)):
    pagename = "page" + oct(index)
    if len(indexstring.split("<" + pagename + ">")) > 1:
        foo = indexstring.split("<" + pagename + ">")[1]
        bar = foo.split("</" + pagename + ">")[0]
        hyperCube[index] = string2byteCode(bar)
        tableout += oct(index) + ":" + hyperCube[index] + "\n"

#need to figure out how to get symbols out of shape table    

foo = indexstring.partition("bytecodeScript")[2]
bar = foo.partition("</script>")[0]
bar = bar.partition("/*")[2]
bar = bar.partition("*/")[0]
bar  = bar.lstrip()
bar  = bar.rstrip()
symboltable = bar
tableout += symboltable
f = open("cube.txt", 'w')
f.write(tableout)
f.close()
