#!/usr/bin/env python    

#open index file

#divide into two strings separated by <page0402>
# 
# <div style = "display:none" class = "data" id = "data0402">

#divide second string into two separated by 

#f = open(outputFile, 'w')
#f.write(htmlOUT)
#f.close()

f = open("reader.html", 'r')
raw_reader = f.read()
f.close()
f = open("data.txt", 'r')
data = f.read()
f.close()

split1 = raw_reader.split("<page0402>")
top = split1[0] + "<page0402>-->\n<div style = \"display:none\" class = \"data\" id = \"data0402\">"
split2 = split1[1].split("</page0402>")
bottom = "\n</div>\n<!--</page0402>" + split2[1]

print top + data + bottom
